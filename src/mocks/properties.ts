// ═══════════════════════════════════════════════════
// Properties mock dataset — lot B fake data
//
// 8 curated residences across Switzerland and select EU regions.
// Content is editorial-grade, not Lorem. Replace before V2 prod.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Property } from '@/types/property';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const properties: Property[] = [
  {
    id: 'prop-01',
    slug: 'chalet-hauts-verbier',
    title: 'Chalet sur les hauts de Verbier',
    kind: 'chalet',
    availability: 'sale',
    region: 'Valais',
    countryCode: 'CH',
    surfaceSqm: 540,
    bedrooms: 7,
    bathrooms: 6,
    plotSqm: 1850,
    yearBuilt: 2019,
    summary:
      'Chalet contemporain en mélèze patiné, vue dégagée sur les Combins, accès ski-in via la Médran 1.',
    description:
      'Architecture signée par un atelier vaudois, livré en 2019 puis réhabilité en 2024. Volumes ouverts au rez, double séjour cathédrale, cuisine professionnelle, salle de cinéma 12 places. Spa privé avec piscine intérieure 12 m, hammam, salle de sport. Ski-room équipé, garage 4 voitures. Personnel pouvant être maintenu en place sur entente.',
    highlights: [
      'Ski-in via Médran 1',
      'Spa et piscine intérieure 12 m',
      'Salle de cinéma 12 places',
      'Personnel optionnel maintenu',
    ],
    images: [
      img('chalet-alps-luxury', 'Façade extérieure du chalet en mélèze'),
      img('chalet-living-room-fireplace', 'Double séjour avec cheminée'),
      img('mountain-view-window', 'Vue sur les Combins depuis la baie vitrée'),
      img('luxury-kitchen-marble', 'Cuisine professionnelle en marbre'),
      img('spa-pool-indoor', 'Spa et piscine intérieure'),
      img('cinema-room-luxury', 'Salle de cinéma privée'),
    ],
    createdAt: '2026-04-12T09:00:00.000Z',
  },
  {
    id: 'prop-02',
    slug: 'penthouse-quai-mont-blanc',
    title: 'Penthouse Quai du Mont-Blanc',
    kind: 'penthouse',
    availability: 'rent',
    region: 'Genève',
    countryCode: 'CH',
    surfaceSqm: 380,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 1907,
    summary:
      'Dernier étage d’un immeuble Belle Époque face à la rade, terrasses 360°, ascenseur privatif.',
    description:
      'Distribution sur deux niveaux, 380 m² habitables et 220 m² de terrasses. Hauteur sous plafond 3,40 m, parquet versaillais d’origine restauré. Domotique Lutron complète, climatisation discrète. Ascenseur privatif desservant un parking 3 places. Conciergerie 24/7 de l’immeuble.',
    highlights: [
      'Vue rade et jet d’eau',
      '220 m² de terrasses',
      'Ascenseur privatif',
      'Conciergerie d’immeuble 24/7',
    ],
    images: [
      img('geneva-lake-luxury-apartment', 'Terrasse face à la rade de Genève'),
      img('belle-epoque-interior', 'Salon Belle Époque restauré'),
      img('master-bedroom-luxury-lake', 'Suite parentale vue lac'),
      img('luxury-bathroom-marble', 'Salle de bains en marbre Calacatta'),
      img('rooftop-terrace-geneva', 'Terrasse panoramique 360°'),
    ],
    createdAt: '2026-04-08T11:00:00.000Z',
  },
  {
    id: 'prop-03',
    slug: 'villa-cap-ferrat',
    title: 'Villa au Cap-Ferrat',
    kind: 'villa',
    availability: 'sale',
    region: 'Côte d’Azur',
    countryCode: 'FR',
    surfaceSqm: 720,
    bedrooms: 8,
    bathrooms: 9,
    plotSqm: 4200,
    yearBuilt: 1928,
    summary:
      'Villa Belle Époque en bord de mer, jardin méditerranéen mature, ponton privé homologué jusqu’à 22 m.',
    description:
      'Propriété emblématique, restaurée en 2022 par un atelier provençal. Volumes classiques, sol en travertin de Tivoli, boiseries d’origine. Maison principale et dépendance personnel séparée. Piscine miroir de 22 m face à la mer, terrasses étagées, jardin signé Russell Page restauré. Ponton privé en bord de Méditerranée.',
    highlights: [
      'Bord de mer Cap-Ferrat',
      'Ponton privé jusqu’à 22 m',
      'Jardin Russell Page restauré',
      'Maison de personnel séparée',
    ],
    images: [
      img('cap-ferrat-villa-sea', 'Villa face à la Méditerranée'),
      img('mediterranean-garden-villa', 'Jardin méditerranéen mature'),
      img('infinity-pool-sea-view', 'Piscine miroir face à la mer'),
      img('belle-epoque-villa-interior', 'Salon principal'),
      img('master-suite-sea-view', 'Suite parentale vue mer'),
      img('private-pier-mediterranean', 'Ponton privé homologué'),
    ],
    createdAt: '2026-04-04T14:30:00.000Z',
  },
  {
    id: 'prop-04',
    slug: 'townhouse-belgravia',
    title: 'Maison de ville à Belgravia',
    kind: 'townhouse',
    availability: 'sale',
    region: 'London',
    countryCode: 'GB',
    surfaceSqm: 460,
    bedrooms: 5,
    bathrooms: 5,
    yearBuilt: 1850,
    summary: 'Maison en stuc blanc à Eaton Square, 5 niveaux, ascenseur privatif, jardin clos.',
    description:
      'Architecture victorienne classique avec restauration intégrale livrée en 2023. Cinq niveaux desservis par ascenseur Otis discret. Cuisine Bulthaup, salle de réception au rez avec accès sur jardin clos. Suite parentale au 2e niveau, dressing sur mesure, salle de bains en onyx. Garage privé en mews.',
    highlights: [
      'Adresse Eaton Square',
      'Ascenseur privatif',
      'Jardin clos',
      'Garage privé en mews',
    ],
    images: [
      img('belgravia-townhouse-stucco', 'Façade en stuc blanc'),
      img('victorian-interior-london', 'Réception au rez-de-chaussée'),
      img('luxury-london-kitchen', 'Cuisine Bulthaup'),
      img('london-private-garden', 'Jardin clos privatif'),
    ],
    createdAt: '2026-03-30T10:00:00.000Z',
  },
  {
    id: 'prop-05',
    slug: 'estate-engadine',
    title: 'Domaine en Engadine',
    kind: 'estate',
    availability: 'sale',
    region: 'Grisons',
    countryCode: 'CH',
    surfaceSqm: 980,
    bedrooms: 9,
    bathrooms: 10,
    plotSqm: 12500,
    yearBuilt: 1898,
    summary:
      'Domaine historique en pierre et arole, lac privé, héliport homologué, accès direct aux pistes.',
    description:
      'Ancienne maison de famille d’un industriel zurichois, restaurée par un architecte de Saint-Moritz. Bâtiment principal de 720 m², ferme rénovée en maison d’invités de 260 m². Lac privé de 8 000 m² alimenté par source naturelle. Héliport classe FATO 1 homologué OFAC. Accès ski par téléphérique privé.',
    highlights: [
      'Lac privé alimenté par source',
      'Héliport homologué OFAC',
      'Téléphérique privé sur les pistes',
      'Maison d’invités séparée',
    ],
    images: [
      img('engadine-estate-mountains', 'Domaine en Engadine'),
      img('alpine-stone-house', 'Bâtiment principal en pierre et arole'),
      img('private-mountain-lake', 'Lac privé sur la propriété'),
      img('alpine-luxury-living', 'Salon principal avec cheminée d’angle'),
      img('mountain-helicopter-pad', 'Héliport homologué'),
    ],
    createdAt: '2026-03-22T08:00:00.000Z',
  },
  {
    id: 'prop-06',
    slug: 'villa-mykonos',
    title: 'Villa contemporaine à Mykonos',
    kind: 'villa',
    availability: 'rent',
    region: 'Cyclades',
    countryCode: 'GR',
    surfaceSqm: 510,
    bedrooms: 6,
    bathrooms: 7,
    plotSqm: 3200,
    yearBuilt: 2021,
    summary:
      'Architecture cycladique contemporaine, accès direct à une crique privée, piscine à débordement de 28 m.',
    description:
      'Volumes blancs, larges baies vitrées sur la mer Égée. Piscine à débordement de 28 m, jacuzzi extérieur, bar de plage privé. Six suites avec terrasses individuelles. Personnel inclus pour location estivale (cuisinier, gouvernante, capitaine).',
    highlights: [
      'Crique privée accessible',
      'Piscine 28 m à débordement',
      'Personnel inclus en location',
      'Vue Égée 270°',
    ],
    images: [
      img('mykonos-villa-pool-sea', 'Villa face à la mer Égée'),
      img('cycladic-architecture-pool', 'Piscine à débordement'),
      img('greek-villa-bedroom', 'Suite avec vue mer'),
      img('mediterranean-private-cove', 'Crique privée'),
    ],
    createdAt: '2026-03-15T13:00:00.000Z',
  },
  {
    id: 'prop-07',
    slug: 'penthouse-place-vendome',
    title: 'Appartement Place Vendôme',
    kind: 'penthouse',
    availability: 'sale',
    region: 'Paris',
    countryCode: 'FR',
    surfaceSqm: 320,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 1715,
    summary:
      'Appartement haussmannien restauré au-dessus d’une enseigne historique, vue directe sur la colonne.',
    description:
      'Distribution classique : enfilade de réception, suite parentale en façade, trois chambres d’invités. Hauteur sous plafond 4,20 m, parquets Versailles XVIIe d’origine, cheminées en marbre noir Saint-Pons. Climatisation invisible. Cave voûtée incluse.',
    highlights: [
      'Vue directe sur la colonne',
      'Hauteur sous plafond 4,20 m',
      'Cheminées XVIIe d’origine',
      'Cave voûtée incluse',
    ],
    images: [
      img('place-vendome-paris-view', 'Vue sur la place Vendôme'),
      img('haussmann-apartment-paris', 'Réception en enfilade'),
      img('parisian-luxury-bedroom', 'Suite parentale'),
      img('parquet-versailles-paris', 'Parquet Versailles XVIIe d’origine'),
    ],
    createdAt: '2026-03-08T15:00:00.000Z',
  },
  {
    id: 'prop-08',
    slug: 'villa-port-andratx',
    title: 'Villa à Port d’Andratx',
    kind: 'villa',
    availability: 'sale',
    region: 'Mallorca',
    countryCode: 'ES',
    surfaceSqm: 620,
    bedrooms: 6,
    bathrooms: 6,
    plotSqm: 2400,
    yearBuilt: 2018,
    summary:
      'Villa contemporaine surplombant le port, mouillage privé inclus, location de yacht jusqu’à 28 m.',
    description:
      'Architecture contemporaine signée d’un atelier majorquin. Vue cinématique sur la baie. Mouillage privé inclus dans la marina (28 m maximum). Lien direct piscine extérieure / piscine couverte. Salle de sport, cinéma, ascenseur sur 4 niveaux.',
    highlights: [
      'Mouillage 28 m inclus',
      'Vue cinématique sur le port',
      'Salle de sport et cinéma',
      'Ascenseur 4 niveaux',
    ],
    images: [
      img('mallorca-port-andratx', 'Vue sur le port'),
      img('contemporary-spanish-villa', 'Façade extérieure'),
      img('infinity-pool-mallorca', 'Piscine extérieure'),
      img('luxury-mallorca-bedroom', 'Suite avec vue port'),
    ],
    createdAt: '2026-03-01T11:00:00.000Z',
  },
];
