// ═══════════════════════════════════════════════════
// Concierge services mock dataset — lot B fake data
// 8 service capabilities, anonymised case studies.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { ConciergeService } from '@/types/concierge';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const conciergeServices: ConciergeService[] = [
  {
    id: 'csv-01',
    slug: 'transport-aerien-prive',
    title: 'Transport aérien privé',
    category: 'transport',
    summary:
      'Réservation de jets et hélicoptères privés, fleet management, repositionnements urgents.',
    description:
      'Accès à un réseau de 240 jets et hélicoptères certifiés en Europe. Réservation possible sous 6 heures de préavis pour les vols court-courrier, 12 heures pour les long-courriers. Negociation tarifaire transparente, contrats encadrés par notre équipe juridique. Fleet management possible si vous possédez votre propre appareil.',
    caseStudies: [
      {
        context: 'Genève → Tokyo, 6 heures de préavis',
        outcome:
          'Bombardier Global 7500 décollé en 6h45, escale technique à Novossibirsk, arrivée Tokyo Haneda en 12h.',
      },
      {
        context: 'Milan → Cap-Ferrat, hélicoptère, météo dégradée',
        outcome:
          'Agusta AW139 IFR avec deux pilotes, vol confirmé sous 90 min, atterrissage hôtel.',
      },
    ],
    leadTime: '6h pour court-courrier, 12h pour long-courrier',
    images: [
      img('private-jet-tarmac', 'Jet privé sur tarmac'),
      img('helicopter-mountain-pad', 'Hélicoptère en altitude'),
    ],
    createdAt: '2026-04-22T10:00:00.000Z',
  },
  {
    id: 'csv-02',
    slug: 'gastronomie-reservations',
    title: 'Gastronomie — réservations 3 étoiles',
    category: 'gastronomy',
    summary:
      'Réservations dans les restaurants 3 étoiles dans le monde entier, chef à domicile, privatisations.',
    description:
      'Réseau direct avec les chefs des 138 restaurants 3 étoiles Michelin actuels. Réservations possibles sous 24h dans la plupart des cas, sous 7 jours pour les tables historiquement fermées (Sukiyabashi Jiro, El Celler de Can Roca…). Chef à domicile dans toute l’Europe, privatisations d’établissement, accord vins par sommelier MS.',
    caseStudies: [
      {
        context: 'Sukiyabashi Jiro, table de 4, préavis 5 jours',
        outcome:
          'Réservation confirmée via le chef Yoshikazu, omakase 22 pièces, accompagnement traducteur.',
      },
      {
        context: 'Privatisation Le Bernardin (NYC) pour anniversaire',
        outcome:
          'Établissement privatisé un dimanche, menu sur mesure 16 services par Eric Ripert.',
      },
    ],
    leadTime: '24h à 7 jours selon établissement',
    images: [
      img('three-star-michelin-restaurant', 'Restaurant 3 étoiles'),
      img('chef-tasting-menu-luxury', 'Menu dégustation gastronomique'),
    ],
    createdAt: '2026-04-18T14:00:00.000Z',
  },
  {
    id: 'csv-03',
    slug: 'securite-privee-rapprochee',
    title: 'Sécurité privée et protection rapprochée',
    category: 'security',
    summary:
      'Agents PR formés ex-services, équipes locales partenaires dans 80 pays, audit de domicile.',
    description:
      'Équipe interne d’agents de protection rapprochée certifiés (ex-services suisses, britanniques, israéliens). Audits de sécurité de domicile. Réseau partenaire dans 80 pays pour escortes locales. Contrats discrets, NDA standard, équipes féminines disponibles pour escortes familiales.',
    caseStudies: [
      {
        context: 'Audit complet villa privée — Cap d’Antibes',
        outcome:
          'Audit 5 jours, recommandations en 47 points, mise en œuvre supervisée sur 6 semaines.',
      },
      {
        context: 'Escorte rapprochée Dubaï → Genève → Aspen',
        outcome:
          'Équipe de 3 agents permanents, transitions douanes facilitées, zéro incident sur 21 jours.',
      },
    ],
    leadTime: '24h pour escorte simple, 7 jours pour audit',
    images: [
      img('private-security-luxury', 'Sécurité privée'),
      img('luxury-villa-security', 'Audit de villa'),
    ],
    createdAt: '2026-04-12T09:00:00.000Z',
  },
  {
    id: 'csv-04',
    slug: 'medical-prive-second-avis',
    title: 'Médical privé — second avis et évacuation',
    category: 'medical',
    summary:
      'Second avis dans 24h auprès des chefs de service européens, évacuations sanitaires aériennes.',
    description:
      'Réseau direct avec 30 chefs de service européens (Cleveland Clinic Londres, Charité Berlin, Pitié-Salpêtrière, HUG Genève…). Second avis confidentiel sous 24h. Évacuation sanitaire aérienne avec ambulance jet équipé soins intensifs. Pas de question financière en amont, on libère les ressources.',
    caseStudies: [
      {
        context: 'Second avis cardiologie — sous 18h',
        outcome:
          'Dossier complet remonté à un chef de service au Royal Brompton, avis écrit en 18h.',
      },
      {
        context: 'Évacuation aérienne Bali → Singapour',
        outcome:
          'Ambulance jet décollée en 4h depuis Singapour, prise en charge 24h en clinique privée.',
      },
    ],
    leadTime: 'Évacuation : 4h. Second avis : 24-48h.',
    images: [
      img('medical-evacuation-jet', 'Ambulance jet médicale'),
      img('luxury-hospital-private', 'Clinique privée'),
    ],
    createdAt: '2026-04-08T13:00:00.000Z',
  },
  {
    id: 'csv-05',
    slug: 'culturel-acces-prive',
    title: 'Accès privé culturel',
    category: 'cultural',
    summary:
      'Visites privées de musées hors heures, opéras et théâtres privatisés, rencontres artistes.',
    description:
      'Visites privées hors heures publiques (Louvre, Uffizi, Hermitage). Privatisations d’opéras et de théâtres pour soirées familiales. Rencontres organisées avec artistes vivants représentés par les grandes galeries. Coordination avec conservateurs et historiens d’art francophones.',
    caseStudies: [
      {
        context: 'Visite privée du Louvre, samedi soir, 6 personnes',
        outcome: 'Trois heures de visite en présence du conservateur du département des Peintures.',
      },
      {
        context: 'Soirée privée à La Scala — Don Giovanni',
        outcome: 'Salle privatisée pour 80 invités, chef d’orchestre rencontré en loge.',
      },
    ],
    leadTime: '14 à 30 jours selon institution',
    images: [
      img('private-museum-tour', 'Visite privée musée'),
      img('opera-house-luxury', 'Opéra historique'),
    ],
    createdAt: '2026-04-04T15:00:00.000Z',
  },
  {
    id: 'csv-06',
    slug: 'wellness-spa-prive',
    title: 'Bien-être et spa privé',
    category: 'wellness',
    summary:
      'Médecins du sport, kinés et thérapeutes en déplacement, programmes longévité personnalisés.',
    description:
      'Réseau de praticiens (médecins, kinés, ostéopathes, naturopathes) en déplacement à domicile, hôtel ou yacht. Programmes longévité personnalisés (Lanserhof, Clinique La Prairie, Buchinger Wilhelmi). Suivi à distance possible avec wearables.',
    caseStudies: [
      {
        context: 'Programme post-opératoire — kiné en yacht en Méditerranée',
        outcome:
          'Kiné spécialisé en orthopédie embarqué pour 14 jours, suivi par téléconsultation à terre.',
      },
      {
        context: 'Cure longévité 21 jours à Lanserhof Tegernsee',
        outcome: 'Suite privatisée, programme sur mesure, chef diététicien dédié.',
      },
    ],
    leadTime: '24h pour praticien, 14j pour cure',
    images: [
      img('luxury-spa-private', 'Spa privé'),
      img('wellness-retreat-luxury', 'Cure longévité'),
    ],
    createdAt: '2026-03-30T11:00:00.000Z',
  },
  {
    id: 'csv-07',
    slug: 'famille-nounous-tutorat',
    title: 'Famille — nounous et tutorat',
    category: 'family',
    summary: 'Nounous Norland, tutorat scolaire trilingue, voyages d’études encadrés.',
    description:
      'Recrutement de nounous Norland (UK), Norland-équivalent suisse (École Eden) et écoles francophones de référence. Tutorat scolaire trilingue (FR/EN/DE) pour cursus IB, MBA prépa et écoles privées suisses. Voyages d’études encadrés (Oxford-Cambridge, Stanford-MIT, Sciences Po-HEC).',
    caseStudies: [
      {
        context: 'Recrutement nounou Norland pour famille de 3 enfants',
        outcome:
          'Sélection en 4 semaines, contrat 3 ans signé, intégration accompagnée par psychologue.',
      },
      {
        context: 'Tutorat IB Math HL — Genève',
        outcome: 'Tuteur Cambridge MSc dépêché 3 fois par semaine, score final 7/7.',
      },
    ],
    leadTime: '4 à 12 semaines pour recrutement',
    images: [
      img('luxury-family-life', 'Vie de famille'),
      img('private-tutoring-luxury', 'Tutorat privé'),
    ],
    createdAt: '2026-03-25T09:00:00.000Z',
  },
  {
    id: 'csv-08',
    slug: 'logistique-evenements-prives',
    title: 'Logistique — événements privés',
    category: 'logistics',
    summary:
      'Mariages, anniversaires, retours de famille — coordination 6 mois en amont, équipes dédiées.',
    description:
      'Coordination intégrale d’événements privés (mariages, jubilés, retours de famille). Équipes dédiées Sawnext sur place, partenaires logistiques pré-validés. Maîtrise des protocoles diplomatiques. Confidentialité garantie par NDA.',
    caseStudies: [
      {
        context: 'Mariage 220 invités — Lac de Côme',
        outcome:
          'Coordination 9 mois, Villa del Balbianello privatisée, transports invités via Linate gérés.',
      },
      {
        context: 'Jubilé 80 ans — Saint-Moritz',
        outcome: 'Trois jours de programme, 60 invités, coordination skiable, dîner 14 services.',
      },
    ],
    leadTime: '3 à 9 mois selon ampleur',
    images: [
      img('luxury-wedding-lake-como', 'Mariage Lac de Côme'),
      img('private-event-mountain', 'Événement privé en montagne'),
    ],
    createdAt: '2026-03-15T10:00:00.000Z',
  },
];
