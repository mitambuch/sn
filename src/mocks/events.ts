// ═══════════════════════════════════════════════════
// Events mock dataset — lot B fake data
// 8 events across the next 12 months. ISO dates Europe/Zurich.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Event } from '@/types/event';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const events: Event[] = [
  {
    id: 'evt-01',
    slug: 'gala-onu-geneve-2026',
    title: 'Gala de bienfaisance, ONU Genève',
    category: 'gala',
    startsAt: '2026-06-14T19:30:00+02:00',
    endsAt: '2026-06-15T01:00:00+02:00',
    city: 'Genève',
    countryCode: 'CH',
    venue: 'Palais des Nations',
    capacity: 220,
    allocatedSeats: 4,
    dressCode: 'black-tie',
    summary:
      'Dîner de gala dans la salle des Pas-Perdus, programme musical privé du Quatuor de l’OSR.',
    description:
      'Soirée de bienfaisance annuelle au profit de l’UNHCR. Cocktail à 19h30 sous la Salle des Pas-Perdus, dîner à 21h, prestation privée du Quatuor à cordes de l’Orchestre de la Suisse Romande, vente aux enchères silencieuse au profit de l’UNHCR. Discours d’accueil par le Directeur général.',
    programme: [
      { time: '19:30', label: 'Cocktail — Salle des Pas-Perdus' },
      { time: '21:00', label: 'Dîner sept services' },
      { time: '22:30', label: 'Quatuor de l’OSR' },
      { time: '23:30', label: 'Vente aux enchères silencieuse' },
    ],
    images: [
      img('geneva-united-nations-gala', 'Salle des Pas-Perdus en gala'),
      img('luxury-dinner-formal-event', 'Dîner formel 220 couverts'),
      img('chamber-music-quartet', 'Quatuor à cordes en représentation'),
    ],
    createdAt: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'evt-02',
    slug: 'art-basel-collectors-preview',
    title: 'Collectors Preview — Art Basel',
    category: 'opening',
    startsAt: '2026-06-16T09:00:00+02:00',
    endsAt: '2026-06-16T13:00:00+02:00',
    city: 'Bâle',
    countryCode: 'CH',
    venue: 'Messe Basel — Hall 2',
    capacity: 180,
    allocatedSeats: 2,
    dressCode: 'business',
    summary: 'Avant-première Art Basel à 9h, accès aux 4 secteurs avant ouverture publique.',
    description:
      'Accès First Choice à 9h, deux heures d’avance sur les VIP standards. Petit-déjeuner privé chez le galeriste Hauser & Wirth. Visite guidée de 30 minutes par Marc Spiegler. Lunch privé à 13h au restaurant de la Messe.',
    programme: [
      { time: '09:00', label: 'Accès First Choice — Hall 2' },
      { time: '10:30', label: 'Petit-déjeuner Hauser & Wirth' },
      { time: '11:30', label: 'Visite guidée Marc Spiegler' },
      { time: '13:00', label: 'Lunch privé Messe' },
    ],
    images: [
      img('art-basel-fair', 'Art Basel galerie principale'),
      img('contemporary-art-fair', 'Hall d’exposition'),
    ],
    createdAt: '2026-04-12T10:00:00.000Z',
  },
  {
    id: 'evt-03',
    slug: 'concert-prive-andermatt',
    title: 'Concert privé — Andermatt Concert Hall',
    category: 'concert',
    startsAt: '2026-07-22T20:00:00+02:00',
    city: 'Andermatt',
    countryCode: 'CH',
    venue: 'Andermatt Concert Hall',
    capacity: 650,
    allocatedSeats: 6,
    dressCode: 'cocktail',
    summary:
      'Soirée privée Beethoven 7/Brahms 2 par l’Orchestra della Svizzera Italiana, dîner inclus.',
    description:
      'Loge privatisée pour 6 personnes, places centre balcon. Dîner avant concert servi en loge dès 18h30. Rencontre avec le chef d’orchestre après concert dans le foyer privé.',
    programme: [
      { time: '18:30', label: 'Dîner en loge' },
      { time: '20:00', label: 'Concert OSI — Beethoven 7 / Brahms 2' },
      { time: '22:30', label: 'Rencontre chef d’orchestre' },
    ],
    images: [
      img('andermatt-concert-hall', 'Salle Andermatt'),
      img('orchestra-symphony-stage', 'Orchestre symphonique en représentation'),
    ],
    createdAt: '2026-04-05T14:00:00.000Z',
  },
  {
    id: 'evt-04',
    slug: 'monaco-gp-paddock',
    title: 'Grand Prix de Monaco — Paddock Club',
    category: 'sport',
    startsAt: '2026-05-24T08:00:00+02:00',
    endsAt: '2026-05-24T20:00:00+02:00',
    city: 'Monte-Carlo',
    countryCode: 'MC',
    venue: 'Paddock Club Monaco',
    capacity: 120,
    allocatedSeats: 8,
    dressCode: 'smart-casual',
    summary:
      'Accès Paddock Club journée Grand Prix, vue sur la ligne d’arrivée, lunch et boissons inclus.',
    description:
      'Accès dès 8h le dimanche du GP. Vue plongeante sur la ligne d’arrivée et la sortie de la chicane du port. Petit-déjeuner, déjeuner gastronomique 4 services, open bar Champagne Krug et grands crus. Visite guidée d’une écurie sur réservation.',
    programme: [
      { time: '08:00', label: 'Accueil Paddock Club' },
      { time: '09:30', label: 'Visite écurie (sur inscription)' },
      { time: '12:00', label: 'Déjeuner 4 services' },
      { time: '15:10', label: 'Course F1 — Grand Prix de Monaco' },
    ],
    images: [
      img('monaco-grand-prix-track', 'Circuit Monte-Carlo'),
      img('formula-1-monaco-paddock', 'Paddock Club vue circuit'),
    ],
    createdAt: '2026-03-30T11:00:00.000Z',
  },
  {
    id: 'evt-05',
    slug: 'diner-prive-megeve',
    title: 'Dîner privé chez Marc Veyrat — Megève',
    category: 'private-dinner',
    startsAt: '2026-12-20T20:00:00+01:00',
    city: 'Megève',
    countryCode: 'FR',
    venue: 'La Maison des Bois (privatisée)',
    capacity: 16,
    allocatedSeats: 16,
    dressCode: 'tenue-d-hiver',
    summary:
      'Soirée privatisée intégralement, menu signature 14 services par Marc Veyrat, accord vins compris.',
    description:
      'La Maison des Bois privatisée pour une soirée. Menu en 14 services par le chef en personne, intégrant la cueillette du jour. Accord vins par le chef sommelier (5 vins du domaine + grands crus). Présence du chef toute la soirée. Voiturier inclus.',
    programme: [
      { time: '19:30', label: 'Apéritif au coin du feu' },
      { time: '20:00', label: 'Premier service' },
      { time: '23:30', label: 'Dessert et mignardises' },
    ],
    images: [
      img('marc-veyrat-megeve-restaurant', 'La Maison des Bois'),
      img('luxury-private-dinner-mountain', 'Dîner privé en montagne'),
    ],
    createdAt: '2026-03-22T15:00:00.000Z',
  },
  {
    id: 'evt-06',
    slug: 'enchere-christies-london',
    title: 'Enchères du soir — Christie’s King Street',
    category: 'auction',
    startsAt: '2026-10-08T18:30:00+01:00',
    city: 'London',
    countryCode: 'GB',
    venue: 'Christie’s — 8 King Street',
    capacity: 240,
    allocatedSeats: 2,
    dressCode: 'business',
    summary: 'Vente du soir Modern & Contemporary, salon privé en mezzanine avec aperçu des lots.',
    description:
      'Aperçu privé des lots à 17h30 dans le salon privé de la mezzanine, avant l’ouverture publique. Présence d’un spécialiste pour briefing pré-enchère. Vente du soir à 18h30. Cocktail post-vente à 22h.',
    programme: [
      { time: '17:30', label: 'Aperçu privé en mezzanine' },
      { time: '18:30', label: 'Enchère du soir' },
      { time: '22:00', label: 'Cocktail post-vente' },
    ],
    images: [
      img('christies-auction-london', 'Salle d’enchères Christie’s'),
      img('contemporary-art-auction', 'Tableau présenté en vente'),
    ],
    createdAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'evt-07',
    slug: 'soiree-cinema-cannes',
    title: 'Première et soirée de clôture — Festival de Cannes',
    category: 'cultural',
    startsAt: '2026-05-23T19:00:00+02:00',
    city: 'Cannes',
    countryCode: 'FR',
    venue: 'Palais des Festivals',
    capacity: 2300,
    allocatedSeats: 4,
    dressCode: 'black-tie',
    summary: 'Tapis rouge soirée de clôture, projection officielle, dîner de clôture au Carlton.',
    description:
      'Tapis rouge dès 18h45, projection en compétition à 19h. Dîner officiel de clôture au Grand Hôtel Carlton. Voiturier inclus, sécurité dédiée, robes/smokings sur entente avec couturier de Sawnext.',
    programme: [
      { time: '18:45', label: 'Tapis rouge' },
      { time: '19:00', label: 'Projection officielle' },
      { time: '22:30', label: 'Dîner de clôture — Carlton' },
    ],
    images: [
      img('cannes-film-festival-red-carpet', 'Tapis rouge Cannes'),
      img('palais-des-festivals-cannes', 'Palais des Festivals'),
    ],
    createdAt: '2026-03-08T13:00:00.000Z',
  },
  {
    id: 'evt-08',
    slug: 'private-cup-saint-moritz',
    title: 'White Turf — tribune privée Saint-Moritz',
    category: 'sport',
    startsAt: '2027-02-14T13:00:00+01:00',
    city: 'St. Moritz',
    countryCode: 'CH',
    venue: 'Lac gelé de Saint-Moritz',
    capacity: 80,
    allocatedSeats: 6,
    dressCode: 'tenue-d-hiver',
    summary: 'Tribune privée 6 places, courses sur lac gelé, déjeuner gastronomique chauffé.',
    description:
      'Trois courses au programme dont le Grand Prix de Saint-Moritz. Tribune privatisée chauffée avec vue centrale sur la ligne d’arrivée. Déjeuner gastronomique servi pendant l’événement (chef étoilé du Badrutt’s Palace). Plaids cachemire fournis.',
    programme: [
      { time: '12:30', label: 'Accueil tribune privée' },
      { time: '13:00', label: 'Première course' },
      { time: '15:30', label: 'Grand Prix de Saint-Moritz' },
    ],
    images: [
      img('white-turf-st-moritz', 'White Turf — courses sur lac gelé'),
      img('st-moritz-winter-luxury', 'Tribune privée Saint-Moritz'),
    ],
    createdAt: '2026-03-01T15:00:00.000Z',
  },
];
