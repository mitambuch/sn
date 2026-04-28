// ═══════════════════════════════════════════════════
// Dashboard — Studio landing tool (first tool in the bar)
//
// WHAT: Auto-adapts to whichever document types are present in the
//       dataset. Shows : a hero welcome block, site state with colored
//       dots, content freshness tiles, page cards with completion
//       badges, colored quick-action tiles, recent activity, footer.
// WHEN: First tool → landing page when the Studio opens.
// NOTE: Introspection-driven — when a client adds a new document type
//       via a new schema file, it automatically shows in the sections.
//       No code change required here.
// ═══════════════════════════════════════════════════

import { useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';

import { PAGE_SINGLETONS } from '../structure/deskStructure';

/* ─── Theme tokens ──────────────────────────────── */

const C = {
  bg: 'transparent',
  surface: 'rgba(255, 255, 255, 0.04)',
  surfaceElevated: 'rgba(255, 255, 255, 0.06)',
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
  rose: '#fb7185',
};

/* ─── Types ─────────────────────────────────────── */

interface LocaleString {
  fr?: string;
  en?: string;
}

interface SiteConfigSnapshot {
  _updatedAt?: string;
  siteName?: LocaleString;
  tagline?: LocaleString;
  seoTitle?: LocaleString;
  primaryNav?: Array<unknown>;
  contactEmail?: string;
  copyright?: string;
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

interface PageSnapshot {
  _id: string;
  _updatedAt: string;
  title?: string;
  slug?: string;
  hasHero: boolean;
  hasSeo: boolean;
  hasCta: boolean;
  hasIntro: boolean;
}

interface Snapshot {
  siteConfig: SiteConfigSnapshot | null;
  typeCounts: TypeCount[];
  recent: RecentDoc[];
  pages: PageSnapshot[];
}

const SNAPSHOT_QUERY = `{
  "siteConfig": *[_type == "siteConfig"][0]{
    _updatedAt, siteName, tagline, seoTitle, primaryNav, contactEmail, copyright
  },
  "typeCounts": array::unique(*[!(_id in path("drafts.**"))]._type)[] {
    "type": @,
    "count": count(*[_type == ^ && !(_id in path("drafts.**"))])
  },
  "recent": *[!(_id in path("drafts.**"))] | order(_updatedAt desc)[0..4]{
    _id, _type, _updatedAt, title
  },
  "pages": *[_type == "page" && !(_id in path("drafts.**"))] | order(_id asc){
    _id, _updatedAt, "title": title, "slug": slug.current,
    "hasHero": defined(heroHeading.fr),
    "hasSeo": defined(seoTitle.fr) && defined(seoDescription.fr),
    "hasCta": defined(ctaLabel.fr) && defined(ctaHref),
    "hasIntro": defined(introHeading.fr) || count(introParagraphs[defined(fr)]) > 0
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

function brandName(): string {
  // process.env vars are inlined at Studio build time by the Sanity CLI.
  return (typeof process !== 'undefined' && process.env.SANITY_STUDIO_BRAND_NAME) || 'Studio';
}

/* ─── Shared card styles ────────────────────────── */

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

const baseButton: React.CSSProperties = {
  ...baseCard,
  textAlign: 'left',
  color: C.fg,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  width: '100%',
};

/* ─── Dashboard root ────────────────────────────── */

export function Dashboard() {
  const client = useClient({ apiVersion: '2024-06-01' });
  const router = useRouter();
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const openSiteConfig = () =>
    router.navigateIntent('edit', { id: 'siteConfig-singleton', type: 'siteConfig' });
  const openPage = (slug: string) =>
    router.navigateIntent('edit', { id: `page-${slug}`, type: 'page' });
  const openStructure = () => router.navigateUrl({ path: '/structure' });
  const openMedia = () => router.navigateUrl({ path: '/media' });

  /* ─── State checks with colored dots ─── */

  const stateItems = useMemo(() => {
    if (!data) return [];
    const sc = data.siteConfig;
    const items: Array<{
      status: 'ok' | 'partial' | 'empty' | 'missing';
      label: string;
      detail: string;
      onClick?: () => void;
    }> = [];

    // Site config
    if (!sc) {
      items.push({
        status: 'missing',
        label: 'Configuration globale',
        detail: "Le document n'existe pas encore — clique pour le créer.",
        onClick: openSiteConfig,
      });
    } else {
      const filled = [sc.siteName?.fr, sc.primaryNav?.length, sc.contactEmail].filter(
        Boolean,
      ).length;
      const total = 3;
      items.push({
        status: filled === total ? 'ok' : filled > 0 ? 'partial' : 'empty',
        label: 'Configuration globale',
        detail:
          filled === total
            ? `${sc.siteName?.fr ?? 'Site'} · menu · contact`
            : `${filled}/${total} champs clés renseignés`,
        onClick: openSiteConfig,
      });
    }

    // Pages
    const publishedCount = data.pages.length;
    if (publishedCount === 0) {
      items.push({
        status: 'missing',
        label: 'Pages principales',
        detail: 'Aucune page publiée — lance /wire-content pour démarrer.',
      });
    } else {
      const complete = data.pages.filter(p => p.hasHero && p.hasIntro).length;
      items.push({
        status: complete === publishedCount ? 'ok' : 'partial',
        label: 'Pages principales',
        detail: `${publishedCount} page(s) publiée(s), ${complete} avec hero + intro complets`,
      });
    }

    // Other document types (anything that's not page or siteConfig)
    const otherTypes = (data.typeCounts ?? []).filter(
      t =>
        t &&
        typeof t.type === 'string' &&
        !t.type.startsWith('system.') &&
        t.type !== 'page' &&
        t.type !== 'siteConfig' &&
        t.type !== 'media.tag',
    );
    if (otherTypes.length > 0) {
      const summary = otherTypes.map(t => `${t.count} ${t.type}`).join(' · ');
      items.push({
        status: 'ok',
        label: 'Collections',
        detail: summary,
      });
    }

    return items;
  }, [data]);

  /* ─── Render: loading / error ─── */

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

  const scTagline = data.siteConfig?.tagline?.fr;
  const scName = data.siteConfig?.siteName?.fr ?? brandName();
  const lastSiteConfigUpdate = data.siteConfig?._updatedAt;
  const lastPageUpdate = data.pages.reduce<string | undefined>((acc, p) => {
    if (!acc || (p._updatedAt && p._updatedAt > acc)) return p._updatedAt;
    return acc;
  }, undefined);
  const lastAnyUpdate = data.recent[0]?._updatedAt;

  /* ─── Main render ─── */

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
      {/* ─── Hero welcome ──────────────── */}
      <header
        style={{
          marginBottom: 40,
          padding: '28px 32px',
          borderRadius: 16,
          background: `linear-gradient(135deg, ${C.surfaceElevated} 0%, ${C.surface} 100%)`,
          border: `1px solid ${C.borderStrong}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.dim,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            marginBottom: 10,
          }}
        >
          {scName} — Studio
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
          Bienvenue <span aria-hidden="true">👋</span>
        </h1>
        {scTagline && (
          <p style={{ color: C.fg, marginTop: 10, fontSize: 16, fontWeight: 400 }}>{scTagline}</p>
        )}
        <p style={{ color: C.muted, marginTop: scTagline ? 6 : 10, fontSize: 14 }}>
          Voici l'état actuel du site et les actions rapides.
        </p>
      </header>

      {/* ─── État du site ──────────────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>État du site</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {stateItems.map((item, i) => (
            <StateRow key={i} item={item} />
          ))}
        </div>
      </section>

      {/* ─── Fraîcheur du contenu ──────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>Fraîcheur du contenu</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          <FreshnessTile
            emoji="📄"
            label="Pages du site"
            subtext={
              lastPageUpdate
                ? `Dernière modif ${relativeTime(lastPageUpdate)}`
                : 'Aucune modification'
            }
            onClick={openStructure}
          />
          <FreshnessTile
            emoji="📝"
            label="Dernière activité"
            subtext={lastAnyUpdate ? relativeTime(lastAnyUpdate) : 'Pas encore de document édité'}
          />
          <FreshnessTile
            emoji="⚙️"
            label="Configuration"
            subtext={
              lastSiteConfigUpdate
                ? `Modifiée ${relativeTime(lastSiteConfigUpdate)}`
                : 'Non configurée'
            }
            onClick={openSiteConfig}
          />
        </div>
      </section>

      {/* ─── Pages avec badges de complétude ─── */}
      {data.pages.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={sectionLabelStyle}>Pages ({data.pages.length})</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 12,
            }}
          >
            {data.pages.map(p => (
              <PageCard key={p._id} page={p} onClick={() => p.slug && openPage(p.slug)} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Actions rapides ────────────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>Actions rapides</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          <QuickAction
            accent={C.emerald}
            emoji="🏠"
            label="Modifier l'accueil"
            hint="Hero, intro, CTA"
            onClick={() => openPage('home')}
          />
          <QuickAction
            accent={C.amber}
            emoji="⚙️"
            label="Configuration globale"
            hint="Menu, contact, SEO default"
            onClick={openSiteConfig}
          />
          <QuickAction
            accent={C.violet}
            emoji="📄"
            label="Toutes les pages"
            hint={`${data.pages.length} page(s)`}
            onClick={openStructure}
          />
          <QuickAction
            accent={C.accent}
            emoji="🖼️"
            label="Médiathèque"
            hint="Images, logos, galeries"
            onClick={openMedia}
          />
        </div>
      </section>

      {/* ─── Activité récente ───────────── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabelStyle}>Activité récente</h2>
        {data.recent.length === 0 ? (
          <div style={{ ...baseCard, color: C.muted }}>Aucun document n'a encore été modifié.</div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            {data.recent.map(d => (
              <div
                key={d._id}
                style={{
                  ...baseCard,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeBadge type={d._type} />
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{resolveDocTitle(d)}</div>
                </div>
                <div style={{ color: C.muted, fontSize: 12 }}>{relativeTime(d._updatedAt)}</div>
              </div>
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
        N'oublie pas de cliquer <strong style={{ color: C.fg }}>Publier</strong> pour que tes
        modifications apparaissent sur le site en production. Besoin d'aide ? Va voir le{' '}
        <strong style={{ color: C.fg }}>📖 Guide</strong> en haut à droite.
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════ */

function StateRow({
  item,
}: {
  item: {
    status: 'ok' | 'partial' | 'empty' | 'missing';
    label: string;
    detail: string;
    onClick?: () => void;
  };
}) {
  const dotColor =
    item.status === 'ok'
      ? C.ok
      : item.status === 'partial'
        ? C.warn
        : item.status === 'missing'
          ? C.danger
          : C.dim;

  const Wrapper = item.onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={item.onClick ? 'button' : undefined}
      onClick={item.onClick}
      style={{
        ...(item.onClick ? baseButton : baseCard),
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: item.onClick ? 'pointer' : 'default',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: item.status === 'ok' ? `0 0 8px ${dotColor}66` : 'none',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</div>
        <div
          style={{
            color: C.muted,
            fontSize: 13,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.detail}
        </div>
      </div>
      {item.onClick && (
        <span aria-hidden="true" style={{ color: C.dim, fontSize: 18 }}>
          →
        </span>
      )}
    </Wrapper>
  );
}

function FreshnessTile({
  emoji,
  label,
  subtext,
  onClick,
}: {
  emoji: string;
  label: string;
  subtext: string;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        ...(onClick ? baseButton : baseCard),
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: 22, flexShrink: 0 }} aria-hidden="true">
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{subtext}</div>
      </div>
    </Wrapper>
  );
}

function PageCard({ page, onClick }: { page: PageSnapshot; onClick?: () => void }) {
  const label = page.title ?? page.slug ?? page._id;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...baseButton,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
        <div style={{ color: C.dim, fontSize: 12 }}>/{page.slug ?? '—'}</div>
      </div>
      <div style={{ color: C.muted, fontSize: 12 }}>{relativeTime(page._updatedAt)}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        <Badge ok={page.hasHero} label="HERO" />
        <Badge ok={page.hasIntro} label="INTRO" />
        <Badge ok={page.hasCta} label="CTA" />
        <Badge ok={page.hasSeo} label="SEO" />
      </div>
    </button>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  const color = ok ? C.ok : C.dim;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        background: ok ? `${C.ok}1a` : 'transparent',
        border: `1px solid ${ok ? `${C.ok}44` : C.border}`,
        color,
      }}
    >
      <span aria-hidden="true">{ok ? '✓' : '—'}</span> {label}
    </span>
  );
}

function QuickAction({
  accent,
  emoji,
  label,
  hint,
  onClick,
}: {
  accent: string;
  emoji: string;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...baseButton,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '20px 20px 18px',
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}12 0%, ${C.surface} 70%)`,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accent}22`,
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
          marginBottom: 4,
        }}
        aria-hidden="true"
      >
        {emoji}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
      <div style={{ color: C.muted, fontSize: 12 }}>{hint}</div>
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
