import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Download, ArrowRight, Printer } from 'lucide-react';
import StatusMark from '../components/admin/StatusMark';
import html2canvas from 'html2canvas';
import { CONTACT_INFO } from '../constants';

interface Donation {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  currency?: string;
  method?: string;
  txId?: string;
  receiptNumber?: string;
  message?: string;
  receiptUrl?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DDKA_LOGO = 'https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png';
const JSKA_LOGO = 'https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg';
const AKFI_LOGO = 'https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png';

const DonationReceipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/donations/${id}`);
        const data = await res.json().catch(() => null);
        if (res.ok && data && data.success) {
          setDonation(data.data);
        } else {
          setDonation(null);
        }
      } catch (err) {
        console.error('Failed to fetch donation', err);
        setDonation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  const generateReceiptCode = (d: Donation) => {
    const short = d._id ? d._id.slice(0, 8).toUpperCase() : String(Date.now()).slice(-6);
    return `DDKA-REC-${short}`;
  };

  const saveAsJpeg = async () => {
    if (!receiptRef.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `DDKA_Receipt_${donation?._id || 'receipt'}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to save JPEG', err);
      alert('Failed to save as JPEG.');
    } finally {
      setBusy(false);
    }
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const html = receiptRef.current.outerHTML;
    const style = `
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .receipt-wrapper { width: 100%; max-width: 800px; margin: 0 auto; }
      </style>
    `;
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) return alert('Popup blocked. Allow popups for this site to print.');
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>DDKA Receipt</title>${style}</head><body>${html}</body></html>`);
    win.document.close();
    // Wait for images to load
    win.focus();
    setTimeout(() => { try { win.print(); } catch (e) { console.error('Print failed', e); } }, 500);
  };

  if (loading) return <div className="p-6">Loading donation...</div>;
  if (!donation) return <div className="p-6">Donation not found.</div>;

  const receiptCode = donation.receiptNumber || generateReceiptCode(donation);
  const dateStr = donation.createdAt ? new Date(donation.createdAt).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Donation Receipt | DDKA</title>
      </Helmet>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold">Donation Details</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><div className="text-xs text-slate-500">Donor Name</div><div className="font-semibold">{donation.name}</div></div>
          <div><div className="text-xs text-slate-500">Email</div><div className="font-semibold">{donation.email || '-'}</div></div>
          <div><div className="text-xs text-slate-500">Phone</div><div className="font-semibold">{donation.phone || '-'}</div></div>
          <div><div className="text-xs text-slate-500">Amount</div><div className="font-semibold">₹{donation.amount}</div></div>
          <div><div className="text-xs text-slate-500">Date</div><div className="font-semibold">{dateStr}</div></div>
          <div>
            <div className="text-xs text-slate-500">Status</div>
            <div className="font-semibold">
              <StatusMark status={donation.status} title={donation.status || 'pending'} className="w-6 h-6" />
              <span className="sr-only">{donation.status || 'pending'}</span>
            </div>
          </div>
          <div><div className="text-xs text-slate-500">Txn ID</div><div className="font-semibold">{donation.txId || '-'}</div></div>
          <div className="md:col-span-2"><div className="text-xs text-slate-500">Message</div><div className="font-semibold">{donation.message || '-'}</div></div>
        </div>

        <div className="mt-6 flex gap-3 items-center">
          {donation.status === 'confirmed' ? (
            <>
              <button onClick={saveAsJpeg} disabled={busy} className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2">{busy ? 'Saving...' : (<><Download className="w-4 h-4"/> Save as JPEG</>)}</button>
              <button onClick={printReceipt} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"><Printer className="w-4 h-4"/> Print</button>
            </>
          ) : (
            <div className="text-sm text-yellow-700">This receipt is pending verification. It will be available after DDKA confirms the donation.</div>
          )}

          {donation.receiptUrl && <a href={donation.receiptUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-100 rounded-md flex items-center gap-2">View uploaded proof <ArrowRight className="w-4 h-4"/></a>}
        </div>
      </div>

      {/* Receipt visual rendering */}
      <div ref={receiptRef} id="receipt-area" className="receipt-wrapper bg-white border border-slate-200 rounded-lg shadow p-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
          <div className="flex items-center justify-between">
            <img src={DDKA_LOGO} alt="DDKA" className="h-16 object-contain" />
            <div className="text-center flex-1">
              <div className="text-xl font-bold">Dhanbad District Kabaddi Association (DDKA)</div>
              <div className="text-sm text-slate-600">Donation Receipt / Tax Exemption Certificate</div>
            </div>
            <div className="flex gap-3 items-center">
              <img src={JSKA_LOGO} alt="JSKA" className="h-10 object-contain rounded" />
              <img src={AKFI_LOGO} alt="AKFI" className="h-10 object-contain" />
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Receipt No</div>
              <div className="font-semibold">{receiptCode}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Date</div>
              <div className="font-semibold">{dateStr}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Donor</div>
              <div className="font-semibold">{donation.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Amount</div>
              <div className="font-semibold">₹{donation.amount}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Email</div>
              <div className="font-semibold">{donation.email || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Phone</div>
              <div className="font-semibold">{donation.phone || '-'}</div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-slate-500">Message</div>
              <div className="font-semibold">{donation.message || '-'}</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded">
            <div className="text-sm">This receipt certifies that the above donation was received by DDKA. <strong>Receipt Code:</strong> {receiptCode}.</div>
            <div className="mt-2 text-sm text-slate-700 italic">"Empowering Kabaddi & Community — Every contribution counts."</div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Authorized Signatory</div>
              <div className="mt-2">
                <img src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1768749991/Mintoo_Thakur_Sign_cg8gxm.png" alt="Mintoo Thakur Signature" className="h-16 object-contain" />
              </div>
              <div className="mt-1 font-semibold">Mintoo Thakur (NIS)</div>
              <div className="text-xs text-slate-500">Secretary, Dhanbad District Kabaddi Association</div>
            </div>

            <div className="text-xs text-slate-500 text-right">
              <div>For Dhanbad District Kabaddi Association</div>
              <div className="mt-4 text-sm">
                <div>Website: <a href="https://dhanbadkabaddiassociation.tech" target="_blank" rel="noreferrer" className="text-blue-700 underline">dhanbadkabaddiassociation.tech</a></div>
                <div>Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-blue-700 underline">{CONTACT_INFO.email}</a></div>
                <div>Contact: <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-blue-700 underline">{CONTACT_INFO.phone}</a></div>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
};

export default DonationReceipt;
