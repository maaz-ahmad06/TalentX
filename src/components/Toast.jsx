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
    <div className={`floating-toast toast-${type} glass-panel animate-slide-up`}>
      <div className="toast-icon-wrap">
        {type === 'ai' ? (
          <Sparkles size={18} className="toast-ai-icon" />
        ) : type === 'error' ? (
          <AlertCircle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}
      </div>
      <div className="toast-message-text">{message}</div>
      <button className="toast-close-btn" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};
