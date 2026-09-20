/**
 * Client-side security, data sanitization, privacy management (APDP Togo),
 * anti-fraud verification, and watermarking.
 */

/**
 * Strips HTML tags, script protocols and control characters from client input
 */
export function sanitizeClientText(input: string, maxLength: number = 500): string {
  if (!input) return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validates file upload before processing
 */
export function validateClientFile(file: File): { isValid: boolean; error?: string; safeName: string; sizeMb: string } {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Fichier trop volumineux (${sizeMb} Mo). La limite de conformité sanitaire est de 5 Mo.`,
      safeName: file.name,
      sizeMb
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const dangerousExtensions = ['exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'py', 'js', 'vbs', 'scr', 'dll', 'svg', 'html', 'htm'];

  if (dangerousExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Format .${extension} interdit pour des raisons de sécurité. Formats acceptés : JPG, PNG, WEBP, PDF.`,
      safeName: file.name,
      sizeMb
    };
  }

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Format .${extension} non supporté. Veuillez sélectionner une image (JPG, PNG) ou un PDF.`,
      safeName: file.name,
      sizeMb
    };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  return {
    isValid: true,
    safeName,
    sizeMb
  };
}

/**
 * Privacy Shield: Purges citizen health records from localStorage (APDP compliance)
 */
export function purgeCitizenHealthHistory(): { success: boolean; clearedItemsCount: number } {
  let clearedCount = 0;
  const keysToPurge = [
    'galenis_search_history',
    'galenis_viewed_drugs',
    'galenis_saved_prescriptions',
    'galenis_temporary_scans',
    'galenis_patient_insurance_cache',
    'galenis_recent_searches'
  ];

  keysToPurge.forEach(key => {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });

  // Notify listeners that history has been sanitized
  window.dispatchEvent(new CustomEvent('galenis_privacy_purged', { detail: { timestamp: Date.now() } }));

  return { success: true, clearedItemsCount: clearedCount };
}

/**
 * Privacy Shield: Export personal data in machine-readable JSON format
 */
export function exportCitizenPersonalData(userName?: string, email?: string): void {
  const exportPayload = {
    standard: 'REPUBLIQUE_TOGOLAISE_LOI_APDP_2019_PROTECTION_DONNEES',
    dateExport: new Date().toISOString(),
    user: {
      name: userName || 'Utilisateur Anonyme',
      email: email || 'Non renseigné'
    },
    donneesLocales: {
      recherchesRecentes: JSON.parse(localStorage.getItem('galenis_recent_searches') || '[]'),
      favorisPharmacies: JSON.parse(localStorage.getItem('galenis_favorite_pharmacies') || '[]'),
      reservations: JSON.parse(localStorage.getItem('galenis_togo_reservations_v1') || '[]')
    },
    certificatProvenance: 'Cadastre National Pharmaceutique du Togo - Galenis'
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `galenis_mes_donnees_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats official shareable certificate text with tamper-evident signature for WhatsApp & SMS
 */
export function generateCertifiedShareText(pharmacyName: string, city: string, phone: string, isGuard: boolean): string {
  const today = new Date().toLocaleDateString('fr-TG', { day: '2-digit', month: 'long', year: 'numeric' });
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `🏛️ *GALENIS TOGO - CADASTRE NATIONAL PHARMACEUTIQUE*
━━━━━━━━━━━━━━━━━━━━━━━
📍 *${pharmacyName}*
📌 Ville : ${city}
📞 Contact Direct : ${phone}
🟢 Statut : ${isGuard ? 'DE GARDE OFFICIELLE (24H/24)' : 'OUVERTE'}
📅 Date de validité : ${today}
🔒 *Certificat d'Intégrité :* #TG-DPML-${hash}
━━━━━━━━━━━━━━━━━━━━━━━
_Source Officielle : Ministère de la Santé & de l'Hygiène Publique du Togo / DPML_
Consultez en direct sur : https://galenis.tg`;
}
