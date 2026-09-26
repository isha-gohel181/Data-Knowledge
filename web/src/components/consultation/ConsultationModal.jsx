import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchAvailableSlots,
  fetchAllUpcomingSlots,
  createConsultationOrder,
  bookConsultation,
  setSelectedDate,
  setSelectedSlot,
  resetBookingState,
  clearError
} from '../../redux/slices/consultationSlice';

// Helper to format date as YYYY-MM-DD in local timezone
const getLocalDateString = (d = new Date()) => {
  const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return new Date().toISOString().split('T')[0];
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const ConsultationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    slots,
    allUpcomingSlots,
    selectedDate,
    selectedSlot,
    loading,
    bookingLoading,
    error,
    lastBooking
  } = useSelector((state) => state.consultation);

  const authUser = useSelector((state) => state.auth?.user);
  const authToken = useSelector((state) => state.auth?.token) || localStorage.getItem('edrilla_token');

  // Step state: 1 = Date & Slot selection, 2 = Candidate Details, 3 = Confirmation / Success
  const [step, setStep] = useState(1);

  // Calendar View Date state (month/year navigation)
  const [viewDate, setViewDate] = useState(new Date());

  // Form Details state tailored for Data Knowledge learners
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentRole: 'Fresher / College Graduate',
    interestedTrack: 'Master Data & Business Analyst',
    institute: '',
    query: '',
    fileUpload: null,
  });
  const [fileName, setFileName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Prefill form when auth user is available
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.fullName || authUser.name || '',
        email: prev.email || authUser.email || '',
        phone: prev.phone || authUser.phone || '',
        institute: prev.institute || authUser.institute || authUser.organization || '',
      }));
    }
  }, [authUser]);

  // Reset states on modal close/open and fetch live slots
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      dispatch(fetchAllUpcomingSlots());
      if (selectedDate) {
        dispatch(fetchAvailableSlots({ date: selectedDate }));
      }
    } else {
      setStep(1);
      dispatch(resetBookingState());
      setFormErrors({});
      setFileName('');
    }
  }, [isOpen, dispatch]);

  // Fetch slots whenever selected date changes while modal is open
  useEffect(() => {
    if (isOpen && selectedDate) {
      dispatch(clearError());
      dispatch(fetchAvailableSlots({ date: selectedDate }));
    }
  }, [isOpen, selectedDate, dispatch]);

  if (!isOpen) return null;

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const todayStr = getLocalDateString(new Date());

  // Sets of available & booked dates in local timezone
  const availableDatesSet = new Set(
    (allUpcomingSlots || [])
      .filter((s) => !s.isBooked && s.isActive && new Date(s.startTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
      .map((s) => getLocalDateString(s.startTime))
      .filter(Boolean)
  );

  const bookedDatesSet = new Set(
    (allUpcomingSlots || [])
      .filter((s) => s.isBooked && new Date(s.startTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
      .map((s) => getLocalDateString(s.startTime))
      .filter(Boolean)
  );

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Prevent selecting past dates
    if (dateStr < todayStr) return;

    dispatch(setSelectedDate(dateStr));
    dispatch(setSelectedSlot(null));
  };

  const formatSlotTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, fileUpload: 'File size must be less than 10MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, fileUpload: file }));
      setFileName(file.name);
      setFormErrors((prev) => ({ ...prev, fileUpload: null }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, fileUpload: null }));
    setFileName('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email?.trim()) errors.email = 'Email address is required';
    if (!formData.phone?.trim()) errors.phone = 'Phone / WhatsApp number is required';
    if (!formData.query?.trim()) errors.query = 'Please share your questions or career goals';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToDetails = () => {
    if (!selectedSlot) return;
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;

    if (!authToken) {
      navigate('/login', { state: { returnUrl: location.pathname } });
      return;
    }

    const submission = new FormData();
    submission.append('slotId', selectedSlot._id);
    submission.append('fullName', formData.fullName.trim());
    submission.append('designation', formData.currentRole.trim());
    submission.append('department', formData.interestedTrack.trim());
    submission.append('institute', (formData.institute || formData.currentRole).trim());
    
    // Combine contact & query for complete context
    const fullQuery = `[Phone: ${formData.phone.trim()}] [Email: ${formData.email.trim()}] [Track: ${formData.interestedTrack}] - ${formData.query.trim()}`;
    submission.append('query', fullQuery);

    if (formData.fileUpload) {
      submission.append('fileUpload', formData.fileUpload);
    }

    // Check if slot is paid
    if (selectedSlot.price > 0 && selectedSlot.duration === 30) {
      try {
        const orderResult = await dispatch(createConsultationOrder({ slotId: selectedSlot._id })).unwrap();
        if (orderResult.isFree) {
          const result = await dispatch(bookConsultation(submission)).unwrap();
          if (result.success) {
            dispatch(fetchAllUpcomingSlots());
            if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
            setStep(3);
          }
        } else {
          // Razorpay Checkout flow
          const options = {
            key: orderResult.key,
            amount: orderResult.amount,
            currency: orderResult.currency || 'INR',
            name: 'Data Knowledge',
            description: `Career Consultation Appointment (${selectedSlot.duration} Mins)`,
            order_id: orderResult.orderId,
            handler: async (response) => {
              try {
                submission.append('razorpay_order_id', response.razorpay_order_id);
                submission.append('razorpay_payment_id', response.razorpay_payment_id);
                submission.append('razorpay_signature', response.razorpay_signature);
                const result = await dispatch(bookConsultation(submission)).unwrap();
                if (result.success) {
                  dispatch(fetchAllUpcomingSlots());
                  if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
                  setStep(3);
                }
              } catch (err) {
                console.error('Paid consultation confirmation error:', err);
                dispatch(fetchAllUpcomingSlots());
                if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
                setStep(1);
              }
            },
            prefill: {
              name: formData.fullName,
              email: formData.email || authUser?.email || '',
              contact: formData.phone || authUser?.phone || '',
            },
            theme: { color: '#3498db' },
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            alert('Payment gateway script loading. Please retry.');
          }
        }
      } catch (err) {
        console.error('Consultation payment order error:', err);
        dispatch(fetchAllUpcomingSlots());
        if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
        setStep(1);
      }
    } else {
      // Free consultation booking
      try {
        const result = await dispatch(bookConsultation(submission)).unwrap();
        if (result.success) {
          dispatch(fetchAllUpcomingSlots());
          if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
          setStep(3);
        }
      } catch (err) {
        console.error('Consultation booking error:', err);
        dispatch(fetchAllUpcomingSlots());
        if (selectedDate) dispatch(fetchAvailableSlots({ date: selectedDate }));
        setStep(1);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] my-auto animate-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shrink-0 cursor-pointer"
                title="Back to Date & Slots"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <h3 className="font-inter font-bold text-slate-900 text-base sm:text-lg leading-snug truncate">
                  {step === 1 && 'Book 1-on-1 Career Consultation'}
                  {step === 2 && 'Candidate Details & Goals'}
                  {step === 3 && 'Consultation Confirmed!'}
                </h3>
              </div>
              <p className="font-inter text-xs text-slate-500 truncate mt-0.5">
                {step === 1 && 'Choose an available date & time for your personalized session'}
                {step === 2 && 'Tell our mentors about your background and target career path'}
                {step === 3 && 'Your 1-on-1 session with industry mentors has been scheduled'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-3 cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6 touch-pan-y">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{typeof error === 'string' ? error : 'An error occurred'}</span>
              </div>
              <button 
                type="button" 
                onClick={() => dispatch(clearError())} 
                className="text-red-500 hover:text-red-800 font-bold ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* ──────────────── STEP 1: Date & Slot Selection ──────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Calendar Container */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-inter font-bold text-slate-900 text-sm sm:text-base">
                    {monthNames[month]} {year}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
                      aria-label="Previous Month"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
                      aria-label="Next Month"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day Names Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-inter font-semibold text-[11px] text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9 sm:h-10" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const formattedMonth = String(month + 1).padStart(2, '0');
                    const formattedDay = String(day).padStart(2, '0');
                    const dayDateStr = `${year}-${formattedMonth}-${formattedDay}`;
                    const isPast = dayDateStr < todayStr;
                    const isSelected = dayDateStr === selectedDate;
                    const isToday = dayDateStr === todayStr;
                    const hasAvailable = availableDatesSet.has(dayDateStr);
                    const hasBooked = bookedDatesSet.has(dayDateStr);

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleSelectDay(day)}
                        className={`h-9 sm:h-10 w-full rounded-xl font-inter text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3498db] text-white shadow-md font-bold ring-2 ring-[#3498db]/40 scale-[1.02]'
                            : isPast
                            ? 'text-slate-300 opacity-40 cursor-not-allowed'
                            : isToday
                            ? 'bg-blue-50 text-blue-900 border border-blue-300 font-bold'
                            : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-blue-50/70 hover:border-[#3498db]/40 font-medium'
                        }`}
                      >
                        <span>{day}</span>
                        {!isPast && (
                          <span className="flex items-center gap-0.5 mt-0.5">
                            {hasAvailable && (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                            )}
                            {!hasAvailable && hasBooked && (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-200' : 'bg-rose-500'}`} />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Status Legend */}
                <div className="flex items-center justify-center gap-6 mt-3.5 pt-3 border-t border-slate-200/70 font-inter text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    <span>Slots Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              {/* Slots Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-inter font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Available Consultation Slots</span>
                    {selectedDate && (
                      <span className="text-xs font-normal text-slate-500">
                        ({new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })})
                      </span>
                    )}
                  </h4>
                  {loading && (
                    <div className="w-4 h-4 border-2 border-[#3498db] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {loading ? (
                  <div className="py-10 text-center text-slate-400 font-inter text-xs flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-5 h-5 border-2 border-[#3498db] border-t-transparent rounded-full animate-spin" />
                    <span>Checking available slots...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <svg className="w-8 h-8 text-slate-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p className="font-inter text-xs text-slate-700 font-medium">
                      No slots open for this date.
                    </p>
                    <p className="font-inter text-[11px] text-slate-500">
                      Please pick another date marked with a green indicator on the calendar above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isBooked = slot.isBooked;
                      const isPast = new Date(slot.startTime) < new Date();
                      const isDisabled = isBooked || isPast;
                      const isSelected = selectedSlot?._id === slot._id;
                      const isFree = slot.price === 0 || slot.duration === 15;

                      return (
                        <button
                          key={slot._id}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => dispatch(setSelectedSlot(slot))}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/90 border-[#3498db] ring-2 ring-[#3498db]/30 shadow-sm'
                              : isDisabled
                              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                              : 'bg-white border-slate-200 hover:border-[#3498db]/60 hover:bg-blue-50/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-inter font-bold text-xs text-slate-900">
                              {formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}
                            </span>
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-[#3498db] text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-[10px] text-slate-500 font-medium">
                              {slot.duration} Mins
                            </span>
                            <span
                              className={`font-inter text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isFree
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {isFree ? 'FREE' : `₹${slot.price}`}
                            </span>
                            {isBooked ? (
                              <span className="font-inter text-[10px] text-rose-600 font-semibold ml-auto">
                                Booked
                              </span>
                            ) : isPast ? (
                              <span className="font-inter text-[10px] text-slate-400 font-medium ml-auto">
                                Expired
                              </span>
                            ) : (
                              <span className="font-inter text-[10px] text-emerald-600 font-semibold ml-auto">
                                Available
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: Consultation Details Form ──────────────── */}
          {step === 2 && selectedSlot && (
            <div className="space-y-4">
              {/* Selected Slot Summary Bar */}
              <div className="p-4 rounded-2xl bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-between">
                <div>
                  <span className="font-jetbrains text-[10px] text-[#1f6696] font-bold uppercase tracking-wider block">
                    Selected Appointment Slot
                  </span>
                  <span className="font-inter font-bold text-slate-900 text-sm">
                    {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}{' '}
                    • {formatSlotTime(selectedSlot.startTime)} - {formatSlotTime(selectedSlot.endTime)}
                  </span>
                </div>
                <span className="font-inter text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedSlot.price === 0 || selectedSlot.duration === 15 ? 'FREE (15 Mins)' : `₹${selectedSlot.price}`}
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30 ${
                    formErrors.fullName ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul@example.com"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30 ${
                      formErrors.email ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="font-inter text-[11px] text-rose-500">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30 ${
                      formErrors.phone ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="font-inter text-[11px] text-rose-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Current Background & Interested Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Current Background
                  </label>
                  <select
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30"
                  >
                    <option value="Fresher / College Graduate">Fresher / College Graduate</option>
                    <option value="Working Professional (IT)">Working Professional (IT)</option>
                    <option value="Career Switcher (Non-IT / Non-Tech)">Career Switcher (Non-IT / Non-Tech)</option>
                    <option value="Business / Sales / Operations Professional">Business / Operations Professional</option>
                    <option value="Self-Learner / Other">Self-Learner / Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Interested Program Track
                  </label>
                  <select
                    name="interestedTrack"
                    value={formData.interestedTrack}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30"
                  >
                    <option value="Master Data & Business Analyst">Master Data & Business Analyst</option>
                    <option value="Master Data Science">Master Data Science</option>
                    <option value="Master Machine Learning">Master Machine Learning</option>
                    <option value="Master Generative AI">Master Generative AI</option>
                    <option value="General Career Guidance & Demo Class">General Career Guidance & Demo</option>
                  </select>
                </div>
              </div>

              {/* Query / Goals */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  What would you like to discuss with the mentor? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="query"
                  rows={3}
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder="Tell us about your career transition goals, current skill level, or what you'd like guidance on..."
                  className={`w-full p-3 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3498db]/30 resize-none ${
                    formErrors.query ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {formErrors.query && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.query}</p>
                )}
              </div>

              {/* Attach Resume (Optional) */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Attach Resume / Profile (Optional)
                </label>
                <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  {fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" className="shrink-0">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span className="font-inter text-xs text-slate-800 font-medium truncate">
                          {fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 cursor-pointer py-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span className="font-inter text-xs text-slate-600 font-medium">
                        Upload Resume PDF / Doc (Optional, Max 10MB)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {formErrors.fileUpload && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.fileUpload}</p>
                )}
              </div>

              {!authToken && (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                  <span className="font-inter text-xs text-blue-900">
                    💡 Please log in or sign up to instantly confirm and manage your appointment.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login', { state: { returnUrl: location.pathname } })}
                    className="font-inter text-xs font-bold text-[#1f6696] hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Log In →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── STEP 3: Confirmation / Success ──────────────── */}
          {step === 3 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1">
                <h4 className="font-inter font-extrabold text-2xl text-slate-900">
                  Consultation Booked Successfully!
                </h4>
                <p className="font-inter text-xs text-slate-600 max-w-md mx-auto">
                  Your 1-on-1 mentorship session with the <strong className="text-slate-900">Data Knowledge Mentor Panel</strong> has been scheduled.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Candidate:</span>
                  <span className="font-bold text-slate-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Track:</span>
                  <span className="font-bold text-[#1f6696]">{formData.interestedTrack}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-800">
                    {selectedSlot && new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} • {selectedSlot && formatSlotTime(selectedSlot.startTime)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Duration:</span>
                  <span className="font-bold text-emerald-700">{selectedSlot?.duration || 15} Minutes (Free)</span>
                </div>
                {lastBooking?._id && (
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Booking ID:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{lastBooking._id}</span>
                  </div>
                )}
              </div>

              <p className="font-inter text-[11px] text-slate-500 max-w-sm mx-auto">
                Our mentor will connect with you via Google Meet / Zoom at the scheduled appointment time. Details will be sent to your email.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/90 backdrop-blur-sm flex items-center justify-between shrink-0">
          {step === 1 && (
            <>
              <div className="text-xs text-slate-500 font-inter truncate mr-2">
                {selectedSlot ? (
                  <span>
                    Selected: <strong className="text-slate-900">{formatSlotTime(selectedSlot.startTime)}</strong> ({selectedSlot.duration}m)
                  </span>
                ) : (
                  <span>Please choose an available slot</span>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={handleProceedToDetails}
                className="bg-[#3498db] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2980b9] text-white font-inter text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-md shadow-[#3498db]/30 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Continue to Details</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-inter text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={bookingLoading}
                onClick={handleConfirmBooking}
                className="bg-[#3498db] hover:bg-[#2980b9] disabled:opacity-60 text-white font-inter text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full transition-all shadow-md shadow-[#3498db]/30 flex items-center gap-2 cursor-pointer"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Booking Session...</span>
                  </>
                ) : (
                  <span>Confirm Appointment</span>
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white font-inter text-xs font-bold uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
