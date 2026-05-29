import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PlayerApp from './PlayerApp';
import AdminApp from './AdminApp';

/**
 * Root Router Orchestrator
 */
export default function App() {
  const location = useLocation();

  // If the path starts with /admin, load the dedicated admin app layout
  if (location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }

  // Otherwise serve standard player layouts
  return <PlayerApp />;
}
