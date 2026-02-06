import { useState, useEffect, useCallback } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
  const [locationState, setLocationState] = useState<'idle' | 'pending' | 'granted' | 'denied' | 'unsupported' | 'error'>('idle');
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<{ latitude?: number; longitude?: number; accuracy?: number } | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);


  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationState('unsupported');
      setLocationMessage('Browser does not support geolocation.');
      setRequestingLocation(false);
      return;
    }

    setRequestingLocation(true);
    setLocationState('pending');
    setLocationMessage('Requesting precise location... please allow the browser prompt.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationState('granted');
        const accuracyLabel = position.coords.accuracy ? `±${position.coords.accuracy.toFixed(1)} m` : 'accuracy unknown';
        setLocationMessage(`Captured precise GPS location (${accuracyLabel}).`);
        setRequestingLocation(false);
      },
      (error) => {
        const baseMessage = 'Location was not captured. You can retry once permission is granted.';
        if (error.code === 1) {
          setLocationState('denied');
          setLocationMessage('Location permission denied. Enable location to share precise coordinates.');
        } else if (error.code === 2) {
          setLocationState('error');
          setLocationMessage(`${baseMessage} Position unavailable.`);
        } else if (error.code === 3) {
          setLocationState('error');
          setLocationMessage(`${baseMessage} Request timed out.`);
        } else {
          setLocationState('error');
          setLocationMessage(`${baseMessage} ${error.message || 'Unknown error'}`);
        }
        setRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

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
      setError('Please enter ID/email and password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminId.trim(),
          password,
          coordinates:
            locationCoords?.latitude != null && locationCoords?.longitude != null
              ? {
                  latitude: locationCoords.latitude,
                  longitude: locationCoords.longitude,
                  accuracy: locationCoords.accuracy,
                }
              : undefined,
        })
      });

      const result = await res.json();

      if (result.success) {
        setError('');

        // Persist JWT token for protected admin API calls
        if (result.token) {
          localStorage.setItem('token', result.token);
        }

        // Persist role and permissions for UI-level access control
        if (result.role) {
          localStorage.setItem('adminRole', result.role);
        }
        if (result.permissions) {
          localStorage.setItem('adminPermissions', JSON.stringify(result.permissions));
        }

        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setTimeout(() => onLoginSuccess(), 300);
      } else {
        // Provide more specific error messages
        const errorMsg = result.message || 'Login failed. Please try again.';
        if (errorMsg.includes('Invalid')) {
          setError('❌ Invalid Admin ID / Email or Password. Please check and try again.');
        } else if (errorMsg.includes('required')) {
          setError('⚠️ Admin ID / Email and Password are required.');
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
    <>
      <Helmet>
        <title>Admin Login | Dhanbad District Kabaddi Association (DDKA)</title>
        <meta name="description" content="Admin login for DDKA portal. Authorized admins can sign in to manage registrations, news and gallery content." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://dhanbadkabaddiassociation.tech/admin-portal-access" />
        <meta property="og:title" content="Admin Login | DDKA" />
        <meta property="og:description" content="Secure admin access to manage DDKA registrations and content." />
      </Helmet>

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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin ID or Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium disabled:bg-slate-100"
                placeholder="Enter admin ID or email"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <p className="text-[10px] leading-tight">
                {locationMessage || 'Location will be captured for login alerts once permission is granted.'}
              </p>
            </div>
            {locationState !== 'granted' && locationState !== 'unsupported' && (
              <button
                type="button"
                onClick={requestLocation}
                disabled={requestingLocation}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-500"
              >
                {requestingLocation ? 'Requesting location...' : 'Retry location'}
              </button>
            )}
          </div>
        </form>
        <div className="p-6 bg-slate-50 text-center border-t border-slate-100 space-y-3">
            <p className="text-sm text-green-700 font-bold">✓ Secure Admin Access</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Dhanbad District Kabaddi Association
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminLogin;