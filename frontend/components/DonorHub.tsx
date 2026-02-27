import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

import { usePaystackPayment } from 'react-paystack';

const DonorHub: React.FC = () => {
  const [amount, setAmount] = useState('5000');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.RESOURCES)
      .then(res => res.json())
      .then(data => {
        const report = data.find((r: any) => r.title.includes('2023'));
        if (report) setReportUrl(report.file);
      })
      .catch(console.error);
  }, []);

  const amounts = ['1000', '5000', '10000', '25000', '50000'];

  const config = {
    reference: "JDPC_" + new Date().getTime(),
    email: email,
    amount: (Number(customAmount || amount)) * 100, // Paystack is in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      custom_fields: [
        {
          display_name: "Project Category",
          variable_name: "project_category",
          value: amount ? "General" : "Custom" // Simple placeholder
        }
      ]
    }
  };

  const [projectCategory, setProjectCategory] = useState('GENERAL');

  const onSuccess = (reference: any) => {
    setLoading(true);
    fetch(API_ENDPOINTS.DONATIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: config.amount / 100,
        email: email,
        donor_name: name,
        reference: config.reference,
        project_category: projectCategory,
        status: 'SUCCESS'
      })
    }).then(() => {
      setLoading(false);
      alert("Donation Successful! Thank you for your support.");
      setEmail('');
      setName('');
      setCustomAmount('');
      setAmount('5000');
    }).catch(() => {
      setLoading(false);
    });
  };

  const onClose = () => {
    alert("Donation cancelled.");
  };

  const initializePayment = usePaystackPayment(config);

  const handleDonation = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    initializePayment({ onSuccess: onSuccess as any, onClose });
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Invest in <span className="text-green-700">Bauchi's Future</span></h2>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium">
          Your contributions drive sustainable peacebuilding, legal justice, and food security across the region.
        </p>

        <div className="grid lg:grid-cols-5 gap-12 items-start text-left">
          <div className="lg:col-span-3 bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="p-2 bg-green-100 rounded-lg text-green-700">💳</span>
              Online Donation
            </h3>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Anonymous Donor"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sponsor a Specific Project</label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium bg-white appearance-none cursor-pointer"
              >
                <option value="GENERAL">General Fund (Greatest Need)</option>
                <option value="WASH">Water, Sanitation and Hygiene (WASH)</option>
                <option value="PEACE">Peace Building & Conflict Resolution</option>
                <option value="AGRIC">Sustainable Agriculture</option>
                <option value="EMP">Women and Youth Empowerment</option>
                <option value="LEGAL">Prison Apostolate & Legal Aid</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {amounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => { setAmount(amt); setCustomAmount(''); }}
                  className={`py-4 px-6 rounded-2xl border-2 text-xl font-black transition-all ${amount === amt && !customAmount ? 'border-green-700 bg-green-50 text-green-700 shadow-lg scale-[1.02]' : 'border-white bg-white text-gray-400 hover:border-gray-200'
                    }`}
                >
                  ₦{Number(amt).toLocaleString()}
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Custom"
                  className={`w-full py-4 px-6 pr-4 rounded-2xl border-2 text-lg font-black outline-none transition-all ${customAmount ? 'border-green-700 bg-green-50 text-green-700 shadow-lg' : 'border-white bg-white'
                    }`}
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
              </div>
            </div>

            <button
              onClick={handleDonation}
              disabled={loading}
              className="w-full py-5 bg-green-700 hover:bg-green-800 text-white text-xl font-black rounded-2xl shadow-xl shadow-green-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? 'Processing...' : 'Complete Donation'}
              {!loading && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-green-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="p-2 bg-white/10 rounded-lg">🌍</span>
                Global Wire Transfer
              </h3>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-green-300 font-black uppercase tracking-widest text-[10px] mb-1">Bank Name</p>
                  <p className="font-bold text-lg">Union Bank</p>
                </div>
                <div>
                  <p className="text-green-300 font-black uppercase tracking-widest text-[10px] mb-1">Account Name</p>
                  <p className="font-bold">Justice Dev and Social Cohesion Initiative</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-green-300 font-black uppercase tracking-widest text-[10px] mb-1">Account Number (NGN) *</p>
                    <p className="font-mono font-bold tracking-tighter">0076017031</p>
                  </div>
                </div>
                <p className="text-[10px] text-green-400 italic">* Please verify account details with our office before making large wire transfers.</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-green-200 italic leading-relaxed">
                    For International SWIFT/IBAN or USD details, please contact our team at <strong>support@judsci.org.ng</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Financial Transparency</h3>
              <p className="text-gray-500 text-sm mb-6">We are committed to full accountability. View our audited financial and narrative reports.</p>
              <button
                onClick={() => reportUrl && window.open(reportUrl, '_blank')}
                disabled={!reportUrl}
                className="w-full py-4 border-2 border-gray-100 rounded-2xl text-green-700 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {reportUrl ? '2023 Narrative Report' : 'Report Loading...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonorHub;
