// ═══════════════════════════════════════════════════
// useBodyScrollLock — prevents background scroll while an overlay is open
//
// WHAT: When `locked` is true, disables scrolling on <body>.
// WHEN: Use in fullscreen menus, modals, drawers.
// NOTE: Uses a reference count so multiple overlays don't fight.
// ═══════════════════════════════════════════════════

import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow: string | null = null;

/** Lock body scroll while any caller holds `locked === true`. Ref-counted
 *  so multiple concurrent overlays don't leak the state. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && originalOverflow !== null) {
        document.body.style.overflow = originalOverflow;
        originalOverflow = null;
      }
    };
  }, [locked]);
}
