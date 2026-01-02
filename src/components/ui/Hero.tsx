import React from 'react';
import { Trophy, ShieldCheck, ChevronRight } from 'lucide-react';
// 1. Import the runtime data (translations)
import { translations } from '../../translations'; 

// 2. Import the TypeScript label (Language)
import type { Language } from '../../translations';

interface HeroProps {
  onRegisterClick: () => void;
  onScheduleClick: () => void;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick, onScheduleClick, lang }) => {
  const t = translations[lang].hero;
  const aff = translations[lang].affiliation;
  
  return (
    <div className="relative min-h-[95vh] flex flex-col overflow-hidden bg-blue-950">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105 opacity-40"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767020556/WhatsApp_Image_2025-12-28_at_9.36.59_PM_sijegu.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/60 to-transparent"></div>
      </div>

      <div className="relative flex-grow max-w-7xl mx-auto px-4 w-full flex flex-col justify-center pt-24 pb-32 lg:pb-56">
        <div className="max-w-4xl text-white">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-lg shadow-orange-600/20">
              <Trophy size={14} />
              <span>{t.badge}</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-blue-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
              <ShieldCheck size={14} className="text-orange-400" />
              <span>{aff.line1}</span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl md:text-3xl font-oswald font-medium text-orange-500 mb-6 tracking-wide uppercase drop-shadow-lg">
             {t.slogan}
          </h2>

          <h1 className="text-4xl sm:text-7xl md:text-9xl font-oswald font-bold mb-8 leading-tight uppercase tracking-tight">
            {t.title} <br />
            <span className="text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">{t.subtitle}</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-blue-50 mb-12 leading-relaxed font-light max-w-3xl border-l-4 border-orange-600 pl-8 italic">
            {t.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <button 
              onClick={onRegisterClick}
              className="bg-orange-600 hover:bg-white hover:text-blue-900 text-white px-12 py-6 rounded-lg font-bold text-xl flex items-center justify-center transition-all group shadow-2xl shadow-orange-600/30 active:scale-95 transform hover:-translate-y-1"
            >
              {t.ctaPrimary}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onScheduleClick}
              className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-blue-900 text-white px-12 py-6 rounded-lg font-bold text-xl transition-all active:scale-95 transform hover:-translate-y-1"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overlay - Desktop */}
      <div className="hidden lg:block bg-blue-950/90 backdrop-blur-2xl border-t border-white/10 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
          <div className="flex items-center space-x-10 border-r border-white/10 pr-16">
            <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" alt="DDKA" className="h-20 w-20 rounded-full bg-white p-1" />
            <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" alt="AKFI" className="h-20 w-20 rounded-full bg-white p-1" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-12 text-white text-center pl-16">
            <div>
              <p className="text-5xl font-bold font-oswald text-orange-500">50+</p>
              <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold">{t.stats.clubs}</p>
            </div>
            <div>
              <p className="text-5xl font-bold font-oswald text-orange-500">1200+</p>
              <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold">{t.stats.players}</p>
            </div>
            <div>
              <p className="text-5xl font-bold font-oswald text-orange-500">12</p>
              <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold">{t.stats.titles}</p>
            </div>
            <div>
              <p className="text-5xl font-bold font-oswald text-orange-500">24/7</p>
              <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold">{t.stats.support}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;