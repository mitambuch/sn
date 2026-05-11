/* ═══════════════════════════════════════════════════════════════
   TEST SETUP — loaded before every test file.
   Adds DOM-specific matchers (toBeVisible, toHaveTextContent…).
   ═══════════════════════════════════════════════════════════════ */

import '@testing-library/jest-dom/vitest';

import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// WHY: developer's .env.local sets VITE_SUPABASE_* so `hasSupabase` would
// be true in tests too. The AuthContext then enters loading=true and tries
// to hit the real Supabase. Tests want the synthetic dev-session path, so
// we stub the module at the global level. Individual tests can override
// with vi.mock() locally if they need to exercise the Supabase branch.
vi.mock('@/lib/supabase', () => ({
  hasSupabase: false,
  supabase: null,
}));

// WHY: jsdom doesn't implement matchMedia — components using useMediaQuery need this mock.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// WHY: jsdom doesn't implement IntersectionObserver — scroll animations and lazy loading need this mock.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// WHY: jsdom doesn't implement HTMLCanvasElement.getContext — chart/canvas components trigger warnings without this stub.
const nullContext: typeof HTMLCanvasElement.prototype.getContext = () => null;
HTMLCanvasElement.prototype.getContext = nullContext;
