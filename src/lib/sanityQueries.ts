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
// WHEN: useSanityCollection() + useSanityItem() consume these.
// ═══════════════════════════════════════════════════

/**
 * Visibility filter for public listings. Returns docs the recipient
 * is allowed to discover via standard browsing (excludes 'private'
 * which is auth-walled separately).
 */
const PUBLIC_VISIBILITY = `visibility in ["public", "shareCode"]`;

// ─── Events ───────────────────────────────────────────────────────
export const GROQ_EVENTS_LIST = `*[_type == "event" && ${PUBLIC_VISIBILITY}] | order(startsAt asc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  "titleEn": title.en,
  category,
  startsAt,
  endsAt,
  city,
  countryCode,
  venue,
  capacity,
  allocatedSeats,
  dressCode,
  "summary": summary.fr,
  "summaryEn": summary.en,
  "description": pt::text(description.fr),
  programme[]{ time, "label": label.fr },
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

export const GROQ_EVENT_DETAIL = (slug: string) =>
  `*[_type == "event" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": title.fr,
    category,
    startsAt,
    endsAt,
    city,
    countryCode,
    venue,
    capacity,
    allocatedSeats,
    dressCode,
    "summary": summary.fr,
    "description": pt::text(description.fr),
    programme[]{ time, "label": label.fr },
    "images": images[]{ "src": asset->url, "alt": alt }
  }`;

// ─── Properties ───────────────────────────────────────────────────
export const GROQ_PROPERTIES_LIST = `*[_type == "property" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  kind,
  transactionType,
  "summary": summary.fr,
  city,
  region,
  countryCode,
  bedrooms,
  bathrooms,
  livingArea,
  landArea,
  amenities[]{ "label": fr },
  price,
  availability,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Timepieces ───────────────────────────────────────────────────
export const GROQ_TIMEPIECES_LIST = `*[_type == "timepiece" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  brand,
  reference,
  caseDiameter,
  caseMaterial,
  movement,
  productionYear,
  condition,
  papers,
  "summary": summary.fr,
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Artworks ─────────────────────────────────────────────────────
export const GROQ_ARTWORKS_LIST = `*[_type == "artwork" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  artistName,
  year,
  medium,
  "technique": technique.fr,
  dimensions,
  edition,
  certificate,
  "summary": summary.fr,
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Journeys ─────────────────────────────────────────────────────
export const GROQ_JOURNEYS_LIST = `*[_type == "journey" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  destinations,
  duration,
  durationDays,
  partySize,
  "summary": summary.fr,
  itinerary[]{ time, "label": label.fr },
  "transport": transport[].fr,
  "accommodation": accommodation[].fr,
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Concierge services ──────────────────────────────────────────
export const GROQ_CONCIERGE_LIST = `*[_type == "conciergeService" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  category,
  "summary": summary.fr,
  "leadTime": leadTime.fr,
  "coverageArea": coverageArea.fr,
  "capabilities": capabilities[].fr,
  price,
  "images": images[]{ "src": asset->url, "alt": alt }
}`;

// ─── Articles / News ──────────────────────────────────────────────
export const GROQ_ARTICLES_LIST = `*[_type == "article" && ${PUBLIC_VISIBILITY}] | order(publishedAt desc){
  "id": _id,
  "slug": slug.current,
  "title": title.fr,
  category,
  publishedAt,
  readTimeMinutes,
  "summary": summary.fr,
  "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
  "author": author->{ firstName, lastName, "photoUrl": photo.asset->url }
}`;

// ─── Team members ─────────────────────────────────────────────────
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
  "title": title.fr,
  "summary": summary.fr,
  "description": pt::text(description.fr),
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
    amenities[]{ "label": fr },
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
    "provenanceNote": provenanceNote.fr,
    price
  }`;

export const GROQ_ARTWORK_DETAIL = (slug: string) =>
  `*[_type == "artwork" && slug.current == "${slug}"][0]{
    ${detailFields},
    artistName,
    year,
    medium,
    "technique": technique.fr,
    dimensions,
    edition,
    certificate,
    catalogueRaisonne,
    "provenanceNote": provenanceNote.fr,
    price
  }`;

export const GROQ_JOURNEY_DETAIL = (slug: string) =>
  `*[_type == "journey" && slug.current == "${slug}"][0]{
    ${detailFields},
    destinations,
    duration,
    durationDays,
    partySize,
    itinerary[]{ time, "label": label.fr },
    "transport": transport[].fr,
    "accommodation": accommodation[].fr,
    price
  }`;

export const GROQ_CONCIERGE_DETAIL = (slug: string) =>
  `*[_type == "conciergeService" && slug.current == "${slug}"][0]{
    ${detailFields},
    category,
    "leadTime": leadTime.fr,
    "coverageArea": coverageArea.fr,
    "capabilities": capabilities[].fr,
    price
  }`;

export const GROQ_ARTICLE_DETAIL = (slug: string) =>
  `*[_type == "article" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": title.fr,
    category,
    publishedAt,
    readTimeMinutes,
    "summary": summary.fr,
    "body": pt::text(body.fr),
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
    "title": title.fr,
    "summary": summary.fr,
    "description": pt::text(coalesce(description.fr, body.fr, bio.fr)),
    "images": images[]{ "src": asset->url, "alt": alt },
    "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
    ...
  }`;
