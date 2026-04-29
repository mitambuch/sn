// ═══════════════════════════════════════════════════
// useFakeLoading — simulated initial-load delay for skeleton states
//
// WHAT: Returns true for `ms` milliseconds after mount, then false.
// WHEN: Use on pages or sections where lot B mocks resolve synchronously
//       but we want to demo the production skeleton state. Drop the hook
//       in lot C once Supabase queries provide real loading.
// USAGE: const loading = useFakeLoading(450);  // ~half-second flicker
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

export const useFakeLoading = (ms = 400): boolean => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return loading;
};
