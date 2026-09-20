import { 
  Pharmacy, 
  Drug, 
  PharmacyDrugStock, 
  Reservation, 
  ErrorReport, 
  ApiKey, 
  UserAccount, 
  UserRole,
  SanitaryAlert,
  CommunityReport,
  PharmacyReview,
  ActivityLogItem,
  AppFeedback,
  AppFeedbackStatus,
  DeveloperAccreditationDossier,
  StockAuditLog,
  GuardCertificateRecord,
  AdBanner
} from '../types';
import { INITIAL_PHARMACIES, INITIAL_DRUG_STOCKS } from '../data/mockPharmacies';
import { INITIAL_DRUGS } from '../data/mockDrugs';
import { 
  INITIAL_SANITARY_ALERTS, 
  INITIAL_COMMUNITY_REPORTS, 
  INITIAL_PHARMACY_REVIEWS, 
  INITIAL_ACTIVITY_LOGS 
} from '../data/mockCommunityData';
import { INITIAL_APP_FEEDBACKS } from '../data/mockFeedbacks';
import { 
  syncPharmacyToCloud, 
  syncStockToCloud, 
  syncReservationToCloud, 
  syncFeedbackToCloud,
  subscribeToRemotePharmacies
} from './firebase';

const KEYS = {
  PHARMACIES: 'galenis_togo_pharmacies_v1',
  DRUGS: 'galenis_togo_drugs_v1',
  STOCKS: 'galenis_togo_stocks_v1',
  RESERVATIONS: 'galenis_togo_reservations_v1',
  REPORTS: 'galenis_togo_reports_v1',
  API_KEYS: 'galenis_togo_apikeys_v1',
  PWA_INSTALLS: 'galenis_togo_pwa_installs',
  ADMIN_INVITES: 'galenis_togo_admin_invites_v1',
  ALERTS: 'galenis_togo_alerts_v1',
  COMMUNITY_REPORTS: 'galenis_togo_community_reports_v1',
  REVIEWS: 'galenis_togo_reviews_v1',
  ACTIVITIES: 'galenis_togo_activities_v1',
  APP_FEEDBACKS: 'galenis_togo_app_feedbacks_v1',
  DEV_DOSSIERS: 'galenis_togo_developer_dossiers_v1',
  STOCK_AUDIT: 'galenis_togo_stock_audits_v1',
  GUARD_CERTIFICATES: 'galenis_togo_guard_certificates_v1',
  AD_BANNERS: 'galenis_togo_ad_banners_v1'
};

const INITIAL_AD_BANNERS: AdBanner[] = [
  {
    id: 'ad_1',
    title: 'Assurance Santé AMU & Tiers-Payant Simplifié',
    subtitle: 'Souscrivez votre couverture complémentaire en ligne et bénéficiez de 80% de prise en charge immédiate.',
    advertiser: 'SUNU Assurances Togo',
    advertiserLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=60',
    category: 'ASSURANCE',
    placement: 'HOME_TOP',
    badgeText: 'Partenaire Officiel Santé',
    callToAction: 'Simuler mon devis assurance',
    targetUrl: 'https://sunu-assurances.tg/sante-amu',
    targetPhone: '+228 22 21 00 00',
    targetWhatsapp: '22890000000',
    status: 'ACTIVE',
    monthlyFeeFcfa: 175000,
    paymentStatus: 'PAID',
    paymentMethod: 'VIREMENT',
    impressions: 14280,
    clicks: 642,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    notes: 'Campagne Trimestre 4 - Ciblage Citoyens Lomé & Régions',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ad_2',
    title: 'Dépistage & Soins Spécialisés 24h/24',
    subtitle: 'Plateau technique moderne, scanner, laboratoire certifié et urgences médicales au cœur de Lomé.',
    advertiser: 'Clinique Internationale Biasa Lomé',
    advertiserLogo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=60',
    category: 'CLINIQUE',
    placement: 'DRUG_SEARCH',
    badgeText: 'Centre Médical Agréé',
    callToAction: 'Prendre rendez-vous médical',
    targetUrl: 'https://cliniquebiasa.tg',
    targetPhone: '+228 22 21 15 55',
    targetWhatsapp: '22891223344',
    status: 'ACTIVE',
    monthlyFeeFcfa: 150000,
    paymentStatus: 'PAID',
    paymentMethod: 'TMONEY',
    impressions: 9850,
    clicks: 410,
    startDate: '2026-09-10',
    endDate: '2026-11-30',
    notes: 'Bannière ciblée sur les recherches de molécules cardiologie et pédiatrie',
    createdAt: '2026-09-10T09:30:00Z'
  },
  {
    id: 'ad_3',
    title: 'Compléments Nutritionnels & Soins Maman-Bébé',
    subtitle: 'Conseils personnalisés par des docteurs en pharmacie et livraison express à domicile sur le Grand Lomé.',
    advertiser: 'Laboratoires Sanofi Afrique de l’Ouest',
    advertiserLogo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=60',
    category: 'LABORATOIRE',
    placement: 'HOME_BOTTOM',
    badgeText: 'Qualité Pharmaceutique Certifiée',
    callToAction: 'Découvrir la gamme certifiée',
    targetUrl: 'https://sanofi.africa/fr/produits-famille',
    targetPhone: '+228 22 51 02 03',
    targetWhatsapp: '22892334455',
    status: 'ACTIVE',
    monthlyFeeFcfa: 220000,
    paymentStatus: 'PAID',
    paymentMethod: 'FLOOZ',
    impressions: 18920,
    clicks: 875,
    startDate: '2026-08-15',
    endDate: '2026-10-31',
    notes: 'Partenariat annuel Laboratoire certifié DPML',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'ad_4',
    title: 'Gamme Vitamines & Immunité Tropicale',
    subtitle: 'Renforcez vos défenses immunitaires. Disponible sans ordonnance dans toutes les officines du Togo.',
    advertiser: 'DenK Pharma Togo',
    advertiserLogo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&auto=format&fit=crop&q=60',
    category: 'PARAPHARMACIE',
    placement: 'CITIZEN_DASHBOARD',
    badgeText: 'Formulation Européenne',
    callToAction: 'Voir les officines distributrices',
    targetUrl: 'https://denkpharma.de/fr',
    targetPhone: '+228 90 11 22 33',
    targetWhatsapp: '22890112233',
    status: 'ACTIVE',
    monthlyFeeFcfa: 125000,
    paymentStatus: 'PAID',
    paymentMethod: 'TMONEY',
    impressions: 7420,
    clicks: 310,
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    notes: 'Bannière espace citoyen reste à charge',
    createdAt: '2026-09-01T12:00:00Z'
  }
];

const INITIAL_DEV_DOSSIERS: DeveloperAccreditationDossier[] = [
  {
    id: 'dev_dossier_1',
    name: 'SADPlus Solutions Santé',
    ref: 'acc_2209219218',
    email: 'contact@sadplus.tg',
    phone: '+228 90 22 44 88',
    organization: 'SADPlus Togo SARL',
    projectType: 'ERP / Logiciel Clinique & Caisse Officine',
    useCaseDescription: 'Interfaçage temps réel des stocks officinaux et vérification automatique des gardes 24h/24 pour 35 pharmacies partenaires à Lomé et Kara.',
    status: 'PENDING_REVIEW',
    tier: 'Sandbox (Test)',
    dailyLimit: 1000,
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    documents: {
      rccmNif: 'TG-LOM-2023-B-4819 | NIF 1001847192',
      idCardName: 'CNI_Directeur_Technique_SADPlus.pdf',
      specsDocName: 'Architecture_Securite_API_Galenis_SADPlus.pdf',
      complianceSigned: true,
      submittedFilesCount: 3
    },
    sandboxApiKey: 'pd_test_tg_11223344556677889900aa',
    liveApiKey: 'pdt_live_9941a82_sadplus_prod_tg'
  },
  {
    id: 'dev_dossier_2',
    name: 'Kodjo Amétépé (WinPharma TG)',
    ref: 'acc_7719283410',
    email: 'kodjo.dev@tech-togo.com',
    phone: '+228 91 33 55 77',
    organization: 'Intégration WinPharma Togo',
    projectType: 'Passerelle Logiciel de Caisse LGO',
    useCaseDescription: 'Module de télétransmission automatique des bordereaux INAM et synchronisation officielle des prix homologués.',
    status: 'APPROVED',
    tier: 'Certifié DPML (Production)',
    dailyLimit: 100000,
    submittedAt: '2026-08-20T10:15:00.000Z',
    reviewedAt: '2026-08-21T14:30:00.000Z',
    reviewedBy: 'Super Administrateur Central (DPML/ONPT)',
    documents: {
      rccmNif: 'TG-LOM-2021-M-9021 | NIF 1000293810',
      idCardName: 'Passeport_Ingenieur_Amétépé.pdf',
      specsDocName: 'Cahier_Des_Charges_WinPharma_Sync.pdf',
      complianceSigned: true,
      submittedFilesCount: 3
    },
    sandboxApiKey: 'pd_test_tg_99887766554433221100bb',
    liveApiKey: 'pdt_live_8832c91_winpharma_prod_tg'
  }
];

// Initialize default storage
export function initStorage(): void {
  if (!localStorage.getItem(KEYS.PHARMACIES)) {
    localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
  }
  if (!localStorage.getItem(KEYS.DRUGS)) {
    localStorage.setItem(KEYS.DRUGS, JSON.stringify(INITIAL_DRUGS));
  }
  if (!localStorage.getItem(KEYS.STOCKS)) {
    localStorage.setItem(KEYS.STOCKS, JSON.stringify(INITIAL_DRUG_STOCKS));
  }
  if (!localStorage.getItem(KEYS.APP_FEEDBACKS)) {
    localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(INITIAL_APP_FEEDBACKS));
  }
  if (!localStorage.getItem(KEYS.RESERVATIONS)) {
    const defaultReservations: Reservation[] = [
      {
        id: 'res-101',
        pharmacyId: 'pharma-1',
        pharmacyName: 'Pharmacie Agoè Assiyéyé',
        patientName: 'Kofi Mensah',
        patientPhone: '+228 90 11 22 33',
        drugName: 'Paracétamol 500mg',
        quantity: 2,
        pickupTime: '18h30 ce soir',
        notes: 'Réservation urgence pour ordonnance enfant',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(defaultReservations));
  }
  if (!localStorage.getItem(KEYS.REPORTS)) {
    localStorage.setItem(KEYS.REPORTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.ALERTS)) {
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(INITIAL_SANITARY_ALERTS));
  }
  if (!localStorage.getItem(KEYS.COMMUNITY_REPORTS)) {
    localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(INITIAL_COMMUNITY_REPORTS));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_PHARMACY_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem(KEYS.API_KEYS)) {
    const defaultApiKeys: ApiKey[] = [
      {
        id: 'key-1',
        key: 'pdt_live_free_9876543210',
        name: 'Clé Démo Publique',
        company: 'Communauté Développeurs Togo',
        tier: 'FREE',
        env: 'live',
        scopes: ['pharmacies:read', 'gardes:read'],
        maskedKey: 'pdt_live_••••••••3210',
        dailyLimit: 1000,
        usedToday: 142,
        createdAt: '2026-08-01'
      }
    ];
    localStorage.setItem(KEYS.API_KEYS, JSON.stringify(defaultApiKeys));
  }
  if (!localStorage.getItem(KEYS.ADMIN_INVITES)) {
    const defaultInvites: UserAccount[] = [
      {
        id: 'usr_founder',
        email: 'fondateur@galenis.tg',
        name: 'Fondateur Principal (Moi)',
        role: 'SUPER_ADMIN',
        status: 'active',
        createdAt: new Date().toISOString(),
        invitedBy: 'Système'
      },
      {
        id: 'usr_1',
        email: 'data.admin@galenis.tg',
        name: 'Koffi Mensah',
        role: 'DATA_ADMIN',
        status: 'invited',
        createdAt: new Date().toISOString(),
        invitedBy: 'Fondateur'
      }
    ];
    localStorage.setItem(KEYS.ADMIN_INVITES, JSON.stringify(defaultInvites));
  }
  if (!localStorage.getItem(KEYS.DEV_DOSSIERS)) {
    localStorage.setItem(KEYS.DEV_DOSSIERS, JSON.stringify(INITIAL_DEV_DOSSIERS));
  }
}

// Getters
export function getPharmacies(): Pharmacy[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.PHARMACIES);
    return data ? JSON.parse(data) : INITIAL_PHARMACIES;
  } catch {
    return INITIAL_PHARMACIES;
  }
}

export function getPharmacyById(id: string): Pharmacy | undefined {
  return getPharmacies().find(p => p.id === id);
}

export function getDrugs(): Drug[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.DRUGS);
    return data ? JSON.parse(data) : INITIAL_DRUGS;
  } catch {
    return INITIAL_DRUGS;
  }
}

export function getDrugStocks(): PharmacyDrugStock[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.STOCKS);
    return data ? JSON.parse(data) : INITIAL_DRUG_STOCKS;
  } catch {
    return INITIAL_DRUG_STOCKS;
  }
}

export function getReservations(): Reservation[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.RESERVATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getErrorReports(): ErrorReport[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getApiKeys(): ApiKey[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.API_KEYS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addDrug(drug: Omit<Drug, 'id'>): Drug {
  const list = getDrugs();
  const newDrug: Drug = {
    ...drug,
    id: `drug-${Date.now()}`
  };
  list.push(newDrug);
  localStorage.setItem(KEYS.DRUGS, JSON.stringify(list));
  return newDrug;
}

// Setters & Actions
export function updatePharmacy(updated: Pharmacy): void {
  const list = getPharmacies();
  const index = list.findIndex(p => p.id === updated.id);
  const finalPharma = index >= 0 
    ? { ...updated, lastVerified: `${new Date().toISOString().split('T')[0]} (Modifié par la pharmacie)` }
    : updated;

  if (index >= 0) {
    list[index] = finalPharma;
  } else {
    list.push(finalPharma);
  }
  localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(list));
  syncPharmacyToCloud(finalPharma).catch(() => {});
}

export function updateGuardStatus(pharmacyId: string, isGuard: boolean, status?: 'OPEN' | 'CLOSED' | 'DE_GARDE'): void {
  const list = getPharmacies();
  const index = list.findIndex(p => p.id === pharmacyId);
  if (index >= 0) {
    list[index].isGuardToday = isGuard;
    if (status) {
      list[index].status = status;
    } else {
      list[index].status = isGuard ? 'DE_GARDE' : 'OPEN';
    }
    list[index].lastVerified = `${new Date().toISOString().split('T')[0]} (Déclaration de garde)`;
    localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(list));
    syncPharmacyToCloud(list[index]).catch(() => {});
  }
}

export function updateDrugStock(pharmacyId: string, drugId: string, status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ORDER_POSSIBLE', priceFcfa: number): void {
  const stocks = getDrugStocks();
  const index = stocks.findIndex(s => s.pharmacyId === pharmacyId && s.drugId === drugId);
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const targetStock: PharmacyDrugStock = { pharmacyId, drugId, status, priceFcfa, lastUpdated: nowStr };
  
  if (index >= 0) {
    stocks[index] = targetStock;
  } else {
    stocks.push(targetStock);
  }
  localStorage.setItem(KEYS.STOCKS, JSON.stringify(stocks));
  syncStockToCloud(targetStock).catch(() => {});
}

export interface StockImportItem {
  name: string;
  dci?: string;
  category?: string;
  priceFcfa?: number;
  status?: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ORDER_POSSIBLE';
  quantity?: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface StockMergeResult {
  addedCount: number;
  updatedCount: number;
  unchangedCount: number;
  totalStocksCount: number;
  importedItemsCount: number;
}

/**
 * Non-destructive stock merge (Ajout & mise à jour sans supprimer l'existant)
 */
export function mergeDrugStocks(pharmacyId: string, items: StockImportItem[]): StockMergeResult {
  const currentDrugs = getDrugs();
  const currentStocks = getDrugStocks();
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  let addedCount = 0;
  let updatedCount = 0;

  const validItems = items.filter(it => it && it.name && it.name.trim().length > 0);

  validItems.forEach((item, idx) => {
    const cleanName = item.name.trim();
    const cleanDci = item.dci ? item.dci.trim() : cleanName;
    const cleanCategory = item.category?.trim() || 'Général';
    const cleanPrice = typeof item.priceFcfa === 'number' && item.priceFcfa > 0 ? item.priceFcfa : 1000;
    const cleanStatus = item.status || 'AVAILABLE';

    // 1. Find or create Drug in the catalog
    let matchedDrug = currentDrugs.find(d => 
      d.name.toLowerCase().trim() === cleanName.toLowerCase() ||
      (d.dci && cleanDci && d.dci.toLowerCase().trim() === cleanDci.toLowerCase() && d.name.toLowerCase().includes(cleanName.toLowerCase()))
    );

    if (!matchedDrug) {
      matchedDrug = {
        id: `drug-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        name: cleanName,
        dci: cleanDci,
        genericName: cleanDci,
        category: cleanCategory,
        description: 'Médicament importé via bordereau / document officine'
      };
      currentDrugs.push(matchedDrug);
    }

    // 2. Non-destructive stock merge for this pharmacy
    const existingStockIndex = currentStocks.findIndex(
      s => s.pharmacyId === pharmacyId && s.drugId === matchedDrug!.id
    );

    if (existingStockIndex >= 0) {
      currentStocks[existingStockIndex] = {
        ...currentStocks[existingStockIndex],
        status: cleanStatus,
        priceFcfa: cleanPrice > 0 ? cleanPrice : currentStocks[existingStockIndex].priceFcfa,
        lastUpdated: nowStr
      };
      updatedCount++;
    } else {
      currentStocks.push({
        pharmacyId,
        drugId: matchedDrug.id,
        status: cleanStatus,
        priceFcfa: cleanPrice,
        lastUpdated: nowStr
      });
      addedCount++;
    }
  });

  localStorage.setItem(KEYS.DRUGS, JSON.stringify(currentDrugs));
  localStorage.setItem(KEYS.STOCKS, JSON.stringify(currentStocks));

  const totalPharmaStocks = currentStocks.filter(s => s.pharmacyId === pharmacyId).length;
  const unchangedCount = Math.max(0, totalPharmaStocks - (addedCount + updatedCount));

  return {
    addedCount,
    updatedCount,
    unchangedCount,
    totalStocksCount: totalPharmaStocks,
    importedItemsCount: validItems.length
  };
}

export function addReservation(res: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation {
  const list = getReservations();
  const newRes: Reservation = {
    ...res,
    id: `res-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  list.unshift(newRes);
  localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(list));
  syncReservationToCloud(newRes).catch(() => {});
  return newRes;
}

export function updateReservationStatus(id: string, status: Reservation['status']): void {
  const list = getReservations();
  const index = list.findIndex(r => r.id === id);
  if (index >= 0) {
    list[index].status = status;
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(list));
  }
}

export function addErrorReport(report: Omit<ErrorReport, 'id' | 'createdAt' | 'status'>): ErrorReport {
  const list = getErrorReports();
  const newReport: ErrorReport = {
    ...report,
    id: `err-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  list.unshift(newReport);
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(list));
  return newReport;
}

export function createApiKey(
  name: string, 
  company: string, 
  tier: ApiKey['tier'],
  env: 'test' | 'live' = 'live',
  scopes: string[] = ['pharmacies:read', 'gardes:read']
): ApiKey {
  const keys = getApiKeys();
  const limits = { FREE: 1000, STARTER: 50000, BUSINESS: 250000, ENTERPRISE: 1000000 };
  const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const prefix = env === 'test' ? 'pdt_test_' : 'pdt_live_';
  const fullKey = `${prefix}${randomHex}`;
  const maskedKey = `${prefix}••••••••${randomHex.substring(12)}`;

  const newKey: ApiKey = {
    id: `key-${Date.now()}`,
    key: fullKey,
    name,
    company,
    tier,
    env,
    scopes,
    maskedKey,
    dailyLimit: limits[tier],
    usedToday: 0,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'active',
    lastUsed: 'Aujourd\'hui 11:24',
    apiOnly: true,
    allowedIps: '',
    allowedDomains: ''
  };
  keys.unshift(newKey);
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
  return newKey;
}

export function revokeApiKey(keyId: string): ApiKey[] {
  const keys = getApiKeys().map(k => {
    if (k.id === keyId) {
      return { ...k, status: 'revoked' as const };
    }
    return k;
  });
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
  return keys;
}

export function regenerateApiKey(keyId: string): { keys: ApiKey[]; newKey: ApiKey } | undefined {
  const keys = getApiKeys();
  const index = keys.findIndex(k => k.id === keyId);
  if (index === -1) return undefined;

  const old = keys[index];
  const env = old.env || 'live';
  const prefix = env === 'test' ? 'pdt_test_' : 'pdt_live_';
  const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const fullKey = `${prefix}${randomHex}`;
  const maskedKey = `${prefix}••••••••${randomHex.substring(12)}`;

  const updatedKey: ApiKey = {
    ...old,
    key: fullKey,
    maskedKey,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    usedToday: 0
  };

  keys[index] = updatedKey;
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
  return { keys, newKey: updatedKey };
}

export function updateKeyRestrictions(keyId: string, restrictions: { apiOnly?: boolean; allowedIps?: string; allowedDomains?: string }): ApiKey[] {
  const keys = getApiKeys().map(k => {
    if (k.id === keyId) {
      return { ...k, ...restrictions };
    }
    return k;
  });
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
  return keys;
}

export function incrementApiKeyUsage(keyIdOrEnv?: string): ApiKey | undefined {
  const keys = getApiKeys();
  if (keys.length === 0) return undefined;

  let targetIndex = 0;
  if (keyIdOrEnv) {
    const idx = keys.findIndex(k => k.id === keyIdOrEnv || k.env === keyIdOrEnv || k.key.includes(keyIdOrEnv));
    if (idx >= 0) targetIndex = idx;
  }

  keys[targetIndex].usedToday = (keys[targetIndex].usedToday || 0) + 1;
  keys[targetIndex].lastUsed = 'À l\'instant';
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
  return keys[targetIndex];
}

// Backup, Export and Import utilities for data resilience
export function exportDataJSON(): string {
  const sanitizedApiKeys = getApiKeys().map(k => ({
    ...k,
    key: k.maskedKey || 'pdt_live_••••••••'
  }));

  const data = {
    version: '1.0-SANITY-CHECKED',
    exportDate: new Date().toISOString(),
    disclaimer: 'Sauvegarde Galenis Togo. Les clés API et identifiants de sécurité ont été masqués.',
    pharmacies: getPharmacies(),
    drugs: getDrugs(),
    stocks: getDrugStocks(),
    reservations: getReservations(),
    reports: getErrorReports(),
    appFeedbacks: getAppFeedbacks(),
    apiKeys: sanitizedApiKeys
  };
  return JSON.stringify(data, null, 2);
}

export function importDataJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.pharmacies && Array.isArray(parsed.pharmacies)) {
      localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(parsed.pharmacies));
    }
    if (parsed.drugs && Array.isArray(parsed.drugs)) {
      localStorage.setItem(KEYS.DRUGS, JSON.stringify(parsed.drugs));
    }
    if (parsed.stocks && Array.isArray(parsed.stocks)) {
      localStorage.setItem(KEYS.STOCKS, JSON.stringify(parsed.stocks));
    }
    if (parsed.reservations && Array.isArray(parsed.reservations)) {
      localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(parsed.reservations));
    }
    if (parsed.reports && Array.isArray(parsed.reports)) {
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(parsed.reports));
    }
    if (parsed.appFeedbacks && Array.isArray(parsed.appFeedbacks)) {
      localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(parsed.appFeedbacks));
    }
    if (parsed.apiKeys && Array.isArray(parsed.apiKeys)) {
      localStorage.setItem(KEYS.API_KEYS, JSON.stringify(parsed.apiKeys));
    }
    return true;
  } catch (err) {
    console.error('Failed to import data JSON', err);
    return false;
  }
}

export function resetStorageToDefault(): void {
  localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
  localStorage.setItem(KEYS.DRUGS, JSON.stringify(INITIAL_DRUGS));
  localStorage.setItem(KEYS.STOCKS, JSON.stringify(INITIAL_DRUG_STOCKS));
  localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.REPORTS, JSON.stringify([]));
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify([]));
}

// Admin Invitations & Email Promotion Handlers
export function getAdminInvitations(): UserAccount[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.ADMIN_INVITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAdminInvitation(invite: { email: string; name: string; role: UserRole; invitedBy: string }): UserAccount {
  const invites = getAdminInvitations();
  const normalizedEmail = invite.email.toLowerCase().trim();
  
  // Check if existing
  const existingIdx = invites.findIndex(i => i.email.toLowerCase() === normalizedEmail);
  const newAccount: UserAccount = {
    id: existingIdx >= 0 ? invites[existingIdx].id : `usr_${Date.now()}`,
    email: normalizedEmail,
    name: invite.name,
    role: invite.role,
    status: 'invited',
    createdAt: new Date().toISOString(),
    invitedBy: invite.invitedBy
  };

  if (existingIdx >= 0) {
    invites[existingIdx] = newAccount;
  } else {
    invites.push(newAccount);
  }

  localStorage.setItem(KEYS.ADMIN_INVITES, JSON.stringify(invites));
  return newAccount;
}

export function checkEmailRolePromotion(email: string): { role: UserRole; isPromoted: boolean; name?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const invites = getAdminInvitations();
  const invite = invites.find(i => i.email.toLowerCase() === normalizedEmail);

  if (invite) {
    return {
      role: invite.role,
      isPromoted: true,
      name: invite.name
    };
  }

  return {
    role: 'DEVELOPPEUR',
    isPromoted: false
  };
}

// Developer Accreditation & Production KYC Management
export function getDeveloperDossiers(): DeveloperAccreditationDossier[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.DEV_DOSSIERS);
    return data ? JSON.parse(data) : INITIAL_DEV_DOSSIERS;
  } catch {
    return INITIAL_DEV_DOSSIERS;
  }
}

export function getDeveloperDossierByEmail(email: string): DeveloperAccreditationDossier | undefined {
  const list = getDeveloperDossiers();
  const normalized = email.toLowerCase().trim();
  return list.find(d => d.email.toLowerCase().trim() === normalized);
}

export function submitDeveloperDossier(
  payload: Partial<DeveloperAccreditationDossier> & { email: string; name: string; organization: string }
): DeveloperAccreditationDossier {
  const list = getDeveloperDossiers();
  const normalizedEmail = payload.email.toLowerCase().trim();
  const existingIdx = list.findIndex(d => d.email.toLowerCase().trim() === normalizedEmail);
  
  const nowIso = new Date().toISOString();
  const dossierId = existingIdx >= 0 ? list[existingIdx].id : `dev_dossier_${Date.now()}`;
  const existingRef = existingIdx >= 0 ? list[existingIdx].ref : `acc_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const existingSandbox = existingIdx >= 0 ? list[existingIdx].sandboxApiKey : `pd_test_tg_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
  const existingLive = existingIdx >= 0 ? list[existingIdx].liveApiKey : `pdt_live_${Math.random().toString(36).substring(2, 10)}_${payload.organization.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 10)}_prod_tg`;

  const updatedDossier: DeveloperAccreditationDossier = {
    id: dossierId,
    name: payload.name,
    ref: existingRef,
    email: normalizedEmail,
    phone: payload.phone || '+228 90 00 00 00',
    organization: payload.organization,
    projectType: payload.projectType || 'ERP / Logiciel Clinique & Caisse',
    useCaseDescription: payload.useCaseDescription || "Interfaçage des stocks d'officines et consultation des gardes.",
    status: 'PENDING_REVIEW',
    tier: 'Sandbox (Test)',
    dailyLimit: 1000,
    submittedAt: nowIso,
    rejectionReason: undefined,
    documents: {
      rccmNif: payload.documents?.rccmNif || 'TG-LOM-2024-B-9921 | NIF 1001928471',
      idCardName: payload.documents?.idCardName || 'CNI_Responsable_Technique.pdf',
      specsDocName: payload.documents?.specsDocName || 'Cahier_Des_Charges_Architecture_API.pdf',
      complianceSigned: payload.documents?.complianceSigned ?? true,
      submittedFilesCount: payload.documents?.submittedFilesCount || 3
    },
    sandboxApiKey: existingSandbox,
    liveApiKey: existingLive
  };

  if (existingIdx >= 0) {
    list[existingIdx] = updatedDossier;
  } else {
    list.unshift(updatedDossier);
  }

  localStorage.setItem(KEYS.DEV_DOSSIERS, JSON.stringify(list));

  // Also sync with fast key
  const devAccountSummary = {
    name: updatedDossier.name,
    ref: updatedDossier.ref,
    isValidated: false,
    status: 'PENDING_REVIEW',
    tier: 'Sandbox (Test)',
    email: updatedDossier.email,
    dailyLimit: 1000,
    requestPending: true,
    submittedAt: nowIso,
    documentsCount: updatedDossier.documents.submittedFilesCount
  };
  localStorage.setItem('galenis_dev_account', JSON.stringify(devAccountSummary));

  // Log activity
  addActivityLog({
    type: 'ALERT_ISSUED',
    title: `Dossier d'Agrément Développeur soumis : ${updatedDossier.organization}`,
    description: `${updatedDossier.name} (${updatedDossier.email}) a soumis ses pièces justificatives (RCCM/NIF, CNI, Cahier des charges) pour passage en Production API.`,
    userRole: 'DEVELOPPEUR'
  });

  window.dispatchEvent(new Event('galenis_dev_account_updated'));
  window.dispatchEvent(new CustomEvent('galenis_admin_notification', {
    detail: {
      type: 'DEV_DOSSIER_PENDING',
      message: `Nouveau dossier d'agrément API soumis par ${updatedDossier.organization}`,
      dossierId: updatedDossier.id
    }
  }));

  return updatedDossier;
}

export function reviewDeveloperDossier(
  dossierId: string, 
  action: 'APPROVED' | 'REJECTED', 
  reviewedBy: string = 'Super Administrateur Central', 
  reason?: string
): DeveloperAccreditationDossier | null {
  const list = getDeveloperDossiers();
  const idx = list.findIndex(d => d.id === dossierId);
  if (idx < 0) return null;

  const nowIso = new Date().toISOString();
  const isApproved = action === 'APPROVED';

  list[idx] = {
    ...list[idx],
    status: isApproved ? 'APPROVED' : 'REJECTED',
    tier: isApproved ? 'Certifié DPML (Production)' : 'Sandbox (Test)',
    dailyLimit: isApproved ? 100000 : 1000,
    reviewedAt: nowIso,
    reviewedBy: reviewedBy,
    rejectionReason: isApproved ? undefined : (reason || 'Dossier incomplet ou non conforme aux exigences DPML/ONPT.')
  };

  localStorage.setItem(KEYS.DEV_DOSSIERS, JSON.stringify(list));

  // Fast key sync
  const devAccountSummary = {
    name: list[idx].name,
    ref: list[idx].ref,
    isValidated: isApproved,
    status: list[idx].status,
    tier: list[idx].tier,
    email: list[idx].email,
    dailyLimit: list[idx].dailyLimit,
    requestPending: false,
    reviewedAt: nowIso,
    rejectionReason: list[idx].rejectionReason
  };
  localStorage.setItem('galenis_dev_account', JSON.stringify(devAccountSummary));

  // Log activity
  addActivityLog({
    type: isApproved ? 'USER_PROMOTED' : 'ALERT_ISSUED',
    title: isApproved 
      ? `Agrément API Validé : ${list[idx].organization}` 
      : `Agrément API Rejeté : ${list[idx].organization}`,
    description: isApproved 
      ? `Le compte développeur de ${list[idx].organization} a été agréé avec succès par ${reviewedBy}. Clés de Production (100k req/j) activées.`
      : `Le dossier d'agrément de ${list[idx].organization} a été refusé par ${reviewedBy}. Motif : ${reason || 'Non conforme'}.`,
    userRole: 'ADMIN'
  });

  window.dispatchEvent(new Event('galenis_dev_account_updated'));
  window.dispatchEvent(new CustomEvent('galenis_admin_notification', {
    detail: {
      type: isApproved ? 'DEV_DOSSIER_APPROVED' : 'DEV_DOSSIER_REJECTED',
      message: `Dossier ${list[idx].organization} ${isApproved ? 'approuvé' : 'rejeté'}`
    }
  }));

  return list[idx];
}

// --- COMMUNITY & VIGILANCE MODULES ---

// 1. Alertes Sanitaires
export function getSanitaryAlerts(): SanitaryAlert[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.ALERTS);
    return data ? JSON.parse(data) : INITIAL_SANITARY_ALERTS;
  } catch {
    return INITIAL_SANITARY_ALERTS;
  }
}

export function addSanitaryAlert(alert: Omit<SanitaryAlert, 'id' | 'publishedAt' | 'status'>): SanitaryAlert {
  const list = getSanitaryAlerts();
  const newAlert: SanitaryAlert = {
    ...alert,
    id: `alt-${Date.now()}`,
    publishedAt: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  };
  list.unshift(newAlert);
  localStorage.setItem(KEYS.ALERTS, JSON.stringify(list));

  // Log activity
  addActivityLog({
    type: 'ALERT_ISSUED',
    title: `Nouvelle alerte : ${newAlert.title}`,
    description: newAlert.summary,
    region: newAlert.region,
    userRole: 'ADMIN'
  });

  return newAlert;
}

export function archiveSanitaryAlert(alertId: string): void {
  const list = getSanitaryAlerts();
  const index = list.findIndex(a => a.id === alertId);
  if (index >= 0) {
    list[index].status = 'ARCHIVED';
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(list));
  }
}

// 2. Signalements Citoyens (Community Reports)
export function getCommunityReports(): CommunityReport[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.COMMUNITY_REPORTS);
    return data ? JSON.parse(data) : INITIAL_COMMUNITY_REPORTS;
  } catch {
    return INITIAL_COMMUNITY_REPORTS;
  }
}

export function addCommunityReport(report: Omit<CommunityReport, 'id' | 'createdAt' | 'status' | 'upvotes'>): CommunityReport {
  const list = getCommunityReports();
  const newReport: CommunityReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: 'PENDING',
    upvotes: 1,
    createdAt: new Date().toISOString()
  };
  list.unshift(newReport);
  localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(list));

  // Also log activity
  addActivityLog({
    type: 'REPORT_SUBMITTED',
    title: `Signalement citoyen enregistré`,
    description: `${newReport.reporterName} a signalé une anomalie (${newReport.category}) pour ${newReport.pharmacyName || newReport.city}.`,
    entityName: newReport.pharmacyName,
    region: newReport.region,
    userRole: 'CITOYEN'
  });

  return newReport;
}

export function updateCommunityReportStatus(reportId: string, status: CommunityReport['status'], resolutionNotes?: string): void {
  const list = getCommunityReports();
  const index = list.findIndex(r => r.id === reportId);
  if (index >= 0) {
    list[index].status = status;
    if (resolutionNotes) {
      list[index].resolutionNotes = resolutionNotes;
    }
    if (status === 'RESOLVED') {
      list[index].resolvedAt = new Date().toISOString();
      // Log activity
      addActivityLog({
        type: 'REPORT_RESOLVED',
        title: `Signalement résolu : ${list[index].pharmacyName || list[index].city}`,
        description: resolutionNotes || 'Anomalie vérifiée et corrigée sur la plateforme.',
        entityName: list[index].pharmacyName,
        region: list[index].region,
        userRole: 'ADMIN'
      });
    }
    localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(list));
  }
}

export function upvoteCommunityReport(reportId: string): void {
  const list = getCommunityReports();
  const index = list.findIndex(r => r.id === reportId);
  if (index >= 0) {
    list[index].upvotes += 1;
    localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(list));
  }
}

// 3. Retours d'expérience (Reviews & Ratings)
export function getPharmacyReviews(pharmacyId?: string): PharmacyReview[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.REVIEWS);
    const list: PharmacyReview[] = data ? JSON.parse(data) : INITIAL_PHARMACY_REVIEWS;
    if (pharmacyId) {
      return list.filter(r => r.pharmacyId === pharmacyId);
    }
    return list;
  } catch {
    return INITIAL_PHARMACY_REVIEWS;
  }
}

export function addPharmacyReview(review: Omit<PharmacyReview, 'id' | 'createdAt' | 'likes'>): PharmacyReview {
  const list = getPharmacyReviews();
  const newReview: PharmacyReview = {
    ...review,
    id: `rev-${Date.now()}`,
    likes: 0,
    createdAt: new Date().toISOString()
  };
  list.unshift(newReview);
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));

  // Update Pharmacy review count & average rating
  const pharmaReviews = list.filter(r => r.pharmacyId === newReview.pharmacyId);
  const avgRating = pharmaReviews.reduce((sum, r) => sum + r.rating, 0) / pharmaReviews.length;
  const pharmacies = getPharmacies();
  const pharmaIdx = pharmacies.findIndex(p => p.id === newReview.pharmacyId);
  if (pharmaIdx >= 0) {
    pharmacies[pharmaIdx].rating = Math.round(avgRating * 10) / 10;
    pharmacies[pharmaIdx].reviewCount = pharmaReviews.length;
    localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(pharmacies));
  }

  // Log activity
  addActivityLog({
    type: 'REVIEW_ADDED',
    title: `Avis ${newReview.rating}/5 partagé pour ${newReview.pharmacyName}`,
    description: `« ${newReview.title} » par ${newReview.authorName} (${newReview.city}).`,
    entityName: newReview.pharmacyName,
    userRole: 'CITOYEN'
  });

  return newReview;
}

export function replyToPharmacyReview(reviewId: string, responderName: string, comment: string): void {
  const list = getPharmacyReviews();
  const index = list.findIndex(r => r.id === reviewId);
  if (index >= 0) {
    list[index].pharmacyResponse = {
      responderName,
      responseDate: new Date().toISOString(),
      comment
    };
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));
  }
}

export function likePharmacyReview(reviewId: string): void {
  const list = getPharmacyReviews();
  const index = list.findIndex(r => r.id === reviewId);
  if (index >= 0) {
    list[index].likes += 1;
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(list));
  }
}

// 4. Activités & Journal d'événements
export function getActivityLogs(): ActivityLogItem[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : INITIAL_ACTIVITY_LOGS;
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function addActivityLog(item: Omit<ActivityLogItem, 'id' | 'timestamp'> & { timestamp?: string }): ActivityLogItem {
  const list = getActivityLogs();
  const newItem: ActivityLogItem = {
    ...item,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: item.timestamp || 'À l\'instant'
  };
  list.unshift(newItem);
  // Keep maximum 50 most recent logs
  if (list.length > 50) {
    list.pop();
  }
  localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(list));
  return newItem;
}

// Distance math utility (Haversine formula in KM)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// ==========================================
// 5. Retours d'Expérience & Suggestions Application
// ==========================================
export function getAppFeedbacks(): AppFeedback[] {
  initStorage();
  try {
    const data = localStorage.getItem(KEYS.APP_FEEDBACKS);
    return data ? JSON.parse(data) : INITIAL_APP_FEEDBACKS;
  } catch {
    return INITIAL_APP_FEEDBACKS;
  }
}

export function saveAppFeedback(feedback: {
  category: AppFeedback['category'];
  title: string;
  description: string;
  rating: number;
  authorName?: string;
  authorRole?: AppFeedback['authorRole'];
  emailOrPhone?: string;
  deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
}): AppFeedback {
  const list = getAppFeedbacks();
  const newFeedback: AppFeedback = {
    id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    category: feedback.category,
    title: feedback.title.trim(),
    description: feedback.description.trim(),
    rating: Math.max(1, Math.min(5, feedback.rating || 5)),
    authorName: feedback.authorName?.trim() || 'Citoyen Anonyme',
    authorRole: feedback.authorRole || 'CITOYEN',
    emailOrPhone: feedback.emailOrPhone?.trim() || undefined,
    deviceType: feedback.deviceType || (window.innerWidth < 640 ? 'MOBILE' : 'DESKTOP'),
    upvotes: 1,
    userUpvoted: true,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString().split('T')[0]
  };

  list.unshift(newFeedback);
  localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(list));
  syncFeedbackToCloud(newFeedback).catch(() => {});

  // Log activity
  addActivityLog({
    type: 'REVIEW_ADDED',
    title: 'Nouveau retour d\'expérience sur l\'app',
    description: `« ${newFeedback.title} » soumis par ${newFeedback.authorName} (${newFeedback.rating}/5 étoiles)`,
    userRole: 'CITOYEN'
  });

  return newFeedback;
}

export function upvoteAppFeedback(feedbackId: string): { upvotes: number; userUpvoted: boolean } | null {
  const list = getAppFeedbacks();
  const index = list.findIndex(f => f.id === feedbackId);
  if (index === -1) return null;

  const current = list[index];
  const isUpvoted = !!current.userUpvoted;

  if (isUpvoted) {
    current.upvotes = Math.max(0, current.upvotes - 1);
    current.userUpvoted = false;
  } else {
    current.upvotes = current.upvotes + 1;
    current.userUpvoted = true;
  }

  list[index] = current;
  localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(list));
  return { upvotes: current.upvotes, userUpvoted: current.userUpvoted };
}

export function updateAppFeedbackStatus(
  feedbackId: string,
  status: AppFeedbackStatus,
  adminResponse?: { author: string; message: string; respondedAt?: string }
): AppFeedback | null {
  const list = getAppFeedbacks();
  const index = list.findIndex(f => f.id === feedbackId);
  if (index === -1) return null;

  const current = list[index];
  current.status = status;
  if (adminResponse) {
    current.adminResponse = {
      author: adminResponse.author || 'Équipe Galenis Togo',
      message: adminResponse.message,
      respondedAt: adminResponse.respondedAt || new Date().toISOString().split('T')[0]
    };
  }

  list[index] = current;
  localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(list));
  return current;
}

export function deleteAppFeedback(feedbackId: string): boolean {
  const list = getAppFeedbacks();
  const filtered = list.filter(f => f.id !== feedbackId);
  if (filtered.length === list.length) return false;
  localStorage.setItem(KEYS.APP_FEEDBACKS, JSON.stringify(filtered));
  return true;
}

export function getPwaInstalls(): number {
  try {
    const data = localStorage.getItem(KEYS.PWA_INSTALLS);
    return data ? parseInt(data, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function recordPwaInstall(): void {
  try {
    const current = getPwaInstalls();
    localStorage.setItem(KEYS.PWA_INSTALLS, (current + 1).toString());
  } catch (e) {
    console.error(e);
  }
}


// ==========================================
// Offline Caching & Sync
// ==========================================

export async function syncPharmacyDirectory(): Promise<void> {
  if (!navigator.onLine) {
    console.warn('Offline mode: Using cached pharmacy directory.');
    return;
  }
  
  try {
    const response = await fetch('/api/v1/pharmacies');
    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(result.data));
        localStorage.setItem(`${KEYS.PHARMACIES}_last_sync`, new Date().toISOString());
        window.dispatchEvent(new Event('pharmacy-directory-synced'));
      }
    }
  } catch (error) {
    console.warn('Could not sync pharmacy directory. Falling back to local cache.', error);
  }
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(`${KEYS.PHARMACIES}_last_sync`);
  } catch {
    return null;
  }
}

// Real-Time Cloud Synchronization using Firebase Firestore
export function initRealtimeCloudSync(onSyncCallback?: () => void): () => void {
  // 1. Subscribe to remote updates
  const unsubscribe = subscribeToRemotePharmacies((cloudPharmacies) => {
    if (cloudPharmacies && cloudPharmacies.length > 0) {
      const local = getPharmacies();
      const mergedMap = new Map<string, Pharmacy>();
      
      local.forEach(p => mergedMap.set(p.id, p));
      cloudPharmacies.forEach(cp => {
        // Merge cloud pharmacy
        mergedMap.set(cp.id, {
          ...(mergedMap.get(cp.id) || cp),
          ...cp
        });
      });

      const updatedList = Array.from(mergedMap.values());
      localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(updatedList));
      localStorage.setItem(`${KEYS.PHARMACIES}_last_sync`, new Date().toISOString());
      
      if (onSyncCallback) {
        onSyncCallback();
      }
      window.dispatchEvent(new Event('pharmacy-directory-synced'));
    }
  });

  return unsubscribe;
}

// --- REQUIS: IMMUTABLE STOCK AUDIT TRAIL ---
export function getStockAuditLogs(pharmacyId?: string): StockAuditLog[] {
  initStorage();
  try {
    const raw = localStorage.getItem(KEYS.STOCK_AUDIT);
    const list: StockAuditLog[] = raw ? JSON.parse(raw) : [];
    if (pharmacyId) {
      return list.filter(l => l.pharmacyId === pharmacyId);
    }
    return list;
  } catch {
    return [];
  }
}

export function addStockAuditLog(log: Omit<StockAuditLog, 'id' | 'timestamp'>): StockAuditLog {
  const list = getStockAuditLogs();
  const newLog: StockAuditLog = {
    ...log,
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString()
  };
  list.unshift(newLog);
  // Cap at 200 items to conserve client memory
  localStorage.setItem(KEYS.STOCK_AUDIT, JSON.stringify(list.slice(0, 200)));

  // Also log to global activity feed
  addActivityLog({
    type: 'STOCK_UPDATED',
    title: `Mise à jour de stock : ${newLog.drugName}`,
    description: `${newLog.changedBy} a actualisé le statut (${newLog.previousStatus} -> ${newLog.newStatus}) pour ${newLog.pharmacyName}. ${newLog.reason || ''}`,
    entityName: newLog.pharmacyName,
    userRole: 'PHARMACIEN'
  });

  return newLog;
}

// --- REQUIS: ONPT GUARD CERTIFICATE AUDIT ---
export function getGuardCertificates(pharmacyId?: string): GuardCertificateRecord[] {
  initStorage();
  try {
    const raw = localStorage.getItem(KEYS.GUARD_CERTIFICATES);
    const list: GuardCertificateRecord[] = raw ? JSON.parse(raw) : [];
    if (pharmacyId) {
      return list.filter(c => c.pharmacyId === pharmacyId);
    }
    return list;
  } catch {
    return [];
  }
}

export function recordGuardCertificate(cert: Omit<GuardCertificateRecord, 'id' | 'certifiedAt'>): GuardCertificateRecord {
  const list = getGuardCertificates();
  const newCert: GuardCertificateRecord = {
    ...cert,
    id: `cert-rec-${Date.now()}`,
    certifiedAt: new Date().toISOString()
  };
  list.unshift(newCert);
  localStorage.setItem(KEYS.GUARD_CERTIFICATES, JSON.stringify(list.slice(0, 100)));
  return newCert;
}

// --- AD SERVER & MONETIZATION MANAGEMENT ---
export function getAdBanners(): AdBanner[] {
  initStorage();
  try {
    const raw = localStorage.getItem(KEYS.AD_BANNERS);
    return raw ? JSON.parse(raw) : INITIAL_AD_BANNERS;
  } catch {
    return INITIAL_AD_BANNERS;
  }
}

export function getActiveAdBannerByPlacement(placement: string): AdBanner | null {
  const banners = getAdBanners().filter(b => b.status === 'ACTIVE' && b.placement === placement);
  if (banners.length === 0) return null;
  // Return random or primary banner
  const randomIndex = Math.floor(Math.random() * banners.length);
  return banners[randomIndex];
}

export function saveAdBanner(banner: Omit<AdBanner, 'id' | 'createdAt' | 'impressions' | 'clicks'> & { id?: string }): AdBanner {
  const list = getAdBanners();
  if (banner.id) {
    const index = list.findIndex(b => b.id === banner.id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...banner,
        id: banner.id
      };
      localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));
      return list[index];
    }
  }

  const newBanner: AdBanner = {
    ...banner,
    id: `ad_${Date.now()}`,
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString()
  };
  list.unshift(newBanner);
  localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));

  addActivityLog({
    type: 'ADMIN_ACTION',
    title: `Nouvelle Bannière Publicitaire : ${newBanner.advertiser}`,
    description: `Bannière "${newBanner.title}" activée sur l'emplacement ${newBanner.placement} (${newBanner.monthlyFeeFcfa.toLocaleString('fr-FR')} FCFA/mois).`,
    entityName: newBanner.advertiser,
    userRole: 'ADMIN'
  });

  return newBanner;
}

export function toggleAdBannerStatus(id: string): boolean {
  const list = getAdBanners();
  const banner = list.find(b => b.id === id);
  if (banner) {
    banner.status = banner.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));
    return true;
  }
  return false;
}

export function deleteAdBanner(id: string): boolean {
  let list = getAdBanners();
  const initialLen = list.length;
  list = list.filter(b => b.id !== id);
  if (list.length !== initialLen) {
    localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));
    return true;
  }
  return false;
}

export function recordAdImpression(id: string): void {
  try {
    const list = getAdBanners();
    const banner = list.find(b => b.id === id);
    if (banner) {
      banner.impressions = (banner.impressions || 0) + 1;
      localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));
    }
  } catch {
    // silent fallback
  }
}

export function recordAdClick(id: string): void {
  try {
    const list = getAdBanners();
    const banner = list.find(b => b.id === id);
    if (banner) {
      banner.clicks = (banner.clicks || 0) + 1;
      localStorage.setItem(KEYS.AD_BANNERS, JSON.stringify(list));
    }
  } catch {
    // silent fallback
  }
}

