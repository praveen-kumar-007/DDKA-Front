import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Donate: React.FC<{ lang?: 'en' | 'hi' }> = ({ lang = 'en' }) => {
  const [amount, setAmount] = useState<number | ''>(500);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const method = 'upi';
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  const presets = [100, 500, 1000, 2000];

  const handleAmountSelect = (v: number) => {
    setCustom('');
    setAmount(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const finalAmount = custom ? Number(custom) : amount;
    if (!finalAmount || finalAmount <= 0) {
      setStatus('error');
      setResultMsg('Please enter a valid donation amount.');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('phone', phone);
      form.append('amount', String(finalAmount));
      form.append('method', method);
      form.append('message', message);
      if (receipt) form.append('receipt', receipt);

      const res = await fetch(`${API_URL}/api/donations`, {
        method: 'POST',
        body: form,
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        setStatus('success');
        setResultMsg('Thank you! Your donation has been received. We will contact you with the receipt shortly.');
        // capture the donation id so we can show a link to view/generate receipt
        const donationId = data.data && data.data._id ? data.data._id : null;
        setName('');
        setEmail('');
        setPhone('');
        setCustom('');
        setAmount(500);
        setMessage('');
        setReceipt(null);
        if (donationId) {
          // show link to receipt for immediate generation/view
          if (window && typeof window.history !== 'undefined') {
            // show a short success toast via alert (simple) and open link in new tab if user wants to
            const view = confirm('Donation recorded. Do you want to view/generate your receipt now?');
            if (view) window.location.href = `/donation/${donationId}`;
          }
        }
      } else {
        setStatus('error');
        setResultMsg((data && data.message) || 'Failed to submit donation. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setResultMsg('Network error. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'दान करें | DDKA' : 'Donate | DDKA'}</title>
        <meta name="description" content={lang === 'hi' ? 'DDKA के लिए दान देकर खेल को समर्थन दें।' : 'Support DDKA by making a donation to grow local kabaddi.'} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-orange-50 text-orange-600">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-blue-900">{lang === 'hi' ? 'DDKA को दान दें' : 'Support DDKA'}</h1>
                <p className="text-slate-600 mt-1">{lang === 'hi' ? 'आपका समर्थन हमारे खेल कार्यक्रमों, प्रशिक्षकों और युवा विकास को आगे बढ़ाता है।' : 'Your support helps fund tournaments, coaching, equipment and youth programs.'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">{lang === 'hi' ? 'राशि चुनें' : 'Choose an amount'}</label>
                <div className="flex flex-wrap gap-3">
                  {presets.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleAmountSelect(p)}
                      className={`px-4 py-2 rounded-full border font-semibold ${amount === p ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-700'}`}>
                      ₹{p}
                    </button>
                  ))}

                  <input
                    type="number"
                    min={1}
                    placeholder={lang === 'hi' ? 'अन्य राशि' : 'Other amount'}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    className="w-36 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'hi' ? 'पूरा नाम' : 'Full name'} className="px-3 py-2 border rounded-lg" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={lang === 'hi' ? 'ईमेल' : 'Email'} type="email" className="px-3 py-2 border rounded-lg" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={lang === 'hi' ? 'फ़ोन नंबर (वैकल्पिक)' : 'Phone (optional)'} className="px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">{lang === 'hi' ? 'भुगतान विधि' : 'Payment method'}</label>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-48 h-48 bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-center shadow-sm">
                    <img src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1769251199/QR_1769251094_biebtv.png" alt="UPI QR code" className="max-w-full max-h-full" />
                  </div>
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold">{lang === 'hi' ? 'Scan & Pay (UPI)' : 'Scan & Pay (UPI)'}</p>
                    <p className="mt-2">{lang === 'hi' ? 'UPI आईडी' : 'UPI ID'}: <span className="font-mono">9504904499@upi</span></p>
                    <p className="text-xs text-slate-500 mt-2">{lang === 'hi' ? 'भुगतान करने के बाद कृपया यहाँ भुगतान का प्रमाण (स्क्रीनशॉट) अपलोड करें।' : 'After paying, please upload your payment proof (screenshot) below.'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">{lang === 'hi' ? 'टिप्पणी (वैकल्पिक)' : 'Message (optional)'}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">{lang === 'hi' ? 'भुगतान का प्रमाण (वैकल्पिक)' : 'Payment proof (optional)'}</label>
                <input type="file" accept="image/*" onChange={(e) => setReceipt(e.target.files ? e.target.files[0] : null)} />
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow-sm" disabled={status === 'sending'}>
                  <Zap className="w-4 h-4" /> {status === 'sending' ? (lang === 'hi' ? 'प्रक्रिया...' : 'Processing...') : (lang === 'hi' ? 'दान करें' : 'Donate now')}
                </button>
                <div className="text-sm text-slate-600">{lang === 'hi' ? 'रिकॉर्ड प्राप्त होने पर हम ईमेल भेजेंगे।' : 'We will email you a receipt once the donation is processed.'}</div>
              </div>

              {status === 'error' && <div className="text-sm text-red-600">{resultMsg}</div>}
              {status === 'success' && <div className="text-sm text-green-700">{resultMsg}</div>}

              <hr className="my-3" />

              <div className="text-sm text-slate-600">
                <p className="font-semibold">{lang === 'hi' ? 'UPI आईडी' : 'UPI ID'}: <span className="font-mono">9504904499@upi</span></p>
                <p className="mt-1">{lang === 'hi' ? 'बैंक विवरण' : 'Bank Details'}:</p>
                <p className="text-[13px] mt-1">Account: Dhanbad District Kabaddi Association</p>
                <p className="text-[13px]">A/C No: 1234567890 | IFSC: ABCD0123456 | Bank: Example Bank</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;
