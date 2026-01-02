import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Tag, ChevronRight, X, Share2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalNews] = useState<any>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/news`);
      const result = await res.json();
      if (result.success) setNews(result.data);
    } catch (e) {}
    setIsLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <>
      <Helmet>
        <title>
          DDKA News & Updates | Dhanbad District Kabaddi Association
        </title>
        <meta
          name="description"
          content="Latest Kabaddi news, match updates, tournament announcements and results from Dhanbad District Kabaddi Association (DDKA) in Dhanbad, Jharkhand."
        />
      </Helmet>
      <div className="relative py-24 overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* News page is now view-only. Upload form removed. */}

        {/* News Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white rounded-3xl shadow-sm border border-slate-100 animate-pulse p-6">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-6" />
                <div className="h-8 bg-slate-100 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item._id}
                className="group flex flex-col items-center bg-transparent p-0"
                style={{ minHeight: 420 }}
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full flex flex-col overflow-hidden">
                  {/* Accent Bar */}
                  <div className={`h-2 w-full ${item.isHighlight ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />

                  {/* Image Full Card */}
                  {item.images && item.images.length > 0 && (
                    <img src={item.images[0]} alt="news-img" className="w-full h-56 object-cover" />
                  )}

                  {/* Text Card Section */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta Data */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                        item.isHighlight 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        <Tag size={12} />
                        {item.category || 'News'}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-lg">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-blue-800 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-slate-700 text-base leading-relaxed mb-6 flex-grow border-l-4 border-blue-100 pl-4 line-clamp-3">
                      {item.content.length > 120 ? item.content.slice(0, 120) + '...' : item.content}
                    </p>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
                      <Link
                        to={`/news/${item._id}`}
                        className="text-blue-700 font-bold text-base flex items-center gap-1 group/btn hover:text-orange-600 transition-colors"
                      >
                        View Full
                        <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>

                    {/* Share Card */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 size={14} className="text-blue-700" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                          Share this news
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {/**
                         * Use backend share URL so WhatsApp/Facebook/Twitter
                         * can read server-rendered OG tags with the news image.
                         */}
                        {(() => {
                          const sharePreviewUrl = `${API_URL}/api/news/share/${item._id}`;
                          return (
                            <>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`${item.title} - ${sharePreviewUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 hover:bg-green-500/20 font-medium transition-colors"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePreviewUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 font-medium transition-colors"
                        >
                          Facebook
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePreviewUrl)}&text=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 font-medium transition-colors"
                        >
                          Twitter
                        </a>
                        <a
                          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(sharePreviewUrl)}&title=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-700/10 text-slate-700 hover:bg-slate-700/20 font-medium transition-colors"
                        >
                          LinkedIn
                        </a>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(sharePreviewUrl)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                        >
                          <Copy size={12} />
                          Copy Link
                        </button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal for full news */}
        {showModal && modalNews && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-2">{modalNews.title}</h2>
              <div className="flex gap-2 mb-2">
                {modalNews.images && modalNews.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="news-img" className="w-24 h-20 object-cover rounded-lg border" />
                ))}
              </div>
              <div className="mb-2 text-xs text-slate-500 flex items-center gap-2"><Calendar size={12} /> {new Date(modalNews.createdAt).toLocaleDateString()}</div>
              <div className="mb-2 text-xs text-blue-700 font-bold uppercase">{modalNews.category}</div>
              <div className="text-slate-700 whitespace-pre-line mb-4">{modalNews.content}</div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );

};

export default News;