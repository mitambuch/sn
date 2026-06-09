// ═══════════════════════════════════════════════════════════════
// catalogue — server-side Sanity read gate (audience enforcement)
//
// WHY: with a PRIVATE Sanity dataset, the browser can no longer read fiche
// content directly. Every read goes through this function, which holds the
// Sanity read token (Netlify env) and — for member catalogue reads — returns
// only the fiches the caller is allowed to see.
//
// AUTH MODEL (no service key): the function reads Supabase AS THE CALLER,
// using the member's own JWT (forwarded as the Authorization header) + the
// public anon key. Audience filtering is done by the SECURITY DEFINER RPC
// gate_hidden_doc_ids() (migration 0026), which returns the doc ids the
// caller may NOT see. This removes the fragile service_role key entirely.
//
// ACTIONS (POST JSON { action, ... }):
//   public  : landing | siteConfig | team            (no auth)
//   member  : list { module } | item { module, slug } (Bearer JWT, filtered)
//   admin   : adminList                               (Bearer JWT, role=admin)
//   share   : shared { code }                         (validated via peek RPC)
//
// ENV (Netlify): SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION,
//   SANITY_READ_TOKEN, SUPABASE_URL (or VITE_SUPABASE_URL),
//   SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY). No service_role key.
//
// Typed/checked via tsconfig.functions.json (`pnpm typecheck:functions`).
// Not part of the browser bundle; uses web-standard Request/Response.
// ═══════════════════════════════════════════════════════════════

import { createClient as createSanity } from '@sanity/client';
import { createClient as createSupabase, type SupabaseClient } from '@supabase/supabase-js';

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

// Minimal ambient for Node's process.env — avoids pulling @types/node just
// to typecheck one env accessor (the runtime provides process on Netlify).
declare const process: { env: Record<string, string | undefined> };

// ── env ──────────────────────────────────────────────────────────
const env = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`[catalogue] missing env ${k}`);
  return v;
};
/** First defined of several env names (lets the function reuse the existing
 *  VITE_SUPABASE_* vars without requiring duplicate non-prefixed copies). */
const envAny = (...keys: string[]): string => {
  for (const k of keys) {
    const v = process.env[k];
    if (v) return v;
  }
  throw new Error(`[catalogue] missing env (one of ${keys.join(', ')})`);
};

const SUPABASE_URL = envAny('SUPABASE_URL', 'VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = envAny('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

const sanity = createSanity({
  projectId: envAny('SANITY_PROJECT_ID', 'VITE_SANITY_PROJECT_ID'),
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-06-01',
  token: env('SANITY_READ_TOKEN'),
  // Private dataset → no CDN (CDN is for public, cacheable reads).
  useCdn: false,
  perspective: 'published',
});

/** Unauthenticated client (anon key) — for the public share-code peek RPC. */
const anonSupabase = createSupabase(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── helpers ──────────────────────────────────────────────────────
type Locale = 'fr' | 'en' | 'es';

const json = (status: number, data: unknown): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

interface Caller {
  id: string;
  isAdmin: boolean;
  /** Supabase client authenticated AS the caller (their JWT). */
  client: SupabaseClient;
  /** Diagnostic only — the role the gate read (or null if no profile). */
  role: string | null;
}

/** Resolve the bearer into a caller + a Supabase client scoped to their JWT,
 *  or null when there is no valid session. No service key involved. */
async function resolveCaller(req: Request): Promise<Caller | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    console.error('[catalogue] resolveCaller: no bearer token');
    return null;
  }
  // Client runs every query as the caller → RLS self-read returns their row,
  // and the authenticated role has the profiles SELECT grant.
  const client = createSupabase(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    console.error('[catalogue] resolveCaller: getUser failed', error?.message);
    return null;
  }
  const { data: profile, error: pErr } = await client
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  if (pErr) console.error('[catalogue] resolveCaller: profile read failed', pErr.message, pErr.code);
  return {
    id: data.user.id,
    isAdmin: profile?.role === 'admin',
    role: (profile?.role as string | null) ?? null,
    client,
  };
}

/** Doc ids the caller may NOT see (audience rules), via the SECURITY DEFINER
 *  RPC. Throws on error so the caller fails CLOSED (500) rather than leaking. */
async function hiddenDocIds(client: SupabaseClient): Promise<Set<string>> {
  const { data, error } = await client.rpc('gate_hidden_doc_ids');
  if (error) {
    console.error('[catalogue] gate_hidden_doc_ids failed', error.message, error.code);
    throw new Error('audience-rpc-failed');
  }
  return new Set((data ?? []).map((r: { sanity_doc_id: string }) => r.sanity_doc_id));
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

  const locale: Locale = body.locale === 'en' ? 'en' : body.locale === 'es' ? 'es' : 'fr';
  const action = body.action;

  try {
    // ── public marketing reads (no auth) ──────────────────────────
    if (action === 'landing') return json(200, { data: await sanity.fetch(GROQ_LANDING) });
    if (action === 'siteConfig') return json(200, { data: await sanity.fetch(GROQ_SITE_CONFIG) });
    if (action === 'team') return json(200, { data: await sanity.fetch(GROQ_TEAM) });

    // ── share (validated by code possession, no auth) ─────────────
    if (action === 'shared') {
      const code = (body.code ?? '').trim();
      if (!code) return json(400, { error: 'missing-code' });
      const { data: rows } = await anonSupabase.rpc('peek_share_code', { p_code: code });
      const row = (rows as PeekRow[] | null)?.[0];
      if (!row || !row.is_valid) return json(404, { error: 'invalid-code' });
      // type + id come from the DB (admin-set at code creation), but the GROQ
      // builders interpolate them — validate defensively before they hit GROQ.
      const docs = shareDocIds(row).filter(d => isModuleKey(d.type) && DOC_ID_RE.test(d.id));
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
      // role in the body is a diagnostic: null = profile unreadable,
      // 'client' = not an operator, 'admin' = should have passed.
      if (!caller.isAdmin) return json(403, { error: 'forbidden', role: caller.role });
      return json(200, { data: await sanity.fetch(GROQ_ADMIN_CATALOGUE) });
    }

    if (action === 'list') {
      if (!isModuleKey(body.module)) return json(400, { error: 'bad-module' });
      const rows = (await sanity.fetch(CATALOGUE_MODULE_QUERIES[body.module].list, {
        locale,
      })) as { id: string }[];
      if (caller.isAdmin) return json(200, { data: rows ?? [] });
      const hidden = await hiddenDocIds(caller.client);
      return json(200, { data: (rows ?? []).filter(r => !hidden.has(r.id)) });
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
      if (caller.isAdmin) return json(200, { data: row });
      const hidden = await hiddenDocIds(caller.client);
      // 404 (not 403) when forbidden: never reveal that a hidden fiche exists.
      if (hidden.has(row.id)) return json(404, { error: 'not-found' });
      return json(200, { data: row });
    }

    return json(400, { error: 'unknown-action' });
  } catch (err) {
    console.error('[catalogue] error', err);
    return json(500, { error: 'server-error' });
  }
}
