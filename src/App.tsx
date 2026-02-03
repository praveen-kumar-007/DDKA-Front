import React, { useState, useEffect, Suspense } from 'react';
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
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
import AdminInstitutionDetails from './pages/AdminInstitutionDetails';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import PublicLogin from './pages/PublicLogin';
import Account from './pages/Account';
import AdminRegistrationDetails from './pages/AdminRegistrationDetails';
import PlayerIDCardPage from './pages/PlayerIDCardPage';
import InstitutionDetailsPublic from './pages/InstitutionDetailsPublic';
const AdminGalleryUpload = React.lazy(() => import('./pages/AdminGalleryUpload'));
const AdminContact = React.lazy(() => import('./pages/AdminContact'));
import Contact from './pages/Contact';
import OurGems from './pages/OurGems';
import Donate from './pages/Donate';
const AdminPlayersManagement = React.lazy(() => import('./pages/AdminPlayersManagement'));
const AdminRefereesManagement = React.lazy(() => import('./pages/AdminRefereesManagement'));
const AdminDonations = React.lazy(() => import('./pages/AdminDonations'));
import DonationReceipt from './pages/DonationReceipt';
const AdminTechnicalOfficialsManagement = React.lazy(() => import('./pages/AdminTechnicalOfficialsManagement'));
const AdminTechnicalOfficialDetails = React.lazy(() => import('./pages/AdminTechnicalOfficialDetails'));
const AdminManageAdmins = React.lazy(() => import('./pages/AdminManageAdmins'));
const AdminUnifiedSearch = React.lazy(() => import('./pages/AdminUnifiedSearch'));
const AdminBulkEmail = React.lazy(() => import('./pages/AdminBulkEmail'));
const AdminRegistrations = React.lazy(() => import('./pages/AdminRegistrations'));

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
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home lang={lang} onNavigate={handlePageChange} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/affiliated-institutions" element={<AffiliatedInstitutions lang={lang} />} />
          <Route path="/gallery" element={<Gallery lang={lang} />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/donate" element={<Donate lang={lang} />} />
          <Route path="/donation/:id" element={<DonationReceipt />} />
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
          {/* Admin Registrations (protected) */}
          <Route path="/admin/registrations" element={
            isAuthenticated ? <AdminRegistrations /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin Bulk Email (protected) */}
          <Route path="/admin/bulk-email" element={
            isAuthenticated ? <AdminBulkEmail /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin Donations Management (protected) */}
          <Route path="/admin/donations" element={
            isAuthenticated ? <AdminDonations /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin Technical Officials Management (protected) */}
          <Route path="/admin/technical-officials" element={
            isAuthenticated ? <AdminTechnicalOfficialsManagement /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          <Route path="/admin/technical-officials/:id" element={
            isAuthenticated ? <AdminTechnicalOfficialDetails /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Unified Admin Search (protected) */}
          <Route path="/admin/unified-search" element={
            isAuthenticated ? <AdminUnifiedSearch /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          {/* Admin News Upload Route (protected) */}
          <Route path="/admin-news-upload" element={
            isAuthenticated ? <AdminNewsUpload /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />

          {/* Superadmin: Manage Admins */}
          <Route path="/admin/manage-admins" element={
            isAuthenticated ? <AdminManageAdmins /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
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

          {/* Public Member Login */}
          <Route path="/login" element={<PublicLogin />} />
          <Route path="/account" element={<Account />} />
          
          <Route path="/register" element={
            <>
              <Helmet>
                <title>
                  {lang === 'hi'
                    ? 'खिलाड़ी पंजीकरण | धनबाद जिला कबड्डी संघ (DDKA)'
                    : 'Player Registration | Dhanbad District Kabaddi Association (DDKA)'}
                </title>
                {/* Canonical and JSON-LD to help indexing & rich results */}
                <link rel="canonical" href={`${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/register`} />
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
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": lang === 'hi' ? 'खिलाड़ी पंजीकरण' : 'Player Registration',
                    "url": `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/register`,
                    "description": lang === 'hi' ? 'धनबाद जिला कबड्डी संघ (DDKA) के लिए ऑनलाइन खिलाड़ी पंजीकरण फ़ॉर्म' : 'Online player registration form for DDKA'
                  })}
                </script>
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
                <link rel="canonical" href={`${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/institution`} />
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
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Dhanbad District Kabaddi Association",
                    "url": `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/institution`,
                    "description": lang === 'hi' ? 'DDKA संस्थान एफिलिएशन पंजीकरण' : 'Institution affiliation registration with DDKA',
                    "sameAs": [
                      `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}`
                    ]
                  })}
                </script>
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

          {/* Admin registration details (protected) */}
          <Route path="/admin/registration/:id" element={
            isAuthenticated ? <AdminRegistrationDetails /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />
          <Route path="/admin/institution/:id" element={
            isAuthenticated ? <AdminInstitutionDetails /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          } />

          <Route path="/id-card/:idNo" element={<PlayerIDCardPage />} />
          {/* Public institution details for SEO */}
          <Route path="/institution/:id" element={
            // lazy load to reduce initial bundle size
            <InstitutionDetailsPublic />
          } />
          <Route path="*" element={<Home lang={lang} onNavigate={handlePageChange} />} />
        </Routes>
        </Suspense>
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