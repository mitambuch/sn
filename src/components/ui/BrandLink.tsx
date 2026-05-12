// ═══════════════════════════════════════════════════
// BrandLink — Link with native View Transitions API wrap
//
// WHAT: Drop-in replacement for react-router-dom <Link> that wraps the
//       navigation in document.startViewTransition() when supported,
//       giving a luxe crossfade between routes. Falls back to standard
//       Link behavior when the browser doesn't support the API
//       (Firefox, Safari < 18).
// WHY: Project uses the legacy <BrowserRouter> (not the data router),
//       so React Router's built-in viewTransition prop is silently
//       ignored. Manual interceptor restores the effect.
// WHEN: Use anywhere an internal route link should crossfade —
//       especially card → detail navigation and primary CTAs.
// ═══════════════════════════════════════════════════

import { type MouseEvent } from 'react';
import { Link as RouterLink, type LinkProps, useNavigate } from 'react-router-dom';

type BrandLinkProps = LinkProps;

const supportsViewTransitions = () =>
  typeof document !== 'undefined' && 'startViewTransition' in document;

export const BrandLink = ({ to, onClick, children, ...rest }: BrandLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let modifier-clicks / middle-click / new-tab proceed natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === '_blank') return;
    if (typeof to !== 'string') return;
    if (!supportsViewTransitions()) return;

    e.preventDefault();
    // Cast: View Transitions API is supported (checked above) but TS lib
    // may not include it in default DOM types. void the returned promise
    // (fire-and-forget — we don't await the transition completion).
    const doc = document as Document & {
      startViewTransition: (cb: () => void) => unknown;
    };
    void doc.startViewTransition(() => {
      void navigate(to);
    });
  };

  return (
    <RouterLink to={to} onClick={handleClick} {...rest}>
      {children}
    </RouterLink>
  );
};
