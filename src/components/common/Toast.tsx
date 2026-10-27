import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useLab } from '../../context/LabContext';

export const Toast: React.FC = () => {
  const { toast } = useLab();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-emerald-500/10 text-slate-900',
    error: 'border-rose-200 bg-white shadow-rose-500/10 text-slate-900',
    info: 'border-blue-200 bg-white shadow-blue-500/10 text-slate-900',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 tracking-tight">{toast.title}</p>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
