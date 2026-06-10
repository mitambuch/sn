---
id: team-cards-per-member-contacts
date: 2026-06-10
type: decision
tags: [#content, #i18n, #decision, #client-specific]
scope: client-specific
status: active
---

# Team cards: each profile drives its own data (reverses the focal-only funnel)

## Context

The Interlocutor landing section (S09) originally implemented a deliberate
owner direction: the focal contact (Valmont) was the **single operational
channel**. Only Valmont's card showed phone/email/WhatsApp/LinkedIn; the
other four members showed a "Contact via Valmont" pill + a "Voir Valmont"
CTA. Contact info came from a hardcoded `FOCAL_CHANNELS` constant, never
overridable. The "function" line was a static `t('…role')` =
"Fondateur opérationnel" shared by everyone.

## Decision

The client brief (`public/brief_claude_code_saw_next.md`, forwarded by the
owner with "lance ça") **reverses** that: every member now exposes its own
sector title, function, phone/email/WhatsApp and a dynamic "Voir <name>"
CTA. Each member has a distinct phone number (Sergio +33 6 88 38 01 86,
Lucian +41 76 492 77 76, Harvy +33 6 42 00 14 74, Tavio +41 79 417 39 49,
Valmont unchanged +41 78 749 81 70).

Implementation: a single typed source of truth
`src/features/landing/teamData.ts` (`TEAM_MEMBERS`) holds every
member-specific value (sectorTitle + functionLabel tri-locale fr/en/es,
channels, slug, isFocal, order). The component reads the active member's
record; nothing member-specific is hardcoded in JSX. Bios stay on the
Sanity→i18n path (unchanged, client-editable). Layout / animation /
rotation timing untouched (brief: no graphic redesign).

## Why this over the alternatives

- **Kept Sanity for bios only** rather than ripping Sanity out (surgical;
  bios are "don't touch" and already match i18n) or pushing all new fields
  into Sanity (pre-launch stale-data risk — see
  [sanity-stale-data-overrides-code](../frictions/2026-06-02-sanity-stale-data-overrides-code.md)
  and the triple-model-divergence friction).
- **WhatsApp derived from phone** (strip spaces/+/()/-) per the brief; no
  per-member wa.me needed.

## Open / deferred

- **LinkedIn**: no real SAW Next LinkedIn URL exists in the project
  (`FOCAL_CHANNELS.linkedin` was `'#'`). The brief forbids inventing one,
  so the LinkedIn row is hidden until a real URL is provided
  (`teamData.ts` → fill the optional `linkedin` field). ACTION HUMAINE.
- **CTA target**: there are no `/team/<slug>` pages, so the CTA anchors to
  `#<slug>` (id added on the focal article). Repoint to real pages when
  they exist.
- **sectorTitle divergence**: Lucian/Harvy/Tavio sector titles changed
  from the old short tags (e.g. "Nuit & showbiz" →
  "ÉVÉNEMENTIEL • SHOWBIZ • HOSPITALITÉ") per the brief. The dead i18n
  `…<member>.tag` keys were removed.

Branch: `fix/team-member-cards` (off main, not the prelaunch-hardening
branch). Commits e000d16 (data) · d2643fa (fix) · 4b1b4fa (test).
