import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

// News Article Detail Page
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NewsArticle = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-2">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Accent Bar */}
        <div className={`h-2 w-full ${news.isHighlight ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />
        <div className="p-8 pb-0">
          <Link to="/news" className="flex items-center gap-2 text-blue-700 font-bold mb-6 hover:underline"><ArrowLeft size={18}/> Back to News</Link>
        </div>
        {/* Main Image */}
        {news.images && news.images.length > 0 && (
          <div className="w-full flex justify-center mb-4">
            <img src={news.images[0]} alt="news-img" className="w-full max-h-80 object-cover" style={{borderRadius: '0 0 1.5rem 1.5rem'}} />
          </div>
        )}
        <div className="p-8 pt-4">
          {/* Meta Data Row */}
          <div className="flex gap-3 mb-2 items-center flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{new Date(news.createdAt).toLocaleDateString()}</span>
            {news.category && <span className="flex items-center gap-1 text-xs text-blue-700 font-bold uppercase"><Tag size={12}/>{news.category}</span>}
            {news.isHighlight && <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-bold ml-2">Highlight</span>}
          </div>
          <h1 className="text-3xl font-extrabold mb-4 text-blue-900 leading-tight">{news.title}</h1>
          <div className="text-slate-700 text-lg whitespace-pre-line mb-4">{news.content}</div>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
