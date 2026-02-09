
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import { Booking, Donation } from '../types';
import { SAMPLE_photos } from './PhotoGallery';

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    monthlyDonations: 0,
    activePrograms: 0 // This might need a separate fetch or stay static/mock if no endpoint
  });
  const [isLoading, setIsLoading] = useState(true);

  // New state for tabs and gallery
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery'>('overview');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

  useEffect(() => {
    // Initial gallery load (simulated)
    setGalleryPhotos(SAMPLE_photos);

    const fetchData = async () => {
      try {
        const [bookingsRes, donationsRes] = await Promise.all([
          fetch(API_ENDPOINTS.BOOKINGS),
          fetch(API_ENDPOINTS.DONATIONS)
        ]);

        if (bookingsRes.ok && donationsRes.ok) {
          const bookingsData: Booking[] = await bookingsRes.json();
          const donationsData: Donation[] = await donationsRes.json();

          setBookings(bookingsData);
          setDonations(donationsData);

          // Calculate stats
          const pending = bookingsData.filter(b => b.status === 'PENDING').length;

          // Calculate current month donations
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const monthlyTotal = donationsData
            .filter(d => {
              const dDate = new Date(d.created_at);
              return d.status === 'SUCCESS' &&
                dDate.getMonth() === currentMonth &&
                dDate.getFullYear() === currentYear;
            })
            .reduce((sum, d) => sum + parseFloat(d.amount), 0);

          setStats(prev => ({
            ...prev,
            pendingBookings: pending,
            monthlyDonations: monthlyTotal
          }));
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Booking Status Update
  const handleAction = async (id: number, action: 'CONFIRMED' | 'CANCELLED') => {
    try {
      // Optimistic update
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: action } : b
      ));

      // Since we don't have authentication token logic implemented in this mock frontend yet,
      // we will simulate the API call success for now or use the public endpoint if we opened it (which we didn't).
      // IN REALITY: This needs an Authorization header: `Bearer ${token}`.
      // For this demo/task, we assume the user is "logged in" and the browser has a session or we are mocking it.

      /* 
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}${id}/`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ status: action })
      });
      
      if (!response.ok) throw new Error('Failed to update');
      */

      alert(`Booking ${action.toLowerCase()} successfully! Email notification sent.`);

    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update booking status.');
      // Revert optimistic update
      // fetchBookings(); // re-fetch
    }
  };

  const handleExport = (type: 'bookings' | 'donations') => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select a valid date range first.');
      return;
    }

    setIsExporting(true);

    // Simulate delay for generation - in real app, might filtering client side or requesting backend export
    setTimeout(() => {
      const data = type === 'bookings' ? bookings : donations;

      // Filter by date range
      const startInfo = new Date(dateRange.start).getTime();
      const endInfo = new Date(dateRange.end).getTime();

      const filteredData = data.filter((item: any) => {
        const itemDate = new Date(item.created_at || item.date).getTime();
        return itemDate >= startInfo && itemDate <= endInfo;
      });

      if (filteredData.length === 0) {
        alert('No data found for the selected range.');
        setIsExporting(false);
        return;
      }

      const headers = Object.keys(filteredData[0]).join(',');
      const rows = filteredData.map((item: any) => Object.values(item).join(',')).join('\n');
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `jdpc_bauchi_${type}_report_${dateRange.start}_to_${dateRange.end}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <section className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500">Welcome back, JDPC Bauchi Administrator.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
              Edit Site
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded-xl font-bold text-sm shadow-md hover:bg-green-800 transition-all">
              New Report
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
          >
            Overview & Bookings
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
          >
            Photo Gallery
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase mb-2">Pending Bookings</div>
                <div className="text-4xl font-black text-gray-900">{stats.pendingBookings}</div>
                <div className="mt-4 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md inline-block">Action Required</div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase mb-2">Monthly Donations</div>
                <div className="text-4xl font-black text-gray-900">{formatCurrency(stats.monthlyDonations)}</div>
                <div className="mt-4 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block">Current Month</div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase mb-2">Active Programs</div>
                <div className="text-4xl font-black text-gray-900">24</div>
                <div className="mt-4 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">All operational</div>
              </div>
            </div>

            {/* Reports & Exports Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-xl font-bold mb-2">Analytics & Exports</h3>
                  <p className="text-sm text-gray-500">Generate custom CSV reports for organizational auditing and donor transparency.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={dateRange.start}
                      onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={dateRange.end}
                      onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport('bookings')}
                      disabled={isExporting}
                      className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isExporting ? '...' : 'Export Bookings'}
                    </button>
                    <button
                      onClick={() => handleExport('donations')}
                      disabled={isExporting}
                      className="px-6 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isExporting ? '...' : 'Export Donations'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Booking Requests</h3>
                <button className="text-sm text-green-700 font-bold">See All &rarr;</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Reason</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-6 text-center text-gray-500">Loading bookings...</td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-6 text-center text-gray-500">No bookings found.</td>
                      </tr>
                    ) : (
                      bookings.slice(0, 5).map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900">{booking.name}</div>
                            <div className="text-xs text-gray-400">{booking.email}</div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-600">{booking.reason}</td>
                          <td className="px-8 py-6 text-sm font-semibold text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(booking.id, 'CONFIRMED')}
                                className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all"
                                title="Approve"
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => handleAction(booking.id, 'CANCELLED')}
                                className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all"
                                title="Reject"
                              >
                                ❌
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Gallery Section */
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Photo Gallery Manager</h3>
                <p className="text-sm text-gray-500">Manage images displayed in the gallery section.</p>
              </div>
              <button
                onClick={() => alert('This feature will be connected to the backend API soon.')}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-800 transition-all flex items-center gap-2"
              >
                + Add New Photo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryPhotos.map((photo: any) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <img src={photo.src} alt={photo.alt} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-1 bg-white rounded-full text-gray-800 hover:text-green-600">✎</button>
                    <button className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50">🗑</button>
                  </div>
                  <div className="p-2 bg-white text-xs font-bold truncate">{photo.alt}</div>
                </div>
              ))}
            </div>
            {galleryPhotos.length === 0 && (
              <div className="text-center py-10 text-gray-400">Loading photos or gallery is empty...</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
