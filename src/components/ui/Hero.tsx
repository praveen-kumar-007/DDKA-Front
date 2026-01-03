import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
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
    <div className="relative min-h-[95vh] flex flex-col overflow-hidden bg-slate-950">
      {/* Background with Advanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 opacity-50"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767020556/WhatsApp_Image_2025-12-28_at_9.36.59_PM_sijegu.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
      </div>

      {/* Decorative "Mat" Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}></div>

      <div className="relative flex-grow max-w-7xl mx-auto px-4 w-full flex flex-col justify-center pt-24 pb-16 lg:pt-32 lg:pb-48">
        <div className="max-w-5xl">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full mb-6 lg:mb-10 group hover:bg-white/10 transition-all duration-500">
            <div className="bg-orange-600 p-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(234,88,12,0.5)]">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">{t.badge}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-white/70 mb-4 lg:mb-6 tracking-tight uppercase flex items-center gap-4">
             <span className="h-px w-12 bg-orange-600"></span>
             {t.slogan}
          </h2>

          <h1 className="text-5xl sm:text-8xl md:text-[10rem] font-black mb-6 lg:mb-10 leading-[0.85] uppercase tracking-tighter text-white">
            {t.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-white drop-shadow-2xl">
              {t.subtitle}
            </span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-300 mb-8 lg:mb-14 leading-relaxed font-medium max-w-2xl border-l-4 border-orange-600 pl-8">
            {t.description}
          </p>

          {/* Advanced Affiliation Glass Card */}
          <div className="mb-8 lg:mb-16 relative group max-w-4xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-5 lg:p-8 rounded-3xl shadow-2xl overflow-hidden">
              {/* Inner Glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 relative z-10">
                {[
                  { text: aff.line1, label: lang === 'hi' ? 'संबद्धता' : 'Affiliation', color: 'bg-orange-500' },
                  { text: aff.line2, label: lang === 'hi' ? 'पंजीकरण' : 'Registration', color: 'bg-orange-500' },
                  { text: aff.line3, label: lang === 'hi' ? 'मान्यता' : 'Recognition', color: 'bg-orange-500' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col space-y-3 group/item">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-400/80">{item.label}</span>
                    </div>
                    <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-white leading-snug group-hover/item:text-orange-400 transition-colors">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onRegisterClick}
              className="relative overflow-hidden bg-orange-600 hover:bg-orange-500 text-white px-14 py-7 rounded-2xl font-black text-2xl uppercase tracking-tighter transition-all group shadow-[0_20px_50px_rgba(234,88,12,0.3)] active:scale-95 transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t.ctaPrimary}
                <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button 
              onClick={onScheduleClick}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white hover:text-slate-950 text-white px-14 py-7 rounded-2xl font-black text-2xl uppercase tracking-tighter transition-all active:scale-95 transform hover:-translate-y-1"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overlay - Desktop */}
      <div className="hidden lg:block bg-slate-950/50 backdrop-blur-3xl border-t border-white/5 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-between">
          <div className="flex items-center space-x-12 border-r border-white/10 pr-20">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png" alt="DDKA" className="h-24 w-24 rounded-full bg-white p-1.5 relative" />
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-white rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <img src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png" alt="AKFI" className="h-24 w-24 rounded-full bg-white p-1.5 relative" />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-16 text-white text-center pl-20">
            {[
              { val: '50+', label: t.stats.clubs },
              { val: '1200+', label: t.stats.players },
              { val: '12', label: t.stats.titles },
              { val: '24/7', label: t.stats.support }
            ].map((stat, i) => (
              <div key={i} className="group cursor-default">
                <p className="text-6xl font-black tracking-tighter text-white group-hover:text-orange-500 transition-colors duration-300">{stat.val}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;