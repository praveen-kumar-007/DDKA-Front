import React from 'react';
import { GALLERY_MOCK_DATA } from '../constants';
import type { Language } from '../translations';

// Use standard import for the actual data (translations)
import { translations } from '../translations';

interface GalleryProps {
  lang: Language;
}

export const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="py-20 bg-slate-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-oswald font-bold text-blue-900 mb-4 uppercase">{t.nav.gallery}</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            {lang === 'hi' 
              ? 'धनबाद के कबड्डी सितारों की तीव्रता और जुनून को कैद करना।' 
              : "Capturing the intensity and passion of Dhanbad's kabaddi stars from recent district championships."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_MOCK_DATA.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl shadow-lg bg-white">
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-orange-500 font-bold text-sm uppercase mb-2">{item.category}</span>
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;