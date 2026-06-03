-- ═══════════════════════════════════════════════════════════════
-- 0026_gate_hidden_doc_ids — audience filtering WITHOUT a service key.
--
-- WHY: the gate (netlify/functions/catalogue) previously needed the Supabase
-- service_role key to read profiles + fiche_audience past RLS. In practice
-- that key was a constant source of misconfiguration (42501 permission denied
-- when the anon/publishable key got pasted instead). This RPC removes the
-- dependency entirely: it runs SECURITY DEFINER (elevated), computes — for the
-- CALLING member — the set of fiche doc ids they are NOT allowed to see, and
-- is callable by any authenticated user. The gate then calls it with the
-- caller's own JWT (no service key) and hides those fiches.
--
-- Leak-safe: it returns only "which fiches YOU can't see" (doc ids), never
-- other members' data or the raw audience rules. Admins get an empty set
-- (they see everything).
-- ═══════════════════════════════════════════════════════════════

create or replace function public.gate_hidden_doc_ids()
returns table (sanity_doc_id text)
language sql
stable
security definer
set search_path = public
as $$
  select fa.sanity_doc_id
  from public.fiche_audience fa
  cross join (
    select id, role, segments from public.profiles where id = auth.uid()
  ) me
  where me.role <> 'admin'   -- admins see everything → no hidden ids
    and (
      -- excluded explicitly …
      me.id = any (fa.excluded_member_ids)
      -- … or targeted at segments the caller doesn't belong to
      or (
        fa.audience_mode = 'segments'
        and not (coalesce(fa.segments, '{}') && coalesce(me.segments, '{}'))
      )
    );
$$;

revoke execute on function public.gate_hidden_doc_ids() from anon, public;
grant execute on function public.gate_hidden_doc_ids() to authenticated;

notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification :
-- ──────────────────────────────────────────────────────────────
-- As a member tagged 'piguet-galland', a fiche restricted to 'vip' must
-- appear in: select * from public.gate_hidden_doc_ids();
-- As an admin, that function returns no rows.
