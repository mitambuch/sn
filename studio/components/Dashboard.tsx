// ═══════════════════════════════════════════════════
// Dashboard — Studio landing tool, action-first layout
//
// WHAT: Salva opens Studio and immediately sees 4 big action tiles —
//       Créer une offre · Créer une clé · Voir les demandes (with a
//       live pending count badge) · Gérer les clients. Below that, a
//       compact "État du site" strip + recent activity. No "Bienvenue
//       👋" hero — owner direction : "on rentre dans le dur."
//
// WHEN: First Studio tool, opens on launch.
// COUNTS: pulled from Supabase via the studio_dashboard_stats() RPC
//         (migration 0007). Falls back to "—" when env vars missing.
// ═══════════════════════════════════════════════════

import { useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';

/* ─── Theme tokens ──────────────────────────────── */

const C = {
  surface: 'rgba(255, 255, 255, 0.04)',
  surfaceHover: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.09)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  fg: 'var(--card-fg-color, #F0FFFF)',
  muted: 'rgba(240, 240, 240, 0.55)',
  dim: 'rgba(240, 240, 240, 0.38)',
  ok: '#4ade80',
  warn: '#facc15',
  danger: '#f87171',
  accent: '#60a5fa',
  violet: '#a78bfa',
  emerald: '#34d399',
  amber: '#fbbf24',
};

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

const SNAPSHOT_QUERY = `{
  "typeCounts": array::unique(*[!(_id in path("drafts.**"))]._type)[] {
    "type": @,
    "count": count(*[_type == ^ && !(_id in path("drafts.**"))])
  },
  "recent": *[!(_id in path("drafts.**"))] | order(_updatedAt desc)[0..4]{
    _id, _type, _updatedAt, title
  }
}`;

/* ─── Helpers ───────────────────────────────────── */

function relativeTime(iso?: string): string {
  if (!iso) return 'jamais';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

function resolveDocTitle(doc: RecentDoc): string {
  if (typeof doc.title === 'string') return doc.title;
  if (doc.title && typeof doc.title === 'object') return doc.title.fr ?? doc._type;
  return doc._id;
}

function siteUrl(): string {
  return (
    (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_URL) ||
    (typeof process !== 'undefined' && process.env.SANITY_STUDIO_SITE_URL) ||
    'http://localhost:5173'
  );
}

function supabaseUrl(): string {
  return (typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_URL) || '';
}

function supabaseKey(): string {
  return (typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_ANON_KEY) || '';
}

async function fetchStats(): Promise<DashboardStats | null> {
  const url = supabaseUrl();
  const key = supabaseKey();
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

/* ─── Shared styles ──────────────────────────────── */

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: C.dim,
  marginBottom: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const baseCard: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: '16px 18px',
  transition: 'background 120ms ease, border-color 120ms ease, transform 120ms ease',
};

/* ─── Dashboard root ────────────────────────────── */

const DOMAIN_TYPES_ORDERED = [
  { type: 'event', label: 'Évènement', emoji: '📅' },
  { type: 'property', label: 'Propriété', emoji: '🏛️' },
  { type: 'timepiece', label: 'Garde-temps', emoji: '⌚' },
  { type: 'artwork', label: 'Œuvre', emoji: '🖼️' },
  { type: 'journey', label: 'Voyage', emoji: '🌍' },
  { type: 'conciergeService', label: 'Service', emoji: '🛎️' },
  { type: 'article', label: 'Actualité', emoji: '📰' },
  { type: 'teamMember', label: 'Membre', emoji: '👤' },
];

// eslint-disable-next-line max-lines-per-function -- action-first dashboard with 4 tiles + state + activity, splitting hurts readability
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
        t.type !== 'page' &&
        t.type !== 'siteConfig' &&
        t.type !== 'media.tag',
    );
  }, [data]);

  if (error) {
    return (
      <div style={{ padding: 32, color: C.danger, fontFamily: 'system-ui' }}>
        <strong>Erreur de chargement :</strong> {error}
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 32, color: C.muted, fontFamily: 'system-ui' }}>Chargement…</div>;
  }

  const pendingInquiries = stats?.pending_inquiries ?? null;
  const activeShareCodes = stats?.active_share_codes ?? null;
  const totalClients = stats?.total_clients ?? null;
  const site = siteUrl();

  return (
    <div
      style={{
        padding: '40px 48px 64px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: C.fg,
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {/* ─── Actions principales ────────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>Actions</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          <ActionTile
            accent={C.emerald}
            emoji="✚"
            label="Créer une offre"
            hint="Évènement, propriété, garde-temps…"
            onClick={() => setCreateOpen(o => !o)}
            badge={createOpen ? 'Choisis un type' : undefined}
          />
          <ActionTile
            accent={C.amber}
            emoji="🔑"
            label="Créer une clé"
            hint="Code à 6 caractères pour partager une fiche"
            onClick={() => window.open(`${site}/fr/admin/share-codes`, '_blank')}
            badge={activeShareCodes !== null ? `${String(activeShareCodes)} actives` : undefined}
          />
          <ActionTile
            accent={pendingInquiries && pendingInquiries > 0 ? C.danger : C.accent}
            emoji="📨"
            label="Voir les demandes"
            hint="Inquiries clients en attente"
            onClick={() => window.open(`${site}/fr/admin/inquiries`, '_blank')}
            badge={
              pendingInquiries !== null
                ? pendingInquiries > 0
                  ? `${String(pendingInquiries)} en cours`
                  : 'Aucune'
                : undefined
            }
            pulse={Boolean(pendingInquiries && pendingInquiries > 0)}
          />
          <ActionTile
            accent={C.violet}
            emoji="👥"
            label="Gérer les clients"
            hint="Profils, rôles, accès"
            onClick={() => window.open(`${site}/fr/admin/users`, '_blank')}
            badge={totalClients !== null ? `${String(totalClients)} inscrits` : undefined}
          />
        </div>

        {/* Inline chooser for "Créer une offre" */}
        {createOpen && (
          <div
            style={{
              marginTop: 12,
              padding: 16,
              background: C.surface,
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 12,
            }}
          >
            <div style={{ ...sectionLabelStyle, marginBottom: 10 }}>Type de fiche</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
                    ...baseCard,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    color: C.fg,
                    fontFamily: 'inherit',
                    fontSize: 13,
                    textAlign: 'left',
                    padding: '10px 14px',
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 18 }}>
                    {t.emoji}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── État du site (compact) ─────── */}
      {otherTypes.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={sectionLabelStyle}>État du contenu</h2>
          <div
            style={{
              ...baseCard,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              padding: '14px 20px',
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
                  gap: 6,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.fg,
                  fontFamily: 'inherit',
                  fontSize: 13,
                  padding: 0,
                }}
              >
                <span style={{ fontWeight: 600 }}>{t.count}</span>
                <span style={{ color: C.muted }}>{t.type}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ─── Activité récente ───────────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>Activité récente</h2>
        {data.recent.length === 0 ? (
          <div style={{ ...baseCard, color: C.muted }}>
            Aucun document n&apos;a encore été modifié.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            {data.recent.map(d => (
              <button
                key={d._id}
                type="button"
                onClick={() => router.navigateIntent('edit', { id: d._id, type: d._type })}
                style={{
                  ...baseCard,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  cursor: 'pointer',
                  color: C.fg,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeBadge type={d._type} />
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{resolveDocTitle(d)}</div>
                </div>
                <div style={{ color: C.muted, fontSize: 12 }}>{relativeTime(d._updatedAt)}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ─── Footer ─────────────────────── */}
      <footer
        style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: `1px solid ${C.border}`,
          color: C.muted,
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        N&apos;oublie pas de cliquer <strong style={{ color: C.fg }}>Publier</strong> pour que tes
        modifications apparaissent sur le site. Besoin d&apos;aide ?{' '}
        <strong style={{ color: C.fg }}>📖 Guide</strong> en haut à droite.
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════ */

function ActionTile({
  accent,
  emoji,
  label,
  hint,
  badge,
  pulse,
  onClick,
}: {
  accent: string;
  emoji: string;
  label: string;
  hint: string;
  badge?: string;
  pulse?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...baseCard,
        textAlign: 'left',
        color: C.fg,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '20px 22px 18px',
        borderColor: `${accent}55`,
        background: `linear-gradient(135deg, ${accent}18 0%, ${C.surface} 70%)`,
        position: 'relative',
        outline: pulse ? `1px solid ${accent}` : undefined,
        outlineOffset: pulse ? 2 : undefined,
        animation: pulse ? 'sn-pulse 2.6s ease-in-out infinite' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${accent}33`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 20,
          }}
          aria-hidden="true"
        >
          {emoji}
        </div>
        {badge && (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
              color: accent,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{label}</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.4 }}>{hint}</div>

      {/* Inline keyframes for the pulse (no global CSS modification) */}
      {pulse && (
        <style>{`
          @keyframes sn-pulse {
            0%, 100% { outline-color: ${accent}33; }
            50%     { outline-color: ${accent}; }
          }
        `}</style>
      )}
    </button>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        background: C.surface,
        border: `1px solid ${C.border}`,
        color: C.muted,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {type}
    </span>
  );
}
