
import React, { useState } from 'react';

import { usePaystackPayment } from 'react-paystack';

const DonorHub: React.FC = () => {
  const [amount, setAmount] = useState('5000');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const amounts = ['1000', '5000', '10000', '25000', '50000'];

  const config = {
    reference: "JDPC_" + new Date().getTime(),
    email: email,
    amount: (Number(customAmount || amount)) * 100, // Paystack is in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const onSuccess = (reference: any) => {
    // 1. Update backend status to SUCCESS
    fetch(`/api/donations/${config.reference}/`, { // We'll need a way to reference by ref ID, or just create new
      method: 'POST', // Simplified for demo: just create SUCCESS record
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: config.amount / 100,
        email: email,
        donor_name: name,
        reference: config.reference,
        status: 'SUCCESS'
      })
    }).then(() => {
      alert("Donation Successful! Thank you for your support.");
      setEmail('');
      setName('');
      setCustomAmount('');
      setAmount('5000');
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
    initializePayment(onSuccess as any, onClose);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6">Invest in <span className="text-green-700">Bauchi's Future</span></h2>
        <p className="text-gray-500 text-lg mb-12">
          Your donations go directly toward community peacebuilding, legal aid for the wrongly accused, and agricultural support.
        </p>

        <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border-2 border-dashed border-gray-200 text-left">

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Anonymous Donor"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {amounts.map(amt => (
              <button
                key={amt}
                onClick={() => { setAmount(amt); setCustomAmount(''); }}
                className={`py-4 px-6 rounded-2xl border-2 text-xl font-bold transition-all ${amount === amt && !customAmount ? 'border-green-700 bg-green-50 text-green-700' : 'border-white bg-white text-gray-400 hover:border-gray-200'
                  }`}
              >
                ₦{Number(amt).toLocaleString()}
              </button>
            ))}
            <div className="relative">
              <input
                type="number"
                placeholder="Custom"
                className={`w-full py-4 px-6 rounded-2xl border-2 text-lg font-bold outline-none transition-all ${customAmount ? 'border-green-700 bg-green-50 text-green-700' : 'border-white bg-white'
                  }`}
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
            </div>
          </div>

          <button
            onClick={handleDonation}
            disabled={loading}
            className="w-full max-w-sm mx-auto py-5 bg-green-700 hover:bg-green-800 text-white text-xl font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : 'Secure Donation'}
            {!loading && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
            <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Processed via</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span className="font-bold text-gray-800 italic">Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonorHub;
