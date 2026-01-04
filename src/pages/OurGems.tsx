import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Award, Shield, Star, Users } from 'lucide-react';
import type { Language } from '../translations';

interface OurGemsProps {
  lang: Language;
}

interface Player {
  _id: string;
  name: string;
  category: string;
  gender: string;
  achievements: string;
}

interface Referee {
  _id: string;
  name: string;
  qualification: string;
}

const OurGems: React.FC<OurGemsProps> = ({ lang }) => {
  const isHi = lang === 'hi';
  const [players, setPlayers] = useState<Player[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, refereesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/champion-players`),
        fetch(`${import.meta.env.VITE_API_URL}/api/referees`)
      ]);
      
      const playersData = await playersRes.json();
      const refereesData = await refereesRes.json();
      
      setPlayers(playersData);
      setReferees(refereesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nationalPlayers = players.filter(p => p.category === 'National Player');
  const federationCupPlayers = players.filter(p => p.category === 'Federation Cup');
  const jplPlayers = players.filter(p => p.category === 'Jharkhand Premier League');

  // Role and qualification hierarchy for referees
  const roleRank = (qualification: string): number => {
    const qual = qualification.toUpperCase();
    if (qual.includes('CHAIRMAN')) return 0;
    if (qual.includes('SECRETARY')) return 1;
    return 2;
  };

  const qualificationRank = (qualification: string): number => {
    const qual = qualification.toUpperCase();
    if (qual.includes('NIS')) return 1;
    if (qual.includes('MPED')) return 2;
    if (qual.includes('BPED')) return 3;
    if (qual.includes('NATIONAL')) return 4;
    if (qual.includes('STATE')) return 5;
    return 6;
  };

  // Sort players within each category alphabetically, but prioritize by name order for ranking
  const sortedNationalPlayers = [...nationalPlayers].sort((a, b) => a.name.localeCompare(b.name));
  const sortedFederationCupPlayers = [...federationCupPlayers].sort((a, b) => a.name.localeCompare(b.name));
  const sortedJplPlayers = [...jplPlayers].sort((a, b) => a.name.localeCompare(b.name));
  const sortedReferees = [...referees].sort((a, b) => {
    const roleDiff = roleRank(a.qualification) - roleRank(b.qualification);
    if (roleDiff !== 0) return roleDiff;
    const rankDiff = qualificationRank(a.qualification) - qualificationRank(b.qualification);
    return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
  });

  return (
    <>
      <Helmet>
        <title>
          {isHi
            ? 'गौरव मंदिर | DDKA'
            : 'Hall of Fame | DDKA - Champions & Referees'}
        </title>
        <meta
          name="description"
          content={
            isHi
              ? 'DDKA के गौरवशाली खिलाड़ी और रेफरी बोर्ड - राष्ट्रीय खिलाड़ी, फेडरेशन कप और झारखंड प्रीमियर लीग के चैंपियन।'
              : 'DDKA Hall of Fame - Celebrating our proud champions and referee board including National players, Federation Cup and Jharkhand Premier League stars.'
          }
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-500 pt-28 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-1 w-12 bg-white/70 rounded-full"></div>
              <Trophy className="w-8 h-8 text-white" />
              <div className="h-1 w-12 bg-white/70 rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-oswald font-extrabold text-white mb-4 uppercase tracking-wider drop-shadow-lg">
              {isHi ? 'गौरव मंदिर' : 'HALL OF FAME'}
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
              <p className="text-white font-semibold text-sm uppercase tracking-widest">
                {isHi ? 'हमारे चैंपियन और रेफरी' : 'Our Champions & Referees'}
              </p>
            </div>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow">
              {isHi
                ? 'धनबाद जिला कबड्डी संघ के गौरवशाली खिलाड़ी और समर्पित रेफरी बोर्ड'
                : 'Celebrating the proud champions and dedicated referee board of Dhanbad District Kabaddi Association'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-20">
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            </div>
          ) : (
            <>
              {/* National Players Section */}
              {nationalPlayers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                  <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'राष्ट्रीय खिलाड़ी' : 'National Players'}
                    </h2>
                  </div>
                  <div className="p-4 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {sortedNationalPlayers.map((player) => (
                        <div key={player._id} className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-3 md:p-6 border border-indigo-100 hover:shadow-lg transition-all hover:scale-105">
                          <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-700 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 leading-tight">{player.name}</h3>
                              <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                                {player.gender === 'Female' ? (isHi ? 'महिला' : 'Female') : (isHi ? 'पुरुष' : 'Male')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Federation Cup Section */}
              {federationCupPlayers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                  <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'फेडरेशन कप' : 'Federation Cup'}
                    </h2>
                  </div>
                  <div className="p-4 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {sortedFederationCupPlayers.map((player) => (
                        <div key={player._id} className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-3 md:p-6 border border-emerald-100 hover:shadow-lg transition-all hover:scale-105">
                          <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 leading-tight">{player.name}</h3>
                              <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {player.gender === 'Female' ? (isHi ? 'महिला' : 'Female') : (isHi ? 'पुरुष' : 'Male')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Jharkhand Premier League Section */}
              {jplPlayers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                  <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'झारखंड प्रीमियर लीग' : 'Jharkhand Premier League'}
                    </h2>
                  </div>
                  <div className="p-4 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {sortedJplPlayers.map((player) => (
                        <div key={player._id} className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-3 md:p-6 border border-purple-100 hover:shadow-lg transition-all hover:scale-105">
                          <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Star className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 leading-tight">{player.name}</h3>
                              <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                {player.gender === 'Female' ? (isHi ? 'महिला' : 'Female') : (isHi ? 'पुरुष' : 'Male')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Referee Board Section */}
              {referees.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 via-indigo-800 to-cyan-700 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'रेफरी बोर्ड' : 'Referee Board'}
                    </h2>
                  </div>
                  <div className="p-4 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {sortedReferees.map((referee) => {
                        const qualUpper = referee.qualification.toUpperCase();
                        const isChairman = qualUpper.includes('CHAIRMAN');
                        const isSecretary = qualUpper.includes('SECRETARY');
                        const isOfficer = isChairman || isSecretary;

                        return (
                          <div
                            key={referee._id}
                            className={
                              `rounded-xl p-3 md:p-6 border hover:shadow-lg transition-all hover:scale-105 ` +
                              (isOfficer
                                ? 'bg-gradient-to-br from-slate-900 via-indigo-800 to-cyan-700 border-amber-400 ring-2 ring-amber-300/70'
                                : 'bg-gradient-to-br from-white to-slate-50 border-slate-200')
                            }
                          >
                            <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
                              <div
                                className={
                                  'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ' +
                                  (isOfficer
                                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 text-slate-900'
                                    : 'bg-gradient-to-br from-slate-800 to-cyan-700')
                                }
                              >
                                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                {isOfficer && (
                                  <div className="mb-1 md:mb-2 flex flex-wrap items-center gap-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wide uppercase bg-amber-100 text-amber-800">
                                      {isHi ? 'रेफरी बोर्ड अधिकारी' : 'Referee Board Officer'}
                                    </span>
                                    <span className="text-[10px] md:text-xs font-semibold uppercase text-amber-100/90">
                                      {isChairman
                                        ? (isHi ? 'चेयरमैन' : 'Chairman')
                                        : (isHi ? 'सचिव' : 'Secretary')}
                                    </span>
                                  </div>
                                )}
                                <h3
                                  className={
                                    'text-sm md:text-lg font-bold mb-1 md:mb-2 leading-tight ' +
                                    (isOfficer ? 'text-white' : 'text-slate-900')
                                  }
                                >
                                  {referee.name}
                                </h3>
                                <p
                                  className={
                                    'text-xs md:text-sm font-medium leading-tight ' +
                                    (isOfficer ? 'text-amber-100/90' : 'text-slate-600')
                                  }
                                >
                                  {referee.qualification}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pride Message */}
          <div className="mt-12 bg-gradient-to-r from-indigo-700 via-slate-800 to-cyan-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <Users className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
              <h3 className="text-3xl font-oswald font-bold text-white mb-4 uppercase drop-shadow-lg">
                {isHi ? 'हमारा गौरव' : 'Our Pride'}
              </h3>
              <p className="text-white/90 max-w-3xl mx-auto leading-relaxed text-lg drop-shadow">
                {isHi
                  ? 'ये खिलाड़ी और रेफरी DDKA की मेहनत, समर्पण और उत्कृष्टता का प्रतीक हैं। इनकी सफलता धनबाद की कबड्डी विरासत को आगे बढ़ाती है।'
                  : 'These players and referees represent the dedication, hard work, and excellence of DDKA. Their success continues the proud kabaddi legacy of Dhanbad.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurGems;
