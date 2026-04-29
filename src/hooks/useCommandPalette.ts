// ═══════════════════════════════════════════════════
// useCommandPalette — global Cmd+K / Ctrl+K toggle
//
// WHAT: Tracks the open state for the CommandPalette and listens
//       globally for Cmd+K / Ctrl+K to toggle. Returns { open,
//       setOpen } so a single layout-level instance owns the modal
//       and a header trigger button can also drive it.
// WHEN: Mount once in AppLayout, render <CommandPalette open={open}
//       onClose={() => setOpen(false)} />.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isShortcut) {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return { open, setOpen };
};
