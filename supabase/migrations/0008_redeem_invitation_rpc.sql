-- ═══════════════════════════════════════════════════════════════
-- redeem_invitation_code — atomic single-use redemption RPC
--
-- The bug this fixes : the client used to SELECT the invitation_code,
-- then signInWithOtp(email). Nothing ever marked the code as
-- `redeemed`, so a single SAW-XXXX-XXXX could be reused indefinitely.
-- Critical security flaw for a cooptation-based access model.
--
-- This RPC :
--   - Locks the candidate row with FOR UPDATE so concurrent calls
--     can't both succeed
--   - Verifies status='unused' (also covers `redeemed/expired/revoked`)
--   - UPDATEs atomically : status='redeemed', redeemed_at=now(),
--     redeemed_by=auth.uid()
--   - Returns a json envelope so the JS caller can distinguish error
--     categories (not_found, already_used, not_authenticated)
--   - SECURITY DEFINER + search_path=public so RLS doesn't shadow the
--     update from the caller's authenticated role (the policy already
--     allows it, but SECURITY DEFINER is the right pattern for a
--     state-mutating RPC and lets us tighten policies later without
--     breaking the call site)
--
-- The flow :
--   1. Landing : user enters SAW-XXXX-XXXX + email in the
--      AccessRequestModal (code mode). Client does a permissive SELECT
--      (existing RLS policy "invitation_codes: read unused for
--      redemption") to surface a clean "code introuvable" error early.
--   2. Client calls signInWithOtp(email, { data: { invitation_code }})
--      → magic link sent to the user's inbox.
--   3. User clicks → lands on /:locale/onboarding authenticated.
--   4. Onboarding reads user_metadata.invitation_code (set in step 2)
--      and calls supabase.rpc('redeem_invitation_code', { p_code }).
--      The RPC marks the code redeemed atomically OR returns error.
--   5. If error : surface to the user, leave them logged in but block
--      step transitions until Salva resolves manually.
--
-- To apply : paste this file into Supabase SQL Editor → Run.
-- Or via CLI : supabase db push.
-- ═══════════════════════════════════════════════════════════════

create or replace function public.redeem_invitation_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_code_id uuid;
  v_status invitation_status;
  v_normalized text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  -- Canonical normalization mirrors src/types/invitation.ts :
  -- strip SAW- prefix, dashes and whitespace, uppercase the rest.
  v_normalized := upper(regexp_replace(coalesce(p_code, ''), '^saw-|[\s-]', '', 'gi'));

  if v_normalized !~ '^[A-HJ-NP-Z2-9]{8}$' then
    return json_build_object('ok', false, 'error', 'invalid_format');
  end if;

  -- Lock the candidate row so concurrent redemptions of the same code
  -- can't both succeed. The row stays locked until commit.
  select id, status
    into v_code_id, v_status
    from public.invitation_codes
   where code = v_normalized
   for update;

  if v_code_id is null then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;

  if v_status <> 'unused' then
    return json_build_object(
      'ok', false,
      'error', 'already_used',
      'status', v_status
    );
  end if;

  update public.invitation_codes
     set status      = 'redeemed',
         redeemed_at = now(),
         redeemed_by = v_user_id
   where id = v_code_id;

  return json_build_object(
    'ok', true,
    'code_id', v_code_id,
    'redeemed_by', v_user_id
  );
end;
$$;

-- Only authenticated users may redeem. The anon SELECT policy on
-- invitation_codes (existing) covers the landing-side UX preview ;
-- anon cannot call this RPC.
grant execute on function public.redeem_invitation_code(text) to authenticated;
revoke execute on function public.redeem_invitation_code(text) from anon, public;
