---
id: atomic-redemption-rpc
date: 2026-05-14
type: decision
tags: [#auth, #security, #decision, #client-specific, #active]
scope: client-specific
status: active
---

# Atomic single-use invitation redemption via Postgres RPC

## Decision

Mark `invitation_codes` as `redeemed` through a `SECURITY DEFINER`
Postgres function `redeem_invitation_code(p_code text)` that locks the
row with `FOR UPDATE` before the status check + UPDATE. Two concurrent
calls on the same code can never both succeed.

The client (AuthContext.confirmInvitationRedemption) calls the RPC
**after** the user is authenticated via the magic-link flow, never
before. Errors are surfaced as a json envelope `{ok, error?}` with
4 categories : `not_authenticated`, `invalid_format`, `not_found`,
`already_used`.

## Why not just an UPDATE from the client

A naive `UPDATE invitation_codes SET status='redeemed' WHERE code=$1
AND status='unused'` is race-prone if `status` is read separately. The
RLS-allowed admin update doesn't lock. Two clients pasting the same
SAW-XXXX-XXXX 100 ms apart would both see `unused`, both run UPDATE,
and both think they succeeded. The `FOR UPDATE` lock in the RPC
serialises them.

## Why not a trigger

A trigger on `auth.users` insert could try to redeem the code on signup
using `user_metadata.invitation_code`. But :
- Magic-link signup doesn't fire trigger when the user already exists.
- The trigger has no clean way to surface error categories to the
  client.
- Triggers obscure the control flow ; an explicit client call after
  auth gives us a visible loading state in the Onboarding wizard.

## Cross-refs

- Migration : `supabase/migrations/0008_redeem_invitation_rpc.sql`
- Client wrapper : `src/context/AuthContext.tsx`
  `confirmInvitationRedemption`
- Call site : `src/pages/Onboarding.tsx` step 1
- Cross-friction : `frictions/2026-05-11-supabase-expose-new-tables-toggle.md`
  (the GRANT issue that already bit us once on the
  `invitation_codes` table)

## Status

Active from 2026-05-14. Bug : critical pre-fix (a code could be reused
indefinitely). Verification path : apply migration 0008 on Supabase,
generate a code from /admin/invitations, redeem it once → row.status =
'redeemed', redeemed_at set ; try to redeem again → RPC returns
`already_used`.
