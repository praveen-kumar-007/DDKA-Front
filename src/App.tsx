import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import News from './pages/News';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminLogin from './pages/AdminLogin'; // New Import

// Form Components
import RegisterForm from './components/forms/RegisterForm';
import InstitutionForm from './components/forms/InstitutionForm';

// Types & Icons
import type { Language } from './translations'; 
import { Phone } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  
  // Admin Auth State - Checks session storage on load
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handlePageChange = (pageId: string) => {
    if (pageId === 'home') {
      navigate('/');
    } else {
      navigate(`/${pageId}`);
    }
  };

  const getCurrentPageId = () => {
    const path = location.pathname.substring(1);
    return path === '' ? 'home' : path;
  };

  const isAdminPage = location.pathname === '/admin-portal-access';

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      <Navbar 
        currentPage={getCurrentPageId()} 
        onPageChange={handlePageChange} 
        lang={lang} 
        onLangChange={setLang} 
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home lang={lang} onNavigate={handlePageChange} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/gallery" element={<Gallery lang={lang} />} />
          <Route path="/news" element={<News lang={lang} />} />
          
          {/* Admin Route with Auth Check */}
          <Route path="/admin-portal-access" element={
            isAuthenticated ? (
              <AdminDashboard lang={lang} />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          } />
          
          <Route path="/register" element={
            <div className="py-20 bg-slate-50 min-h-screen">
              <div className="max-w-7xl mx-auto px-4">
                <RegisterForm lang={lang} />
              </div>
            </div>
          } />

          <Route path="/institution" element={
            <div className="py-20 bg-slate-50 min-h-screen">
              <div className="max-w-7xl mx-auto px-4">
                <InstitutionForm lang={lang} />
              </div>
            </div>
          } />

          <Route path="*" element={<Home lang={lang} onNavigate={handlePageChange} />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer lang={lang} />}

      {!isAdminPage && (
        <div className="fixed bottom-8 right-8 z-40">
          <a 
            href="tel:+91 9123163206" 
            className="bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 group flex items-center justify-center"
            title="Contact Support"
          >
            <Phone size={28} className="group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
};

export default App;