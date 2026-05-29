import React from 'react';
import { UserPlus, Users, Sparkles } from 'lucide-react';

/**
 * Navigation Bar for switching views in the application.
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ('register' or 'users')
 * @param {function} props.setActiveTab - State setter to switch active tab
 */
export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('register')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-none">
              QuantumPortal
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
              User Directory
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            id="nav-btn-register"
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
          
          <button
            id="nav-btn-users"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users</span>
          </button>
        </nav>

      </div>
    </header>
  );
}
