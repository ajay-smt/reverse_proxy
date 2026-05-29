import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

/**
 * A beautiful, animated custom toast notification.
 * @param {Object} props
 * @param {boolean} props.show - Whether to display the toast
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast: 'success', 'error', 'info'
 * @param {function} props.onClose - Callback function to dismiss toast
 * @param {number} [props.duration=5000] - Duration in ms before auto-dismiss
 */
export default function Toast({ show, message, type = 'success', onClose, duration = 5000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
      progress: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-rose-950/80 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      progress: 'bg-rose-500'
    },
    info: {
      bg: 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
      progress: 'bg-indigo-500'
    }
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full"
      style={{
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${currentStyle.bg}`}>
        {currentStyle.icon}
        <div className="flex-1 text-sm font-medium pr-2">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 hover:bg-white/10 p-1 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
