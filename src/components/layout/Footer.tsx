import React, { useState } from 'react';
import { Phone, MapPin, ShieldCheck, Mail, Youtube, Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../constants';
import { translations } from '../../translations';
import type { Language } from '../../translations';
import FooterContactForm from './FooterContactForm';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];
  const footer = t.footer;
  const [akfiTapCount, setAkfiTapCount] = useState(0);
  const navigate = useNavigate();

  const handleAkfiTap = () => {
    const next = akfiTapCount + 1;
    setAkfiTapCount(next);
    if (next >= 7) {
      window.open('https://www.indiankabaddi.org', '_blank');
      setAkfiTapCount(0);
    }
  };

  const go = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-slate-950 text-white pt-12 pb-6 mt-16 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] gap-10 md:gap-12 mb-10">
          {/* Logo & Affiliation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png"
                alt="DDKA Logo"
                className="h-14 w-14 rounded-full bg-white p-1"
              />
              <div>
                <div className="font-oswald text-xl font-bold tracking-widest">DDKA</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-orange-400 font-semibold">
                  {lang === 'hi' ? 'धनबाद जिला कबड्डी संघ' : 'Dhanbad District Kabaddi Association'}
                </div>
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

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-8 border-l-4 border-orange-500 pl-4">{footer.quickLinks}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400 text-sm font-medium">
              <div>
                <p className="text-sm uppercase tracking-wider text-white font-semibold mb-3">
                  {lang === 'hi' ? 'एक्सप्लोर' : 'Explore DDKA'}
                </p>
                <ul className="space-y-2">
                  <li><button onClick={() => go('/')} className="hover:text-orange-500 transition-colors">{t.nav.home}</button></li>
                  <li><button onClick={() => go('/about')} className="hover:text-orange-500 transition-colors">{t.nav.about}</button></li>
                  <li><button onClick={() => go('/affiliated-institutions')} className="hover:text-orange-500 transition-colors">{t.nav.affiliatedInstitutions}</button></li>
                  <li><button onClick={() => go('/gallery')} className="hover:text-orange-500 transition-colors">{t.nav.gallery}</button></li>
                  <li><button onClick={() => go('/news')} className="hover:text-orange-500 transition-colors">{t.nav.news}</button></li>
                  <li><button onClick={() => go('/kabaddi-rules')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'DDKA कबड्डी नियम' : 'DDKA Kabaddi Rules'}</button></li>
                  <li><button onClick={() => go('/hall-of-fame')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'गौरव मंदिर' : 'Hall of Fame'}</button></li>
                </ul>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-white font-semibold mb-3">
                  {lang === 'hi' ? 'पंजीकरण एवं विधिक' : 'Registration & Legal'}
                </p>
                <ul className="space-y-2">
                  <li><button onClick={() => go('/register')} className="hover:text-orange-500 transition-colors">{t.forms.playerTitle}</button></li>
                  <li><button onClick={() => go('/institution')} className="hover:text-orange-500 transition-colors">{t.forms.instTitle}</button></li>
                  <li><button onClick={() => go('/technical-official-registration')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'टेक्निकल ऑफिशियल रजिस्ट्रेशन' : 'Technical Official Registration'}</button></li>
                  <li><button onClick={() => go('/terms-conditions')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'नियम एवं शर्तें' : 'Terms & Conditions'}</button></li>
                  <li><button onClick={() => go('/privacy-policy')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy'}</button></li>
                  <li><button onClick={() => go('/contact')} className="hover:text-orange-500 transition-colors">{footer.contact}</button></li>
                  <li className="pt-2 text-[11px] text-slate-300">
                    <span className="font-semibold text-white">Player Registration Fee:</span>{' '}
                    <span className="font-semibold text-orange-400">₹250</span>
                  </li>
                  <li className="text-[11px] text-slate-300">
                    <span className="font-semibold text-white">Institution Registration Fee:</span>{' '}
                    <span className="font-semibold text-orange-400">₹1600</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
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

          {/* Affiliation logos & Donate CTA */}
          <div className="flex flex-col items-center justify-center p-8 bg-blue-900/10 rounded-2xl border border-white/5 text-center">
            <div className="flex gap-4 mb-6">
              <img
                src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg"
                alt="Jharkhand State Kabaddi Association"
                className="h-24 w-24 opacity-80 rounded-full bg-white p-1"
              />
              <img
                src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png"
                alt="AKFI"
                className="h-24 w-24 opacity-80 rounded-full bg-white p-1 cursor-pointer select-none"
                onClick={handleAkfiTap}
              />
            </div>
            <div className="font-oswald text-xl text-orange-500 font-bold uppercase">
              {translations[lang].hero.slogan}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => go('/donate')}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full font-bold shadow-lg hover:scale-105 transform transition-transform"
              >
                <Heart className="w-5 h-5" />
                <span>{t.donate.title}</span>
              </button>
              <div className="mt-2 text-sm text-white/80">
                <div className="font-semibold text-[13px]">{t.donate.subtitle}</div>
                <div className="mt-1 text-xs text-white/90">
                  UPI: <span className="font-mono">{t.donate.upiId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-[11px] uppercase tracking-[0.25em] mb-2 font-semibold">
                {lang === 'hi' ? 'सोशल मीडिया पर जुड़ें' : 'Connect on Social Media'}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="DDKA YouTube Channel"
                  className="relative group p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-red-500/70 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-transparent to-orange-500/25 opacity-60 group-hover:opacity-100 blur-md transition-opacity" />
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 group-hover:bg-black/90 transition-colors">
                    <Youtube className="w-3 h-3 text-red-400 group-hover:text-red-300 transition-colors" />
                  </span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="DDKA Instagram"
                  className="relative group p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-pink-500/70 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-pink-500/35 via-fuchsia-500/25 to-yellow-400/25 opacity-60 group-hover:opacity-100 blur-md transition-opacity" />
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 group-hover:bg-black/90 transition-colors">
                    <Instagram className="w-3 h-3 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  </span>
                </a>
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="DDKA X (Twitter)"
                  className="relative group p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-400/70 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 via-slate-500/25 to-white/15 opacity-60 group-hover:opacity-100 blur-md transition-opacity" />
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 group-hover:bg-black/90 transition-colors">
                    <Twitter className="w-3 h-3 text-sky-400 group-hover:text-sky-300 transition-colors" />
                  </span>
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="DDKA Facebook Page"
                  className="relative group p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-600/70 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-blue-600/35 via-sky-500/30 to-white/15 opacity-60 group-hover:opacity-100 blur-md transition-opacity" />
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 group-hover:bg-black/90 transition-colors">
                    <Facebook className="w-3 h-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </span>
                </a>
              </div>
            </div>
            <p className="text-gray-500 text-xs text-center md:text-right">
              © {new Date().getFullYear()} DDKA. {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'ALL RIGHTS RESERVED.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;