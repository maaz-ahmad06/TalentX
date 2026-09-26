import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl border animate-slide-up ${
      type === 'ai' 
        ? 'bg-purple-950/90 border-purple-500/40 text-purple-200' 
        : type === 'error' || type === 'warning'
        ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        : 'bg-slate-900/95 border-emerald-500/40 text-slate-100'
    }`}>
      <div className="shrink-0">
        {type === 'ai' ? (
          <Sparkles size={18} className="text-purple-400" />
        ) : type === 'error' || type === 'warning' ? (
          <AlertCircle size={18} className="text-rose-400" />
        ) : (
          <CheckCircle2 size={18} className="text-emerald-400" />
        )}
      </div>
      <div className="text-xs sm:text-sm font-medium pr-2">{message}</div>
      <button className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};
