import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import RegistrationForm from './components/RegistrationForm';
import GameDashboard from './components/GameDashboard';
import LoginForm from './components/LoginForm';
import Toast from './components/Toast';

const USERS_API = import.meta.env.VITE_API_URL || '/api/users';

/**
 * Player-facing portal layout with session authorization
 */
export default function PlayerApp() {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', 'play'
  const [activePlayer, setActivePlayer] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Sync session on mount
  useEffect(() => {
    const syncSession = async () => {
      const savedPlayer = localStorage.getItem('quantum_player');
      if (savedPlayer) {
        try {
          const parsed = JSON.parse(savedPlayer);
          // Fetch latest player data from database to ensure fresh balance/stats
          const response = await axios.get(USERS_API);
          if (response.data.success) {
            const freshData = response.data.users.find(u => u._id === parsed._id);
            if (freshData) {
              setActivePlayer(freshData);
              localStorage.setItem('quantum_player', JSON.stringify(freshData));
              setActiveTab('play');
            } else {
              // User was deleted or database cleared
              localStorage.removeItem('quantum_player');
              setActiveTab('login');
            }
          }
        } catch (err) {
          console.error('Session sync error:', err);
          // Fallback to local storage if API is offline
          const parsed = JSON.parse(savedPlayer);
          setActivePlayer(parsed);
          setActiveTab('play');
        }
      } else {
        setActiveTab('login');
      }
      setLoadingSession(false);
    };

    syncSession();
  }, []);

  const handleLoginSuccess = (player) => {
    setActivePlayer(player);
    localStorage.setItem('quantum_player', JSON.stringify(player));
    setActiveTab('play');
  };

  const handleRegistrationSuccess = (newPlayer) => {
    // If backend returns the registered user, log them in automatically
    if (newPlayer) {
      setTimeout(() => {
        handleLoginSuccess(newPlayer);
      }, 1500);
    } else {
      setTimeout(() => {
        setActiveTab('login');
        showToast('Profile created! Please log in with your email.', 'success');
      }, 1500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quantum_player');
    setActivePlayer(null);
    setActiveTab('login');
    showToast('Logged out successfully', 'success');
  };

  if (loadingSession) {
    return (
      <div className="flex flex-col min-h-screen relative bg-slate-950 text-slate-100 items-center justify-center">
        <BackgroundEffects />
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-dashed border-indigo-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">Synchronizing secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-950 text-slate-100">
      <BackgroundEffects />

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={!!activePlayer} 
        onLogout={handleLogout}
        playerName={activePlayer?.fullName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        
        {activeTab === 'play' && activePlayer && (
          <div className="animate-fade-in">
            <GameDashboard 
              showToast={showToast} 
              activePlayer={activePlayer}
              setActivePlayer={(updatedPlayer) => {
                setActivePlayer(updatedPlayer);
                if (updatedPlayer) {
                  localStorage.setItem('quantum_player', JSON.stringify(updatedPlayer));
                } else {
                  localStorage.removeItem('quantum_player');
                }
              }}
            />
          </div>
        )}

        {activeTab === 'login' && !activePlayer && (
          <div className="animate-fade-in">
            <LoginForm 
              showToast={showToast} 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          </div>
        )}

        {activeTab === 'register' && !activePlayer && (
          <div className="animate-fade-in">
            <RegistrationForm 
              showToast={showToast} 
              onSuccess={handleRegistrationSuccess} 
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} QuantumBet. All rights reserved.</p>
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
