export type PharmacyStatus = 'OPEN' | 'CLOSED' | 'DE_GARDE';

export type ServiceType = 
  | 'LIVRAISON'
  | 'PAIEMENT_MOBILE'
  | 'GARDE_24H'
  | 'CONSEIL_ORAL'
  | 'TEST_RAPIDE_PALU'
  | 'PRISE_TENSION'
  | 'TEST_GLYCEMIE';

export type MobilePaymentType = 'T-Money' | 'Flooz' | 'Carte Bancaire';

export interface GuardDate {
  date: string; // YYYY-MM-DD
  type: 'JOUR' | 'NUIT' | '24H';
  notes?: string;
}

export interface Pharmacy {
  validationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  id: string;
  name: string;
  region: string; // e.g. 'Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'
  city: string; // e.g. 'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié'
  quarter: string; // e.g. 'Agoè-Nyivé', 'Bé', 'Tokoin-Nifidji', 'Agbalépédogan', 'Totsi', 'Hedzranawoé'
  address: string;
  lat: number;
  lng: number;
  phone: string;
  phoneSecondary?: string;
  whatsapp: string;
  email: string;
  website?: string;
  pharmacistInCharge: string;
  status: PharmacyStatus;
  is24h: boolean;
  isGuardToday: boolean;
  guardSchedule?: GuardDate[];
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  photos: string[];
  services: ServiceType[];
  mobilePayments: MobilePaymentType[];
  lastVerified: string;
  rating: number;
  reviewCount: number;
  verificationSource: 'Appel direct' | 'Ordre des Pharmaciens' | 'Visite de terrain' | 'Déclaration pharmacie';
  claimed: boolean;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  dci: string;
}

export type DrugStockStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'ORDER_POSSIBLE';

export interface PharmacyDrugStock {
  pharmacyId: string;
  drugId: string;
  status: DrugStockStatus;
  priceFcfa: number;
  lastUpdated: string;
}

export interface Reservation {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  patientName: string;
  patientPhone: string;
  drugName: string;
  quantity: number;
  pickupTime: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface ErrorReport {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  reportedBy: string;
  phone?: string;
  issueType: 'HORAIRES_INCORRECTS' | 'TELEPHONE_INJOIGNABLE' | 'LOCATION_EXACTE' | 'GARDE_NON_SPECTEE' | 'AUTRE';
  details: string;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED';
  createdAt: string;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  company: string;
  tier: 'FREE' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE';
  env?: 'test' | 'live';
  scopes?: string[];
  maskedKey?: string;
  dailyLimit: number;
  usedToday: number;
  createdAt: string;
  status?: 'active' | 'revoked';
  lastUsed?: string;
  apiOnly?: boolean;
  allowedIps?: string;
  allowedDomains?: string;
}

export interface CityInfo {
  name: string;
  region: string;
  pharmacyCount: number;
  lat: number;
  lng: number;
}

export interface DeveloperAccreditationDossier {
  id: string;
  name: string;
  ref: string;
  email: string;
  phone?: string;
  organization: string;
  projectType: string;
  useCaseDescription?: string;
  status: 'SANDBOX' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  tier: string;
  dailyLimit: number;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documents: {
    rccmNif?: string;
    idCardName?: string;
    specsDocName?: string;
    complianceSigned?: boolean;
    submittedFilesCount?: number;
  };
  liveApiKey?: string;
  sandboxApiKey: string;
}

export type UserRole = 'SUPER_ADMIN' | 'DATA_ADMIN' | 'PHARMACIEN' | 'DEVELOPPEUR' | 'CITOYEN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  organization?: string;
  badge?: string;
  pharmacyId?: string;
  avatarInitials?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  invitedBy?: string;
  pharmacyId?: string;
  status: 'active' | 'invited' | 'disabled';
}

export interface SanitaryAlert {
  id: string;
  title: string;
  category: 'RAPPEL_LOT' | 'EPIDEMIE' | 'RUPTURE_NATIONALE' | 'GARDE_EXCEPTIONNELLE' | 'INFO_SANTE';
  severity: 'CRITIQUE' | 'VIGILANCE' | 'INFO';
  region: 'Toutes' | 'Maritime' | 'Plateaux' | 'Centrale' | 'Kara' | 'Savanes';
  publishedAt: string;
  source: 'Ministère de la Santé' | 'Ordre des Pharmaciens' | 'Galenis Togo' | 'OMS / DGS';
  summary: string;
  content: string;
  affectedProducts?: string[];
  recommendations: string[];
  status: 'ACTIVE' | 'ARCHIVED';
}

export type ReportCategory = 
  | 'GARDE_NON_RESPECTEE' 
  | 'HORAIRES_INCORRECTS' 
  | 'TELEPHONE_INJOIGNABLE' 
  | 'LOCALISATION_GPS' 
  | 'RUPTURE_MEDICAMENT' 
  | 'SUSPICION_CONTREFACON' 
  | 'PRIX_ANORMAL' 
  | 'AUTRE';

export interface CommunityReport {
  id: string;
  pharmacyId?: string;
  pharmacyName?: string;
  reporterName: string;
  reporterPhone?: string;
  category: ReportCategory;
  description: string;
  city: string;
  region: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
  urgency: 'FAIBLE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
  upvotes: number;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PharmacyReview {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  authorName: string;
  city: string;
  rating: number; // 1 to 5
  criteria: {
    accueil: number;
    delaiAttente: number;
    disponibiliteStock: number;
    respectPrix: number;
  };
  title: string;
  comment: string;
  tags: string[]; // e.g. "Prise en charge INAM", "Service nuit rapide", "Conseil attentionné", "Flooz & T-Money ok"
  acceptsInam?: boolean;
  paymentMethodUsed?: string;
  likes: number;
  createdAt: string;
  pharmacyResponse?: {
    responderName: string;
    responseDate: string;
    comment: string;
  };
}

export type ActivityType = 
  | 'ALERT_ISSUED' 
  | 'REPORT_SUBMITTED' 
  | 'REPORT_RESOLVED' 
  | 'REVIEW_ADDED' 
  | 'GUARD_UPDATED' 
  | 'STOCK_UPDATED' 
  | 'PHARMACY_VERIFIED'
  | 'PHARMACY_REJECTED'
  | 'USER_PROMOTED'
  | 'DEVELOPER_ACCREDITED'
  | 'DEVELOPER_REJECTED'
  | 'DEVELOPER_SUBMITTED'
  | 'ADMIN_ACTION'
  | 'AD_BANNER_CREATED'
  | 'AD_BANNER_UPDATED';

export interface ActivityLogItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  entityId?: string;
  entityName?: string;
  region?: string;
  userRole?: 'CITOYEN' | 'PHARMACIEN' | 'ADMIN' | 'SYSTEME' | 'DEVELOPPEUR';
}

export type ActiveTab = 
  | 'CITIZEN' 
  | 'COMMUNITY_VIGILANCE'
  | 'PHARMACY_DASHBOARD' 
  | 'COVERAGE' 
  | 'PRICING' 
  | 'API_PORTAL' 
  | 'RESOURCES' 
  | 'CONTACTS' 
  | 'PARTNER_NETWORK' 
  | 'ROADMAP_STRATEGY'
  | 'LOGIN'
  | 'ADMIN_DASHBOARD'
  | 'USER_PROFILE'
  | 'AI_PRIVACY_GATEWAY'
  | 'LEGAL_TERMS';

export type LegalSectionType = 'TERMS' | 'PRIVACY' | 'COOKIES';

export const TAB_TITLES: Record<ActiveTab, string> = {
  CITIZEN: 'Portail Citoyen & Gardes',
  COMMUNITY_VIGILANCE: 'Signalements & Alertes',
  PHARMACY_DASHBOARD: 'Espace Officine',
  COVERAGE: 'Couverture Sanitaire',
  PRICING: 'Tarifs & Modèles',
  API_PORTAL: 'Intégrations API',
  RESOURCES: 'Ressources & Guides',
  CONTACTS: 'Contacts & Urgences',
  PARTNER_NETWORK: 'Réseau Partenaires',
  ROADMAP_STRATEGY: 'Vision & Stratégie',
  LOGIN: 'Connexion Espace Pro',
  ADMIN_DASHBOARD: 'Administration',
  USER_PROFILE: 'Mon Compte & Profil',
  AI_PRIVACY_GATEWAY: 'Passerelle IA Santé',
  LEGAL_TERMS: 'Cadre Légal & Vie Privée'
};

export type AppFeedbackCategory = 
  | 'SUGGESTION' 
  | 'ERGONOMIE' 
  | 'FONCTIONNALITE' 
  | 'BUG_TECHNIQUE' 
  | 'DONNEES_OFFICINES' 
  | 'AUTRE';

export type AppFeedbackStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'PLANNED' | 'IMPLEMENTED' | 'DECLINED';

export interface AppFeedback {
  id: string;
  category: AppFeedbackCategory;
  title: string;
  description: string;
  rating: number; // 1 to 5 stars
  authorName: string;
  authorRole?: 'CITOYEN' | 'PHARMACIEN' | 'MEDECIN' | 'DEVELOPPEUR' | 'AUTRE';
  emailOrPhone?: string;
  deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
  upvotes: number;
  userUpvoted?: boolean;
  status: AppFeedbackStatus;
  adminResponse?: {
    author: string;
    message: string;
    respondedAt: string;
  };
  createdAt: string;
}

export interface StockAuditLog {
  id: string;
  drugId: string;
  drugName: string;
  pharmacyId: string;
  pharmacyName: string;
  previousStatus: 'AVAILABLE' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  newStatus: 'AVAILABLE' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  changedBy: string;
  reason?: string;
  timestamp: string;
  onptMatricule?: string;
}

export interface GuardCertificateRecord {
  id: string;
  certificateId: string;
  pharmacyId: string;
  pharmacyName: string;
  onptMatricule: string;
  guardDate: string;
  guardType: 'JOUR' | 'NUIT' | '24H';
  signature: string;
  certifiedAt: string;
}

export type AdPlacement = 'HOME_TOP' | 'HOME_BOTTOM' | 'DRUG_SEARCH' | 'PHARMACY_LIST' | 'CITIZEN_DASHBOARD';
export type AdCategory = 'LABORATOIRE' | 'ASSURANCE' | 'CLINIQUE' | 'PARAPHARMACIE' | 'CAMPAGNE_SANTE';
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'SCHEDULED' | 'EXPIRED';

export interface AdBanner {
  id: string;
  title: string;
  subtitle?: string;
  advertiser: string;
  advertiserLogo?: string;
  category: AdCategory;
  placement: AdPlacement;
  imageUrl?: string;
  badgeText?: string;
  callToAction: string;
  targetUrl: string;
  targetPhone?: string;
  targetWhatsapp?: string;
  status: AdStatus;
  monthlyFeeFcfa: number;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentMethod?: 'TMONEY' | 'FLOOZ' | 'VIREMENT' | 'CHEQUE';
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

