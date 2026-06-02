// ═══════════════════════════════════════════════════
// sanityQueries — GROQ queries for the 7 domain listings + detail
//
// WHAT: One query string per domain that returns the SAME shape as the
//       corresponding mock dataset, so the existing pages can fallback
//       cleanly when Sanity is empty / unavailable. Each list query
//       returns only `visibility != "private"` items (i.e. public +
//       shareCode visible to anon ; private docs only render in
//       authenticated/admin contexts which use a different query).
//
//       The transform functions in `sanityTransform.ts` adapt each
//       Sanity doc to the internal TypeScript type.
// WHEN: useSanityCollection() + useSanityItem() consume these. Both
//       hooks inject a `$locale` param ('fr' | 'en') read from the
//       active LocaleProvider, so every localised projection below
//       resolves to the visitor's language with a FR fallback.
// i18n: editorial fields are localeString/localeText/localeRichText in
//       Sanity. We flatten them HERE (not in React) via the L/LPT/LARR
//       helpers — the returned shape stays mono-string, so pages, types
//       and mocks are untouched. Fixes the FR-only detail-page bug
//       (friction 2026-05-29-bilingual-detail-gap).
// ═══════════════════════════════════════════════════

/**
 * Visibility filter for public listings. Returns docs the recipient
 * is allowed to discover via standard browsing (excludes 'private'
 * which is auth-walled separately).
 */
const PUBLIC_VISIBILITY = `visibility in ["public", "shareCode"]`;

// ─── Localised projection helpers ─────────────────────────────────
// `$locale` is supplied by the consuming hook. `select` + `coalesce`
// are core GROQ (no reliance on dynamic-key access). FR is the final
// fallback so a half-translated doc never renders blank.

/** Localised scalar (localeString / localeText) → active-locale string. */
const L = (field: string) =>
  `select($locale == "en" => coalesce(${field}.en, ${field}.fr), ${field}.fr)`;

/** Localised portable text → plain string in the active locale. */
const LPT = (field: string) =>
  `pt::text(select($locale == "en" => coalesce(${field}.en, ${field}.fr), ${field}.fr))`;

/** Localised array-of-localeString → array of active-locale strings. */
const LARR = (field: string) => `${field}[]select($locale == "en" => coalesce(@.en, @.fr), @.fr)`;

/** Localised `label` inside an array element (element has a `label` localeString). */
const L_LABEL = `select($locale == "en" => coalesce(label.en, label.fr), label.fr)`;

/** Localised value when the array element *is itself* the localeString. */
const L_SELF = `select($locale == "en" => coalesce(en, fr), fr)`;

// ─── Events ───────────────────────────────────────────────────────
export const GROQ_EVENTS_LIST = `*[_type == "event" && ${PUBLIC_VISIBILITY}] | order(startsAt asc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  dateMode,
  startsAt,
  endsAt,
  "dateLabel": ${L('dateLabel')},
  city,
  countryCode,
  venue,
  capacity,
  allocatedSeats,
  dressCode,
  "summary": ${L('summary')},
  "description": ${LPT('description')},
  programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

export const GROQ_EVENT_DETAIL = (slug: string) =>
  `*[_type == "event" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": ${L('title')},
    category,
    dateMode,
    startsAt,
    endsAt,
    "dateLabel": ${L('dateLabel')},
    city,
    countryCode,
    venue,
    capacity,
    allocatedSeats,
    dressCode,
    "summary": ${L('summary')},
    "description": ${LPT('description')},
    programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
    "images": images[]{ "src": asset->url, "alt": alt }
  }`;

// ─── Properties ───────────────────────────────────────────────────
export const GROQ_PROPERTIES_LIST = `*[_type == "property" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  kind,
  transactionType,
  "summary": ${L('summary')},
  city,
  region,
  countryCode,
  bedrooms,
  bathrooms,
  livingArea,
  landArea,
  amenities[]{ "label": ${L_SELF} },
  price,
  availability,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Timepieces ───────────────────────────────────────────────────
export const GROQ_TIMEPIECES_LIST = `*[_type == "timepiece" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  brand,
  reference,
  caseDiameter,
  caseMaterial,
  movement,
  productionYear,
  condition,
  papers,
  "summary": ${L('summary')},
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Artworks ─────────────────────────────────────────────────────
export const GROQ_ARTWORKS_LIST = `*[_type == "artwork" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  artistName,
  year,
  medium,
  "technique": ${L('technique')},
  dimensions,
  edition,
  certificate,
  "summary": ${L('summary')},
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Journeys ─────────────────────────────────────────────────────
export const GROQ_JOURNEYS_LIST = `*[_type == "journey" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  destinations,
  duration,
  durationDays,
  partySize,
  "summary": ${L('summary')},
  itinerary[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
  "transport": ${LARR('transport')},
  "accommodation": ${LARR('accommodation')},
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Concierge services ──────────────────────────────────────────
export const GROQ_CONCIERGE_LIST = `*[_type == "conciergeService" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  "summary": ${L('summary')},
  "leadTime": ${L('leadTime')},
  "coverageArea": ${L('coverageArea')},
  "capabilities": ${LARR('capabilities')},
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Articles / News ──────────────────────────────────────────────
export const GROQ_ARTICLES_LIST = `*[_type == "article" && ${PUBLIC_VISIBILITY}] | order(publishedAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  publishedAt,
  readTimeMinutes,
  "summary": ${L('summary')},
  "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
  "author": author->{ firstName, lastName, "photoUrl": photo.asset->url }
}`;

// ─── Team members ─────────────────────────────────────────────────
// NOTE: not localised here — useTeamMembers fetches with its own query
// and does not pass $locale. Left FR until team bilingual is in scope.
export const GROQ_TEAM = `*[_type == "teamMember"] | order(order asc){
  "id": _id,
  firstName,
  lastName,
  role,
  isFocal,
  "tag": tag.fr,
  phone,
  email,
  whatsapp,
  linkedin,
  "bio": bio.fr,
  "photoUrl": photo.asset->url
}`;

// ─── Domain detail queries by slug ────────────────────────────────
const detailFields = `
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  "summary": ${L('summary')},
  "description": ${LPT('description')},
  "images": images[]{ "src": asset->url, "alt": alt }
`;

export const GROQ_PROPERTY_DETAIL = (slug: string) =>
  `*[_type == "property" && slug.current == "${slug}"][0]{
    ${detailFields},
    kind,
    transactionType,
    city,
    region,
    countryCode,
    bedrooms,
    bathrooms,
    livingArea,
    landArea,
    amenities[]{ "label": ${L_SELF} },
    price,
    availability
  }`;

export const GROQ_TIMEPIECE_DETAIL = (slug: string) =>
  `*[_type == "timepiece" && slug.current == "${slug}"][0]{
    ${detailFields},
    brand,
    reference,
    caseDiameter,
    caseMaterial,
    movement,
    productionYear,
    condition,
    papers,
    "provenanceNote": ${L('provenanceNote')},
    price
  }`;

export const GROQ_ARTWORK_DETAIL = (slug: string) =>
  `*[_type == "artwork" && slug.current == "${slug}"][0]{
    ${detailFields},
    artistName,
    year,
    medium,
    "technique": ${L('technique')},
    dimensions,
    edition,
    certificate,
    catalogueRaisonne,
    "provenanceNote": ${L('provenanceNote')},
    price
  }`;

export const GROQ_JOURNEY_DETAIL = (slug: string) =>
  `*[_type == "journey" && slug.current == "${slug}"][0]{
    ${detailFields},
    destinations,
    duration,
    durationDays,
    partySize,
    itinerary[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
    "transport": ${LARR('transport')},
    "accommodation": ${LARR('accommodation')},
    price
  }`;

export const GROQ_CONCIERGE_DETAIL = (slug: string) =>
  `*[_type == "conciergeService" && slug.current == "${slug}"][0]{
    ${detailFields},
    category,
    "leadTime": ${L('leadTime')},
    "coverageArea": ${L('coverageArea')},
    "capabilities": ${LARR('capabilities')},
    price
  }`;

export const GROQ_ARTICLE_DETAIL = (slug: string) =>
  `*[_type == "article" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": ${L('title')},
    category,
    publishedAt,
    readTimeMinutes,
    "summary": ${L('summary')},
    "body": ${LPT('body')},
    "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
    "gallery": gallery[]{ "src": asset->url, "alt": alt },
    "author": author->{ firstName, lastName, "photoUrl": photo.asset->url }
  }`;

// ─── Share fiche by type + id (for /share/:code render) ──────────
export const GROQ_SHARED_FICHE = (type: string, id: string) =>
  `*[_type == "${type}" && _id == "${id}"][0]{
    _type,
    _id,
    "slug": slug.current,
    "title": ${L('title')},
    "summary": ${L('summary')},
    "description": pt::text(select(
      $locale == "en" => coalesce(description.en, body.en, bio.en, description.fr, body.fr, bio.fr),
      coalesce(description.fr, body.fr, bio.fr)
    )),
    "images": images[]{ "src": asset->url, "alt": alt },
    "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
    // Event specsheet + programme (null on other types) so the public
    // share page renders the full fiche from Sanity, not just the generics.
    dateMode,
    startsAt,
    "dateLabel": ${L('dateLabel')},
    venue,
    city,
    countryCode,
    capacity,
    allocatedSeats,
    dressCode,
    programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
    ...
  }`;

/** Compact projection for a SET of fiches by _id — used by the multi-doc
 *  share page (one code → several fiches) to render a collection of cards. */
export const GROQ_SHARED_FICHES = (ids: readonly string[]) => {
  const idList = ids.map(id => `"${id}"`).join(', ');
  return `*[_id in [${idList}]]{
    _type,
    _id,
    "slug": slug.current,
    "title": ${L('title')},
    "summary": ${L('summary')},
    "image": images[0].asset->url
  }`;
};
