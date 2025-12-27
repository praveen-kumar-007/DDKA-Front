import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credentials - You can change these
    const VALID_ID = "DDKA";
    const VALID_PASSWORD = "DDKA@2017";

    if (adminId === VALID_ID && password === VALID_PASSWORD) {
      setError('');
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLoginSuccess();
    } else {
      setError('Invalid Credentials. Access Denied.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-blue-900 p-8 text-center text-white">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <Lock size={32} />
          </div>
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
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                placeholder="Enter ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-900 hover:bg-orange-600 text-white font-oswald text-xl uppercase py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center group active:scale-95"
          >
            Authenticate
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>
        
        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Dhanbad District Kabaddi Association
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;