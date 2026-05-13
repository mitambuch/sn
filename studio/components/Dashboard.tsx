// ═══════════════════════════════════════════════════
// Dashboard — Studio landing tool, SAW NEXT brand voice
//
// WHAT: Action-first dashboard with the SAW↗NEXT typographic identity
//       baked in — Geist Mono monospaced uppercase tracking-wide labels,
//       strict monochrome palette (no chromatic accent — the brand rule),
//       generous whitespace, hairline borders. Tiles are equivalent in
//       weight ; only "Voir les demandes" pulses when count > 0.
//
//       Owner direction : "interface pue la race, donne du caractère
//       comme étoiles-aux-atomes" → discipline, austerity, no candy.
//
// WHEN: First Studio tool, opens on launch.
// COUNTS: pulled from Supabase via studio_dashboard_stats() RPC.
// ═══════════════════════════════════════════════════

import { useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';

/* ═══ Brand palette — strict monochrome, no chroma ═════════ */

const C = {
  // Surface ladder
  surface: 'rgba(255, 255, 255, 0.025)',
  surfaceHover: 'rgba(255, 255, 255, 0.05)',
  surfaceStrong: 'rgba(255, 255, 255, 0.07)',
  // Hairlines
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  borderPulse: 'rgba(255, 255, 255, 0.34)',
  // Text
  fg: '#F0F0F0',
  muted: 'rgba(240, 240, 240, 0.62)',
  dim: 'rgba(240, 240, 240, 0.36)',
  // Functional only (urgency) — the ONE deliberate exception to monochrome
  urgent: '#d65a3a',
};

const FONT_DISPLAY =
  '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const FONT_BODY = '"Geist Variable", "Inter", system-ui, -apple-system, sans-serif';

/* ─── Types ─────────────────────────────────────── */

interface LocaleString {
  fr?: string;
  en?: string;
}

interface TypeCount {
  type: string;
  count: number;
}

interface RecentDoc {
  _id: string;
  _type: string;
  _updatedAt: string;
  title?: string | LocaleString;
}

interface Snapshot {
  typeCounts: TypeCount[];
  recent: RecentDoc[];
}

interface DashboardStats {
  pending_inquiries: number;
  active_share_codes: number;
  total_clients: number;
}

const EXCLUDE = `!(_id in path("drafts.**")) && !(_type match "system.*") && !(_id match "_*") && _type != "media.tag"`;

const SNAPSHOT_QUERY = `{
  "typeCounts": array::unique(*[${EXCLUDE}]._type)[] {
    "type": @,
    "count": count(*[_type == ^ && ${EXCLUDE}])
  },
  "recent": *[${EXCLUDE}] | order(_updatedAt desc)[0..4]{
    _id, _type, _updatedAt, title
  }
}`;

/* ─── Helpers ───────────────────────────────────── */

function relativeTime(iso?: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} j`;
  if (days < 30) return `${Math.floor(days / 7)} sem`;
  return `${Math.floor(days / 30)} mois`;
}

function resolveDocTitle(doc: RecentDoc): string {
  if (typeof doc.title === 'string') return doc.title;
  if (doc.title && typeof doc.title === 'object') return doc.title.fr ?? doc._type;
  return doc._id;
}

function envValue(name: string, fallback = ''): string {
  return (typeof process !== 'undefined' && process.env[name]) || fallback;
}

async function fetchStats(): Promise<DashboardStats | null> {
  const url = envValue('SANITY_STUDIO_SUPABASE_URL');
  const key = envValue('SANITY_STUDIO_SUPABASE_ANON_KEY');
  if (!url || !key || key.includes('REMPLACE')) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/studio_dashboard_stats`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: '{}',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as DashboardStats[] | DashboardStats;
    if (Array.isArray(data)) return data[0] ?? null;
    return data;
  } catch {
    return null;
  }
}

/* ─── Brand atoms ────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_DISPLAY,
  fontSize: 10,
  fontWeight: 500,
  color: C.dim,
  textTransform: 'uppercase',
  letterSpacing: '0.36em',
};

const tileSurface: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  transition: 'background 240ms ease, border-color 240ms ease, transform 240ms ease',
};

const DOMAIN_TYPES_ORDERED = [
  { type: 'event', label: 'Évènement' },
  { type: 'property', label: 'Propriété' },
  { type: 'timepiece', label: 'Garde-temps' },
  { type: 'artwork', label: 'Œuvre' },
  { type: 'journey', label: 'Voyage' },
  { type: 'conciergeService', label: 'Service' },
  { type: 'article', label: 'Actualité' },
  { type: 'teamMember', label: 'Membre' },
];

/* ─── Dashboard root ────────────────────────────── */

// eslint-disable-next-line max-lines-per-function -- single-screen brand dashboard, splitting hurts the typographic discipline
export function Dashboard() {
  const client = useClient({ apiVersion: '2024-06-01' });
  const router = useRouter();
  const [data, setData] = useState<Snapshot | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    client
      .fetch<Snapshot>(SNAPSHOT_QUERY)
      .then(d => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue.');
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  useEffect(() => {
    let cancelled = false;
    void fetchStats().then(s => {
      if (!cancelled) setStats(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = (type: string) => {
    setCreateOpen(false);
    router.navigateIntent('create', { type });
  };

  const otherTypes = useMemo(() => {
    if (!data) return [];
    return (data.typeCounts ?? []).filter(
      t =>
        t &&
        typeof t.type === 'string' &&
        !t.type.startsWith('system.') &&
        !t.type.startsWith('sanity.') &&
        t.type !== 'page' &&
        t.type !== 'siteConfig' &&
        t.type !== 'media.tag',
    );
  }, [data]);

  if (error) {
    return (
      <div style={{ padding: 48, color: C.urgent, fontFamily: FONT_BODY }}>
        <strong>Erreur de chargement :</strong> {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 48, color: C.muted, fontFamily: FONT_BODY, fontSize: 13 }}>
        Chargement…
      </div>
    );
  }

  const pendingInquiries = stats?.pending_inquiries ?? null;
  const activeShareCodes = stats?.active_share_codes ?? null;
  const totalClients = stats?.total_clients ?? null;
  const site = envValue(
    'SANITY_STUDIO_PREVIEW_URL',
    envValue('SANITY_STUDIO_SITE_URL', 'http://localhost:5173'),
  );

  return (
    <div
      style={{
        padding: '56px 56px 80px',
        fontFamily: FONT_BODY,
        color: C.fg,
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {/* ─── Brand strip ─── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 56,
          paddingBottom: 20,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div>
          <div style={{ ...labelStyle, marginBottom: 8 }}>SAW↗NEXT — Studio</div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            Atelier
          </div>
        </div>
        <div style={{ ...labelStyle, fontSize: 9 }}>
          {new Date().toLocaleDateString('fr-CH', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </header>

      {/* ─── Actions ─── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ ...labelStyle, marginBottom: 16 }}>Actions</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 14,
          }}
        >
          <ActionTile
            label="Créer une offre"
            hint="Évènement · propriété · garde-temps · …"
            indicator={createOpen ? 'CHOISIS UN TYPE' : '⊕'}
            onClick={() => setCreateOpen(o => !o)}
          />
          <ActionTile
            label="Créer une clé"
            hint="Code à 6 caractères pour partager une fiche"
            indicator={activeShareCodes !== null ? `${String(activeShareCodes)} actives` : '—'}
            onClick={() => window.open(`${site}/fr/admin/share-codes`, '_blank')}
          />
          <ActionTile
            label="Voir les demandes"
            hint="Inquiries clients en attente"
            indicator={
              pendingInquiries !== null
                ? pendingInquiries > 0
                  ? `${String(pendingInquiries)} en cours`
                  : 'Aucune'
                : '—'
            }
            urgent={Boolean(pendingInquiries && pendingInquiries > 0)}
            onClick={() => window.open(`${site}/fr/admin/inquiries`, '_blank')}
          />
          <ActionTile
            label="Gérer les clients"
            hint="Profils, rôles, accès au cercle"
            indicator={totalClients !== null ? `${String(totalClients)} inscrits` : '—'}
            onClick={() => window.open(`${site}/fr/admin/users`, '_blank')}
          />
        </div>

        {createOpen && (
          <div
            style={{
              marginTop: 12,
              padding: '18px 20px',
              background: C.surface,
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 14,
            }}
          >
            <div style={{ ...labelStyle, marginBottom: 14 }}>Type de fiche</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 8,
              }}
            >
              {DOMAIN_TYPES_ORDERED.map(t => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => {
                    openCreate(t.type);
                  }}
                  style={{
                    ...tileSurface,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    color: C.fg,
                    cursor: 'pointer',
                    fontFamily: FONT_DISPLAY,
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    padding: '14px 16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = C.surfaceHover;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = C.surface;
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── Inventaire ─── */}
      {otherTypes.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ ...labelStyle, marginBottom: 16 }}>Inventaire</h2>
          <div
            style={{
              ...tileSurface,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 28,
              padding: '20px 24px',
            }}
          >
            {otherTypes.map(t => (
              <button
                key={t.type}
                type="button"
                onClick={() => router.navigateUrl({ path: `/structure/collection-${t.type}` })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 10,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.fg,
                  fontFamily: FONT_DISPLAY,
                  padding: 0,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0', color: C.fg }}>
                  {t.count}
                </span>
                <span style={{ fontSize: 10, color: C.muted }}>{t.type}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ─── Activité ─── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ ...labelStyle, marginBottom: 16 }}>Activité</h2>
        {data.recent.length === 0 ? (
          <div
            style={{
              ...tileSurface,
              padding: '20px 24px',
              color: C.muted,
              fontFamily: FONT_DISPLAY,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Aucun document modifié pour le moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 4 }}>
            {data.recent.map(d => (
              <button
                key={d._id}
                type="button"
                onClick={() => router.navigateIntent('edit', { id: d._id, type: d._type })}
                style={{
                  ...tileSurface,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 22px',
                  cursor: 'pointer',
                  color: C.fg,
                  fontFamily: FONT_BODY,
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.surfaceHover;
                  e.currentTarget.style.borderColor = C.borderStrong;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = C.surface;
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span
                    style={{
                      ...labelStyle,
                      fontSize: 9,
                      minWidth: 96,
                      letterSpacing: '0.24em',
                    }}
                  >
                    {d._type}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{resolveDocTitle(d)}</span>
                </div>
                <span style={{ ...labelStyle, fontSize: 10 }}>{relativeTime(d._updatedAt)}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ─── Footer ─── */}
      <footer
        style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          color: C.muted,
          fontFamily: FONT_DISPLAY,
          fontSize: 10,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          lineHeight: 1.8,
        }}
      >
        Cliquer <span style={{ color: C.fg }}>Publier</span> pour rendre la modification visible sur
        le site · Guide en haut à droite
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ActionTile — equivalent typographic tiles, no chroma
   ═══════════════════════════════════════════════════ */

function ActionTile({
  label,
  hint,
  indicator,
  urgent,
  onClick,
}: {
  label: string;
  hint: string;
  indicator?: string;
  urgent?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...tileSurface,
        textAlign: 'left',
        color: C.fg,
        cursor: 'pointer',
        fontFamily: FONT_BODY,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '24px 24px 22px',
        borderColor: urgent ? C.urgent : C.border,
        background: urgent ? `rgba(214, 90, 58, 0.06)` : C.surface,
        animation: urgent ? 'sn-tile-pulse 2.6s ease-in-out infinite' : undefined,
      }}
      onMouseEnter={e => {
        if (!urgent) {
          e.currentTarget.style.background = C.surfaceHover;
          e.currentTarget.style.borderColor = C.borderStrong;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        if (!urgent) {
          e.currentTarget.style.background = C.surface;
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ ...labelStyle, fontSize: 9 }}>{label}</span>
        {indicator && (
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: urgent ? C.urgent : C.muted,
              padding: '3px 9px',
              border: `1px solid ${urgent ? C.urgent : C.border}`,
              borderRadius: 999,
            }}
          >
            {indicator}
          </span>
        )}
      </div>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 19,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          color: C.fg,
          lineHeight: 1.15,
        }}
      >
        {label.replace(/^(Créer|Voir|Gérer)/, '$1 ')}
      </div>

      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: C.muted,
          lineHeight: 1.5,
        }}
      >
        {hint}
      </div>

      {/* Inline keyframes for the urgent pulse */}
      {urgent && (
        <style>{`
          @keyframes sn-tile-pulse {
            0%, 100% { border-color: ${C.urgent}; box-shadow: 0 0 0 0 rgba(214, 90, 58, 0); }
            50%     { border-color: ${C.urgent}; box-shadow: 0 0 0 4px rgba(214, 90, 58, 0.08); }
          }
        `}</style>
      )}
    </button>
  );
}
