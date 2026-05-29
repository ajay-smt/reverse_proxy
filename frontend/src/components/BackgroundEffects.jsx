import React from 'react';

/**
 * Renders glowing ambient circles in the background for a modern premium feel.
 */
export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dark background base */}
      <div className="absolute inset-0 bg-[#0f172a]" />

      {/* Indigo glowing orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-slow" />

      {/* Purple glowing orb */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Additional subtle accent orb */}
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
    </div>
  );
}
