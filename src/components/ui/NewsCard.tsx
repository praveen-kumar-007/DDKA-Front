import React from 'react';
import { Link } from 'react-router-dom';

export interface HomeNewsItem {
  _id: string;
  title: string;
  category?: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
}

interface NewsCardProps {
  article: HomeNewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <Link
      to={`/news/${article._id}`}
      className="block bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group h-full overflow-hidden"
    >
      {article.imageUrl && (
        <div className="w-full h-40 bg-blue-950/40 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
      <span className="text-[10px] font-bold bg-orange-600/90 px-3 py-1 rounded mb-3 inline-block uppercase tracking-widest">
        {article.category || 'News'}
      </span>
      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-blue-100 line-clamp-3 mb-3 font-light">
        {article.content}
      </p>
      <span className="text-[11px] text-blue-200 font-mono">
        {new Date(article.createdAt).toLocaleDateString()}
      </span>
      </div>
    </Link>
  );
};

export default NewsCard;
