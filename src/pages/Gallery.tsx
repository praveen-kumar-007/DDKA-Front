import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import type { Language } from '../translations';
import { translations } from '../translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface GalleryProps {
  lang: Language;
}

export const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const t = translations[lang];
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch gallery images from backend
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setGalleryImages(result.data.map((img: any) => img.url));
        }
      } catch (e) {
        setGalleryImages([]);
      }
    };
    fetchImages();
  }, []);

  const closeModal = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  }, [selectedIndex, galleryImages.length]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
    setIsZoomed(false);
  }, [selectedIndex, galleryImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedIndex, showNext, showPrev]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      if (isZoomed) {
        setIsZoomed(false);
      } else {
        closeModal();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {lang === 'hi'
            ? 'DDKA फोटो गैलरी | धनबाद कबड्डी तस्वीरें'
            : 'DDKA Kabaddi Gallery | Dhanbad District Kabaddi Photos'}
        </title>
        <meta
          name="description"
          content={
            lang === 'hi'
              ? 'धनबाद जिला कबड्डी संघ (DDKA) द्वारा आयोजित कबड्डी मैचों, खिलाड़ियों और जिला प्रतियोगिताओं की फोटो गैलरी।'
              : 'Photo gallery of Kabaddi matches, players and district championships organised by Dhanbad District Kabaddi Association (DDKA) in Dhanbad, Jharkhand.'
          }
        />
        <meta
          name="keywords"
          content="Kabaddi photos Dhanbad, DDKA gallery, Dhanbad kabaddi images, Jharkhand kabaddi gallery, jaan kabaddi photos, jan kabaddi dhanbad"
        />
      </Helmet>
      <div className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-oswald font-bold text-blue-900 mb-4 uppercase tracking-wide">{t.nav.gallery}</h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {lang === 'hi' 
              ? 'धनबाद के कबड्डी सितारों की तीव्रता और जुनून को कैद करना।' 
              : "Capturing the intensity and passion of Dhanbad's kabaddi stars from recent district championships."}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {galleryImages.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-12 text-lg">No images in the gallery yet.</div>
          ) : (
            galleryImages.map((url, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedIndex(index)}
                className="aspect-square group relative overflow-hidden rounded-xl shadow-sm bg-slate-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <img 
                  src={url} 
                  alt={`Kabaddi moment ${index + 1}`} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedIndex !== null && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
          onClick={handleBackdropClick}
        >
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[110] bg-gradient-to-b from-black/60 to-transparent">
             <div className="text-white/90 font-medium text-sm px-4 py-2 bg-black/40 rounded-full backdrop-blur-md">
                {selectedIndex + 1} / {galleryImages.length}
             </div>
              <button 
                onClick={closeModal}
                className="p-2 bg-black/40 rounded-full text-white/90 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>
          <button onClick={showPrev} className="absolute left-2 md:left-6 z-[110] p-3 text-white/70 hover:text-white transition-colors hidden sm:block bg-black/20 hover:bg-black/40 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={showNext} className="absolute right-2 md:right-6 z-[110] p-3 text-white/70 hover:text-white transition-colors hidden sm:block bg-black/20 hover:bg-black/40 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div 
            className={`
              w-full h-full flex items-center justify-center p-0 md:p-8
              ${isZoomed ? 'overflow-auto cursor-grab active:cursor-grabbing' : 'overflow-hidden cursor-zoom-in'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            <img 
              src={galleryImages[selectedIndex]} 
              alt="Full screen view"
              className={`
                transition-all duration-500 ease-in-out select-none
                ${isZoomed 
                  ? 'max-w-none h-auto min-h-screen md:min-h-full object-cover scale-100' 
                  : 'max-w-full max-h-[90vh] md:max-h-full object-contain' 
                }
              `}
            />
          </div>
           {!isZoomed && (
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none md:hidden animate-pulse">
                 <span className="text-white/70 text-xs bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Tap to zoom</span>
            </div>
           )}
        </div>
      )}
    </div>
    </>
  );
};

export default Gallery;