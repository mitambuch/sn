import { BrandPreloader } from '@components/brand/BrandPreloader';
import { ErrorBoundary } from '@components/features/ErrorBoundary';
import { ToastContainer } from '@components/ui/Toast';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import AppRoutes from './routes';

const PRELOADER_SEEN_KEY = '__sn_preloader_seen';

function readPreloaderSeen(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.sessionStorage.getItem(PRELOADER_SEEN_KEY) === '1';
  } catch {
    return true; // Safari private mode → skip preloader rather than crash
  }
}

function markPreloaderSeen(): void {
  try {
    window.sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');
  } catch {
    // ignore
  }
}

/**
 * Smooth scroll — Lenis (fromanother.love-style "vivant" inertia).
 * Mounted once at App level so it covers EVERY route, including
 * top-level routes (/motion, /logo) outside the locale tree.
 * 1.1s ease-out-expo. Respect prefers-reduced-motion.
 */
function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

function AppContent() {
  const { pathname } = useLocation();
  useSmoothScroll();
  const [showPreloader, setShowPreloader] = useState(() => !readPreloaderSeen());
  return (
    <ErrorBoundary resetKeys={[pathname]}>
      {showPreloader && (
        <BrandPreloader
          onComplete={() => {
            markPreloaderSeen();
            setShowPreloader(false);
          }}
        />
      )}
      <AppRoutes />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
