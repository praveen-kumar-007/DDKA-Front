import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Share2, Copy, Facebook, Linkedin, Twitter } from 'lucide-react';

// News Article Detail Page
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NewsArticle = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/news/${id}`);
      const result = await res.json();
      if (result.success) setNews(result.data);
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  if (!news) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">News not found.</div>;

  const isBrowser = typeof window !== 'undefined';
  const articleUrl = isBrowser && id ? `${window.location.origin}/news/${id}` : '';
  const sharePreviewUrl = id ? `${API_URL}/api/news/share/${id}` : '';

  const handleCopyLink = () => {
    if (!sharePreviewUrl) return;
    navigator.clipboard.writeText(sharePreviewUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <>
      <Helmet>
        <title>{news.title} | DDKA Kabaddi News Dhanbad</title>
        <meta
          name="description"
          content={
            news.content && news.content.length > 150
              ? `${news.content.slice(0, 150)}...`
              : news.content
          }
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${news.title} | DDKA Kabaddi News Dhanbad`} />
        <meta
          property="og:description"
          content={
            news.content && news.content.length > 150
              ? `${news.content.slice(0, 150)}...`
              : news.content
          }
        />
        {articleUrl && <meta property="og:url" content={articleUrl} />}
        {news.images && news.images.length > 0 && (
          <meta property="og:image" content={news.images[0]} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${news.title} | DDKA Kabaddi News Dhanbad`} />
        <meta
          name="twitter:description"
          content={
            news.content && news.content.length > 150
              ? `${news.content.slice(0, 150)}...`
              : news.content
          }
        />
        {news.images && news.images.length > 0 && (
          <meta name="twitter:image" content={news.images[0]} />
        )}
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-2">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Accent Bar */}
        <div className={`h-2 w-full ${news.isHighlight ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />
        <div className="p-8 pb-0">
          <Link to="/news" className="flex items-center gap-2 text-blue-700 font-bold mb-6 hover:underline"><ArrowLeft size={18}/> Back to News</Link>
        </div>
        {/* Main Image - full view with click-to-zoom */}
        {news.images && news.images.length > 0 && (
          <div className="w-full flex justify-center mb-4 overflow-hidden" style={{borderRadius: '0 0 1.5rem 1.5rem'}}>
            <img
              src={news.images[0]}
              alt="news-img"
              className={`w-full max-h-[80vh] object-contain transition-transform duration-300 ${
                isImageZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setIsImageZoomed((prev) => !prev)}
            />
          </div>
        )}
        <div className="p-8 pt-4">
          {/* Meta Data Row */}
          <div className="flex gap-3 mb-2 items-center flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{new Date(news.createdAt).toLocaleDateString()}</span>
            {news.category && <span className="flex items-center gap-1 text-xs text-blue-700 font-bold uppercase"><Tag size={12}/>{news.category}</span>}
            {news.isHighlight && <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-bold ml-2">Highlight</span>}
          </div>
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Share2 size={16} className="text-blue-700" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Share this news
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${news.title} - ${sharePreviewUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 hover:bg-green-500/20 font-medium transition-colors"
              >
                <Share2 size={14} />
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePreviewUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 font-medium transition-colors"
              >
                <Facebook size={14} />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePreviewUrl)}&text=${encodeURIComponent(news.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 font-medium transition-colors"
              >
                <Twitter size={14} />
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(sharePreviewUrl)}&title=${encodeURIComponent(news.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-700/10 text-slate-700 hover:bg-slate-700/20 font-medium transition-colors"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
              >
                <Copy size={14} />
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-4 text-blue-900 leading-tight">{news.title}</h1>
          <div className="text-slate-700 text-lg whitespace-pre-line mb-4">{news.content}</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewsArticle;
