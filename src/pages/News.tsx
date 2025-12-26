import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { MOCK_NEWS } from '../constants';
// Use 'import type' for TypeScript interfaces/types
import type { NewsArticle } from '../types';
import type { Language } from '../translations';

// Use standard import for the actual data (translations)
import { translations } from '../translations';

interface NewsProps {
  lang: Language;
}

// Internal reusable icon for the "Read More" button
const ArrowRight: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export const News: React.FC<NewsProps> = ({ lang }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const t = translations[lang];

  const fetchNews = () => {
    setIsLoadingNews(true);
    setTimeout(() => {
      setNews(MOCK_NEWS as NewsArticle[]);
      setIsLoadingNews(false);
    }, 800);
  };

  useEffect(() => {
    fetchNews();
  }, [lang]);

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-oswald font-bold text-blue-900 uppercase">{t.news.title}</h1>
            <p className="text-slate-500 mt-2">{t.news.subtitle}</p>
          </div>
          <button 
            onClick={fetchNews} 
            className="bg-blue-100 text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-blue-200 transition-all flex items-center shadow-sm"
          >
            <Newspaper className="mr-2" size={20} /> {t.news.refresh}
          </button>
        </div>

        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((item, idx) => (
              <article key={idx} className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col group">
                <div className="h-2 bg-orange-600 w-full group-hover:h-3 transition-all duration-300"></div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{item.category}</span>
                    <span className="text-slate-400 text-xs font-mono">{item.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 leading-tight group-hover:text-orange-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-1 font-light">{item.content}</p>
                  <button className="text-blue-900 font-bold text-sm flex items-center hover:translate-x-1 transition-transform group/btn">
                    {t.news.readMore} <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;