import React, { useState, useEffect } from 'react';
import { Menu, X, Languages } from 'lucide-react';
import { translations } from '../../translations';
import type { Language } from '../../translations';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, lang, onLangChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const t = translations[lang];

  const navItems = [
    { name: t.nav.home, id: 'home' },
    { 
      name: t.nav.about, 
      id: 'about', 
      dropdown: [
        { name: lang === 'hi' ? 'हमारे बारे में' : 'About Us', id: 'about' },
        { name: lang === 'hi' ? 'गौरव मंदिर' : 'Hall of Fame', id: 'hall-of-fame' },
        { name: t.nav.affiliatedInstitutions, id: 'affiliated-institutions' },
        { name: lang === 'hi' ? 'कबड्डी नियम' : 'Kabaddi Rules', id: 'kabaddi-rules' },
      ] 
    },
    { name: t.nav.gallery, id: 'gallery' },
    { name: t.nav.news, id: 'news' },
    { 
      name: t.nav.register, 
      id: 'register', 
      dropdown: [
        { name: t.forms.playerTitle, id: 'register' },
        { name: t.forms.instTitle, id: 'institution' },
      ] 
    },
    { name: t.footer.contact, id: 'contact' },
  ];

  // Close mobile menu when page changes
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [currentPage]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (id: string) => {
    onPageChange(id);
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" 
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" 
              alt="DDKA Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full bg-white p-1" 
            />
            <div className="flex flex-col border-l border-gray-200 pl-2 sm:pl-3">
              <span className="text-xl sm:text-2xl font-oswald font-bold text-blue-900 leading-tight">
                DDKA
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-orange-600 font-bold">
                  {lang === 'hi' ? 'धनबाद जिला कबड्डी' : 'Dhanbad District Kabaddi'}
                </span>
                <span className="text-[7px] sm:text-[8px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-100 font-bold uppercase w-fit">
                  {t.nav.affiliated}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-4 xl:space-x-6 mr-4 border-r border-gray-100 pr-4">
              {navItems.map((item) => (
                item.dropdown ? (
                  <div key={item.id} className="relative group">
                    <button
                      className={`text-xs xl:text-sm font-semibold transition-colors duration-200 uppercase tracking-wider flex items-center gap-1 py-2 ${
                        item.dropdown.some(sub => sub.id === currentPage) 
                          ? 'text-orange-600 border-b-2 border-orange-600' 
                          : 'text-gray-600 hover:text-blue-800'
                      }`}
                    >
                      {item.name}
                      <svg 
                        className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.dropdown.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id)}
                            className={`block w-full text-left px-4 py-3 text-xs xl:text-sm font-semibold transition-colors ${
                              currentPage === sub.id 
                                ? 'bg-orange-50 text-orange-600' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-800'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-xs xl:text-sm font-semibold transition-colors duration-200 uppercase tracking-wider py-2 ${
                      currentPage === item.id 
                        ? 'text-orange-600 border-b-2 border-orange-600' 
                        : 'text-gray-600 hover:text-blue-800'
                    }`}
                  >
                    {item.name}
                  </button>
                )
              ))}
            </div>
            
            {/* Desktop Language & Logos */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg" 
                alt="Jharkhand State Kabaddi Association" 
                className="h-8 w-8 object-contain grayscale hover:grayscale-0 transition-all rounded-full bg-white p-1" 
              />
              <img 
                src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" 
                alt="AKFI Logo" 
                className="h-8 w-8 object-contain grayscale hover:grayscale-0 transition-all rounded-full bg-white p-1" 
              />
              <button
                onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors group whitespace-nowrap"
              >
                <Languages size={16} className="text-blue-800 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold text-blue-900 uppercase">
                  {lang === 'en' ? 'हिन्दी' : 'English'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button & Language */}
          <div className="lg:hidden flex items-center space-x-3">
            <button 
              onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')} 
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <Languages size={14} className="text-blue-800" />
              <span className="text-[9px] font-bold uppercase">
                {lang === 'en' ? 'HI' : 'EN'}
              </span>
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-blue-800 p-1 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <button
                      className={`w-full text-left px-4 py-3 text-base font-semibold rounded-lg flex items-center justify-between transition-colors ${
                        item.dropdown.some(sub => sub.id === currentPage) 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleDropdown(item.id)}
                    >
                      {item.name}
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.id ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.id && (
                      <div className="pl-4 space-y-1 mt-1">
                        {item.dropdown.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id)}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                              currentPage === sub.id 
                                ? 'bg-orange-100 text-orange-600' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                      currentPage === item.id 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
            
            {/* Affiliation Info in Mobile Menu */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <img 
                    src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg" 
                    alt="Jharkhand State Kabaddi Association" 
                    className="h-10 w-10 object-contain rounded-full" 
                  />
                  <img 
                    src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" 
                    alt="AKFI Logo" 
                    className="h-10 w-10 object-contain" 
                  />
                  <div className="h-8 w-px bg-slate-300"></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider leading-tight">
                      {lang === 'hi' ? 'संबद्धता एवं मान्यता' : 'Affiliated & Recognised'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[9px] text-slate-600 font-semibold">
                    {lang === 'hi' ? 'झारखंड राज्य कबड्डी संघ' : 'Jharkhand State Kabaddi Association'}
                  </p>
                  <p className="text-[8px] text-orange-600 font-bold uppercase">
                    {lang === 'hi' ? 'AKFI द्वारा मान्यता प्राप्त' : 'Recognised by AKFI'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;