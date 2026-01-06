import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FooterContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If a reCAPTCHA site key is configured, ensure user solved it
    if (recaptchaSiteKey && !captchaToken) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/contact/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, botField, recaptchaToken: captchaToken })
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result && result.success) {
        setStatus('sent');
        setEmail('');
        setBotField('');
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
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
      {/* Honeypot field for bots – kept hidden from real users */}
      <input
        type="text"
        value={botField}
        onChange={e => setBotField(e.target.value)}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
      {recaptchaSiteKey && (
        <div className="pt-1">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>
      )}
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
