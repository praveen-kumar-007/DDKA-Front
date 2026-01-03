import React from 'react';
// Only import icons that are actually used in the code below
import { Phone, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../../constants';
import { translations } from '../../translations';
import type { Language } from '../../translations';
import FooterContactForm from './FooterContactForm';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];
  const footer = t.footer;

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" alt="Logo" className="h-16 w-16 rounded-full bg-white p-1" />
              <div>
                <span className="text-3xl font-oswald font-bold tracking-tight block">DDKA</span>
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest leading-none">Dhanbad District</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{footer.desc}</p>
            <div className="bg-blue-900/20 border border-blue-800/40 p-4 rounded-xl space-y-3">
               <div className="flex items-start space-x-3">
                  <ShieldCheck className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-[10px] uppercase font-bold text-blue-200 leading-tight">
                     {t.affiliation.line1}
                  </div>
               </div>
               <div className="flex items-start space-x-3">
                  <ShieldCheck className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-[10px] uppercase font-bold text-blue-200 leading-tight">
                     {t.affiliation.line2}
                  </div>
               </div>
               <div className="flex items-start space-x-3">
                  <ShieldCheck className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-[10px] uppercase font-bold text-blue-200 leading-tight">
                     {t.affiliation.line3}
                  </div>
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-8 border-l-4 border-orange-500 pl-4">{footer.quickLinks}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400 text-sm font-medium">
              <div>
                <p className="text-sm uppercase tracking-wider text-white font-semibold mb-3">
                  {lang === 'hi' ? 'एक्सप्लोर' : 'Explore DDKA'}
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="hover:text-orange-500 transition-colors">
                      {t.nav.home}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-orange-500 transition-colors">
                      {t.nav.about}
                    </Link>
                  </li>
                  <li>
                    <Link to="/affiliated-institutions" className="hover:text-orange-500 transition-colors">
                      {t.nav.affiliatedInstitutions}
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery" className="hover:text-orange-500 transition-colors">
                      {t.nav.gallery}
                    </Link>
                  </li>
                  <li>
                    <Link to="/news" className="hover:text-orange-500 transition-colors">
                      {t.nav.news}
                    </Link>
                  </li>
                  <li>
                    <Link to="/kabaddi-rules" className="hover:text-orange-500 transition-colors">
                      {lang === 'hi' ? 'DDKA कबड्डी नियम' : 'DDKA Kabaddi Rules'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/hall-of-fame" className="hover:text-orange-500 transition-colors">
                      {lang === 'hi' ? 'गौरव मंदिर' : 'Hall of Fame'}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-white font-semibold mb-3">
                  {lang === 'hi' ? 'पंजीकरण एवं विधिक' : 'Registration & Legal'}
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link to="/register" className="hover:text-orange-500 transition-colors">
                      {t.forms.playerTitle}
                    </Link>
                  </li>
                  <li>
                    <Link to="/institution" className="hover:text-orange-500 transition-colors">
                      {t.forms.instTitle}
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions" className="hover:text-orange-500 transition-colors">
                      {lang === 'hi' ? 'नियम एवं शर्तें' : 'Terms & Conditions'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">
                      {lang === 'hi' ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-orange-500 transition-colors">
                      {footer.contact}
                    </Link>
                  </li>
                  <li className="pt-2 text-[11px] text-slate-300">
                    <span className="font-semibold text-white">Player Registration Fee:</span>{' '}
                    <span className="font-semibold text-orange-400">₹400</span>
                  </li>
                  <li className="text-[11px] text-slate-300">
                    <span className="font-semibold text-white">Institution Registration Fee:</span>{' '}
                    <span className="font-semibold text-orange-400">₹2000</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-8 border-l-4 border-orange-500 pl-4">{footer.contact}</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 text-gray-400 text-sm">
                <MapPin size={22} className="text-orange-500 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-4 text-gray-400 text-sm">
                <Phone size={22} className="text-orange-500 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-4 text-gray-400 text-sm">
                <Mail size={22} className="text-orange-500 shrink-0" />
                <a href="mailto:dhanbaddistrictkabaddi@gmail.com" className="underline hover:text-orange-400">dhanbaddistrictkabaddi@gmail.com</a>
              </li>
            </ul>
            <FooterContactForm />
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-blue-900/10 rounded-2xl border border-white/5 text-center">
            <div className="flex gap-4 mb-6">
              <img src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg" alt="Jharkhand State Kabaddi Association" className="h-24 w-24 opacity-80 rounded-full bg-white p-1" />
              <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" alt="AKFI" className="h-24 w-24 opacity-80 rounded-full bg-white p-1" />
            </div>
            <div className="font-oswald text-xl text-orange-500 font-bold uppercase">
              {translations[lang].hero.slogan}
            </div>
           </div>
        </div>

        <div className="border-t border-white/5 pt-10 text-center">
          <p className="text-gray-500 text-xs">
             © {new Date().getFullYear()} DDKA. {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'ALL RIGHTS RESERVED.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;