import React from 'react';
import { Check, X, Hourglass } from 'lucide-react';

interface Props {
  status?: string | null;
  className?: string;
  title?: string;
}

const normalize = (s?: string | null) => {
  if (!s) return 'pending';
  const v = s.toLowerCase();
  if (v === 'approved' || v === 'published' || v === 'read' || v === 'confirmed') return 'approved';
  if (v === 'rejected' || v === 'failed') return 'rejected';
  return 'pending';
};

const StatusMark: React.FC<Props> = ({ status, className = '', title }) => {
  const key = normalize(status);

  if (key === 'approved') {
    return (
      <span title={title || 'Approved'} aria-label="Approved" className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 ${className}`}>
        <Check className="w-4 h-4" />
      </span>
    );
  }

  if (key === 'rejected') {
    return (
      <span title={title || 'Rejected'} aria-label="Rejected" className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 ${className}`}>
        <X className="w-4 h-4" />
      </span>
    );
  }

  return (
    <span title={title || 'Pending'} aria-label="Pending" className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 ${className}`}>
      <Hourglass className="w-4 h-4" />
    </span>
  );
};

export default StatusMark;
