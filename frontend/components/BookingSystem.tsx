
import React, { useState } from 'react';

const BookingSystem: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch('/api/bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        time: '09:00', // Default time for now, can be expanded
      }),
    })
      .then(res => {
        if (res.ok) {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 5000);
        } else {
          alert("Failed to schedule appointment. Please try again.");
        }
      })
      .catch(err => {
        console.error("Booking failed:", err);
        alert("An error occurred. Please try again later.");
      });
  };

  // Generate next 5 weekdays
  const getNextWeekdays = () => {
    const days = [];
    let current = new Date();
    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) { // Skip weekends
        days.push(current.toISOString().split('T')[0]);
      }
    }
    return days;
  };

  const [dates] = useState(getNextWeekdays());

  return (
    <section className="py-20 bg-gray-50 min-h-[70vh] flex items-center">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="md:w-1/3 bg-green-700 p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Book a Consultation</h2>
            <p className="text-green-100 mb-8 leading-relaxed">
              Need legal aid or social support? Pick a convenient time to speak with our experts at JDPC Bauchi.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📍</span>
                <span>Catholic Secretariat, Bauchi</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⏰</span>
                <span>Mon - Fri, 9am - 4pm</span>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-12">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-4xl mb-6">
                  ✅
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-500">Check your email. We've sent a confirmation to <span className="font-semibold">{formData.email}</span>.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preferred Date</label>
                  <div className="flex flex-wrap gap-2">
                    {dates.map(date => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setFormData({ ...formData, date })}
                        className={`px-4 py-2 rounded-lg border text-sm transition-all ${formData.date === date ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'
                          }`}
                      >
                        {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason for Consultation</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Schedule Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSystem;
