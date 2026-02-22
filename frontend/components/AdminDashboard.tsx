import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import { Booking, Donation } from '../types';
import { Photo } from './PhotoGallery';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    monthlyDonations: 0,
    activePrograms: 0,
    recentActivity: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const { token, logout, refreshAccessToken } = useAuth();

  // Gallery Management State
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery'>('overview');
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<Photo> | null>(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('--- JDPC Admin Sync Start ---');
      const fetchWithAuth = (url: string) => fetch(url, { headers });

      const [bookingsRes, donationsRes, photosRes, statsRes] = await Promise.all([
        fetchWithAuth(API_ENDPOINTS.BOOKINGS).catch(() => ({ ok: false, json: () => [] })),
        fetchWithAuth(API_ENDPOINTS.DONATIONS).catch(() => ({ ok: false, json: () => [] })),
        fetch(API_ENDPOINTS.PHOTOS).catch(() => ({ ok: false, json: () => [] })),
        fetchWithAuth(API_ENDPOINTS.ADMIN_DASHBOARD_STATS).catch(() => ({ ok: false, json: () => ({}) }))
      ]);

      if ((bookingsRes as any).status === 401 || (donationsRes as any).status === 401 || (statsRes as any).status === 401) {
        console.warn('Unauthorized. Attempting token refresh...');
        const refreshed = await refreshAccessToken();
        if (refreshed) return fetchAdminData();
        return;
      }

      // Handle Bookings
      if (bookingsRes.ok) {
        const data = await (bookingsRes as Response).json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
      }

      // Handle Donations
      if (donationsRes.ok) {
        const data = await (donationsRes as Response).json();
        setDonations(data);
      } else {
        console.error('Failed to fetch donations');
      }

      // Handle Photos
      if (photosRes.ok) {
        const data = await (photosRes as Response).json();
        setGalleryPhotos(data);
      }

      // Handle Stats
      if (statsRes.ok) {
        const data = await (statsRes as Response).json();
        console.log('Backend Stats Received:', data);
        setStats(data);
      } else {
        console.error('Failed to fetch stats from', API_ENDPOINTS.ADMIN_DASHBOARD_STATS);
      }
      console.log('--- JDPC Admin Sync End ---');
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  // Handle Booking Status Update
  const handleBookingAction = async (id: number, action: 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED') => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));
        alert(`Booking ${action.toLowerCase()} successfully! Email notification sent.`);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update booking status. Session may have expired.');
    }
  };

  // Photo Management Handlers
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPhoto?.title || !currentPhoto?.category || (!photoFile && !currentPhoto.id)) {
      alert('Please fill all required fields and select an image.');
      return;
    }

    setIsSavingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('title', currentPhoto.title);
      formData.append('category', currentPhoto.category);
      if (currentPhoto.caption) formData.append('caption', currentPhoto.caption);
      if (photoFile) formData.append('image', photoFile);

      const url = currentPhoto.id
        ? `${API_ENDPOINTS.PHOTOS}${currentPhoto.id}/`
        : API_ENDPOINTS.PHOTOS;

      const method = currentPhoto.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setIsPhotoModalOpen(false);
        setPhotoFile(null);
        setCurrentPhoto(null);
        fetchAdminData();
        alert('Photo saved successfully!');
      } else {
        const err = await response.json();
        alert(`Failed to save: ${JSON.stringify(err)}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Error saving photo.');
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.PHOTOS}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setGalleryPhotos(prev => prev.filter(p => p.id !== id));
        alert('Photo deleted successfully!');
      } else {
        alert('Failed to delete photo.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const handleExport = (type: 'bookings' | 'donations') => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select a valid date range first.');
      return;
    }
    const data = type === 'bookings' ? bookings : donations;
    const start = new Date(dateRange.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    const filtered = data.filter((item: any) => {
      const d = new Date(item.created_at || item.date);
      return d >= start && d <= end;
    });

    if (filtered.length === 0) return alert('No data for selected range');

    // Better CSV formatting: handle commas by wrapping in quotes
    const headers = Object.keys(filtered[0]);
    const csvContent = [
      headers.join(','),
      ...filtered.map((row: any) =>
        headers.map(header => {
          const val = row[header];
          const stringVal = val === null || val === undefined ? '' : String(val);
          return `"${stringVal.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `judsci_${type}_${dateRange.start}_to_${dateRange.end}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
            <p className="text-gray-500 font-medium">JDPC Bauchi Management Portal</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.location.hash = ''} className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl font-black text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              🌐 View Website
            </button>
            <button onClick={logout} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl font-black text-sm border border-red-100 hover:bg-red-600 hover:text-white transition-all">
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-white/50 p-1.5 rounded-2xl border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 text-sm font-black rounded-xl transition-all ${activeTab === 'overview' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
          >
            📊 Overview & Bookings
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-2.5 text-sm font-black rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
          >
            📸 Photo Gallery
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">📅</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pending Bookings</div>
                <div className="text-4xl font-black text-gray-900">{stats.pendingBookings}</div>
                <div className="mt-4 text-[10px] font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full inline-block border border-yellow-100">Action Required</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">💰</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Donations</div>
                <div className="text-4xl font-black text-gray-900">{formatCurrency(stats.monthlyDonations)}</div>
                <div className="mt-4 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block border border-green-100">This Month</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">🚀</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Active Programs</div>
                <div className="text-4xl font-black text-gray-900">{stats.activePrograms}</div>
                <div className="mt-4 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100">Live on Site</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-2">Export Reports</h3>
                    <p className="text-sm text-gray-500 font-medium">Download CSV data for audits or donor updates.</p>
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="px-3 py-2 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none" />
                      <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="px-3 py-2 border border-gray-100 rounded-xl text-xs font-bold ml-2 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleExport('bookings')} className="px-5 py-2 bg-black text-white rounded-xl text-[10px] font-black hover:bg-gray-800">Bookings</button>
                      <button onClick={() => handleExport('donations')} className="px-5 py-2 bg-green-700 text-white rounded-xl text-[10px] font-black hover:bg-green-800">Donations</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {stats.recentActivity.length > 0 ? stats.recentActivity.map((act: any) => (
                    <div key={act.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm bg-gray-50`}>
                        {act.type === 'booking' ? '📅' : '💰'}
                      </div>
                      <div className="flex-grow">
                        <div className="text-xs font-black text-gray-900 leading-tight">{act.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-[10px] font-bold text-gray-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${act.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                              act.status === 'SUCCESS' || act.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>{act.status}</div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-xs text-center text-gray-400 italic py-4">No recent activity</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">Recent Booking Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Requester</th>
                      <th className="px-8 py-4">Reason</th>
                      <th className="px-8 py-4">Submission Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-medium italic">No bookings found.</td></tr>
                    ) : (
                      bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-black text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-400">{b.email}</div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-500 font-medium">{b.reason}</td>
                          <td className="px-8 py-6 text-xs font-bold text-gray-400">{new Date(b.created_at).toLocaleDateString()}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${b.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                              b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border border-green-100' :
                                b.status === 'RESCHEDULED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  'bg-red-50 text-red-600 border border-red-100'
                              }`}>{b.status}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2">
                              <select
                                value={b.status}
                                onChange={(e) => handleBookingAction(b.id, e.target.value as any)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none transition-all border ${b.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    b.status === 'CONFIRMED' ? 'bg-green-700 text-white border-transparent' :
                                      b.status === 'RESCHEDULED' ? 'bg-blue-600 text-white border-transparent' :
                                        'bg-gray-100 text-gray-500 border-gray-200'
                                  }`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirm</option>
                                <option value="RESCHEDULED">Reschedule</option>
                                <option value="CANCELLED">Reject/Cancel</option>
                              </select>
                              {b.status === 'PENDING' && (
                                <div className="text-[9px] font-black text-yellow-600 self-center animate-pulse">Action Required</div>
                              )}
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
          /* Real Gallery Manager */
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight">Photo Gallery Manager</h3>
                <p className="text-sm text-gray-500 font-medium">Manage evidence of your impact.</p>
              </div>
              <button
                onClick={() => { setCurrentPhoto({ title: '', category: 'Outreach', caption: '' }); setIsPhotoModalOpen(true); }}
                className="px-6 py-3 bg-green-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all flex items-center gap-2"
              >
                ➕ Add Impact Photo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {galleryPhotos.map(photo => (
                <div key={photo.id} className="relative group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <img src={photo.image} alt={photo.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setCurrentPhoto(photo); setIsPhotoModalOpen(true); }}
                      className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-800 hover:bg-green-700 hover:text-white transition-all transform hover:scale-110"
                    > ✎ </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                    > 🗑 </button>
                  </div>
                  <div className="p-4">
                    <div className="text-[9px] font-black text-green-700 uppercase mb-1">{photo.category}</div>
                    <div className="text-xs font-black text-gray-900 truncate">{photo.title}</div>
                  </div>
                </div>
              ))}
            </div>
            {galleryPhotos.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-medium italic">No photos in the gallery. Start by adding one!</div>
            )}
          </div>
        )}
      </div>

      {/* Photo Upsert Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl p-10 relative animate-fade-in-up">
            <h3 className="text-2xl font-black tracking-tight mb-6">{currentPhoto?.id ? 'Edit Photo' : 'Upload Impact Photo'}</h3>
            <form onSubmit={handleSavePhoto} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Title</label>
                <input
                  type="text"
                  value={currentPhoto?.title || ''}
                  onChange={e => setCurrentPhoto({ ...currentPhoto!, title: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="e.g. Borehole Commissioning"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Category</label>
                  <select
                    value={currentPhoto?.category || ''}
                    onChange={e => setCurrentPhoto({ ...currentPhoto!, category: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  >
                    <option>Outreach</option>
                    <option>WASH</option>
                    <option>Legal Aid</option>
                    <option>Education</option>
                    <option>Empowerment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Photo File</label>
                  <input
                    type="file"
                    onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    accept="image/*"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Caption / Description</label>
                <textarea
                  value={currentPhoto?.caption || ''}
                  onChange={e => setCurrentPhoto({ ...currentPhoto!, caption: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all h-24 resize-none"
                  placeholder="Briefly describe this impact photo..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                > Cancel </button>
                <button
                  type="submit"
                  disabled={isSavingPhoto}
                  className="flex-2 py-4 px-10 bg-green-700 text-white rounded-2xl font-black text-sm hover:bg-green-800 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                > {isSavingPhoto ? 'Saving...' : 'Save Changes'} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
