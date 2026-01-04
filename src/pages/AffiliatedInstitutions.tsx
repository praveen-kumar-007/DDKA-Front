import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Search, LayoutGrid, List, Building2 } from 'lucide-react';
import { translations } from '../translations';
import type { Language } from '../translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Institution {
  _id: string;
  instName: string;
  instType: string;
  instLogoUrl: string;
  status: string;
  area: string;
  year: number;
}

interface AffiliatedInstitutionsProps {
  lang: Language;
}

const AffiliatedInstitutions: React.FC<AffiliatedInstitutionsProps> = ({ lang }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const t = translations[lang];

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/institutions`);
        const result = await res.json();
        if (result.success) {
          // Only show approved institutions
          const approved = result.data.filter((inst: Institution) => inst.status === 'Approved');
          setInstitutions(approved);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter(inst =>
    inst.instName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>
          {t.nav.affiliatedInstitutions} | Dhanbad District Kabaddi Association
        </title>
        <meta
          name="description"
          content="List of schools, colleges, and clubs affiliated with the Dhanbad District Kabaddi Association (DDKA)."
        />
        <meta
          name="keywords"
          content="DDKA affiliated institutions, kabaddi schools dhanbad, kabaddi clubs dhanbad, Jharkhand kabaddi institutions, kabaddi association of jharkhand dhanbad, jaan kabaddi schools"
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pb-16">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-blue-900 py-12 md:py-16 mb-8 md:mb-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-800/50 border border-blue-700 px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <span className="text-blue-100 text-sm font-bold uppercase tracking-wider">
                {t.nav.affiliated}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-oswald font-bold text-white mb-4 uppercase tracking-tight">
              {t.nav.affiliatedInstitutions}
            </h1>
            <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-bold text-lg mb-6 shadow-lg transform -rotate-1">
              {lang === 'hi' ? 'स्कूल / क्लब रजिस्टर्ड' : 'Registered Schools & Clubs'}
            </div>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              {lang === 'hi' 
                ? 'DDKA से जुड़े हमारे गौरवशाली स्कूलों, कॉलेजों और क्लबों का नेटवर्क।' 
                : 'Our network of prestigious schools, colleges, and clubs affiliated with DDKA.'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & View Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder={lang === 'hi' ? 'संस्थान खोजें...' : 'Search institutions...'}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {lang === 'hi' ? 'ग्रिड' : 'Grid'}
                </span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {lang === 'hi' ? 'सूची' : 'List'}
                </span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 animate-pulse">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-100 rounded-2xl mx-auto mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredInstitutions.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredInstitutions.map((inst, index) => (
                  <div 
                    key={inst._id} 
                    className="group bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="relative w-16 h-16 md:w-24 md:h-24 mb-4">
                      <div className="absolute inset-0 bg-blue-50 rounded-xl md:rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform" />
                      {inst.instLogoUrl ? (
                        <img 
                          src={inst.instLogoUrl} 
                          alt={inst.instName}
                          className="relative w-full h-full object-contain rounded-xl md:rounded-2xl bg-white p-2 border border-slate-50 shadow-sm"
                        />
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                          <Building2 className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xs md:text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                      <span className="text-blue-500 mr-1">{index + 1}.</span>
                      {inst.instName}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredInstitutions.map((inst, index) => (
                  <div 
                    key={inst._id} 
                    className="group bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center gap-4 md:gap-6"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 shrink-0">
                      {inst.instLogoUrl ? (
                        <img 
                          src={inst.instLogoUrl} 
                          alt={inst.instName}
                          className="w-full h-full object-contain rounded-lg md:rounded-xl bg-slate-50 p-1 border border-slate-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg md:rounded-xl border border-slate-100">
                          <Building2 className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-sm md:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {inst.instName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {lang === 'hi' ? 'कोई संस्थान नहीं मिला' : 'No institutions found'}
              </h3>
              <p className="text-slate-600">
                {lang === 'hi' 
                  ? 'कृपया अपनी खोज बदलें या बाद में पुनः प्रयास करें।' 
                  : 'Try adjusting your search or check back later.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AffiliatedInstitutions;
