import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  showManageModules?: boolean;
  onManageModules?: () => void;
  actions?: React.ReactNode;
  showBack?: boolean;
}

const AdminPageHeader: React.FC<Props> = ({ title, subtitle, showManageModules, onManageModules, actions, showBack = true }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="min-w-0">
        <h1 className="text-3xl font-oswald font-bold text-blue-900 uppercase truncate">{title}</h1>
        {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {showManageModules && (
          <button
            onClick={onManageModules}
            className="w-full sm:w-auto px-3 py-2 rounded-full bg-white text-blue-700 text-xs font-bold border border-blue-200 hover:shadow-sm transition-all"
          >
            Manage Modules
          </button>
        )}

        {showBack && (
          <button
            onClick={() => (window.location.href = '/admin-portal-access')}
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        )}

        {actions}
      </div>
    </div>
  );
};

export default AdminPageHeader;
