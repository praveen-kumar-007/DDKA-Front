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
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  // cleanup object URL when component unmounts or preview changes
  React.useEffect(() => {
    return () => {
      if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    };
  }, [receiptPreview]);

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

    // Require email and phone
    if (!email || !email.trim()) {
      setStatus('error');
      setResultMsg(lang === 'hi' ? 'कृपया अपना ईमेल दर्ज करें।' : 'Please enter your email address.');
      return;
    }

    if (!phone || !phone.trim()) {
      setStatus('error');
      setResultMsg(lang === 'hi' ? 'कृपया अपना मोबाइल नंबर दर्ज करें।' : 'Please enter your mobile number.');
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
        setResultMsg(lang === 'hi'
          ? 'आपका दान रिकॉर्ड कर लिया गया है और सत्यापन के लिए लंबित है। DDKA की स्वीकृति के बाद आप रिसीप्ट डाउनलोड करने के लिए /login पर लॉगिन कर सकते हैं — ईमेल आईडी को ID के रूप में और पंजीकृत मोबाइल नंबर को पासवर्ड के रूप में उपयोग करें।'
          : 'Your donation has been submitted and is pending verification. After approval by DDKA you can get the receipt by logging in at /login using your Email as your ID and your registered mobile number as the password.'
        );
        // clear form
        setName('');
        setEmail('');
        setPhone('');
        setCustom('');
        setAmount(500);
        setMessage('');
        // clear receipt and preview
        if (receiptPreview) URL.revokeObjectURL(receiptPreview);
        setReceipt(null);
        setReceiptPreview(null);
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-4 rounded-full bg-orange-50 text-orange-600 flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold text-blue-900 truncate">{lang === 'hi' ? 'DDKA को दान दें' : 'Support DDKA'}</h1>
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
                    className="w-full sm:w-36 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'hi' ? 'पूरा नाम' : 'Full name'} className="px-3 py-2 border rounded-lg" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={lang === 'hi' ? 'ईमेल' : 'Email'} type="email" className="px-3 py-2 border rounded-lg" />
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={lang === 'hi' ? 'फ़ोन नंबर' : 'Phone'} type="tel" className="px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">{lang === 'hi' ? 'भुगतान विधि' : 'Payment method'}</label>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-48 h-auto md:h-48 bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-center shadow-sm">
                    <img src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1769251199/QR_1769251094_biebtv.png" alt="UPI QR code" className="max-w-full h-auto object-contain" />
                  </div>
                  <div className="text-sm text-slate-700 min-w-0 break-words">
                    <p className="font-semibold">{lang === 'hi' ? 'Scan & Pay (UPI)' : 'Scan & Pay (UPI)'}</p>
                    <p className="mt-2">{lang === 'hi' ? 'UPI आईडी' : 'UPI ID'}: <span className="font-mono break-words inline-block">9504904499@upi</span></p>
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

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer?.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      setStatus('error');
                      setResultMsg(lang === 'hi' ? 'कृपया 5MB से छोटा फ़ाइल चुनें।' : 'Please select a file smaller than 5MB.');
                      setReceipt(null);
                      setReceiptPreview(null);
                      return;
                    }
                    setReceipt(file);
                    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                    const url = URL.createObjectURL(file);
                    setReceiptPreview(url);
                    setStatus('idle');
                    setResultMsg('');
                    try { (document.querySelector('input[data-receipt]') as HTMLInputElement).value = ''; } catch(e) {}
                  }}
                  className={`border rounded-lg p-4 flex items-center gap-4 ${dragActive ? 'border-dashed border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  <input
                    data-receipt
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (!file) {
                        setReceipt(null);
                        if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                        setReceiptPreview(null);
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setStatus('error');
                        setResultMsg(lang === 'hi' ? 'कृपया 5MB से छोटा फ़ाइल चुनें।' : 'Please select a file smaller than 5MB.');
                        setReceipt(null);
                        setReceiptPreview(null);
                        return;
                      }
                      setReceipt(file);
                      if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                      const url = URL.createObjectURL(file);
                      setReceiptPreview(url);
                      setStatus('idle');
                      setResultMsg('');
                    }}
                    className="hidden"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                      {receiptPreview ? (
                        <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m0 0L3 12m4-4l4 4M17 8v8m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">{lang === 'hi' ? 'स्लाइड में रखें या क्लिक करके छवि अपलोड करें' : 'Drop or click to upload an image'}</div>
                      <div className="text-xs text-slate-500 mt-1">{lang === 'hi' ? 'PNG/JPG, अधिकतम 5MB' : 'PNG/JPG, max 5MB'}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[data-receipt]') as HTMLInputElement | null;
                        if (input) input.click();
                      }}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded"
                    >
                      {lang === 'hi' ? 'अपलोड करें' : 'Upload'}
                    </button>
                  </div>
                </div>

                {/* Preview meta / actions */}
                {receiptPreview && (
                  <div className="mt-3 flex items-start gap-3">
                    <div className="w-28 h-28 rounded-md overflow-hidden border border-slate-200 bg-white shadow-sm">
                      <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-slate-700">{receipt?.name}</div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (receiptPreview) URL.revokeObjectURL(receiptPreview);
                            setReceipt(null);
                            setReceiptPreview(null);
                            try { (document.querySelector('input[data-receipt]') as HTMLInputElement).value = ''; } catch(e) {}
                          }}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded"
                        >{lang === 'hi' ? 'हटाएँ' : 'Remove'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <button type="submit" className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow-sm justify-center" disabled={status === 'sending'}>
                  <Zap className="w-4 h-4" /> {status === 'sending' ? (lang === 'hi' ? 'प्रक्रिया...' : 'Processing...') : (lang === 'hi' ? 'दान करें' : 'Donate now')}
                </button>
                <div className="text-sm text-slate-600 break-words">{lang === 'hi' ? 'दान सत्यापन के लिए लंबित है। DDKA की स्वीकृति के बाद आप रिसीप्ट प्राप्त करने के लिए /login पर लॉगिन कर सकते हैं (ईमेल आईडी के रूप में ID और पंजीकृत मोबाइल नंबर पासवर्ड के रूप में)।' : 'Donation is pending verification. After approval by DDKA you can get the receipt by logging in at /login using your Email as ID and your registered mobile number as password.'}</div>
              </div>

              {status === 'error' && <div className="text-sm text-red-600">{resultMsg}</div>}
              {status === 'success' && <div className="text-sm text-green-700">{resultMsg}</div>}

              <hr className="my-3" />

              <div className="text-sm text-slate-600">
                <p className="font-semibold">{lang === 'hi' ? 'UPI आईडी' : 'UPI ID'}: <span className="font-mono">9504904499@upi</span></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;
