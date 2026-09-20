import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  getDocs, 
  setDoc, 
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Pharmacy, PharmacyDrugStock, Reservation, AppFeedback } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error Handling Infrastructure as per Skill Requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firebase Firestore connecté avec succès [Database: ' + firebaseConfig.firestoreDatabaseId + ']');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Mode hors-ligne actif ou réseau indisponible pour Firestore.');
    } else {
      console.info('Test de connectivité initial Firestore effectué.');
    }
    return false;
  }
}

// Run test on module import
testFirestoreConnection().catch(() => {});

// Cloud Sync Helpers for Galenis Togo
export async function syncPharmacyToCloud(pharmacy: Pharmacy): Promise<void> {
  const path = `pharmacies/${pharmacy.id}`;
  try {
    await setDoc(doc(db, 'pharmacies', pharmacy.id), {
      id: pharmacy.id,
      name: pharmacy.name,
      city: pharmacy.city,
      region: pharmacy.region,
      address: pharmacy.address,
      phone: pharmacy.phone,
      status: pharmacy.status,
      isGuardToday: !!pharmacy.isGuardToday,
      lat: pharmacy.lat,
      lng: pharmacy.lng,
      lastVerified: pharmacy.lastVerified || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Sync pharmacy ${pharmacy.id} to cloud failed, saved locally:`, error);
  }
}

export async function syncStockToCloud(stock: PharmacyDrugStock): Promise<void> {
  const stockDocId = `${stock.pharmacyId}_${stock.drugId}`;
  try {
    await setDoc(doc(db, 'stocks', stockDocId), {
      pharmacyId: stock.pharmacyId,
      drugId: stock.drugId,
      status: stock.status,
      priceFcfa: stock.priceFcfa,
      lastUpdated: stock.lastUpdated || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Sync stock ${stockDocId} failed:`, error);
  }
}

export async function syncReservationToCloud(reservation: Reservation): Promise<void> {
  try {
    await setDoc(doc(db, 'reservations', reservation.id), reservation, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Sync reservation ${reservation.id} failed:`, error);
  }
}

export async function syncFeedbackToCloud(feedback: AppFeedback): Promise<void> {
  try {
    await setDoc(doc(db, 'app_feedbacks', feedback.id), feedback, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Sync feedback ${feedback.id} failed:`, error);
  }
}

// Listener to pull remote updates down to local cache
export function subscribeToRemotePharmacies(onUpdate: (pharmacies: Pharmacy[]) => void) {
  try {
    const q = query(collection(db, 'pharmacies'), limit(150));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cloudPharmacies: Pharmacy[] = [];
        snapshot.forEach((docSnap) => {
          cloudPharmacies.push(docSnap.data() as Pharmacy);
        });
        if (cloudPharmacies.length > 0) {
          onUpdate(cloudPharmacies);
        }
      }
    }, (err) => {
      console.warn('[Firestore] Snapshot listener on pharmacies paused:', err.message);
    });
  } catch (err) {
    console.warn('[Firestore] Could not subscribe to pharmacies collection:', err);
    return () => {};
  }
}
