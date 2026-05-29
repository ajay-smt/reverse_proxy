import React from 'react';
import { UserPlus, Sparkles, Gamepad2, LogIn, LogOut, User } from 'lucide-react';

/**
 * Navigation Bar that adapts dynamically to the login state of the player.
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ('login', 'register', 'play')
 * @param {function} props.setActiveTab - Toggles state active tabs
 * @param {boolean} props.isLoggedIn - True if a player session is active
 * @param {function} props.onLogout - Terminate player session callback
 * @param {string} props.playerName - Active player display name
 */
export default function Navbar({ activeTab, setActiveTab, isLoggedIn, onLogout, playerName }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => isLoggedIn ? setActiveTab('play') : setActiveTab('login')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-none">
              QuantumBet
            </h1>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">
              Casino Portal
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center gap-4">
          
          <nav className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {isLoggedIn ? (
              /* Logged In Navbar Option */
              <button
                id="nav-btn-play"
                onClick={() => setActiveTab('play')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  activeTab === 'play'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Play Area</span>
              </button>
            ) : (
              /* Guest Navbar Options */
              <>
                <button
                  id="nav-btn-login"
                  onClick={() => setActiveTab('login')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>

                <button
                  id="nav-btn-register"
                  onClick={() => setActiveTab('register')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </>
            )}
          </nav>

          {/* User profile & Logout button if logged in */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Player</span>
                <span className="text-xs text-slate-200 font-bold">{playerName}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all"
                title="Logout session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
