// ═══════════════════════════════════════════════════
// useCyclingWord — typographic cycling hero word
//
// WHAT: Returns one word from a list, cycling to the next every `intervalMs`.
//       Used in the landing hero — one word in the headline mutates while
//       the rest stays still ("voix [basse|tenue|feutrée|retenue]").
// WHEN: Anywhere a single text token should rotate on a fixed cadence
//       without re-rendering surrounding copy.
// CHANGE CADENCE: pass `intervalMs` (default 4000ms — 4s per word).
// RULE: respects prefers-reduced-motion (returns first word, no rotation).
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

export function useCyclingWord(words: readonly string[], intervalMs: number = 4000): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (words.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % words.length);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [words.length, intervalMs]);

  return words[index] ?? words[0] ?? '';
}
