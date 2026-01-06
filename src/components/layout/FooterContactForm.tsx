import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FooterContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/contact/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result && result.success) {
        setStatus('sent');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/60 p-6 rounded-xl border border-blue-900/30 mt-8">
      <h4 className="text-lg font-bold text-orange-400 mb-2">Contact Us</h4>
      <input
        type="email"
        className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-orange-400 outline-none"
        placeholder="Your Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition-all"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'sent' && <div className="text-green-400 text-sm font-bold">Thank you! We received your email.</div>}
      {status === 'error' && <div className="text-red-400 text-sm font-bold">Something went wrong. Please try again.</div>}
    </form>
  );
};

export default FooterContactForm;
