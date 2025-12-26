
import React, { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import News from './pages/News';

// Form Components
import RegisterForm from './components/forms/RegisterForm';
import InstitutionForm from './components/forms/InstitutionForm';

// Types & Icons
import type { Language } from './translations/index';
import { Phone } from 'lucide-react';

const App: React.FC = () => {
  // Global State for Navigation and Language
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState<Language>('en');

  // Automatically scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Routing Logic
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            lang={lang} 
            onNavigate={setCurrentPage} 
          />
        );
      case 'about':
        return <About lang={lang} />;
      case 'gallery':
        return <Gallery lang={lang} />;
      case 'news':
        return <News lang={lang} />;
      case 'register':
        return (
          <div className="py-20 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
              <RegisterForm lang={lang} />
            </div>
          </div>
        );
      case 'institution':
        return (
          <div className="py-20 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
              <InstitutionForm lang={lang} />
            </div>
          </div>
        );
      default:
        return <Home lang={lang} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      {/* Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        lang={lang} 
        onLangChange={setLang} 
      />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer Area */}
      <Footer lang={lang} />

      {/* Floating Support/Contact Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <a 
          href="tel:+919876543210" 
          className="bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 group flex items-center justify-center"
          title="Contact Support"
        >
          <Phone size={28} className="group-hover:rotate-12 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default App;