import mongoose, { Schema } from 'mongoose';

const consultationBookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    slotId: { type: Schema.Types.ObjectId, ref: 'ConsultationSlot', required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    designation: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    institute: { type: String, required: true, trim: true },
    query: { type: String, required: true, trim: true },
    fileUpload: { type: String, default: null }, // File path stored via upload-middleware.js
    paymentProvider: { type: String, default: 'razorpay' },
    paymentStatus: { type: String, enum: ['free', 'pending', 'paid', 'failed'], default: 'free' },
    paymentId: { type: String, default: null }, // Razorpay payment ID
    orderId: { type: String, default: null },   // Razorpay order ID
}, { timestamps: true });

export default mongoose.models.ConsultationBooking || mongoose.model('ConsultationBooking', consultationBookingSchema);
