import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/ui/Hero';
import { Trophy, Users, Award, Zap, ExternalLink, Megaphone, Activity } from 'lucide-react';
import NewsCard from '../components/ui/NewsCard';
import type { HomeNewsItem } from '../components/ui/NewsCard';
import type { Language } from '../translations';
import { translations } from '../translations';

interface HomeProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, onNavigate }) => {
  const [news, setNews] = useState<HomeNewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  // tracks video load error so we can show a graceful image fallback
  const [videoError, setVideoError] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setIsLoadingNews(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const sorted = data.data
            .slice()
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const mapped: HomeNewsItem[] = sorted.slice(0, 3).map((n: any) => ({
            _id: n._id,
            title: n.title,
            category: n.category,
            content: n.content,
            createdAt: n.createdAt,
            imageUrl: Array.isArray(n.images) && n.images.length > 0 ? n.images[0] : undefined,
          }));
          setNews(mapped);
        } else {
          setNews([]);
        }
      })
      .catch(() => {
        setNews([]);
      })
      .finally(() => setIsLoadingNews(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {lang === 'hi'
            ? 'धनबाद जिला कबड्डी संघ (DDKA) | आधिकारिक वेबसाइट'
            : 'Dhanbad District Kabaddi Association (DDKA) | Kabaddi in Dhanbad, Jharkhand'}
        </title>
        <meta
          name="description"
          content={
            lang === 'hi'
              ? 'धनबाद जिला कबड्डी संघ (DDKA) की आधिकारिक वेबसाइट – धनबाद, झारखंड में कबड्डी की खबरें, टूर्नामेंट, पंजीकरण और प्रशिक्षण की पूरी जानकारी।'
              : 'Official website of Dhanbad District Kabaddi Association (DDKA) – news, tournaments, registrations and Kabaddi development programs in Dhanbad, Jharkhand.'
          }
        />
        <meta
          name="keywords"
          content="Dhanbad District Kabaddi Association, DDKA, Dhanbad Kabaddi Association, Kabaddi Dhanbad, Kabaddi in Dhanbad, Kabaddi Jharkhand, Jharkhand Kabaddi Association, Kabaddi Association of Jharkhand Dhanbad, jaan kabaddi, jan kabaddi, jaan kabaddi dhanbad, jaan dhn kabaddi, dhanbad kabaddi district, kabaddi dhanbad jharkhand"
        />
      </Helmet>
      <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <Hero 
        onRegisterClick={() => onNavigate('register')} 
        onScheduleClick={() => onNavigate('news')} 
        lang={lang} 
      />
      
      {/* ----------------------------------------------------------------------- */}
      {/* MINI TOURNAMENT POSTER (Home-only) */}
      {/* ----------------------------------------------------------------------- */}
      <section className="relative py-10 lg:py-16 bg-gradient-to-br from-red-900 to-blue-950 text-white overflow-hidden border-y-8 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left: Looping video (with fallback) */}
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black">
                {!videoError ? (
                  <video
                    src="/videos/dhanbad-mini-kabaddi-2026.mp4"
                    poster="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766845990/Gemini_Generated_Image_eyfw6eyfw6eyfw6e_pldumt.png"
                    className="w-full h-72 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    aria-label="Dhanbad Mini Kabaddi Tournament 2026 video"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766845990/Gemini_Generated_Image_eyfw6eyfw6eyfw6e_pldumt.png"
                    alt="Dhanbad Mini Kabaddi Tournament poster"
                    className="w-full h-72 object-cover"
                  />
                )}
              </div>
              {videoError && (
                <p className="mt-2 text-sm text-orange-200">Video not found — please add <code>/public/videos/dhanbad-mini-kabaddi-2026.mp4</code> or refresh the page.</p>
              )}
            </div>

            {/* Right: Poster copy + download CTA */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-2 lg:mb-3">
                <Megaphone size={16} />
                {lang === 'hi' ? 'घोषणा' : 'Announcement'}
              </div>

              <h2 className="text-3xl md:text-4xl font-oswald font-bold mb-2 leading-tight uppercase">DHANBAD DISTRICT MINI KABADDI TOURNAMENT — 2026</h2>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-slate-100">
                <p className="font-bold">When &amp; Where</p>
                <p className="mb-2">Sunday, 8 Mar 2026 — Birsa Munda Stadium</p>

                <p className="font-bold">Who can play</p>
                <p className="mb-2">Students in Class 3–5; under 11 years; max weight 36.97 kg</p>

                <p className="font-bold">How to register</p>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li>Submit team list on official school letterhead (Name, Father’s Name, DOB) + 1 passport photo per player.</li>
                  <li>Deadline: <strong>27 Feb 2026</strong>.</li>
                </ul>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/important-docs/entryform.pdf"
                    download
                    className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg text-center"
                  >
                    Download Entry Form (PDF)
                  </a>

                  <a
                    href="/important-docs/participation-letter.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white/6 hover:bg-white/10 hover:text-slate-900 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 ml-2"
                  >
                    Participation Letter (PDF)
                  </a>
                </div>

                <p className="mt-3 text-xs text-slate-300">Complete registration before the deadline — incomplete/late entries will not be accepted.</p>
              </div>


            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-oswald font-bold text-blue-900 mb-4 uppercase tracking-wider">{t.features.title}</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {t.features.items.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-2xl transition-all border border-slate-100 group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {idx === 0 && <Trophy className="w-10 h-10 text-orange-500" />}
                  {idx === 1 && <Users className="w-10 h-10 text-orange-500" />}
                  {idx === 2 && <Zap className="w-10 h-10 text-orange-500" />}
                  {idx === 3 && <Award className="w-10 h-10 text-orange-500" />}
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-900">{feature.title}</h3>
                <p className="text-slate-700 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* NEW: ASSOCIATION MEETING UPDATE SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <section className="py-10 lg:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5 lg:mb-8">
            <Activity className="text-orange-600" />
            <h3 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">
              {lang === 'hi' ? 'संघ की गतिविधियां' : 'Association Updates'}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-5 lg:gap-8 items-center">
            {/* IMAGE AREA - PASTE YOUR LINK BELOW */}
            <div className="w-full md:w-1/2">
               <div className="rounded-xl overflow-hidden shadow-md border-2 border-orange-100">
                  {/* 👇👇👇 PASTE YOUR IMAGE LINK INSIDE THE QUOTES BELOW 👇👇👇 */}
                  <img 
                    src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766941283/WhatsApp_Image_2025-12-28_at_10.06.10_PM_vlhjvh.jpg" 
                    alt="DDKA Committee Meeting" 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
               </div>
            </div>
            
            {/* CONTENT AREA */}
            <div className="w-full md:w-1/2 md:pr-4 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded mb-3 inline-block">
                 {lang === 'hi' ? 'ताज़ा खबर' : 'LATEST UPDATE'}
              </span>
              <h2 className="text-3xl font-oswald font-bold text-blue-900 mb-4">
                {lang === 'hi' 
                  ? 'धनबाद जिला कबड्डी संघ की बैठक' 
                  : 'Meeting of Dhanbad District Kabaddi Association'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {lang === 'hi'
                  ? 'धनबाद जिला कबड्डी संघ की एक महत्वपूर्ण बैठक आयोजित की गई जिसमें जिले में कबड्डी के विकास और आगामी कार्ययोजना पर चर्चा की गई। इस बैठक में संघ के वरिष्ठ पदाधिकारी और सदस्य उपस्थित रहे।'
                  : 'A significant meeting of the Dhanbad District Kabaddi Association (DDKA) was held to discuss the development of Kabaddi and the upcoming roadmap for the district. Senior officials and members of the association were present to strategize future events.'}
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-800 font-semibold bg-blue-50 p-3 rounded-lg border border-blue-100">
                 <Users size={16} />
                 {lang === 'hi' 
                   ? 'कार्यकारिणी समिति और सदस्य उपस्थित'
                   : 'Executive Committee & Members Present'}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ----------------------------------------------------------------------- */}


      {/* Latest News Preview Section */}
      <section className="py-12 lg:py-20 bg-blue-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 lg:mb-12 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-oswald font-bold uppercase mb-2">{t.news.latest}</h2>
              <p className="text-blue-200">{t.news.curated}</p>
            </div>
            <button onClick={() => onNavigate('news')} className="mt-6 md:mt-0 text-orange-400 font-bold hover:text-white flex items-center group bg-white/5 px-6 py-2 rounded-full transition-all">
              {lang === 'hi' ? 'सभी खबरें देखें' : 'View All News'} <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
            {isLoadingNews ? (
              [1,2,3].map(i => <div key={i} className="h-64 bg-blue-800/50 rounded-2xl animate-pulse"></div>)
            ) : (
              news.map((item, idx) => (
                <NewsCard key={idx} article={item} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Institution Banner CTA */}
      <section className="py-12 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 bg-orange-600 rounded-2xl lg:rounded-[3rem] p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
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
    </>
  );
};

export default Home;