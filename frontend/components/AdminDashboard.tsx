
import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for exports
  const mockBookings = [
    { id: 1, name: 'John Doe', email: 'john@example.com', reason: 'Legal Aid', date: '2023-11-20', status: 'Pending' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', reason: 'Consultation', date: '2023-11-21', status: 'Confirmed' },
  ];

  const mockDonations = [
    { id: 'TX-001', donor: 'Anonymous', amount: 5000, date: '2023-11-18', channel: 'Paystack' },
    { id: 'TX-002', donor: 'Bauchi Co-op', amount: 50000, date: '2023-11-19', channel: 'Squad' },
  ];

  const handleExport = (type: 'bookings' | 'donations') => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select a valid date range first.');
      return;
    }

    setIsExporting(true);

    // Simulate delay for generation
    setTimeout(() => {
      const data = type === 'bookings' ? mockBookings : mockDonations;
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(',')).join('\n');
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-sm font-bold text-gray-400 uppercase mb-2">Pending Bookings</div>
            <div className="text-4xl font-black text-gray-900">12</div>
            <div className="mt-4 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md inline-block">Action Required</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-sm font-bold text-gray-400 uppercase mb-2">Monthly Donations</div>
            <div className="text-4xl font-black text-gray-900">₦1.2M</div>
            <div className="mt-4 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block">+14% vs last month</div>
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
                  onChange={e => setDateRange({...dateRange, start: e.target.value})}
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  value={dateRange.end}
                  onChange={e => setDateRange({...dateRange, end: e.target.value})}
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
                {[1, 2, 3, 4].map(i => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">Client User {i}</div>
                      <div className="text-xs text-gray-400">client{i}@example.com</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600">Legal aid for property dispute...</td>
                    <td className="px-8 py-6 text-sm font-semibold text-gray-500">Nov 2{i}, 2023</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full">Pending</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all">
                          ✅
                        </button>
                        <button className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all">
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
