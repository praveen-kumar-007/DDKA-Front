import React, { useState } from 'react';
import { User, Key, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PublicLogin: React.FC = () => {
  const [type, setType] = useState<'player' | 'official' | 'institution'>('player');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter email');
      return;
    }

    // Require email and registered mobile number (used as password) for ALL roles
    if (!password.trim()) {
      setError('Please enter your registered mobile number as password');
      return;
    }

    try {
      setIsLoading(true);

      const body = { type, email: email.trim(), password: password.trim() };

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();
      if (!result.success) {
        setError(result.message || 'Login failed');
        return;
      }

      if (result.token) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userProfile', JSON.stringify(result.profile || {}));
        localStorage.setItem('userRole', result.role || '');
      }

      // Redirect to account page
      window.location.href = '/account';
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Make sure the backend server is running');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-[#003366] p-6 text-center text-white">
          <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" alt="DDKA Logo" className="mx-auto mb-2 h-10 w-10 rounded-full bg-white p-1" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">Member Login</h2>
          <p className="text-sm mt-1">Only approved candidates may login</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">I am a</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-slate-50">
              <option value="player">Player</option>
              <option value="official">Technical Official / Referee</option>
              <option value="institution">Institution</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#003366] outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Registered mobile number</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#003366] outline-none"
                placeholder="Enter your registered mobile number"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003366] hover:bg-[#00264d] text-white font-oswald text-lg uppercase py-3 rounded-2xl shadow transition-all flex items-center justify-center"
          >
            {isLoading ? 'Logging in...' : 'Login'}
            {!isLoading && <ArrowRight className="ml-2" size={18} />}
          </button>
        </form>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100 space-y-2 text-sm">
          <p className="text-slate-600">Login using your registered Email and your registered mobile number (use mobile number as password).</p>
          <p className="text-slate-400">For any issues, contact the association.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicLogin;