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

  // Qualification hierarchy for referees
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
    const rankDiff = qualificationRank(a.qualification) - qualificationRank(b.qualification);
    return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
  });

  return (
    <>
      <Helmet>
        <title>
          {isHi
            ? 'हमारे रत्न | DDKA'
            : 'Our Gems | DDKA - Champions & Referees'}
        </title>
        <meta
          name="description"
          content={
            isHi
              ? 'DDKA के गौरवशाली खिलाड़ी और रेफरी बोर्ड - राष्ट्रीय खिलाड़ी, फेडरेशन कप और झारखंड प्रीमियर लीग के चैंपियन।'
              : 'DDKA proud champions and referee board - National players, Federation Cup and Jharkhand Premier League stars.'
          }
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-2xl mb-6 border border-orange-500/30">
              <Trophy className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-oswald font-bold text-white mb-6 uppercase tracking-tight">
              {isHi ? 'DDKA के रत्न' : 'DDKA Gems'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {isHi
                ? 'धनबाद जिला कबड्डी संघ के गौरवशाली खिलाड़ी और समर्पित रेफरी बोर्ड'
                : 'Celebrating the proud champions and dedicated referee board of Dhanbad District Kabaddi Association'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20 relative z-20">
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900"></div>
            </div>
          ) : (
            <>
              {/* National Players Section */}
              {nationalPlayers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'राष्ट्रीय खिलाड़ी' : 'National Players'}
                    </h2>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedNationalPlayers.map((player, index) => (
                        <div key={player._id} className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-oswald font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-blue-900 mb-1">{player.name}</h3>
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
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'फेडरेशन कप' : 'Federation Cup'}
                    </h2>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedFederationCupPlayers.map((player, index) => (
                        <div key={player._id} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-oswald font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-orange-900 mb-1">{player.name}</h3>
                              <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-orange-100 text-orange-700'}`}>
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
                  <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-green-700" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'झारखंड प्रीमियर लीग' : 'Jharkhand Premier League'}
                    </h2>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedJplPlayers.map((player, index) => (
                        <div key={player._id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-oswald font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-green-900 mb-1">{player.name}</h3>
                              <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
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
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                      {isHi ? 'रेफरी बोर्ड' : 'Referee Board'}
                    </h2>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedReferees.map((referee, index) => (
                        <div key={referee._id} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-oswald font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 mb-2">{referee.name}</h3>
                              <p className="text-sm text-slate-600 font-medium">{referee.qualification}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pride Message */}
          <div className="mt-12 bg-gradient-to-r from-blue-900 to-orange-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <Users className="w-16 h-16 text-white mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-oswald font-bold text-white mb-4 uppercase">
                {isHi ? 'हमारा गौरव' : 'Our Pride'}
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto leading-relaxed text-lg">
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
