import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../../constants';
import { translations } from '../../translations';
import type { Language } from '../../translations';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;

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
            <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            <div className="bg-blue-900/20 border border-blue-800/40 p-4 rounded-xl flex items-center space-x-3">
               <ShieldCheck className="text-orange-500 w-8 h-8 shrink-0" />
               <div className="text-[10px] uppercase font-bold text-blue-200">
                  {lang === 'hi' ? 'AKFI से संबद्ध संस्थान' : 'Affiliated to AKFI'}
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-8 border-l-4 border-orange-500 pl-4">{t.quickLinks}</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Upcoming Events</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Rule Book</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-8 border-l-4 border-orange-500 pl-4">{t.contact}</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 text-gray-400 text-sm">
                <MapPin size={22} className="text-orange-500 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-4 text-gray-400 text-sm">
                <Phone size={22} className="text-orange-500 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-blue-900/10 rounded-2xl border border-white/5 text-center">
            <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" alt="AKFI" className="h-24 w-24 mb-6 opacity-80 rounded-full bg-white p-1" />
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