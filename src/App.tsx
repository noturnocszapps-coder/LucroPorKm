import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Entries from './pages/Entries';
import Simulator from './pages/Simulator';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  console.log(`[ROUTE] PrivateRoute - User: ${user?.uid}, Loading: ${loading}, Profile: ${!!profile}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center">
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mx-auto"></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Autenticando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('[ROUTE] No user found, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // If user exists but onboarding not completed, redirect to onboarding (except if already there)
  if (profile && profile.onboardingCompleted === false && window.location.pathname !== '/onboarding') {
    console.log('[ROUTE] Onboarding not completed, redirecting...');
    return <Navigate to="/onboarding" />;
  }

  // If onboarding is completed and user is on /onboarding, move them to dashboard
  if (profile && profile.onboardingCompleted === true && window.location.pathname === '/onboarding') {
    console.log('[ROUTE] Onboarding already completed, redirecting to dashboard...');
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/onboarding" element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/entries" element={
            <PrivateRoute>
              <Entries />
            </PrivateRoute>
          } />
          
          <Route path="/simulator" element={
            <PrivateRoute>
              <Simulator />
            </PrivateRoute>
          } />
          
          <Route path="/reports" element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
