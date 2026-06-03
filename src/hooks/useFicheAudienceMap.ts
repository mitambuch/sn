// ═══════════════════════════════════════════════════
// useFicheAudienceMap — all per-fiche audience rules, keyed by doc id
//
// WHAT: loads every fiche_audience row (migration 0018) once and exposes a
//       Map<sanity_doc_id, FicheAudience> + a reload() to refresh after an
//       edit. Used by the admin catalogue to badge each card Tous/Restreint.
// WHEN: /admin/catalogue. Admin-only (RLS gates the table).
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';

import { listFicheAudiences } from '@/lib/segments';
import type { FicheAudience } from '@/types/segment';

export function useFicheAudienceMap(): {
  map: Map<string, FicheAudience>;
  reload: () => void;
} {
  const [map, setMap] = useState<Map<string, FicheAudience>>(new Map());

  const reload = useCallback(() => {
    void listFicheAudiences()
      .then(list => {
        setMap(new Map(list.map(a => [a.sanityDocId, a])));
      })
      .catch(() => {
        // Non-fatal: cards fall back to the neutral "Audience" label.
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { map, reload };
}
