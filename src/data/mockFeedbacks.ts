import { AppFeedback } from '../types';

export const INITIAL_APP_FEEDBACKS: AppFeedback[] = [
  {
    id: 'fb-1',
    category: 'FONCTIONNALITE',
    title: 'Mode hors-ligne pour la consultation des pharmacies de garde',
    description: 'Serait-il possible de mettre en cache les pharmacies de garde du weekend pour pouvoir les consulter même en cas de coupure de réseau ou de faible connexion à Lomé ou en région ?',
    rating: 5,
    authorName: 'Dr. Mensah Kodjo',
    authorRole: 'PHARMACIEN',
    emailOrPhone: 'mensah.k@gmail.com',
    deviceType: 'MOBILE',
    upvotes: 42,
    status: 'PLANNED',
    adminResponse: {
      author: 'Équipe Technique Galenis',
      message: 'Excellente suggestion ! Le stockage local sécurisé est en cours de déploiement pour permettre la consultation hors-ligne avec synchronisation automatique.',
      respondedAt: '2026-08-25'
    },
    createdAt: '2026-08-20'
  },
  {
    id: 'fb-2',
    category: 'ERGONOMIE',
    title: 'Bouton de retour rapide vers la page précédente sur mobile',
    description: 'Quand on explore les détails d\'une pharmacie ou un tableau de tarifs, un bouton retour en haut à gauche facilite beaucoup la navigation au pouce.',
    rating: 5,
    authorName: 'Afiwa D.',
    authorRole: 'CITOYEN',
    deviceType: 'MOBILE',
    upvotes: 38,
    status: 'IMPLEMENTED',
    adminResponse: {
      author: 'Équipe Produit Galenis',
      message: 'Fonctionnalité intégrée avec historique de navigation et prise en charge du bouton retour natif du navigateur !',
      respondedAt: '2026-08-27'
    },
    createdAt: '2026-08-22'
  },
  {
    id: 'fb-3',
    category: 'SUGGESTION',
    title: 'Recherche vocale des médicaments en langues locales (Mina / Éwé / Kabyè)',
    description: 'Une aide vocale ou une transcription en langues locales pour aider les personnes âgées à trouver leur pharmacie ou leur traitement plus facilement.',
    rating: 5,
    authorName: 'EwéSanté Togo',
    authorRole: 'CITOYEN',
    deviceType: 'MOBILE',
    upvotes: 29,
    status: 'UNDER_REVIEW',
    adminResponse: {
      author: 'Équipe IA & Accessibilité',
      message: 'Projet à l\'étude en collaboration avec des linguistes et l\'intégration du chatbot santé Galenis.',
      respondedAt: '2026-08-26'
    },
    createdAt: '2026-08-23'
  },
  {
    id: 'fb-4',
    category: 'DONNEES_OFFICINES',
    title: 'Indicateur temps réel de fluidité / affluence dans les officines',
    description: 'Avoir une estimation du temps d\'attente ou de la fréquentation dans les grandes pharmacies de garde (comme Tokoin ou Assiyéyé) le soir.',
    rating: 4,
    authorName: 'Komla Agbeko',
    authorRole: 'CITOYEN',
    deviceType: 'MOBILE',
    upvotes: 19,
    status: 'UNDER_REVIEW',
    createdAt: '2026-08-24'
  },
  {
    id: 'fb-5',
    category: 'FONCTIONNALITE',
    title: 'Itinéraire GPS direct via Google Maps / Apple Maps / Waze',
    description: 'Un clic sur l\'adresse d\'une pharmacie pour lancer directement le guidage GPS sur son smartphone.',
    rating: 5,
    authorName: 'Folly G.',
    authorRole: 'CITOYEN',
    deviceType: 'MOBILE',
    upvotes: 54,
    status: 'IMPLEMENTED',
    adminResponse: {
      author: 'Équipe Technique',
      message: 'Déjà disponible sur la fiche détaillée de chaque pharmacie avec guidage direct !',
      respondedAt: '2026-08-21'
    },
    createdAt: '2026-08-19'
  }
];
