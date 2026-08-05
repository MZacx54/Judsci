import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config';

const BookingSystem: React.FC = () => {
  // State
  const [step, setStep] = useState<1 | 2>(1); // 1 = Date/Time, 2 = Details
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Constants
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty placeholders for alignment
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6; // Disable past days & weekends
  };

  // Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    // Use local date parts instead of toISOString to avoid timezone shifts
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    setLoading(true);
    try {
      const formattedTime = selectedTime.includes(':') && selectedTime.split(':').length === 2 ? `${selectedTime}:00` : selectedTime;
      const res = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: dateStr,
          time: formattedTime,
        }),
      });

      const data = await res.json();

      if (res.ok || res.status === 201 || res.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setStep(1);
          setSelectedDate(null);
          setSelectedTime(null);
          setFormData({ name: '', email: '', phone: '', reason: '' });
        }, 5000);
      } else {
        // Detailed diagnostic logging for production debugging
        console.error(`[JUDSCI Booking Error] Status: ${res.status} ${res.statusText}`);
        console.error(`[JUDSCI Booking Error] Body:`, data);

        let errorMessage = "Failed to schedule appointment.";
        if (data && typeof data === 'object') {
          const errors = Object.values(data).flat();
          if (errors.length > 0) {
            errorMessage = String(errors[0]);
          }
        }
        alert(`${errorMessage} (Status: ${res.status})`);
      }
    } catch (err) {
      console.error("[JUDSCI Booking Network Error]:", err);
      alert("A network error occurred. This could be due to slow connection or server timeout. Please try again or contact us directly if the problem persists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 min-h-[600px]">

          {/* Sidebar Info */}
          <div className="lg:w-1/3 bg-green-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Book a Consultation</h2>
              <p className="text-green-100 mb-8 leading-relaxed text-lg">
                Schedule a face-to-face meeting with our support team or specialists.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">📍</div>
                  <div>
                    <h4 className="font-bold text-white">Location</h4>
                    <p className="text-green-200 text-sm">Catholic Secretariat, Bauchi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">🕒</div>
                  <div>
                    <h4 className="font-bold text-white">Hours</h4>
                    <p className="text-green-200 text-sm">Mon - Fri: 09:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary of Selection */}
            {(selectedDate || selectedTime) && (
              <div className="relative z-10 mt-10 p-4 bg-green-800/50 rounded-xl border border-green-700/50 backdrop-blur-sm">
                <h4 className="text-xs font-bold uppercase text-green-300 mb-2">Your Selection</h4>
                {selectedDate && (
                  <div className="text-lg font-bold">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                {selectedTime && (
                  <div className="text-2xl text-green-300 font-mono mt-1">
                    @ {selectedTime}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3 p-8 md:p-12 relative bg-white">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-green-100">
                  ✅
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                  Your appointment has been scheduled. We've sent a confirmation email to <span className="font-semibold text-gray-900">{formData.email}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2 text-green-700 font-semibold hover:bg-green-50 rounded-lg transition-colors"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Steps Indicator */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step === 1 ? 'bg-green-600' : 'bg-green-200'}`}></div>
                  <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step === 2 ? 'bg-green-600' : 'bg-gray-100'}`}></div>
                </div>

                {step === 1 ? (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Select Date & Time</h3>
                      <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">◀</button>
                        <span className="font-bold text-gray-700 min-w-[140px] text-center">
                          {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">▶</button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                      {daysOfWeek.map(d => (
                        <div key={d} className="text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-8">
                      {getDaysInMonth(currentMonth).map((date, idx) => {
                        if (!date) return <div key={idx} className="aspect-square"></div>;

                        const disabled = isDateDisabled(date);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = new Date().toDateString() === date.toDateString();

                        return (
                          <button
                            key={idx}
                            disabled={disabled}
                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                            className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 relative
                                                            ${isSelected
                                ? 'bg-green-700 text-white shadow-lg shadow-green-700/30 scale-105 z-10'
                                : disabled
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'hover:bg-green-50 text-gray-700 bg-white border border-gray-100 hover:border-green-200'
                              }
                                                            ${isToday && !isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
                                                        `}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Available Time Slots</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 rounded-lg text-sm font-medium border transition-all duration-200
                                                                ${selectedTime === time
                                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-700'
                                }
                                                            `}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-8 flex justify-end">
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(2)}
                        className="px-8 py-3 bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-all ml-auto"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="animate-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-gray-500 hover:text-green-700 flex items-center gap-1 font-medium"
                      >
                        ← Back to Calendar
                      </button>
                      <h3 className="text-xl font-bold text-gray-900 mt-4">Your Details</h3>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                          <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone</label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                        <input
                          required
                          type="email"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason for Consultation</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all resize-none"
                          value={formData.reason}
                          onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-lg shadow-green-700/20 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {loading && (
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {loading ? 'Confirming Appointment...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSystem;
