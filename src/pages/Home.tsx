import React, { useState, useEffect } from 'react';
import Hero from '../components/ui/Hero';
import { Trophy, Users, Award, Zap, ExternalLink } from 'lucide-react';
import { MOCK_NEWS } from '../constants';
// Use 'import type' for TypeScript interfaces/types
import type { NewsArticle } from '../types';
import type { Language } from '../translations';

// Use standard import for the actual data (translations)
import { translations } from '../translations';

interface HomeProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, onNavigate }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setIsLoadingNews(true);
    // Simulating API call
    setTimeout(() => {
      setNews(MOCK_NEWS.slice(0, 3) as NewsArticle[]);
      setIsLoadingNews(false);
    }, 800);
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <Hero onRegisterClick={() => onNavigate('register')} lang={lang} />
      
      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-oswald font-bold text-blue-900 mb-4 uppercase tracking-wider">{t.features.title}</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {t.features.items.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-2xl transition-all border border-slate-100 group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {idx === 0 && <Trophy className="w-10 h-10 text-orange-500" />}
                  {idx === 1 && <Users className="w-10 h-10 text-orange-500" />}
                  {idx === 2 && <Zap className="w-10 h-10 text-orange-500" />}
                  {idx === 3 && <Award className="w-10 h-10 text-orange-500" />}
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview Section */}
      <section className="py-20 bg-blue-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-oswald font-bold uppercase mb-2">{t.news.latest}</h2>
              <p className="text-blue-200">{t.news.curated}</p>
            </div>
            <button onClick={() => onNavigate('news')} className="mt-6 md:mt-0 text-orange-400 font-bold hover:text-white flex items-center group bg-white/5 px-6 py-2 rounded-full transition-all">
              {lang === 'hi' ? 'सभी खबरें देखें' : 'View All News'} <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingNews ? (
              [1,2,3].map(i => <div key={i} className="h-64 bg-blue-800/50 rounded-2xl animate-pulse"></div>)
            ) : (
              news.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
                  <span className="text-[10px] font-bold bg-orange-600 px-3 py-1 rounded mb-6 inline-block uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-blue-100 line-clamp-3 mb-6 font-light">{item.content}</p>
                  <span className="text-xs text-blue-300 font-mono">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Institution Banner CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 bg-orange-600 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-5xl font-oswald font-bold mb-8 uppercase leading-tight">
              {lang === 'hi' ? 'अपने स्कूल या क्लब का प्रतिनिधित्व करें' : 'REPRESENT YOUR SCHOOL OR CLUB'}
            </h2>
            <p className="text-xl text-orange-50 font-light mb-12 max-w-3xl mx-auto">
              {lang === 'hi' 
                ? 'क्या आप एक स्कूल समन्वयक या क्लब सचिव हैं? आधिकारिक जिला लीग और परीक्षणों में भाग लेने के लिए DDKA के साथ अपना संस्थान पंजीकृत करें।'
                : 'Are you a school coordinator or club secretary? Register your institution with DDKA to participate in official district leagues and championships.'}
            </p>
            <button 
              onClick={() => onNavigate('institution')}
              className="bg-white text-orange-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-blue-900 hover:text-white transition-all transform hover:scale-105 shadow-xl"
            >
              {t.nav.institution} Affiliation
            </button>
          </div>
          <Zap className="absolute top-10 right-10 w-48 h-48 text-white/5 -rotate-12" />
          <Trophy className="absolute bottom-[-20px] left-[-20px] w-64 h-64 text-white/5 rotate-12" />
        </div>
      </section>
    </div>
  );
};

export default Home;