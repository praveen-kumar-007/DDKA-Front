import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import AffiliatedInstitutions from './pages/AffiliatedInstitutions';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import KabaddiRules from './pages/KabaddiRules';
import AdminNewsUpload from './pages/AdminNewsUpload';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminInstitutionDetails from './pages/AdminInstitutionDetails';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminRegistrationDetails from './pages/AdminRegistrationDetails';
import PlayerIDCardPage from './pages/PlayerIDCardPage';
import AdminGalleryUpload from './pages/AdminGalleryUpload';
import AdminContact from './pages/AdminContact';
import Contact from './pages/Contact';
import OurGems from './pages/OurGems';
import AdminPlayersManagement from './pages/AdminPlayersManagement';
import AdminRefereesManagement from './pages/AdminRefereesManagement';
import AdminTechnicalOfficialsManagement from './pages/AdminTechnicalOfficialsManagement';
import AdminTechnicalOfficialDetails from './pages/AdminTechnicalOfficialDetails';

// Form Components
import RegisterForm from './components/forms/RegisterForm';
import InstitutionForm from './components/forms/InstitutionForm';
import TechnicalOfficialForm from './components/forms/TechnicalOfficialForm';

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
          <Route path="/affiliated-institutions" element={<AffiliatedInstitutions lang={lang} />} />
          <Route path="/gallery" element={<Gallery lang={lang} />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/terms-conditions" element={<TermsConditions lang={lang} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy lang={lang} />} />
          <Route path="/kabaddi-rules" element={<KabaddiRules lang={lang} />} />
          <Route path="/hall-of-fame" element={<OurGems lang={lang} />} />
          {/* Admin Gallery Upload Route (protected) */}
          <Route path="/admin/gallery" element={
            isAuthenticated ? <AdminGalleryUpload /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
            {/* Admin Contact Messages (protected) */}
            <Route path="/admin/contact" element={
              isAuthenticated ? <AdminContact /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            } />
          {/* Admin Players Management (protected) */}
          <Route path="/admin/players" element={
            isAuthenticated ? <AdminPlayersManagement /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin Referees Management (protected) */}
          <Route path="/admin/referees" element={
            isAuthenticated ? <AdminRefereesManagement /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin Technical Officials Management (protected) */}
          <Route path="/admin/technical-officials" element={
            isAuthenticated ? <AdminTechnicalOfficialsManagement /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          <Route path="/admin/technical-officials/:id" element={
            isAuthenticated ? <AdminTechnicalOfficialDetails /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin News Upload Route (protected) */}
          <Route path="/admin-news-upload" element={
            isAuthenticated ? <AdminNewsUpload /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          
          {/* Admin Route with Auth Check */}
          <Route path="/admin-portal-access" element={
            isAuthenticated ? (
              <AdminDashboard lang={lang} />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          } />
          <Route path="/admin-secure-setup-dkka2024" element={<AdminSignup />} />
          
          <Route path="/register" element={
            <>
              <Helmet>
                <title>
                  {lang === 'hi'
                    ? 'खिलाड़ी पंजीकरण | धनबाद जिला कबड्डी संघ (DDKA)'
                    : 'Player Registration | Dhanbad District Kabaddi Association (DDKA)'}
                </title>
                <meta
                  name="description"
                  content={
                    lang === 'hi'
                      ? 'धनबाद जिला कबड्डी संघ (DDKA) के लिए ऑनलाइन खिलाड़ी पंजीकरण फ़ॉर्म – धनबाद, झारखंड के खिलाड़ियों के लिए।'
                      : 'Online player registration form for Dhanbad District Kabaddi Association (DDKA) – for Kabaddi players from Dhanbad, Jharkhand.'
                  }
                />
                <meta
                  name="keywords"
                  content="player registration dhanbad kabaddi, DDKA player registration, kabaddi registration dhanbad, kabaddi jharkhand player form, jaan kabaddi registration, jan kabaddi dhanbad"
                />
              </Helmet>
              <div className="py-20 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                  <RegisterForm lang={lang} />
                </div>
              </div>
            </>
          } />

          <Route path="/institution" element={
            <>
              <Helmet>
                <title>
                  {lang === 'hi'
                    ? 'संस्थान एफिलिएशन | धनबाद जिला कबड्डी संघ (DDKA)'
                    : 'Institution Affiliation | Dhanbad District Kabaddi Association (DDKA)'}
                </title>
                <meta
                  name="description"
                  content={
                    lang === 'hi'
                      ? 'स्कूल, कॉलेज और क्लबों के लिए DDKA संस्थान एफिलिएशन पंजीकरण – धनबाद जिला कबड्डी संघ से जुड़ने के लिए ऑनलाइन फ़ॉर्म।'
                      : 'Institution affiliation registration for schools, colleges and clubs with Dhanbad District Kabaddi Association (DDKA) in Dhanbad, Jharkhand.'
                  }
                />
                <meta
                  name="keywords"
                  content="institution affiliation dhanbad kabaddi, DDKA institution registration, kabaddi school affiliation dhanbad, kabaddi club registration jharkhand, kabaddi association of jharkhand dhanbad, jaan kabaddi school affiliation"
                />
              </Helmet>
              <div className="py-20 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                  <InstitutionForm lang={lang} />
                </div>
              </div>
            </>
          } />

          <Route path="/technical-official-registration" element={
            <>
              <Helmet>
                <title>
                  {lang === 'hi'
                    ? 'टेक्निकल ऑफिशियल पंजीकरण | DDKA'
                    : 'Technical Official Registration | DDKA Kabaddi Dhanbad'}
                </title>
                <meta
                  name="description"
                  content={
                    lang === 'hi'
                      ? 'धनबाद जिला कबड्डी संघ (DDKA) के लिए टेक्निकल ऑफिशियल / रेफरी पंजीकरण फ़ॉर्म – धनबाद और झारखंड के इच्छुक अधिकारियों के लिए।'
                      : 'Technical official / referee registration form for Dhanbad District Kabaddi Association (DDKA) – for Kabaddi officials from Dhanbad and Jharkhand.'
                  }
                />
                <meta
                  name="keywords"
                  content="technical official registration dhanbad kabaddi, kabaddi referees dhanbad, DDKA technical officials, kabaddi jharkhand referees, jaan kabaddi referee registration"
                />
              </Helmet>
              <div className="py-20 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                  <TechnicalOfficialForm lang={lang} />
                </div>
              </div>
            </>
          } />

          <Route path="/contact" element={<Contact lang={lang} />} />

          <Route path="*" element={<Home lang={lang} onNavigate={handlePageChange} />} />
          <Route path="/admin/registration/:id" element={<AdminRegistrationDetails />} />
          <Route path="/id-card/:idNo" element={<PlayerIDCardPage />} />
          <Route path="/admin/institution/:id" element={<AdminInstitutionDetails />} />
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