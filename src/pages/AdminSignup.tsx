import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminSignup: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/exists`);
        const result = await res.json();
        if (result.success) {
          setAdminExists(result.exists);
        }
      } catch (err) {
        console.error('Failed to check admin status', err);
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-600'];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!adminId.trim()) {
      setError('Admin ID is required');
      return;
    }
    if (adminId.trim().length < 3) {
      setError('Admin ID must be at least 3 characters');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminId.trim(),
          email: email.trim(),
          password,
          confirmPassword: confirm
        })
      });

      const result = await res.json();

      if (result.success) {
        setSuccess('✓ Admin account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/admin-portal-access'), 1500);
      } else {
        setError(result.message || 'Failed to create admin account');
      }
    } catch (err) {
      setError('Failed to create admin account. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-900 p-8 text-center text-white">
            <ShieldCheck size={48} className="mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">Checking Admin Status</h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-slate-700">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-blue-900 p-8 text-center text-white">
          <a href="/" className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <img src="/logo.png" alt="DDKA Logo" className="w-12 h-12 object-contain" />
          </a>
          <h2 className="text-3xl font-oswald font-bold uppercase tracking-tight">Create Admin Account</h2>
          <p className="text-blue-200 text-sm mt-1 uppercase tracking-widest font-bold">Secure Registration</p>
        </div>

        <form onSubmit={handleSignup} className="p-8 space-y-5">
          {adminExists && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-100">
              <CheckCircle size={16} />
              First admin (SUPERADMIN) already exists. New accounts will be NORMAL ADMINS without delete rights. Permissions can be managed by the superadmin.
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-100 animate-pulse">
              <CheckCircle size={18} /> {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                placeholder="Enter unique admin ID"
                minLength={3}
              />
            </div>
            {adminId.length > 0 && adminId.length < 3 && (
              <p className="text-xs text-orange-600 ml-1">Minimum 3 characters required</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                placeholder="Enter admin email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="Minimum 6 characters"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`h-2 flex-1 rounded-full ${strengthColors[passwordStrength - 1]}`} />
                <span className="text-xs font-bold text-slate-500">{strengthLabels[passwordStrength - 1]}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && confirm && password === confirm && (
              <p className="text-xs text-green-600 ml-1 flex items-center gap-1"><CheckCircle size={14} /> Passwords match</p>
            )}
            {password && confirm && password !== confirm && (
              <p className="text-xs text-red-600 ml-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !adminId || !email || !password || !confirm || password !== confirm}
            className="w-full bg-blue-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-oswald text-lg uppercase py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 mb-3">Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate('/admin-portal-access')}
              className="text-blue-900 font-bold hover:underline"
            >
              Go to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
