---
id: 2026-06-29-ship-without-asking-in-delivery-flow
date: 2026-06-29
type: feedback
tags: [#workflow, #client-specific, #content]
scope: client-specific
status: active
---

# In the live-pitch fast-iteration flow, "mets à jour / faut mettre à jour" = ship to prod, don't re-ask

During the THE ODYSSEY pitch iterations (saw-next.ch/the-hidden-shore), the owner
fed revised copy three times in a row. Each time the intent was: edit → validate →
**push to prod immediately**. On the third revision I built + committed on a branch
and asked "ship?" for confirmation. Owner replied "cest bien en ligne --'"
(exasperated) — they expected it already live.

**Why:** This is a one-off, low-risk, owner-driven client deliverable on a
dedicated standalone page (`/the-hidden-shore`, English, noindex, no other surface
touched). The owner is actively driving, the offer is time-sensitive, and a
confirmation round-trip per revision is pure friction. "Mettre à jour" on an
already-live page means update the live page.

**How to apply:**
- When the owner sends revised content for an **already-deployed** page in an
  active iteration loop and says "mets à jour / faut mettre à jour / nouveau
  texte" → branch, edit, `pnpm validate`, commit, **push to prod (PR + gh pr
  merge)** and verify, without a separate "ship?" gate.
- Still report what shipped + verify live. Still branch (never commit to main).
- This relaxes the default "merge/push only on explicit request" **for this
  specific delivery flow** — the request IS explicit here. Keep the confirmation
  gate for ambiguous, high-blast-radius, or first-time-publish actions.

Related: [[2026-06-26-1714-option-b-fast-ship-handoff]] (the proven PR + gh pr
merge fast path), [[2026-06-04-post-deploy-stale-cache]] (hard-refresh after deploy).
