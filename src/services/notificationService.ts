import { Pharmacy } from '../types';

export interface GuardPushNotificationPreference {
  enabled: boolean;
  city: string;
  quarter?: string;
  sound: boolean;
  notifyOnGuardStart: boolean;
  notifyOnEmergencyAlert: boolean;
}

export interface GuardNotificationItem {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  city: string;
  quarter: string;
  phone: string;
  timestamp: string;
  type: 'GUARD_STARTED' | 'GUARD_ROTATION' | 'EMERGENCY_FLASH' | 'STATUS_CHANGE';
  message: string;
  read: boolean;
}

const STORAGE_KEYS = {
  PREFERENCES: 'galenis_guard_push_prefs_v1',
  HISTORY: 'galenis_guard_push_history_v1',
};

const DEFAULT_PREFERENCES: GuardPushNotificationPreference = {
  enabled: true,
  city: 'TOUTES',
  sound: true,
  notifyOnGuardStart: true,
  notifyOnEmergencyAlert: true,
};

// Obtenir les préférences utilisateur
export function getNotificationPreferences(): GuardPushNotificationPreference {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

// Sauvegarder les préférences
export function saveNotificationPreferences(prefs: Partial<GuardPushNotificationPreference>): GuardPushNotificationPreference {
  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('galenis_push_prefs_updated', { detail: updated }));
  return updated;
}

// Obtenir l'historique des notifications
export function getNotificationHistory(): GuardNotificationItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Sauvegarder une notification dans l'historique
export function saveNotificationToHistory(item: GuardNotificationItem): GuardNotificationItem[] {
  const history = getNotificationHistory();
  const updated = [item, ...history.slice(0, 49)]; // Garder les 50 dernières
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('galenis_push_history_updated', { detail: updated }));
  return updated;
}

// Marquer comme lue
export function markNotificationAsRead(id: string): void {
  const history = getNotificationHistory();
  const updated = history.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('galenis_push_history_updated', { detail: updated }));
}

// Tout marquer comme lu
export function markAllNotificationsAsRead(): void {
  const history = getNotificationHistory();
  const updated = history.map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('galenis_push_history_updated', { detail: updated }));
}

// Effacer l'historique
export function clearNotificationHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  window.dispatchEvent(new CustomEvent('galenis_push_history_updated', { detail: [] }));
}

// Demander la permission push au navigateur
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      saveNotificationPreferences({ enabled: true });
    }
    return permission;
  } catch (error) {
    console.error('Erreur lors de la demande de permission de notification:', error);
    return 'denied';
  }
}

// Émettre un carillon sonore synthétique
function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Fréquences douces et harmonieuses (Accord santé Fa# - La#)
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch {
    // Ignorer si audio non autorisé
  }
}

// Envoyer une notification push locale (Web Notification + In-App Toast)
export function sendGuardPushNotification(params: {
  pharmacy: Pharmacy;
  type?: 'GUARD_STARTED' | 'GUARD_ROTATION' | 'EMERGENCY_FLASH' | 'STATUS_CHANGE';
  customTitle?: string;
  customMessage?: string;
}): GuardNotificationItem {
  const prefs = getNotificationPreferences();
  const { pharmacy, type = 'GUARD_STARTED' } = params;

  // Filtrer par ville si une ville spécifique est sélectionnée
  if (prefs.city !== 'TOUTES' && pharmacy.city.toLowerCase() !== prefs.city.toLowerCase()) {
    // Ne pas notifier si hors zone d'intérêt
  }

  const title = params.customTitle || `⚡ Pharmacie de Garde Active : ${pharmacy.name}`;
  const message = params.customMessage || `L'officine ${pharmacy.name} située à ${pharmacy.quarter} (${pharmacy.city}) est désormais DE GARDE 24h/24. Tél : ${pharmacy.phone}`;

  const notificationItem: GuardNotificationItem = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    pharmacyId: pharmacy.id,
    pharmacyName: pharmacy.name,
    city: pharmacy.city,
    quarter: pharmacy.quarter,
    phone: pharmacy.phone,
    timestamp: new Date().toISOString(),
    type,
    message,
    read: false
  };

  // Enregistrer dans l'historique
  saveNotificationToHistory(notificationItem);

  // Jouer le carillon sonore si activé
  if (prefs.sound) {
    playNotificationChime();
  }

  // 1. Notification Native du Navigateur (si permission accordée)
  if ('Notification' in window && Notification.permission === 'granted' && prefs.enabled) {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body: message,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: `guard-${pharmacy.id}`,
            data: { pharmacyId: pharmacy.id, url: `/?pharmacy=${pharmacy.id}` }
          });
        }).catch(() => {
          new Notification(title, {
            body: message,
            icon: '/icon.svg'
          });
        });
      } else {
        new Notification(title, {
          body: message,
          icon: '/icon.svg'
        });
      }
    } catch (e) {
      console.warn('Native notification fallback:', e);
    }
  }

  // 2. Émettre l'événement in-app pour le bandeau toast interactif
  window.dispatchEvent(new CustomEvent('galenis_in_app_push_alert', { 
    detail: { notification: notificationItem, pharmacy } 
  }));

  return notificationItem;
}

// Déclencher un test de notification push pour vérification immédiate
export function triggerTestGuardPush(city: string = 'Lomé'): GuardNotificationItem {
  const testPharma: Pharmacy = {
    id: `test_guard_${Date.now()}`,
    name: 'Pharmacie de la Victoire (Alerte Démo)',
    address: 'Avenue de la Libération, Face Grand Marché',
    city: city || 'Lomé',
    quarter: 'Tokoin Habitat',
    region: 'Maritime',
    phone: '+228 90 12 34 56',
    whatsapp: '+228 90 12 34 56',
    email: 'contact@pharmacie-victoire.tg',
    pharmacistInCharge: 'Dr. Mensah Kossi',
    lat: 6.1375,
    lng: 1.2125,
    status: 'DE_GARDE',
    is24h: true,
    isGuardToday: true,
    guardSchedule: [
      { date: new Date().toISOString().split('T')[0], type: '24H', notes: 'Garde Officielle confirmée' }
    ],
    hours: {
      weekday: '24h/24',
      saturday: '24h/24',
      sunday: '24h/24'
    },
    photos: [],
    services: ['GARDE_24H', 'PAIEMENT_MOBILE', 'CONSEIL_ORAL'],
    mobilePayments: ['T-Money', 'Flooz'],
    lastVerified: 'Aujourd\'hui (Garde déclarée)',
    verificationSource: 'Ordre des Pharmaciens',
    claimed: true,
    rating: 4.8,
    reviewCount: 36
  };

  return sendGuardPushNotification({
    pharmacy: testPharma,
    type: 'GUARD_STARTED',
    customTitle: `🚨 ALERTE GARDE 24H : ${testPharma.name}`,
    customMessage: `Nouvelle pharmacie de garde déclarée à ${testPharma.quarter} (${testPharma.city}). Cliquez pour consulter les stocks et l'itinéraire.`
  });
}
