import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IDCardFront } from './Frontcard';
import { IDCardBack } from './Backcard';
import { formatDateMDY } from '../utils/date';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Account: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showIdsToUsers, setShowIdsToUsers] = useState<boolean>(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings/public`);
        const json = await res.json();
        if (json && json.success && typeof json.data?.showIdsToUsers === 'boolean') {
          setShowIdsToUsers(json.data.showIdsToUsers);
        }
      } catch (e) {
        console.error('Failed to fetch public settings', e);
      }
    };
    fetchSettings();
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const localProfile = localStorage.getItem('userProfile');
    const localRole = localStorage.getItem('userRole');

    if (!token) {
      // Not logged in
      setError('Not logged in. Please login first.');
      return;
    }

    setRole(localRole || null);

    // Try to fetch fresh profile from /api/auth/me
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        if (result.success && result.profile) {
          setProfile(result.profile);
          localStorage.setItem('userProfile', JSON.stringify(result.profile));
        } else {
          // Fall back to local storage
          setProfile(localProfile ? JSON.parse(localProfile) : null);
        }
      } catch (err) {
        console.error('Failed fetching profile', err);
        setProfile(localProfile ? JSON.parse(localProfile) : null);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">{error}</h3>
          <a href="/login" className="text-orange-600 font-bold">Go to Login</a>
        </div>
      </div>
    );
  }


  const formatDate = (d: any) => {
    return formatDateMDY(d);
  };

  const getIdSuffix = (p: any) => {
    const raw = (p && (p._id || p.id || p.applicationId || '')) as string;
    return raw ? raw.slice(-4).toUpperCase() : '';
  };

  const buildTechnicalIdCardUrl = (autoDownload?: boolean) => {
    if (!profile) return '';
    const suffix = getIdSuffix(profile);
    const params = new URLSearchParams();
    if (API_URL) params.set('api', API_URL);
    const name = profile.candidateName || profile.fullName || profile.instName || '';
    params.set('name', name);
    if (suffix) params.set('sno', suffix);
    if (suffix) params.set('uid', `DDKA-2026-${suffix}`);
    const dobDate = profile.dob ? new Date(profile.dob) : null;
    if (dobDate && !Number.isNaN(dobDate.getTime())) {
      params.set('dob', dobDate.toISOString().slice(0, 10));
    }
    if (profile.grade) params.set('grade', profile.grade);
    if (profile.photoUrl) params.set('photoUrl', profile.photoUrl);
    if (autoDownload) params.set('download', 'pdf');
    return `/important-docs/technical-id-card.html?${params.toString()}`;
  };

  const buildOfficialCertificateUrl = (autoDownload?: boolean) => {
    if (!profile) return '';
    const suffix = getIdSuffix(profile);
    const params = new URLSearchParams();
    if (API_URL) params.set('api', API_URL);
    const name = profile.candidateName || profile.fullName || profile.instName || '';
    params.set('name', name);
    if (profile.parentName) params.set('father', profile.parentName);
    if (suffix && profile.grade) params.set('regSuffix', suffix);
    // Use event date (fixed) for certificates
    params.set('date', '2026-01-18');
    if (profile.grade) params.set('grade', profile.grade);
    if (profile.photoUrl) params.set('photoUrl', profile.photoUrl);
    if (autoDownload) params.set('download', 'pdf');
    return `/important-docs/official-certificate.html?${params.toString()}`;
  };

  const triggerDownload = (url: string) => {
    if (!url) return;
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
  };

  const canViewOfficialAssets = role === 'official' && profile?.status === 'Approved' && !!profile?.grade;

  // Show institution logo in the profile slot when no photo is uploaded
  const displayProfileImage = profile ? (profile.photoUrl || (role === 'institution' ? profile.instLogoUrl : '')) : '';

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Account</h2>

          <div className="flex items-center gap-3">
            <a href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">GO TO DASHBOARD</a>

            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Logout</button>
          </div>
        </div>

        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* LEFT: Photo & Documents Cards */}
            <div className="space-y-4">
              {/* Photo Card */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 flex flex-col items-center text-center">
                <div className="text-xs uppercase text-slate-500 font-semibold mb-3">Profile Photo</div>
                {displayProfileImage ? (
                  <a href={displayProfileImage} target="_blank" rel="noreferrer" className="inline-block">
                    <div className="h-44 w-full max-w-[176px] rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img src={displayProfileImage} alt={profile.fullName || profile.instName || 'Profile Image'} className="h-full w-full object-cover" />
                    </div>
                  </a>
                ) : (
                  <div className="h-44 w-full max-w-[176px] rounded-full bg-slate-100 flex items-center justify-center text-slate-400">No Photo</div>
                )}
                <div className="mt-4 text-lg font-semibold text-slate-700">{profile.fullName || profile.candidateName || profile.instName || '—'}</div>
                <div className="mt-1 text-sm text-slate-500 px-3 py-1 bg-slate-50 rounded-full">{role}</div>
              </div>

              {/* Documents / Aadhar Card */}
              {role !== 'institution' && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-slate-700">Aadhar Card Documents</div>
                    <div className="text-xs text-slate-400">Click to view</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {role === 'player' && (
                      <>
                        {profile.aadharFrontUrl && (
                          <div className="bg-white rounded-lg border p-4">
                            <div className="text-sm font-semibold mb-2">Aadhar Front</div>
                            <div className="w-full max-w-[360px] mx-auto bg-slate-50 rounded border overflow-hidden flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                              <a href={profile.aadharFrontUrl} target="_blank" rel="noreferrer" className="inline-block w-full">
                                <img src={profile.aadharFrontUrl} alt="Aadhar Front" className="mx-auto max-h-[360px] w-auto object-contain" />
                              </a>
                            </div>
                            <div className="mt-3 text-center">
                              <a href={profile.aadharFrontUrl} download className="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded">Download Front</a>
                            </div>
                          </div>
                        )}

                        {profile.aadharBackUrl && (
                          <div className="bg-white rounded-lg border p-4">
                            <div className="text-sm font-semibold mb-2">Aadhar Back</div>
                            <div className="w-full max-w-[360px] mx-auto bg-slate-50 rounded border overflow-hidden flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                              <a href={profile.aadharBackUrl} target="_blank" rel="noreferrer" className="inline-block w-full">
                                <img src={profile.aadharBackUrl} alt="Aadhar Back" className="mx-auto max-h-[360px] w-auto object-contain" />
                              </a>
                            </div>
                            <div className="mt-3 text-center">
                              <a href={profile.aadharBackUrl} download className="inline-flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded">Download Back Side</a>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {role === 'official' && (
                      <div className="space-y-3">
                        {profile.signatureUrl && (
                          <div className="bg-white rounded-lg border p-3 flex items-center gap-3">
                            <div className="flex-shrink-0 w-full max-w-[192px]">
                              <a href={profile.signatureUrl} target="_blank" rel="noreferrer" className="inline-block">
                                <div className="h-32 w-full bg-slate-50 rounded border overflow-hidden flex items-center justify-center">
                                  <img src={profile.signatureUrl} alt="Signature" className="h-full w-full object-contain" />
                                </div>
                              </a>
                            </div>
                            <div className="flex-1 text-sm text-slate-700"></div>
                          </div>
                        )} 

                        {profile.otherDocUrl && (
                          <div className="bg-white rounded-lg border p-3 flex items-center gap-3">
                            <div className="flex-shrink-0 w-full max-w-[192px]">
                              <a href={profile.otherDocUrl} target="_blank" rel="noreferrer" className="inline-block">
                                <div className="h-32 w-full bg-slate-50 rounded border overflow-hidden flex items-center justify-center">
                                  <img src={profile.otherDocUrl} alt="Other" className="h-full w-full object-contain" />
                                </div>
                              </a>
                            </div>
                            <div className="flex-1 text-sm text-slate-700"></div>
                          </div>
                        )} 
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Details Card */}
            <div className="md:col-span-2 flex flex-col gap-6">

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Profile Details</h3>
                    <div className="text-sm text-slate-500">All your account information and documents.</div>
                    <div className="mt-3 text-xs text-slate-500">
                      By using this account you agree to our{' '}
                      <Link to="/terms-conditions" className="text-blue-600 underline">Terms &amp; Conditions</Link>{' '}
                      and{' '}
                      <Link to="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link>.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{role}</div>
                  </div>
                </div> 

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-orange-600">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                      PERSONAL INFORMATION
                    </h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div><strong>Name:</strong> {profile.fullName || profile.candidateName || profile.instName || '—'}</div>
                      <div><strong>Email:</strong> {profile.email || '—'}</div>
                      <div><strong>Status:</strong> {profile.status || '—'}</div>
                      {profile.idNo && showIdsToUsers && (
                        <div className="flex items-center gap-3">
                          <div><strong>Player ID:</strong> <span className="text-slate-700">{profile.idNo}</span></div>
                        </div>
                      )}

                      {!showIdsToUsers && profile.idNo && (
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-yellow-700">ID is currently hidden by the association.</div>
                        </div>
                      )}
                      {profile.regNo && <div><strong>Reg. No:</strong> {profile.regNo}</div>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-600">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      CONTACT & IDENTITY
                    </h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      {profile.phone && <div><strong>Phone:</strong> {profile.phone}</div>}
                      {profile.officePhone && <div><strong>Office Phone:</strong> {profile.officePhone}</div>}
                      {profile.altPhone && <div><strong>Alt Phone:</strong> {profile.altPhone}</div>}
                      {profile.address && <div><strong>Address:</strong> {profile.address}</div>}
                    </div>
                  </div>
                </div>

                {/* Extended Details: player/official/institution */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {role === 'player' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Player Details</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        {profile.fathersName && <div><strong>Father's Name:</strong> {profile.fathersName}</div>}
                        {profile.gender && <div><strong>Gender:</strong> {profile.gender}</div>}
                        {profile.dob && <div><strong>DOB:</strong> {formatDate(profile.dob)}</div>}
                        {profile.bloodGroup && <div><strong>Blood Group:</strong> {profile.bloodGroup}</div>}
                        {profile.parentsPhone && <div><strong>Parents' Phone:</strong> {profile.parentsPhone}</div>}
                        {profile.aadharNumber && <div><strong>Aadhar Number:</strong> {profile.aadharNumber}</div>}
                        {profile.memberRole && <div><strong>Role on Card:</strong> {profile.memberRole}</div>}
                      </div>
                    </div>
                  )}

                  {role === 'official' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Official Details</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        {profile.parentName && <div><strong>Parent Name:</strong> {profile.parentName}</div>}
                        {profile.dob && <div><strong>DOB:</strong> {formatDate(profile.dob)}</div>}
                        {profile.aadharNumber && <div><strong>Aadhar Number:</strong> {profile.aadharNumber}</div>}
                        {profile.playerLevel && <div><strong>Level:</strong> {profile.playerLevel}</div>}
                        {profile.work && <div><strong>Work:</strong> {profile.work}</div>}
                        {profile.education && <div><strong>Education:</strong> {profile.education}</div>}
                        {canViewOfficialAssets && profile.grade && <div><strong>Grade:</strong> {profile.grade}</div>}
                        {canViewOfficialAssets && profile.remarks && <div><strong>Remarks:</strong> {profile.remarks}</div>}
                      </div>
                    </div>
                  )}

                  {role === 'institution' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Institution Details</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        {profile.instType && <div><strong>Type:</strong> {profile.instType}</div>}
                        {profile.year && <div><strong>Year:</strong> {profile.year}</div>}
                        {profile.headName && <div><strong>Head:</strong> {profile.headName}</div>}
                        {profile.secretaryName && <div><strong>Secretary:</strong> {profile.secretaryName}</div>}
                        {profile.totalPlayers && <div><strong>Total Players:</strong> {profile.totalPlayers}</div>}
                        {profile.surfaceType && <div><strong>Surface:</strong> {profile.surfaceType}</div>}
                        {profile.area && <div><strong>Area/Location:</strong> {profile.area}</div>}
                        {typeof profile.acceptedTerms === 'boolean' && <div><strong>Accepted Terms:</strong> {profile.acceptedTerms ? 'Yes' : 'No'}</div>}
                      </div>
                    </div>
                  )}

                  {role === 'donor' && (
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">My Donations</h3>
                          <div className="text-sm text-slate-500">Confirmed donations & receipts available here.</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {profile.confirmedDonations && profile.confirmedDonations.length > 0 ? (
                          profile.confirmedDonations.map((d: any) => (
                            <div key={d.id} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <div className="text-sm text-slate-500">Date</div>
                                <div className="font-semibold">{new Date(d.createdAt).toLocaleString()}</div>
                                <div className="text-sm text-slate-500">Receipt # {d.receiptNumber || d.id.slice(0,8).toUpperCase()}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">₹{d.amount}</div>
                                <div className="mt-2 flex items-center gap-2 justify-end">
                                  <a href={`/donation/${d.id}`} className="px-3 py-2 bg-sky-600 text-white rounded text-sm">View Receipt</a>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-600">No confirmed donations yet. Your donation may be pending verification.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assets table (User downloads) */}
              {role === 'official' && canViewOfficialAssets && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">My Assets</h3>
                      <div className="text-sm text-slate-500">Download your approved assets anytime.</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500">
                          <th className="py-2 px-3">Asset</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {showIdsToUsers && (
                          <tr>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">Technical Official ID Card</div>
                              <div className="text-xs text-slate-500">Download JPG / PDF from the asset page.</div>
                            </td>
                            <td className="py-3 px-3">
                              {canViewOfficialAssets ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Available</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">Not available</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                disabled={!canViewOfficialAssets}
                                onClick={() => {
                                  const url = buildTechnicalIdCardUrl(true);
                                  if (!url) return;
                                  triggerDownload(url);
                                }}
                                className="px-3 py-2 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-600"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        )}

                        <tr>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">Official Certificate</div>
                            <div className="text-xs text-slate-500">Issued after approval and grade assignment.</div>
                          </td>
                          <td className="py-3 px-3">
                            {canViewOfficialAssets ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Available</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">Not available</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              disabled={!canViewOfficialAssets}
                              onClick={() => {
                                const url = buildOfficialCertificateUrl(true);
                                if (!url) return;
                                triggerDownload(url);
                              }}
                              className="px-3 py-2 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ID Card card */}
{profile.idNo && showIdsToUsers && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your ID Card</h3>
                    <div className="text-sm text-slate-500">Printable & Shareable</div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 text-sm font-semibold text-slate-700">Front</div>
                      <IDCardFront data={{
                        idNo: profile.idNo,
                        name: profile.fullName || profile.candidateName || profile.instName,
                        fathersName: profile.fathersName || profile.parentName || '',
                        dob: profile.dob,
                        bloodGroup: profile.bloodGroup,
                        phone: profile.phone || profile.mobile || profile.officePhone || '',
                        address: profile.address,
                        photoUrl: profile.photoUrl,
                        transactionId: profile.transactionId,
                        memberRole: profile.memberRole || (role === 'official' ? 'Official' : 'Player'),
                      }} />
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="mb-2 text-sm font-semibold text-slate-700">Back</div>
                      <IDCardBack data={{
                        idNo: profile.idNo,
                        name: profile.fullName || profile.candidateName || profile.instName,
                        fathersName: profile.fathersName || profile.parentName || '',
                        dob: profile.dob,
                        bloodGroup: profile.bloodGroup,
                        phone: profile.phone || profile.mobile || profile.officePhone || '',
                        address: profile.address,
                        photoUrl: profile.photoUrl,
                        transactionId: profile.transactionId,
                        memberRole: profile.memberRole || (role === 'official' ? 'Official' : 'Player'),
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {!showIdsToUsers && profile.idNo && (
                <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4 text-sm text-yellow-800">
                  ID visibility is currently disabled by the association. Your profile details are retained but the ID number and ID card are hidden from users.
                </div>
              )}

              <div className="text-sm text-slate-500">Account created: {formatDate(profile.createdAt)}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">Loading profile...</div>
        )}
      </div>
    </div>
  );
};

export default Account;