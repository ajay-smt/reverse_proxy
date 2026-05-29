import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import BackgroundEffects from './components/BackgroundEffects';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

/**
 * Separate layout for Admin operations accessed via `/admin` url
 */
export default function AdminApp() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="flex flex-col min-h-screen relative text-slate-100 bg-slate-950">
      <BackgroundEffects />

      {/* Admin Specific Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none">
                QuantumBet
              </h1>
              <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </div>

          {/* Go Back to Main App Link */}
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Player Site</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="animate-fade-in">
          <AdminPanel showToast={showToast} />
        </div>
      </main>

      <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} QuantumBet Admin Dashboard. Confidential.</p>
      </footer>

      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={handleCloseToast} 
      />
    </div>
  );
}
