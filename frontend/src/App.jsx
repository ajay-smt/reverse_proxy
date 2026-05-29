import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import RegistrationForm from './components/RegistrationForm';
import UsersTable from './components/UsersTable';
import Toast from './components/Toast';

/**
 * Root Application Component
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Helper to trigger toast messages
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Helper to close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Callback when a user registrations is successful
  const handleRegistrationSuccess = () => {
    // Wait a brief moment to show success state before redirecting to lists
    setTimeout(() => {
      setActiveTab('users');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Premium Glassmorphic / Glowing Background */}
      <BackgroundEffects />

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        
        {activeTab === 'register' ? (
          <div className="animate-fade-in">
            <RegistrationForm 
              showToast={showToast} 
              onSuccess={handleRegistrationSuccess} 
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <UsersTable 
              showToast={showToast} 
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} QuantumPortal. All rights reserved.</p>
      </footer>

      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={handleCloseToast} 
      />

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
