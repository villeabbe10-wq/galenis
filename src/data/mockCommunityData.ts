import { SanitaryAlert, CommunityReport, PharmacyReview, ActivityLogItem } from '../types';

export const INITIAL_SANITARY_ALERTS: SanitaryAlert[] = [
  {
    id: 'alt-2026-001',
    title: 'Rappel de lot : Paracétamol Sirop 120mg/5ml (Laboratoires Phyto-Care)',
    category: 'RAPPEL_LOT',
    severity: 'CRITIQUE',
    region: 'Toutes',
    publishedAt: '2026-08-20',
    source: 'Ordre des Pharmaciens',
    summary: 'Avis officiel de retrait préventif des flacons portant le lot n° PC-2409-B suite à un contrôle de conformité physico-chimique.',
    content: 'Le Ministère de la Santé et l\'Ordre National des Pharmaciens du Togo ordonnent le blocage immédiat et le retour aux grossistes-répartiteurs (CAMEG, COPHARMA, etc.) du lot PC-2409-B de Paracétamol Sirop pédiatrique. Les officines et centres de santé sont tenus de retirer ces unités des rayons.',
    affectedProducts: ['Paracétamol Sirop 120mg/5ml - Lot PC-2409-B (Exp: 11/2027)'],
    recommendations: [
      'Cesser immédiatement toute délivrance de ce lot spécifique.',
      'Inviter les patients détenteurs à rapporter le flacon en pharmacie pour remplacement sans frais.',
      'Signaler toute réaction indésirable suspecte sur le portail de pharmacovigilance.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'alt-2026-002',
    title: 'Campagne de Vigilance Paludisme & Approvisionnement en CTA (Artéméther-Luméfantrine)',
    category: 'EPIDEMIE',
    severity: 'VIGILANCE',
    region: 'Maritime',
    publishedAt: '2026-08-15',
    source: 'Ministère de la Santé',
    summary: 'Renforcement du stock d\'antipaludiques dans les officines de la région Maritime suite aux fortes pluies.',
    content: 'Dans le cadre du Programme National de Lutte contre le Paludisme (PNLP), un approvisionnement prioritaire en tests de diagnostic rapide (TDR) et combinaisons thérapeutiques (CTA) est déployé dans les pharmacies du Grand Lomé et des Lacs. Le prix sous subvention publique doit être rigoureusement respecté.',
    affectedProducts: ['Coartem / Artefan 20/120mg', 'Tests TDR Palu'],
    recommendations: [
      'Privilégier la réalisation d\'un test rapide TDR avant toute délivrance d\'antipaludique.',
      'Rappeler aux patients l\'importance de l\'utilisation de moustiquaires imprégnées (MILD).',
      'Signaler les ruptures d\'approvisionnement CTA au superviseur régional.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'alt-2026-003',
    title: 'Mise en garde contre les circuits informels de vente de médicaments (« Pharmacies par terre »)',
    category: 'INFO_SANTE',
    severity: 'INFO',
    region: 'Toutes',
    publishedAt: '2026-08-08',
    source: 'Galenis Togo',
    summary: 'Sensibilisation nationale sur les risques de contrefaçons et de dégradation thermique des molécules vendues hors officine.',
    content: 'Rappel à la population togolaise : l\'achat de médicaments auprès de marchands ambulants ou étals de rue expose à des risques graves d\'inefficacité thérapeutique, de surdosage ou d\'intoxication. Seules les pharmacies enregistrées et contrôlées par l\'Ordre garantissent la chaîne du froid et la traçabilité.',
    recommendations: [
      'Vérifier toujours l\'intégrité de l\'emballage, la date de péremption et le cachet de l\'officine.',
      'Utiliser Galenis Togo pour identifier la pharmacie de garde la plus proche 24h/24.'
    ],
    status: 'ACTIVE'
  }
];

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-2026-101',
    pharmacyId: 'pharma-1',
    pharmacyName: 'Pharmacie Agoè Assiyéyé',
    reporterName: 'Mawuli K.',
    reporterPhone: '+228 90 22 33 44',
    category: 'HORAIRES_INCORRECTS',
    description: 'Le service de garde a ouvert à 19h45 au lieu de 19h00 lors de la garde de dimanche soir. Le guichet de nuit était néanmoins bien opérationnel toute la nuit.',
    city: 'Lomé',
    region: 'Maritime',
    status: 'RESOLVED',
    urgency: 'MOYENNE',
    upvotes: 6,
    resolutionNotes: 'Vérifié avec le titulaire : léger retard de relais d\'équipe exceptionnel dû aux pluies. Horaires confirmés.',
    createdAt: '2026-08-18T20:30:00Z',
    resolvedAt: '2026-08-19T09:15:00Z'
  },
  {
    id: 'rep-2026-102',
    pharmacyId: 'pharma-4',
    pharmacyName: 'Pharmacie de l\'Aéroport',
    reporterName: 'Afiwa D.',
    reporterPhone: '+228 99 11 44 77',
    category: 'TELEPHONE_INJOIGNABLE',
    description: 'Le numéro fixe sonnait occupé en continu entre 22h et 23h. Le numéro WhatsApp secondaire est en revanche très réactif.',
    city: 'Lomé',
    region: 'Maritime',
    status: 'INVESTIGATING',
    urgency: 'HAUTE',
    upvotes: 11,
    resolutionNotes: 'Équipe Galenis en contact avec le secrétariat pour ajouter la ligne mobile directe de garde.',
    createdAt: '2026-08-21T22:45:00Z'
  },
  {
    id: 'rep-2026-103',
    pharmacyId: 'pharma-7',
    pharmacyName: 'Pharmacie Kara Centrale',
    reporterName: 'Essodina B.',
    reporterPhone: '+228 92 55 66 77',
    category: 'RUPTURE_MEDICAMENT',
    description: 'Rupture temporaire signalée sur l\'Amoxicilline suspension buvable 250mg hier soir, réapprovisionnement attendu auprès du grossiste.',
    city: 'Kara',
    region: 'Kara',
    status: 'RESOLVED',
    urgency: 'MOYENNE',
    upvotes: 4,
    resolutionNotes: 'Livraison reçue ce matin 08h30. Stock à nouveau disponible.',
    createdAt: '2026-08-20T14:10:00Z',
    resolvedAt: '2026-08-21T09:00:00Z'
  },
  {
    id: 'rep-2026-104',
    reporterName: 'Dr. Komla T.',
    category: 'SUSPICION_CONTREFACON',
    description: 'Vente signalée d\'antalgiques d\'origine douteuse sur le grand marché de Cacaveli. Signalement transmis aux autorités de contrôle.',
    city: 'Lomé',
    region: 'Maritime',
    status: 'INVESTIGATING',
    urgency: 'URGENTE',
    upvotes: 19,
    createdAt: '2026-08-21T11:20:00Z'
  }
];

export const INITIAL_PHARMACY_REVIEWS: PharmacyReview[] = [
  {
    id: 'rev-001',
    pharmacyId: 'pharma-1',
    pharmacyName: 'Pharmacie Agoè Assiyéyé',
    authorName: 'Sena Kodjo',
    city: 'Lomé',
    rating: 5,
    criteria: {
      accueil: 5,
      delaiAttente: 4,
      disponibiliteStock: 5,
      respectPrix: 5
    },
    title: 'Excellente prise en charge pendant la garde de nuit',
    comment: 'Je suis venu à 1h du matin pour une urgence pédiatrique. Le pharmacien a été très rassurant, a pris le temps d\'expliquer la posologie et a accepté le paiement T-Money sans aucun frais supplémentaire.',
    tags: ['Service nuit rapide', 'Flooz & T-Money ok', 'Conseil attentionné', 'Prise en charge INAM'],
    acceptsInam: true,
    paymentMethodUsed: 'T-Money',
    likes: 14,
    createdAt: '2026-08-19T02:30:00Z',
    pharmacyResponse: {
      responderName: 'Dr. Akakpo (Titulaire)',
      responseDate: '2026-08-19T10:00:00Z',
      comment: 'Merci beaucoup M. Kodjo pour votre confiance. Toute notre équipe de garde reste mobilisée pour la santé de nos concitoyens.'
    }
  },
  {
    id: 'rev-002',
    pharmacyId: 'pharma-2',
    pharmacyName: 'Pharmacie du Grand Marché',
    authorName: 'Akouvi Mensah',
    city: 'Lomé',
    rating: 4,
    criteria: {
      accueil: 4,
      delaiAttente: 3,
      disponibiliteStock: 5,
      respectPrix: 5
    },
    title: 'Stock très complet, un peu d\'attente aux heures de pointe',
    comment: 'Trouvé tous les produits de l\'ordonnance cardiologique prescrite au CHU Sylvanus Olympio. Il y avait un peu de monde à 17h mais les 4 guichets étaient ouverts.',
    tags: ['Stock complet', 'Prise en charge INAM', 'Carte Bancaire'],
    acceptsInam: true,
    paymentMethodUsed: 'Carte Bancaire',
    likes: 8,
    createdAt: '2026-08-17T18:15:00Z'
  },
  {
    id: 'rev-003',
    pharmacyId: 'pharma-7',
    pharmacyName: 'Pharmacie Kara Centrale',
    authorName: 'Patrice Tchala',
    city: 'Kara',
    rating: 5,
    criteria: {
      accueil: 5,
      delaiAttente: 5,
      disponibiliteStock: 4,
      respectPrix: 5
    },
    title: 'Accueil chaleureux et conseils avisés à Kara',
    comment: 'Personnel très professionnel et à l\'écoute. Possibilité de réserver par WhatsApp confirmée en moins de 10 minutes.',
    tags: ['Réservation WhatsApp', 'Flooz & T-Money ok', 'Conseil attentionné'],
    acceptsInam: true,
    paymentMethodUsed: 'Flooz',
    likes: 12,
    createdAt: '2026-08-16T11:45:00Z'
  },
  {
    id: 'rev-004',
    pharmacyId: 'pharma-8',
    pharmacyName: 'Pharmacie de la Paix - Sokodé',
    authorName: 'Foussena Ouro',
    city: 'Sokodé',
    rating: 4,
    criteria: {
      accueil: 4,
      delaiAttente: 4,
      disponibiliteStock: 4,
      respectPrix: 5
    },
    title: 'Bon service de proximité',
    comment: 'Officine propre, bien climatisée et personnel courtois. Test de glycémie rapide réalisé sur place.',
    tags: ['Test Glycémie', 'Conseil attentionné', 'Flooz & T-Money ok'],
    acceptsInam: false,
    paymentMethodUsed: 'T-Money',
    likes: 5,
    createdAt: '2026-08-14T09:20:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-001',
    type: 'ALERT_ISSUED',
    title: 'Nouvelle alerte sanitaire publiée',
    description: 'Rappel officiel de lot sur Paracétamol Sirop 120mg par l\'Ordre des Pharmaciens.',
    timestamp: 'Il y a 2 heures',
    region: 'National',
    userRole: 'ADMIN'
  },
  {
    id: 'act-002',
    type: 'REPORT_RESOLVED',
    title: 'Signalement citoyen résolu',
    description: 'Stock Amoxicilline réapprovisionné et confirmé à la Pharmacie Kara Centrale.',
    timestamp: 'Il y a 4 heures',
    entityName: 'Pharmacie Kara Centrale',
    region: 'Kara',
    userRole: 'PHARMACIEN'
  },
  {
    id: 'act-003',
    type: 'REVIEW_ADDED',
    title: 'Nouveau retour d\'expérience publié',
    description: 'Sena K. a noté 5/5 la Pharmacie Agoè Assiyéyé pour sa réactivité de garde.',
    timestamp: 'Il y a 6 heures',
    entityName: 'Pharmacie Agoè Assiyéyé',
    region: 'Maritime',
    userRole: 'CITOYEN'
  },
  {
    id: 'act-004',
    type: 'GUARD_UPDATED',
    title: 'Planning de garde certifié',
    description: 'Tour de garde du weekend validé pour 14 pharmacies du Grand Lomé.',
    timestamp: 'Il y a 12 heures',
    region: 'Maritime',
    userRole: 'ADMIN'
  },
  {
    id: 'act-005',
    type: 'PHARMACY_VERIFIED',
    title: 'Vérification terrain officine',
    description: 'Pharmacie des Plateaux (Kpalimé) mise à jour avec service 24h/24 actif.',
    timestamp: 'Hier',
    entityName: 'Pharmacie des Plateaux',
    region: 'Plateaux',
    userRole: 'SYSTEME'
  }
];
