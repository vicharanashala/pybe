import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Auth pages (eager — small, always needed)
import Login  from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';

// Lazy pages
const Home      = lazy(() => import('./pages/Home.jsx'));
const AppLayout = lazy(() => import('./layouts/AppLayout.jsx'));
const AppHome   = lazy(() => import('./pages/AppHome.jsx'));
const ChapterPage = lazy(() => import('./pages/ChapterPage.jsx'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center',
      background: 'var(--bg-base)', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(168,255,62,0.2)',
          borderTop: '3px solid var(--accent)',
          animation: 'spin 0.7s linear infinite',
          margin: '0 auto 14px',
        }} />
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--accent)', fontSize: '0.95rem' }}>
          Loading PyBe…
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Protected route — redirects to /login if not authenticated
function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// Guest-only route — redirects to /app if already logged in
function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login"  element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />

        {/* Protected app */}
        <Route
          path="/app"
          element={<Protected><AppLayout /></Protected>}
        >
          <Route index element={<AppHome />} />
          <Route path="chapter/:chapterId" element={<ChapterPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={
          <div style={{
            minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐍</div>
              <h2 style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
                Page not found
              </h2>
              <a href="/" style={{
                display: 'inline-block', marginTop: 16, padding: '12px 24px',
                background: 'var(--accent)', color: '#0D1117', borderRadius: 10,
                fontWeight: 700, textDecoration: 'none',
              }}>Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
