// ═══════════════════════════════════════════════════
// heroVideos — shared hero footage (self-hosted under public/)
//
// WHAT: the cinematic loop clips used as the landing hero background. Shared
//       so the /presentation hero reuses the EXACT same shots (owner direction
//       2026-06-17 "utilise les mêmes shots que la landing"). The hero picks
//       one at random per load.
// WHY self-hosted: the Cloudinary account (df5khdkxl) was disabled and every
//       clip returned 401 — owner moved the footage into public/video
//       (2026-06-17). Files in public/ are served same-origin at /video/*
//       (CSP media-src 'self' already covers them — no Cloudinary needed).
// CHANGE FOOTAGE: drop new .mp4 files into public/video/ and list them below.
// ═══════════════════════════════════════════════════

export const HERO_VIDEOS = ['/video/1.mp4', '/video/2.mp4'] as const;
