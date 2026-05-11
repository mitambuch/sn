-- ═══════════════════════════════════════════════════════════════
-- Grant table access to anon + authenticated roles
--
-- Context: the project was created with "Automatically expose new
-- tables" disabled, which skips the default GRANTs Supabase normally
-- applies. Without these grants the API returns 42501
-- (insufficient_privilege) even when RLS would have allowed the row.
--
-- RLS still gates row-level access — these grants only add the
-- table-level privilege that lets RLS run in the first place.
--
-- To apply: paste into Supabase SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════════

-- profiles — authenticated users read/update their own row (RLS gates which row).
grant select, update on public.profiles to authenticated;

-- invitation_codes — anon checks code existence at redemption time,
-- authenticated admins manage the lifecycle.
grant select on public.invitation_codes to anon;
grant select, insert, update on public.invitation_codes to authenticated;

-- inquiries — authenticated users insert + read their own (RLS gates which).
grant select, insert, update on public.inquiries to authenticated;
