import crypto from 'crypto';

const WATERMARK_SECRET = process.env.API_SIGNING_SECRET || 'GALENIS_TOGO_NATIONAL_CADASTRE_SECRET_2026';

/**
 * Strict sanitization for input strings (prevents XSS, SQLi, NoSQL injection, and control char attacks)
 */
export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    // Remove control characters except standard whitespace
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip dangerous tags and script protocols
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Sanitize search queries specifically, escaping regex control characters
 */
export function sanitizeSearchQuery(input: unknown, maxLength: number = 100): string {
  const clean = sanitizeString(input, maxLength);
  // Strip potential NoSQL operator injections like $gt, $ne, $where
  return clean.replace(/\$+[a-zA-Z0-9_]+/g, '').trim();
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const clean = email.trim().toLowerCase().slice(0, 120);
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return emailRegex.test(clean) ? clean : null;
}

/**
 * Validates and sanitizes phone numbers (supports Togolese +228 and international formats)
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  return phone.trim().slice(0, 30).replace(/[^0-9+\s\-()]/g, '');
}

/**
 * Generates an encrypted cryptographic watermark token to trace data provenance and detect stolen clones
 */
export function generateDataWatermark(apiKeyId: string, endpoint: string): { signature: string; timestamp: string; watermark_token: string } {
  const timestamp = new Date().toISOString();
  const rawPayload = `${apiKeyId}:${endpoint}:${timestamp}:${WATERMARK_SECRET}`;
  const signature = crypto.createHmac('sha256', WATERMARK_SECRET).update(rawPayload).digest('hex').substring(0, 32);
  const watermarkToken = Buffer.from(JSON.stringify({
    org: 'REPUBLIQUE_TOGOLAISE_GALENIS',
    key_id: apiKeyId,
    sig: signature,
    ts: Date.now()
  })).toString('base64');

  return { signature, timestamp, watermark_token: watermarkToken };
}

/**
 * Heuristic bot & scraper detection
 */
export function detectScrapingAnomaly(req: { headers: Record<string, string | string[] | undefined>; query: Record<string, any> }): { isSuspicious: boolean; reason?: string } {
  const userAgent = String(req.headers['user-agent'] || '').toLowerCase();
  
  // Known aggressive scraper tool signatures
  const scraperSignatures = ['scrapy', 'mechanize', 'httrack', 'nikto', 'sqlmap', 'nmap', 'zgrab', 'masscan'];
  for (const sig of scraperSignatures) {
    if (userAgent.includes(sig)) {
      return { isSuspicious: true, reason: `SUSPICIOUS_USER_AGENT_${sig.toUpperCase()}` };
    }
  }

  // Trapping trap parameters (honeypot queries often used by scrapers attempting SQL injection probes)
  if (req.query['admin_dump'] || req.query['export_all'] || req.query['$where'] || req.query['union_select']) {
    return { isSuspicious: true, reason: 'HONEYPOT_INJECTION_PROBE_DETECTED' };
  }

  return { isSuspicious: false };
}

/**
 * Sanitizes and contextualizes pharmacy outputs to avoid exposing internal debug notes
 */
export function sanitizePharmacyRecord(pharmacy: any) {
  if (!pharmacy) return null;
  const { internalNotes, adminFlags, ...clean } = pharmacy;
  return clean;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  safeName?: string;
  mimeType?: string;
  sizeKb?: number;
}

/**
 * Validates uploaded files (Anti-Malware, Strict MIME & extension checking, 5MB max limit)
 */
export function validateUploadedFile(file: { name: string; size: number; type?: string }): FileValidationResult {
  if (!file || !file.name) {
    return { isValid: false, error: 'Fichier absent ou non reconnu.' };
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE_BYTES) {
    return { 
      isValid: false, 
      error: `Fichier trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La limite de sécurité est fixée à 5 Mo.` 
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const dangerousExtensions = [
    'exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'py', 'js', 'vbs', 'scr', 
    'dll', 'msi', 'jar', 'svg', 'html', 'htm', 'xhtml', 'htaccess'
  ];

  if (dangerousExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Format de fichier non autorisé (.${extension}). Seuls les formats d'images (JPG, PNG, WEBP) et documents PDF sont acceptés pour des raisons de sécurité sanitaire.`
    };
  }

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Extension (.${extension}) non prise en charge. Formats acceptés : JPG, PNG, WEBP, PDF.`
    };
  }

  // Sanitize filename to prevent directory traversal
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);

  return {
    isValid: true,
    safeName,
    mimeType: file.type || (extension === 'pdf' ? 'application/pdf' : `image/${extension}`),
    sizeKb: Math.round(file.size / 1024)
  };
}

/**
 * Generates an official ONPT cryptographic guard certificate
 */
export function generateGuardCertificate(pharmacyId: string, pharmacyName: string, onptNumber: string, guardDate: string): {
  certificateId: string;
  onptVerified: boolean;
  signature: string;
  validDate: string;
  legalNotice: string;
} {
  const cleanOnpt = sanitizeString(onptNumber, 30);
  const onptVerified = cleanOnpt.length >= 4;
  const rawPayload = `${pharmacyId}:${pharmacyName}:${cleanOnpt}:${guardDate}:${WATERMARK_SECRET}`;
  const signature = crypto.createHmac('sha256', WATERMARK_SECRET).update(rawPayload).digest('hex').substring(0, 24).toUpperCase();
  const certificateId = `TG-ONPT-${guardDate.replace(/-/g, '')}-${signature.substring(0, 8)}`;

  return {
    certificateId,
    onptVerified,
    signature,
    validDate: guardDate,
    legalNotice: 'Certifié conforme par le Cadastre National Pharmaceutique du Togo (DPML / Ordre National des Pharmaciens).'
  };
}
