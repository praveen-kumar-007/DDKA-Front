import React, { useState } from 'react';
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
  const t = translations[lang];

  const navItems = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.gallery, id: 'gallery' },
    { name: t.nav.news, id: 'news' },
    { name: t.nav.register, id: 'register', dropdown: [
      { name: t.forms.playerTitle, id: 'register' },
      { name: t.forms.instTitle, id: 'institution' },
    ] },
  ];

  // State for mobile dropdown
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => onPageChange('home')}>
            <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" alt="DDKA Logo" className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full bg-white p-1" />
            <div className="flex flex-col border-l border-gray-200 pl-2 sm:pl-3">
              <span className="text-xl sm:text-2xl font-oswald font-bold text-blue-900 leading-tight">DDKA</span>
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

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-4 xl:space-x-6 mr-4 border-r border-gray-100 pr-4">
              {navItems.map((item) => (
                item.dropdown ? (
                  <div key={item.id} className="relative group hidden lg:block">
                    <button
                      className={`text-xs xl:text-sm font-semibold transition-colors duration-200 uppercase tracking-wider flex items-center gap-1 ${
                        (currentPage === 'register' || currentPage === 'institution') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-blue-800'
                      }`}
                      tabIndex={0}
                    >
                      {item.name}
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-30">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => onPageChange(sub.id)}
                          className={`block w-full text-left px-4 py-2 text-xs xl:text-sm font-semibold rounded-lg ${
                            currentPage === sub.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`text-xs xl:text-sm font-semibold transition-colors duration-200 uppercase tracking-wider ${
                      currentPage === item.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-blue-800'
                    }`}
                  >
                    {item.name}
                  </button>
                )
              ))}
              {/* Mobile Registration Dropdown Button */}
              {navItems.find((item) => item.dropdown) && (
                <div className="relative lg:hidden">
                  <button
                    className={`text-xs font-semibold transition-colors duration-200 uppercase tracking-wider flex items-center gap-1 ${
                      (currentPage === 'register' || currentPage === 'institution') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-blue-800'
                    }`}
                    onClick={() => setMobileDropdownOpen((open) => !open)}
                  >
                    {t.nav.register}
                    <svg className={`w-3 h-3 ml-1 transform transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mobileDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-30">
                      {navItems.find((item) => item.dropdown).dropdown.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => { onPageChange(sub.id); setIsOpen(false); setMobileDropdownOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-xs font-semibold rounded-lg ${
                            currentPage === sub.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" alt="AKFI Logo" className="h-8 w-8 object-contain grayscale hover:grayscale-0 transition-all rounded-full bg-white p-1" />
              <button
                onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors group whitespace-nowrap"
              >
                <Languages size={16} className="text-blue-800 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold text-blue-900 uppercase">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')} className="flex items-center space-x-1 bg-slate-100 px-2.5 py-1.5 rounded-full">
              <Languages size={14} className="text-blue-800" />
              <span className="text-[9px] font-bold uppercase">{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-1">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full animate-in fade-in slide-in-from-top-2 z-40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.filter((item) => !item.dropdown).map((item) => (
              <button
                key={item.id}
                onClick={() => { onPageChange(item.id); setIsOpen(false); setMobileDropdownOpen(false); }}
                className={`block w-full text-left px-4 py-4 text-base font-semibold rounded-lg ${
                  currentPage === item.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
            {/* Mobile Registration Dropdown */}
            <div className="group">
              <button
                className={`block w-full text-left px-4 py-4 text-base font-semibold rounded-lg flex items-center justify-between ${
                  (currentPage === 'register' || currentPage === 'institution') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileDropdownOpen((open) => !open)}
              >
                {t.nav.register}
                <svg className={`w-4 h-4 ml-2 transform transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {mobileDropdownOpen && (
                <div className="pl-4 mt-1">
                  {navItems.find((item) => item.dropdown).dropdown.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => { onPageChange(sub.id); setIsOpen(false); setMobileDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                        currentPage === sub.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;