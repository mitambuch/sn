// ═══════════════════════════════════════════════════
// Journeys mock dataset — lot B fake data
// 7 bespoke travel itineraries.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Journey } from '@/types/journey';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const journeys: Journey[] = [
  {
    id: 'jrn-01',
    slug: 'safari-okavango-private',
    title: 'Safari privé — Delta de l’Okavango',
    kind: 'safari',
    durationDays: 8,
    origin: 'Genève',
    destinations: 'Maun · Mombo · Vumbura · Île de Chief',
    earliestStart: '2026-06-01',
    guestCapacity: 6,
    inclusions: [
      'Vol privé Genève → Maun (Bombardier Global 6500)',
      'Charters internes Cessna Caravan',
      '3 camps Belmond exclusifs (Mombo, Vumbura, Chief’s)',
      'Ranger francophone privatisé sur 8 jours',
      'Pension complète, vins africains sélection sommelier',
    ],
    exclusions: ['Visa et formalités', 'Pourboires', 'Activités optionnelles aviation'],
    legs: [
      {
        date: '2026-06-01',
        location: 'Genève → Maun',
        highlight: 'Décollage 02h45 — vol direct Bombardier Global',
      },
      {
        date: '2026-06-02',
        location: 'Mombo Camp',
        highlight: 'Arrivée camp Belmond, briefing ranger',
      },
      {
        date: '2026-06-04',
        location: 'Vumbura Plains',
        highlight: 'Transfert Cessna, big five matinal',
      },
      { date: '2026-06-06', location: 'Chief’s Camp', highlight: 'Île de Chief, mokoro privatif' },
      {
        date: '2026-06-08',
        location: 'Maun → Genève',
        highlight: 'Retour direct, repas signature en vol',
      },
    ],
    summary:
      'Safari de 8 jours en Botswana, 3 camps Belmond, ranger privatisé, vol Bombardier Global aller-retour.',
    description:
      'Itinéraire conçu pour 6 voyageurs maximum. Trois camps Belmond consécutifs choisis pour leur diversité de biotopes (Delta, plaines, île). Ranger francophone privatisé sur la durée totale, pas de partage avec d’autres groupes. Le calendrier est ajustable à la semaine près selon vos contraintes.',
    images: [
      img('botswana-okavango-delta', 'Delta de l’Okavango vu du ciel'),
      img('safari-luxury-camp-tent', 'Tente Belmond Mombo Camp'),
      img('african-elephants-safari', 'Éléphants au point d’eau'),
      img('private-jet-cabin', 'Cabine du Bombardier Global'),
    ],
    createdAt: '2026-04-18T10:00:00.000Z',
  },
  {
    id: 'jrn-02',
    slug: 'yacht-amalfi-mediterranean',
    title: 'Yacht — Amalfi & Capri (Benetti 50 m)',
    kind: 'yacht',
    durationDays: 10,
    origin: 'Naples',
    destinations: 'Capri · Positano · Amalfi · Ponza · Stromboli',
    earliestStart: '2026-07-15',
    guestCapacity: 10,
    inclusions: [
      'Yacht Benetti 50 m, équipage de 11',
      'Tender Riva Aquariva',
      'Pension complète, chef italien étoilé',
      'Carburant et frais de port',
      'Plongées privées encadrées (PADI)',
    ],
    exclusions: [
      'Vol jusqu’à Naples',
      'Boissons hors carte standard',
      'Activités terrestres optionnelles',
    ],
    legs: [
      { date: '2026-07-15', location: 'Naples', highlight: 'Embarquement et brief équipage' },
      {
        date: '2026-07-16',
        location: 'Capri',
        highlight: 'Mouillage Marina Piccola, déjeuner Da Paolino',
      },
      { date: '2026-07-19', location: 'Positano', highlight: 'Mouillage Spiaggia Grande' },
      { date: '2026-07-22', location: 'Stromboli', highlight: 'Éruption nocturne au mouillage' },
      { date: '2026-07-25', location: 'Naples', highlight: 'Débarquement matinal' },
    ],
    summary:
      'Croisière 10 jours en yacht Benetti 50 m, Capri-Amalfi-Stromboli, équipage 11 personnes.',
    description:
      'Yacht récent (2022) entièrement équipé. Maître d’hôtel et chef italien embarqués. Itinéraire ajustable selon météo et envies. Tender Riva pour escapades terrestres. Plongées privées PADI encadrées. Réservations restaurants étoilés (Da Paolino, Il San Pietro) confirmées d’avance.',
    images: [
      img('benetti-yacht-amalfi-coast', 'Yacht Benetti en croisière'),
      img('amalfi-coast-positano', 'Côte amalfitaine vue du yacht'),
      img('capri-marina-piccola', 'Mouillage Marina Piccola'),
      img('luxury-yacht-cabin', 'Cabine principale du yacht'),
    ],
    createdAt: '2026-04-12T14:00:00.000Z',
  },
  {
    id: 'jrn-03',
    slug: 'expedition-greenland-icebergs',
    title: 'Expédition — Côte est du Groenland',
    kind: 'expedition',
    durationDays: 9,
    origin: 'Reykjavík',
    destinations: 'Akureyri · Ittoqqortoormiit · Scoresby Sund · Húsavík',
    earliestStart: '2026-08-10',
    guestCapacity: 12,
    inclusions: [
      'Vol charter Reykjavík → Constable Pynt (Twin Otter)',
      'Expédition à bord d’un brise-glace classe 1B',
      'Encadrement scientifique (glaciologue, ornithologue)',
      'Vêtements polaires fournis (Canada Goose Expedition)',
      'Pension complète, chef nordique',
    ],
    exclusions: ['Vol vers l’Islande', 'Assurance évacuation polaire (recommandée)'],
    legs: [
      { date: '2026-08-10', location: 'Reykjavík', highlight: 'Embarquement à Reykjavík' },
      {
        date: '2026-08-12',
        location: 'Constable Pynt',
        highlight: 'Atterrissage Twin Otter sur piste glacée',
      },
      {
        date: '2026-08-14',
        location: 'Scoresby Sund',
        highlight: 'Plus grand fjord du monde, icebergs tabulaires',
      },
      {
        date: '2026-08-16',
        location: 'Ittoqqortoormiit',
        highlight: 'Village inuit le plus isolé du Groenland',
      },
      { date: '2026-08-18', location: 'Húsavík', highlight: 'Observation baleines à bosse' },
    ],
    summary:
      'Expédition 9 jours brise-glace côte est groenlandaise, encadrement scientifique, 12 voyageurs maximum.',
    description:
      'Expédition rare réservée à 12 voyageurs. Brise-glace classe 1B armé pour les glaces du Scoresby Sund. Encadrement scientifique : un glaciologue et un ornithologue à bord. Possibilité de descente en zodiac aux abords des fronts de glaciers. Conditions polaires : courage et goût de l’aventure attendus.',
    images: [
      img('greenland-icebergs', 'Icebergs tabulaires Scoresby Sund'),
      img('arctic-expedition-ship', 'Brise-glace en zone polaire'),
      img('zodiac-boat-icebergs', 'Sortie zodiac vers le glacier'),
      img('inuit-village-greenland', 'Village inuit groenlandais'),
    ],
    createdAt: '2026-04-04T09:00:00.000Z',
  },
  {
    id: 'jrn-04',
    slug: 'private-jet-tour-japan',
    title: 'Tour du Japon en jet privé — 12 jours',
    kind: 'private-jet',
    durationDays: 12,
    origin: 'Genève',
    destinations: 'Tokyo · Kanazawa · Kyoto · Naoshima · Hokkaido · Okinawa',
    earliestStart: '2026-10-15',
    guestCapacity: 8,
    inclusions: [
      'Jet privé Bombardier Global 7500 sur la durée totale',
      'Hôtels Aman et ryokans privatisés',
      'Guide bilingue privé chaque ville',
      'Pension complète restaurants étoilés (Sukiyabashi Jiro, Kyô Aji…)',
      'Transferts limousine et shinkansen verts privés',
    ],
    exclusions: ['Visa', 'Achats personnels', 'Pourboires'],
    legs: [
      {
        date: '2026-10-15',
        location: 'Genève → Tokyo',
        highlight: 'Décollage Genève, Bombardier Global 7500',
      },
      { date: '2026-10-17', location: 'Kanazawa', highlight: 'Visite privée du marché Ômichô' },
      {
        date: '2026-10-19',
        location: 'Kyoto',
        highlight: 'Aman Kyoto privatisé, cérémonie du thé',
      },
      {
        date: '2026-10-22',
        location: 'Naoshima',
        highlight: 'Île de l’art, Chichu Art Museum privé',
      },
      { date: '2026-10-24', location: 'Hokkaido', highlight: 'Onsen privé en plein air' },
      { date: '2026-10-26', location: 'Okinawa', highlight: 'Plongée privée récif corallien' },
    ],
    summary:
      'Itinéraire 12 jours, jet privé sur la durée, 6 régions japonaises, ryokans Aman privatisés.',
    description:
      'Tour conçu sur mesure couvrant 6 régions emblématiques. Bombardier Global 7500 réservé exclusivement, ce qui permet une grande flexibilité d’itinéraire. Hôtels Aman et ryokans choisis pour leur authenticité. Réservations restaurants 3 étoiles confirmées 6 mois à l’avance.',
    images: [
      img('japan-kyoto-aman', 'Aman Kyoto'),
      img('private-jet-japan', 'Bombardier Global 7500'),
      img('naoshima-art-island', 'Île de Naoshima'),
      img('hokkaido-onsen-private', 'Onsen privé Hokkaido'),
    ],
    createdAt: '2026-03-28T13:00:00.000Z',
  },
  {
    id: 'jrn-05',
    slug: 'rail-orient-express-istanbul',
    title: 'Venice Simplon-Orient-Express — Paris-Istanbul',
    kind: 'rail-luxury',
    durationDays: 6,
    origin: 'Paris',
    destinations: 'Paris · Budapest · Bucharest · Istanbul',
    earliestStart: '2026-08-25',
    guestCapacity: 4,
    inclusions: [
      'Cabine Grand Suite (Istanbul) avec salon privé',
      'Service voiturier 24/7',
      'Pension complète, dîners gastronomiques par chef étoilé',
      'Excursions à terre privatisées (Budapest, Sinaia)',
      'Transfert ARR Istanbul → Hôtel Pera Palace',
    ],
    exclusions: ['Vols A/R', 'Hôtels en début et fin de voyage'],
    legs: [
      {
        date: '2026-08-25',
        location: 'Paris Gare de l’Est',
        highlight: 'Embarquement Grand Suite',
      },
      { date: '2026-08-26', location: 'Budapest', highlight: 'Excursion privée Castle Hill' },
      { date: '2026-08-28', location: 'Sinaia', highlight: 'Château de Peleș privatisé' },
      { date: '2026-08-30', location: 'Istanbul Sirkeci', highlight: 'Arrivée — Pera Palace' },
    ],
    summary:
      'Voyage 6 jours Paris-Istanbul en Venice Simplon-Orient-Express, Grand Suite, salon privé inclus.',
    description:
      'Itinéraire historique, train d’époque restauré. Grand Suite (la plus haute catégorie disponible) avec salon privé, salle de bains marbre, service voiturier dédié. Dîners gastronomiques par chef étoilé. Deux excursions à terre privatisées en cours de route. À l’arrivée Istanbul, transfert au Pera Palace inclus.',
    images: [
      img('venice-simplon-orient-express', 'Train Venice Simplon-Orient-Express'),
      img('orient-express-cabin-luxury', 'Grand Suite Istanbul'),
      img('istanbul-pera-palace', 'Pera Palace Istanbul'),
    ],
    createdAt: '2026-03-22T11:00:00.000Z',
  },
  {
    id: 'jrn-06',
    slug: 'helicopter-iceland-photography',
    title: 'Hélicoptère photographique — Highlands islandais',
    kind: 'expedition',
    durationDays: 5,
    origin: 'Reykjavík',
    destinations: 'Þórsmörk · Landmannalaugar · Vatnajökull · Askja',
    earliestStart: '2026-08-05',
    guestCapacity: 4,
    inclusions: [
      'Airbus H145 privatisé sur 5 jours',
      'Photographe National Geographic en accompagnement',
      'Hôtel boutique en pension complète (Buubble Highland Centre)',
      'Tirages signés A1 envoyés post-voyage',
    ],
    exclusions: ['Vol vers Reykjavík'],
    legs: [
      {
        date: '2026-08-05',
        location: 'Reykjavík → Þórsmörk',
        highlight: 'Premier vol au coucher de soleil',
      },
      {
        date: '2026-08-07',
        location: 'Landmannalaugar',
        highlight: 'Couleurs rhyolitiques au lever',
      },
      { date: '2026-08-08', location: 'Vatnajökull', highlight: 'Survol grottes de glace' },
      { date: '2026-08-09', location: 'Askja', highlight: 'Caldeira et lac thermal' },
    ],
    summary:
      'Cinq jours en hélicoptère privé sur les Highlands islandais, photographe National Geographic en accompagnement.',
    description:
      'Itinéraire conçu pour les amateurs de photographie de paysage. Airbus H145 privatisé sur 5 jours, photographe National Geographic en encadrement (cours sur place, retouche post-voyage incluse). Tirages A1 signés livrés à domicile.',
    images: [
      img('iceland-highlands-helicopter', 'Hélicoptère sur les Highlands'),
      img('landmannalaugar-iceland', 'Landmannalaugar'),
      img('iceland-glacier-vatnajokull', 'Glacier Vatnajökull'),
    ],
    createdAt: '2026-03-15T14:00:00.000Z',
  },
  {
    id: 'jrn-07',
    slug: 'yacht-norway-fjords',
    title: 'Yacht — Fjords norvégiens (Sunrise 65 m)',
    kind: 'yacht',
    durationDays: 14,
    origin: 'Bergen',
    destinations: 'Bergen · Geirangerfjord · Trolltunga · Lofoten · Tromsø',
    earliestStart: '2026-07-01',
    guestCapacity: 12,
    inclusions: [
      'Yacht expédition Sunrise 65 m, équipage 14',
      'Hélicoptère embarqué (Airbus H125)',
      'Tender Riva Aquariva',
      'Guide de montagne suisse pour ascensions Trolltunga',
      'Pension complète',
    ],
    exclusions: ['Vol jusqu’à Bergen', 'Activités terrestres optionnelles'],
    legs: [
      { date: '2026-07-01', location: 'Bergen', highlight: 'Embarquement et brief équipage' },
      {
        date: '2026-07-04',
        location: 'Geirangerfjord',
        highlight: 'Mouillage face aux Sept Sœurs',
      },
      {
        date: '2026-07-07',
        location: 'Trolltunga',
        highlight: 'Ascension guidée + retour héliporté',
      },
      { date: '2026-07-10', location: 'Lofoten', highlight: 'Soleil de minuit, pêche au saumon' },
      { date: '2026-07-14', location: 'Tromsø', highlight: 'Débarquement matinal' },
    ],
    summary: 'Croisière 14 jours yacht expédition 65 m, hélicoptère embarqué, fjords norvégiens.',
    description:
      'Yacht expédition ice-class, conçu pour les conditions nordiques. Hélicoptère embarqué pour ascensions et survols. Guide de montagne suisse pour les randonnées (Trolltunga, Preikestolen). Soleil de minuit en juillet. Réservations restaurants Maaemo et Re-naa confirmées.',
    images: [
      img('norway-fjords-yacht', 'Yacht en Geirangerfjord'),
      img('lofoten-islands-norway', 'Îles Lofoten'),
      img('trolltunga-norway', 'Trolltunga vue aérienne'),
    ],
    createdAt: '2026-03-08T11:00:00.000Z',
  },
];
