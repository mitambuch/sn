// ═══════════════════════════════════════════════════════════════
// catalogue — server-side Sanity read gate (audience enforcement)
//
// WHY: with a PRIVATE Sanity dataset, the browser can no longer read fiche
// content directly. Every read goes through this function, which holds the
// Sanity read token (Netlify env) and — for member catalogue reads — returns
// only the fiches the caller is allowed to see per the audience rules
// (Supabase fiche_audience, migration 0018). This is the REAL barrier; the
// client-side memberCanSeeFiche is a preview helper only.
//
// ACTIONS (POST JSON { action, ... }):
//   public  : landing | siteConfig | team            (no auth)
//   member  : list { module } | item { module, slug } (Bearer JWT, filtered)
//   admin   : adminList                               (Bearer JWT, role=admin)
//   share   : shared { code }                         (validated via peek RPC)
//
// ENV (Netlify): SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION,
//   SANITY_READ_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// Typed/checked via tsconfig.functions.json (`pnpm typecheck:functions`).
// Not part of the browser bundle; uses web-standard Request/Response.
// ═══════════════════════════════════════════════════════════════

import { createClient as createSanity } from '@sanity/client';
import { createClient as createSupabase } from '@supabase/supabase-js';

import {
  CATALOGUE_MODULE_QUERIES,
  type CatalogueModuleKey,
  GROQ_ADMIN_CATALOGUE,
  GROQ_LANDING,
  GROQ_SHARED_FICHE,
  GROQ_SHARED_FICHES,
  GROQ_SITE_CONFIG,
  GROQ_TEAM,
} from '../../src/lib/sanityQueries.ts';
import { memberCanSeeFiche } from '../../src/types/segment.ts';

// Minimal ambient for Node's process.env — avoids pulling @types/node just
// to typecheck one env accessor (the runtime provides process on Netlify).
declare const process: { env: Record<string, string | undefined> };

// ── env ──────────────────────────────────────────────────────────
const env = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`[catalogue] missing env ${k}`);
  return v;
};

const sanity = createSanity({
  projectId: env('SANITY_PROJECT_ID'),
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-06-01',
  token: env('SANITY_READ_TOKEN'),
  // Private dataset → no CDN (CDN is for public, cacheable reads).
  useCdn: false,
  perspective: 'published',
});

const admin = createSupabase(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── helpers ──────────────────────────────────────────────────────
type Locale = 'fr' | 'en';

const json = (status: number, data: unknown): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

interface AudienceRow {
  sanity_doc_id: string;
  audience_mode: 'all' | 'segments';
  segments: string[];
  excluded_member_ids: string[];
}

interface Caller {
  id: string;
  segments: string[];
  isAdmin: boolean;
  /** Diagnostic only — the role the gate read (or null if no profile). */
  role: string | null;
}

/** Identity + segments of the bearer, or null when the token is invalid. */
async function resolveCaller(req: Request): Promise<Caller | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    console.error('[catalogue] resolveCaller: no bearer token');
    return null;
  }
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    console.error('[catalogue] resolveCaller: getUser failed', error?.message);
    return null;
  }
  const { data: profile, error: pErr } = await admin
    .from('profiles')
    .select('role, segments')
    .eq('id', data.user.id)
    .single();
  if (pErr) {
    // RLS/key problem most likely: the service key must bypass RLS to read
    // this row. Surfaced so the 403 reason is unambiguous.
    console.error('[catalogue] resolveCaller: profile read failed', pErr.message, pErr.code);
  }
  return {
    id: data.user.id,
    segments: (profile?.segments as string[] | null) ?? [],
    isAdmin: profile?.role === 'admin',
    role: (profile?.role as string | null) ?? null,
  };
}

/** Map of sanity_doc_id → audience rule. Fiches with no row default to all. */
async function loadAudienceMap(): Promise<Map<string, AudienceRow>> {
  const { data } = await admin
    .from('fiche_audience')
    .select('sanity_doc_id, audience_mode, segments, excluded_member_ids');
  const map = new Map<string, AudienceRow>();
  for (const r of (data ?? []) as AudienceRow[]) map.set(r.sanity_doc_id, r);
  return map;
}

function canSee(
  ficheId: string,
  caller: { id: string; segments: string[]; isAdmin: boolean },
  audience: Map<string, AudienceRow>,
): boolean {
  if (caller.isAdmin) return true; // operators see everything
  const rule = audience.get(ficheId);
  if (!rule) return true; // no rule → visible to all members
  return memberCanSeeFiche(caller.id, caller.segments, {
    mode: rule.audience_mode,
    segments: rule.segments,
    excludedMemberIds: rule.excluded_member_ids,
  });
}

function isModuleKey(v: unknown): v is CatalogueModuleKey {
  return typeof v === 'string' && v in CATALOGUE_MODULE_QUERIES;
}

// The detail/shared GROQ builders interpolate slug/id into the query string.
// On this privileged (read-token) path that is a GROQ-injection surface: a
// crafted slug like `x" || _type=="event" && "` could break out of the
// audience-filtered query. Slugs are kebab-case and Sanity doc ids are a
// known charset — anything outside these is rejected before it reaches GROQ.
const SLUG_RE = /^[a-z0-9-]{1,128}$/;
const DOC_ID_RE = /^[a-zA-Z0-9._-]{1,128}$/;

// ── share helpers ────────────────────────────────────────────────
interface PeekRow {
  sanity_doc_type: string | null;
  sanity_doc_id: string | null;
  sanity_docs: { type?: string; id?: string }[] | null;
  is_valid: boolean;
}

function shareDocIds(row: PeekRow): { type: string; id: string }[] {
  const multi = Array.isArray(row.sanity_docs) ? row.sanity_docs : [];
  const fromMulti = multi
    .filter((d): d is { type: string; id: string } => Boolean(d?.type) && Boolean(d?.id))
    .map(d => ({ type: d.type, id: d.id }));
  if (fromMulti.length > 0) return fromMulti;
  if (row.sanity_doc_type && row.sanity_doc_id) {
    return [{ type: row.sanity_doc_type, id: row.sanity_doc_id }];
  }
  return [];
}

// ── handler ──────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method-not-allowed' });

  let body: { action?: string; module?: string; slug?: string; code?: string; locale?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json(400, { error: 'bad-json' });
  }

  const locale: Locale = body.locale === 'en' ? 'en' : 'fr';
  const action = body.action;

  try {
    // ── public marketing reads (no auth) ──────────────────────────
    if (action === 'landing') return json(200, { data: await sanity.fetch(GROQ_LANDING) });
    if (action === 'siteConfig') return json(200, { data: await sanity.fetch(GROQ_SITE_CONFIG) });
    if (action === 'team') return json(200, { data: await sanity.fetch(GROQ_TEAM) });

    // ── share (validated by code possession) ──────────────────────
    if (action === 'shared') {
      const code = (body.code ?? '').trim();
      if (!code) return json(400, { error: 'missing-code' });
      const { data: rows } = await admin.rpc('peek_share_code', { p_code: code });
      const row = (rows as PeekRow[] | null)?.[0];
      if (!row || !row.is_valid) return json(404, { error: 'invalid-code' });
      // type + id come from the DB (admin-set at code creation), but the GROQ
      // builders interpolate them — validate defensively before they hit GROQ.
      const docs = shareDocIds(row).filter(
        d => isModuleKey(d.type) && DOC_ID_RE.test(d.id),
      );
      if (docs.length === 0) return json(404, { error: 'no-docs' });
      if (docs.length === 1) {
        const d = docs[0]!;
        const single = await sanity.fetch(GROQ_SHARED_FICHE(d.type, d.id), { locale });
        return json(200, { docs, single, collection: null });
      }
      const ids = docs.map(d => d.id);
      const collection = await sanity.fetch(GROQ_SHARED_FICHES(ids), { locale });
      return json(200, { docs, single: null, collection });
    }

    // ── everything below needs a valid member ─────────────────────
    const caller = await resolveCaller(req);
    if (!caller) return json(401, { error: 'unauthorized', reason: 'no-valid-session' });

    if (action === 'adminList') {
      // role in the body is a diagnostic: null = profile unreadable (key/RLS),
      // 'client' = not an operator, 'admin' = should have passed.
      if (!caller.isAdmin) return json(403, { error: 'forbidden', role: caller.role });
      return json(200, { data: await sanity.fetch(GROQ_ADMIN_CATALOGUE) });
    }

    if (action === 'list') {
      if (!isModuleKey(body.module)) return json(400, { error: 'bad-module' });
      const rows = (await sanity.fetch(CATALOGUE_MODULE_QUERIES[body.module].list, {
        locale,
      })) as { id: string }[];
      const audience = await loadAudienceMap();
      const visible = (rows ?? []).filter(r => canSee(r.id, caller, audience));
      return json(200, { data: visible });
    }

    if (action === 'item') {
      if (!isModuleKey(body.module)) return json(400, { error: 'bad-module' });
      const slug = (body.slug ?? '').trim();
      if (!slug) return json(400, { error: 'missing-slug' });
      // Reject anything that isn't a clean slug → blocks GROQ injection.
      // 404 (not 400) so a probe can't distinguish "bad slug" from "absent".
      if (!SLUG_RE.test(slug)) return json(404, { error: 'not-found' });
      const row = (await sanity.fetch(CATALOGUE_MODULE_QUERIES[body.module].detail(slug), {
        locale,
      })) as { id: string } | null;
      if (!row) return json(404, { error: 'not-found' });
      const audience = await loadAudienceMap();
      // 404 (not 403) when forbidden: never reveal that a hidden fiche exists.
      if (!canSee(row.id, caller, audience)) return json(404, { error: 'not-found' });
      return json(200, { data: row });
    }

    return json(400, { error: 'unknown-action' });
  } catch (err) {
    console.error('[catalogue] error', err);
    return json(500, { error: 'server-error' });
  }
}
