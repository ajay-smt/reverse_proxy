import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowRight, RotateCw, LogIn } from 'lucide-react';

const LOGIN_API = '/api/users/login';

/**
 * LoginForm Component
 * Renders a glassmorphic login interface for players to enter their email and access their dashboard.
 * @param {Object} props
 * @param {function} props.showToast - Callback to display toast notifications
 * @param {function} props.onLoginSuccess - Callback when login succeeds, receives the player object
 * @param {function} props.onSwitchToRegister - Callback to toggle tab to registration
 */
export default function LoginForm({ showToast, onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email to login', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(LOGIN_API, { email: email.trim() });
      if (response.data.success) {
        showToast(response.data.message || 'Logged in successfully!', 'success');
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please verify your email.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-8 glow-indigo relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Access Play Area</h2>
        <p className="text-slate-400 text-xs">Enter your registered email address to access your personal wallet and bets.</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Registered Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. testplayer@gmail.com"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold glass-input placeholder-slate-600"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/15 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Redirect footer */}
      <div className="mt-8 text-center border-t border-white/5 pt-5">
        <p className="text-xs text-slate-500">
          Don't have a profile yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline decoration-2 underline-offset-4"
          >
            Create registration profile
          </button>
        </p>
      </div>

    </div>
  );
}
