import { useState, useEffect } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check if admin account exists on mount
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/exists`);
        const result = await res.json();
        if (result.success) {
          // Admin exists, page ready
        }
      } catch (err) {
        console.error('Failed to check admin status', err);
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!adminId.trim() || !password) {
      setError('Please enter both ID and password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminId.trim(),
          password
        })
      });

      const result = await res.json();

      if (result.success) {
        setError('');

        // Persist JWT token for protected admin API calls
        if (result.token) {
          localStorage.setItem('token', result.token);
        }

        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setTimeout(() => onLoginSuccess(), 300);
      } else {
        // Provide more specific error messages
        const errorMsg = result.message || 'Login failed. Please try again.';
        if (errorMsg.includes('Invalid')) {
          setError('❌ Invalid Admin ID or Password. Please check and try again.');
        } else if (errorMsg.includes('required')) {
          setError('⚠️ Admin ID and Password are required.');
        } else {
          setError(`❌ ${errorMsg}`);
        }
      }
    } catch (err) {
      setError('❌ Connection failed. Make sure the backend server is running at ' + API_URL);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-900 p-8 text-center text-white">
            <Lock size={48} className="mx-auto mb-4 animate-pulse" />
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
            <img src="/logo.svg" alt="DDKA Logo" className="w-12 h-12 object-contain" />
          </a>
          <h2 className="text-3xl font-oswald font-bold uppercase tracking-tight">Admin Portal</h2>
          <p className="text-blue-200 text-sm mt-1 uppercase tracking-widest font-bold">Secure Access</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-pulse">
              <AlertCircle size={18} /> {error}
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
                onChange={(e) => setAdminId(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium disabled:bg-slate-100"
                placeholder="Enter admin ID"
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
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:bg-slate-100"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !adminId || !password}
            className="w-full bg-blue-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-oswald text-xl uppercase py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center group active:scale-95 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate'}
            {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
          </button>
        </form>
        <div className="p-6 bg-slate-50 text-center border-t border-slate-100 space-y-3">
          <p className="text-sm text-green-700 font-bold">✓ Secure Admin Access</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Dhanbad District Kabaddi Association
          </p>
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] text-slate-600 mb-2">No admin account yet?</p>
            <a 
              href="/admin-secure-setup-dkka2024" 
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline"
            >
              Create admin account here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;