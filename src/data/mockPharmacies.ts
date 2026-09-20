import { Pharmacy, PharmacyDrugStock, CityInfo } from '../types';

export const TOGO_CITIES: CityInfo[] = [
  { name: 'Lomé', region: 'Maritime', pharmacyCount: 142, lat: 6.1375, lng: 1.2125 },
  { name: 'Kara', region: 'Kara', pharmacyCount: 22, lat: 9.5511, lng: 1.1861 },
  { name: 'Sokodé', region: 'Centrale', pharmacyCount: 18, lat: 8.9833, lng: 1.1333 },
  { name: 'Atakpamé', region: 'Plateaux', pharmacyCount: 15, lat: 7.5269, lng: 1.1297 },
  { name: 'Kpalimé', region: 'Plateaux', pharmacyCount: 16, lat: 6.9031, lng: 0.6294 },
  { name: 'Dapaong', region: 'Savanes', pharmacyCount: 12, lat: 10.8633, lng: 0.2078 },
  { name: 'Tsévié', region: 'Maritime', pharmacyCount: 14, lat: 6.4261, lng: 1.2133 },
  { name: 'Aného', region: 'Maritime', pharmacyCount: 9, lat: 6.2278, lng: 1.5972 },
];

export const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharma-1',
    name: 'Pharmacie Agoè Assiyéyé',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Agoè-Nyivé',
    address: 'Face au Grand Marché d\'Agoè Assiyéyé, Boulevard du 13 Janvier',
    lat: 6.2085,
    lng: 1.2135,
    phone: '+228 90 12 34 56',
    phoneSecondary: '+228 22 25 11 00',
    whatsapp: '22890123456',
    email: 'contact@pharmacieagoe.tg',
    pharmacistInCharge: 'Dr. Kossi AGBEKO',
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: '2026-08-07', type: '24H', notes: 'Garde Officielle de Nuit & Dimanche' },
      { date: '2026-08-08', type: 'NUIT', notes: 'Garde de Nuit 20h - 08h' }
    ],
    hours: {
      weekday: '07h00 - 22h00 (24h/24 en garde)',
      saturday: '07h30 - 22h00',
      sunday: '08h00 - 20h00 (En Garde)'
    },
    photos: [
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['GARDE_24H', 'PAIEMENT_MOBILE', 'LIVRAISON', 'TEST_RAPIDE_PALU', 'PRISE_TENSION'],
    mobilePayments: ['T-Money', 'Flooz', 'Carte Bancaire'],
    lastVerified: '2026-08-07 (Confirmé par téléphone)',
    rating: 4.8,
    reviewCount: 42,
    verificationSource: 'Appel direct',
    claimed: true
  },
  {
    id: 'pharma-2',
    name: 'Pharmacie De La Paix',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Agbalépédogan',
    address: 'Avenue de la Chance, près du Carrefour Campus Nord',
    lat: 6.1842,
    lng: 1.2051,
    phone: '+228 91 88 77 66',
    whatsapp: '22891887766',
    email: 'delapaix.lome@gmail.com',
    pharmacistInCharge: 'Dr. Afi KOFFI-DOSSOU',
    status: 'OPEN',
    is24h: false,
    isGuardToday: false,
    guardSchedule: [
      { date: '2026-08-12', type: 'NUIT', notes: 'Prochaine garde nocturne' }
    ],
    hours: {
      weekday: '07h30 - 21h30',
      saturday: '08h00 - 21h00',
      sunday: 'Fermé (sauf garde)'
    },
    photos: [
      'https://images.unsplash.com/photo-1631549912265-f483a93e36e9?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['PAIEMENT_MOBILE', 'CONSEIL_ORAL', 'PRISE_TENSION', 'TEST_GLYCEMIE'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-06 (Visite terrain)',
    rating: 4.6,
    reviewCount: 29,
    verificationSource: 'Visite de terrain',
    claimed: true
  },
  {
    id: 'pharma-3',
    name: 'Pharmacie Populaire Tokoin',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Tokoin-Nifidji',
    address: 'Face CHU Sylvanus Olympio, Boulevard Léopold Sédar Senghor',
    lat: 6.1488,
    lng: 1.2188,
    phone: '+228 92 33 44 55',
    phoneSecondary: '+228 22 21 05 40',
    whatsapp: '22892334455',
    email: 'tokoin@populaire.tg',
    pharmacistInCharge: 'Dr. Edem EKLOU',
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: '2026-08-07', type: '24H', notes: 'Garde Urgence CHU' }
    ],
    hours: {
      weekday: '07h00 - 23h00 (24h/24 en garde)',
      saturday: '07h00 - 23h00',
      sunday: '07h00 - 23h00'
    },
    photos: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['GARDE_24H', 'LIVRAISON', 'PAIEMENT_MOBILE', 'TEST_RAPIDE_PALU', 'PRISE_TENSION', 'TEST_GLYCEMIE'],
    mobilePayments: ['T-Money', 'Flooz', 'Carte Bancaire'],
    lastVerified: '2026-08-07 (Ordre des Pharmaciens)',
    rating: 4.9,
    reviewCount: 88,
    verificationSource: 'Ordre des Pharmaciens',
    claimed: true
  },
  {
    id: 'pharma-4',
    name: 'Pharmacie Saint Joseph',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Bé-Gényigba',
    address: 'Rue de l\'Hôpital Bé, proche de la Laguna',
    lat: 6.1320,
    lng: 1.2380,
    phone: '+228 93 45 67 89',
    whatsapp: '22893456789',
    email: 'stjoseph.be@yahoo.fr',
    pharmacistInCharge: 'Dr. Ablavi MENSAH',
    status: 'OPEN',
    is24h: false,
    isGuardToday: false,
    hours: {
      weekday: '07h30 - 21h00',
      saturday: '08h00 - 20h00',
      sunday: 'Fermé'
    },
    photos: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['PAIEMENT_MOBILE', 'CONSEIL_ORAL'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-05 (Appel direct)',
    rating: 4.3,
    reviewCount: 17,
    verificationSource: 'Appel direct',
    claimed: false
  },
  {
    id: 'pharma-5',
    name: 'Pharmacie Espoir Totsi',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Totsi',
    address: 'Carrefour Totsi, à côté de la station Total',
    lat: 6.1980,
    lng: 1.1920,
    phone: '+228 90 99 88 77',
    whatsapp: '22890998877',
    email: 'espoir.totsi@galenis.tg',
    pharmacistInCharge: 'Dr. Mawuli LAWSON',
    status: 'OPEN',
    is24h: false,
    isGuardToday: false,
    hours: {
      weekday: '07h30 - 21h30',
      saturday: '08h00 - 21h00',
      sunday: '09h00 - 15h00'
    },
    photos: [
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['PAIEMENT_MOBILE', 'LIVRAISON', 'TEST_RAPIDE_PALU'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-07 (Déclaration pharmacie)',
    rating: 4.7,
    reviewCount: 35,
    verificationSource: 'Déclaration pharmacie',
    claimed: true
  },
  {
    id: 'pharma-6',
    name: 'Pharmacie Hedzranawoé Aéroport',
    region: 'Maritime',
    city: 'Lomé',
    quarter: 'Hedzranawoé',
    address: 'Route de l\'Aéroport Gnassingbé Eyadéma, près du Marché Hedzranawoé',
    lat: 6.1680,
    lng: 1.2350,
    phone: '+228 96 11 22 33',
    whatsapp: '22896112233',
    email: 'hedzranawoe@pharma.tg',
    pharmacistInCharge: 'Dr. Komlan AKAKPO',
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: '2026-08-07', type: '24H', notes: 'Garde Zone Aéroport' }
    ],
    hours: {
      weekday: '07h30 - 22h00',
      saturday: '07h30 - 22h00',
      sunday: '24h/24 (En Garde)'
    },
    photos: [
      'https://images.unsplash.com/photo-1631549912265-f483a93e36e9?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['GARDE_24H', 'PAIEMENT_MOBILE', 'LIVRAISON', 'PRISE_TENSION'],
    mobilePayments: ['T-Money', 'Flooz', 'Carte Bancaire'],
    lastVerified: '2026-08-07 (Confirmé par téléphone)',
    rating: 4.5,
    reviewCount: 51,
    verificationSource: 'Appel direct',
    claimed: true
  },
  {
    id: 'pharma-7',
    name: 'Pharmacie Principale Kara',
    region: 'Kara',
    city: 'Kara',
    quarter: 'Château',
    address: 'Avenue de la Kozah, à 200m du Grand Marché de Kara',
    lat: 9.5511,
    lng: 1.1861,
    phone: '+228 90 44 55 66',
    whatsapp: '22890445566',
    email: 'principale.kara@galenis.tg',
    pharmacistInCharge: 'Dr. Essowavana BATCHASSI',
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: '2026-08-07', type: '24H', notes: 'Garde Régionale Kara Central' }
    ],
    hours: {
      weekday: '07h00 - 22h00',
      saturday: '07h00 - 22h00',
      sunday: '24h/24 (En Garde)'
    },
    photos: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['GARDE_24H', 'PAIEMENT_MOBILE', 'TEST_RAPIDE_PALU', 'PRISE_TENSION'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-07 (Appel direct)',
    rating: 4.9,
    reviewCount: 63,
    verificationSource: 'Appel direct',
    claimed: true
  },
  {
    id: 'pharma-8',
    name: 'Pharmacie Du Centre Sokodé',
    region: 'Centrale',
    city: 'Sokodé',
    quarter: 'Komah',
    address: 'Nationale N1, face à la BIA Togo Sokodé',
    lat: 8.9833,
    lng: 1.1333,
    phone: '+228 91 22 33 44',
    whatsapp: '22891223344',
    email: 'sokode.pharmacie@gmail.com',
    pharmacistInCharge: 'Dr. Issa OURO-AGOUDA',
    status: 'OPEN',
    is24h: false,
    isGuardToday: false,
    hours: {
      weekday: '07h30 - 21h00',
      saturday: '08h00 - 20h30',
      sunday: 'Fermé'
    },
    photos: [
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['PAIEMENT_MOBILE', 'CONSEIL_ORAL', 'TEST_RAPIDE_PALU'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-04 (Visite de terrain)',
    rating: 4.4,
    reviewCount: 22,
    verificationSource: 'Visite de terrain',
    claimed: false
  },
  {
    id: 'pharma-9',
    name: 'Pharmacie du Grand Marché Kpalimé',
    region: 'Plateaux',
    city: 'Kpalimé',
    quarter: 'Commercial',
    address: 'Rue de la Gare, proche du Marché Central de Kpalimé',
    lat: 6.9031,
    lng: 0.6294,
    phone: '+228 92 11 00 99',
    whatsapp: '22892110099',
    email: 'kpalime.pharma@gmail.com',
    pharmacistInCharge: 'Dr. Yao DZIDO',
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: '2026-08-07', type: '24H', notes: 'Garde de Nuit Kpalimé' }
    ],
    hours: {
      weekday: '07h30 - 21h00 (24h/24 en garde)',
      saturday: '08h00 - 21h00',
      sunday: 'En Garde 24h'
    },
    photos: [
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['GARDE_24H', 'PAIEMENT_MOBILE', 'TEST_RAPIDE_PALU', 'PRISE_TENSION'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-07 (Confirmé par téléphone)',
    rating: 4.8,
    reviewCount: 31,
    verificationSource: 'Appel direct',
    claimed: true
  },
  {
    id: 'pharma-10',
    name: 'Pharmacie Les Savanes Dapaong',
    region: 'Savanes',
    city: 'Dapaong',
    quarter: 'Nyalé',
    address: 'Avenue de la Paix, à côté du CHR de Dapaong',
    lat: 10.8633,
    lng: 0.2078,
    phone: '+228 90 77 66 55',
    whatsapp: '22890776655',
    email: 'dapaong.savanes@galenis.tg',
    pharmacistInCharge: 'Dr. Yendoube KOMBATE',
    status: 'OPEN',
    is24h: false,
    isGuardToday: false,
    hours: {
      weekday: '07h30 - 20h30',
      saturday: '08h00 - 20h00',
      sunday: '08h00 - 13h00'
    },
    photos: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    ],
    services: ['PAIEMENT_MOBILE', 'CONSEIL_ORAL', 'TEST_RAPIDE_PALU'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: '2026-08-06 (Ordre des Pharmaciens)',
    rating: 4.6,
    reviewCount: 19,
    verificationSource: 'Ordre des Pharmaciens',
    claimed: true
  }
];

export const INITIAL_DRUG_STOCKS: PharmacyDrugStock[] = [
  // Pharmacy 1 (Agoe Assiyeye)
  { pharmacyId: 'pharma-1', drugId: 'drug-1', status: 'AVAILABLE', priceFcfa: 450, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-2', status: 'AVAILABLE', priceFcfa: 1200, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-3', status: 'AVAILABLE', priceFcfa: 2500, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-4', status: 'AVAILABLE', priceFcfa: 800, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-5', status: 'AVAILABLE', priceFcfa: 1500, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-9', status: 'AVAILABLE', priceFcfa: 3200, lastUpdated: '2026-08-07 08:30' },
  { pharmacyId: 'pharma-1', drugId: 'drug-11', status: 'AVAILABLE', priceFcfa: 6800, lastUpdated: '2026-08-07 08:30' },

  // Pharmacy 2 (De La Paix - Agbalepedogan)
  { pharmacyId: 'pharma-2', drugId: 'drug-1', status: 'AVAILABLE', priceFcfa: 500, lastUpdated: '2026-08-06 17:00' },
  { pharmacyId: 'pharma-2', drugId: 'drug-2', status: 'OUT_OF_STOCK', priceFcfa: 1250, lastUpdated: '2026-08-06 17:00' },
  { pharmacyId: 'pharma-2', drugId: 'drug-3', status: 'AVAILABLE', priceFcfa: 2400, lastUpdated: '2026-08-06 17:00' },
  { pharmacyId: 'pharma-2', drugId: 'drug-5', status: 'ORDER_POSSIBLE', priceFcfa: 1600, lastUpdated: '2026-08-06 17:00' },
  { pharmacyId: 'pharma-2', drugId: 'drug-11', status: 'OUT_OF_STOCK', priceFcfa: 7100, lastUpdated: '2026-08-06 17:00' },

  // Pharmacy 3 (Populaire Tokoin)
  { pharmacyId: 'pharma-3', drugId: 'drug-1', status: 'AVAILABLE', priceFcfa: 450, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-2', status: 'AVAILABLE', priceFcfa: 1150, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-3', status: 'AVAILABLE', priceFcfa: 2300, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-4', status: 'AVAILABLE', priceFcfa: 750, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-6', status: 'AVAILABLE', priceFcfa: 1800, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-9', status: 'AVAILABLE', priceFcfa: 3100, lastUpdated: '2026-08-07 07:15' },
  { pharmacyId: 'pharma-3', drugId: 'drug-11', status: 'AVAILABLE', priceFcfa: 6500, lastUpdated: '2026-08-07 07:15' },

  // Pharmacy 7 (Principale Kara)
  { pharmacyId: 'pharma-7', drugId: 'drug-1', status: 'AVAILABLE', priceFcfa: 450, lastUpdated: '2026-08-07 08:00' },
  { pharmacyId: 'pharma-7', drugId: 'drug-3', status: 'AVAILABLE', priceFcfa: 2500, lastUpdated: '2026-08-07 08:00' },
  { pharmacyId: 'pharma-7', drugId: 'drug-4', status: 'AVAILABLE', priceFcfa: 800, lastUpdated: '2026-08-07 08:00' }
];
