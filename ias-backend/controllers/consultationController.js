import ConsultationSlot from '../models/ConsultationSlot.js';
import ConsultationBooking from '../models/ConsultationBooking.js';
import Setting from '../models/setting.js';
import axios from 'axios';
import fs from 'fs';

// --- Admin Endpoints ---

// Create new slots
export const createSlots = async (req, res) => {
    try {
        const { slots } = req.body; 
        // Expected slots: [{ startTime, endTime, duration, price }]
        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid slots data' });
        }

        const createdSlots = await ConsultationSlot.insertMany(slots);

        return res.status(201).json({
            success: true,
            message: 'Consultation slots created successfully',
            data: createdSlots
        });
    } catch (error) {
        console.error('Error creating slots:', error);
        return res.status(500).json({ success: false, message: 'Failed to create slots', error: error.message });
    }
};

// Get all slots for admin (including booked)
export const getAdminSlots = async (req, res) => {
    try {
        const slots = await ConsultationSlot.find().sort({ startTime: 1 });
        return res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        console.error('Error fetching admin slots:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch slots', error: error.message });
    }
};

// Delete a slot (only if unbooked)
export const deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const slot = await ConsultationSlot.findById(id);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found' });
        }
        if (slot.isBooked) {
            return res.status(400).json({ success: false, message: 'Cannot delete a booked slot' });
        }
        
        await ConsultationSlot.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Slot deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting slot:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete slot', error: error.message });
    }
};

// Get all bookings (for Admin)
export const getAdminBookings = async (req, res) => {
    try {
        const bookings = await ConsultationBooking.find()
            .populate('userId', 'fullName email phone')
            .populate('slotId')
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
};

// --- Frontend/Student Endpoints ---

// Get available slots (Filter by date if provided, otherwise all future slots)
export const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        let query = { isActive: true };

        if (date) {
            // Parse the requested date
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            // Return all slots for this specific day, even past ones
            // (The frontend can disable booking for past slots)
            query.startTime = { $gte: startOfDay, $lte: endOfDay };
        } else {
            // Default behavior: all future slots
            query.startTime = { $gte: new Date() };
        }

        const slots = await ConsultationSlot.find(query).sort({ startTime: 1 });

        return res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch slots', error: error.message });
    }
};

// Create Razorpay Order for Consultation
export const createConsultationOrder = async (req, res) => {
    try {
        const { slotId } = req.body;
        if (!slotId) return res.status(400).json({ success: false, message: "slotId is required" });

        const slot = await ConsultationSlot.findById(slotId);
        if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
        if (slot.isBooked) return res.status(400).json({ success: false, message: "Slot is already booked" });
        if (new Date(slot.startTime) < new Date()) return res.status(400).json({ success: false, message: "Cannot book a past slot" });

        // If it's a free slot, no order needed
        if (slot.price === 0 || slot.duration !== 30) {
            return res.status(200).json({ success: true, isFree: true });
        }

        const keySetting = await Setting.findOne({ key: "RAZORPAY_KEY_ID" });
        const secretSetting = await Setting.findOne({ key: "RAZORPAY_KEY_SECRET" });
        if (!keySetting || !secretSetting) {
            return res.status(500).json({ success: false, message: "Razorpay settings not configured" });
        }

        const auth = Buffer.from(`${keySetting.value}:${secretSetting.value}`).toString("base64");
        const headers = { "Content-Type": "application/json", Authorization: `Basic ${auth}` };
        const amountPaise = Math.round(slot.price * 100);

        const orderOptions = {
            amount: amountPaise,
            currency: "INR",
            receipt: `rcpt_cns_${Date.now().toString().slice(-6)}`
        };

        const response = await axios.post("https://api.razorpay.com/v1/orders", orderOptions, { headers });
        
        return res.status(200).json({
            success: true,
            isFree: false,
            key: keySetting.value,
            orderId: response.data.id,
            amount: amountPaise,        // Razorpay expects paise (₹100 = 10000 paise)
            baseAmount: slot.price,     // The actual Rupee amount (₹100)
            currency: "INR"
        });
    } catch (error) {
        console.error('Error creating consultation order:', error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'Failed to create order', error: error.response?.data?.error?.description || error.message });
    }
};

// Book a consultation slot
export const bookConsultation = async (req, res) => {
    const session = await ConsultationSlot.startSession();
    session.startTransaction();

    try {
        const { slotId, fullName, designation, department, institute, query, paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        const slot = await ConsultationSlot.findById(slotId).session(session);
        if (!slot) throw new Error('Slot not found');
        if (slot.isBooked) throw new Error('Slot is already booked');
        if (new Date(slot.startTime) < new Date()) throw new Error('Cannot book a slot that has already passed');

        let paymentStatus = 'free';

        // Check if paid slot
        if (slot.price > 0 && slot.duration === 30) {
            const finalPaymentId = razorpay_payment_id || paymentId;
            if (!razorpay_order_id || !finalPaymentId || !razorpay_signature) {
                throw new Error('Payment details (order_id, payment_id, signature) are required for paid slots');
            }

            const secretSetting = await Setting.findOne({ key: "RAZORPAY_KEY_SECRET" });
            if (!secretSetting) throw new Error('Payment verification settings not found');

            const crypto = await import('crypto');
            const hmac = crypto.createHmac("sha256", secretSetting.value);
            hmac.update(razorpay_order_id + "|" + finalPaymentId);
            const generatedSignature = hmac.digest("hex");

            if (generatedSignature !== razorpay_signature) {
                throw new Error("Payment signature verification failed");
            }
            
            paymentStatus = 'paid';
        }

        // Handle File Upload from upload-middleware
        let fileUploadPath = null;
        if (req.files && req.files.fileUpload && req.files.fileUpload[0]) {
            fileUploadPath = req.files.fileUpload[0].filename;
        }

        // Create booking
        const booking = new ConsultationBooking({
            userId,
            slotId,
            fullName,
            designation,
            department,
            institute,
            query,
            fileUpload: fileUploadPath,
            paymentStatus,
            paymentId: razorpay_payment_id || paymentId || null,
        });

        await booking.save({ session });

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: 'Consultation booked successfully',
            data: booking
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        // Clean up uploaded file if transaction fails
        if (req.files && req.files.fileUpload && req.files.fileUpload[0]) {
            try {
                await fs.promises.unlink(req.files.fileUpload[0].path);
            } catch (e) {
                console.error("Failed to delete uploaded file after error:", e);
            }
        }

        console.error('Error booking consultation:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to book consultation' });
    }
};
