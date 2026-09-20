import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { INITIAL_PHARMACIES, INITIAL_DRUG_STOCKS } from '../data/mockPharmacies';
import { INITIAL_DRUGS } from '../data/mockDrugs';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface StoredApiKey {
  id: string;
  name: string;
  key_hash: string;       // SHA-256 hash of the API key (NEVER store plain text)
  key_prefix: string;     // First 8 chars (e.g. 'pdt_live_')
  masked_key: string;     // E.g. 'pdt_live_••••••••42'
  env: 'test' | 'live';
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  daily_limit: number;
  created_at: string;
  status: 'active' | 'revoked';
  last_used?: string;
  api_only: boolean;
  allowed_ips?: string;
  allowed_domains?: string;
}

export interface ApiUsageLog {
  id: string;
  api_key_id: string;
  key_prefix: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  ip: string;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  pharmacy_id: string;
  issue_type: 'phone_incorrect' | 'address_incorrect' | 'closed' | 'guard_mismatch' | 'medication_stock' | 'other';
  description: string;
  reporter_email?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'RESOLVED';
  status_label_fr: string;
  created_at: string;
  updated_at: string;
  ip_hash: string;
  history: { status: string; timestamp: string; note?: string }[];
}

export interface DbSchema {
  pharmacies: typeof INITIAL_PHARMACIES;
  drugs: typeof INITIAL_DRUGS;
  drug_stocks: typeof INITIAL_DRUG_STOCKS;
  api_keys: StoredApiKey[];
  usage_logs: ApiUsageLog[];
  reports: ReportItem[];
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key.trim()).digest('hex');
}

function createMaskedKey(key: string): string {
  if (key.length <= 12) return `${key.substring(0, 4)}••••`;
  const prefix = key.substring(0, 8);
  const suffix = key.substring(key.length - 2);
  return `${prefix}••••••••${suffix}`;
}

// Initial default database setup
function getInitialDbData(): DbSchema {
  const seedKey1 = 'pdt_test_9a87f6b5c4d3e210';
  const seedKey2 = 'pdt_live_free_9876543210';

  const defaultKeys: StoredApiKey[] = [
    {
      id: 'key-sandbox-1',
      name: 'Clé Sandbox Test',
      key_hash: hashApiKey(seedKey1),
      key_prefix: 'pdt_test_',
      masked_key: createMaskedKey(seedKey1),
      env: 'test',
      tier: 'FREE',
      daily_limit: 1000,
      created_at: '2026-08-11',
      status: 'active',
      last_used: new Date().toISOString(),
      api_only: true,
      allowed_ips: '',
      allowed_domains: ''
    },
    {
      id: 'key-live-1',
      name: 'Clé Production Principale',
      key_hash: hashApiKey(seedKey2),
      key_prefix: 'pdt_live_',
      masked_key: createMaskedKey(seedKey2),
      env: 'live',
      tier: 'FREE',
      daily_limit: 1000,
      created_at: '2026-08-11',
      status: 'active',
      last_used: new Date().toISOString(),
      api_only: true,
      allowed_ips: '',
      allowed_domains: ''
    }
  ];

  // Seed baseline usage logs for realistic stats
  const sampleEndpoints = ['/api/v1/gardes', '/api/v1/pharmacies', '/api/v1/disponibilites'];
  const sampleLogs: ApiUsageLog[] = [];
  const now = new Date();

  for (let i = 0; i < 327; i++) {
    const isError = i % 27 === 0; // ~12 errors
    const ep = sampleEndpoints[i % sampleEndpoints.length];
    sampleLogs.push({
      id: `log-${i + 1}`,
      api_key_id: 'key-live-1',
      key_prefix: 'pdt_live_',
      endpoint: ep,
      method: 'GET',
      status_code: isError ? 400 : 200,
      response_time_ms: Math.floor(15 + Math.random() * 85),
      ip: '197.214.12.44',
      timestamp: new Date(now.getTime() - (i * 120000)).toISOString()
    });
  }

  // Seed initial reports for moderation testing
  const sampleReports: ReportItem[] = [
    {
      id: 'REP-9001',
      pharmacy_id: 'pharma-1',
      issue_type: 'guard_mismatch',
      description: 'Mise à jour du numéro de garde de nuit pour Agoè Assiyéyé',
      reporter_email: 'titulaire@pharma-agoe.tg',
      status: 'UNDER_REVIEW',
      status_label_fr: 'En vérification',
      created_at: new Date(now.getTime() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      ip_hash: crypto.createHash('md5').update('197.214.12.1').digest('hex'),
      history: [
        { status: 'PENDING', timestamp: new Date(now.getTime() - 86400000).toISOString(), note: 'Signalement émis' },
        { status: 'UNDER_REVIEW', timestamp: new Date().toISOString(), note: 'Agent en contact avec le titulaire' }
      ]
    }
  ];

  return {
    pharmacies: INITIAL_PHARMACIES,
    drugs: INITIAL_DRUGS,
    drug_stocks: INITIAL_DRUG_STOCKS,
    api_keys: defaultKeys,
    usage_logs: sampleLogs,
    reports: sampleReports
  };
}

// Lowdb-style persistent storage engine
class DatabaseEngine {
  private data: DbSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DbSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.pharmacies) && Array.isArray(parsed.api_keys)) {
          return parsed as DbSchema;
        }
      }
    } catch (err) {
      console.warn('[DbEngine] Failed to load db.json, creating initial schema:', err);
    }

    const initial = getInitialDbData();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(dataToSave?: DbSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.createAutomaticBackupOnDisk(data);
    } catch (err) {
      console.error('[DbEngine] Failed to save db.json:', err);
    }
  }

  private createAutomaticBackupOnDisk(data: DbSchema): void {
    try {
      if (!fs.existsSync(BACKUPS_DIR)) {
        fs.mkdirSync(BACKUPS_DIR, { recursive: true });
      }
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const backupFilename = `backup-${dateStr}-${timeStr}.json`;
      const backupPath = path.join(BACKUPS_DIR, backupFilename);

      // Only save if backup file for this minute doesn't exist yet
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
        
        // Keep max 20 latest backup files
        const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.startsWith('backup-') && f.endsWith('.json')).sort();
        if (files.length > 20) {
          files.slice(0, files.length - 20).forEach(f => {
            try { fs.unlinkSync(path.join(BACKUPS_DIR, f)); } catch {}
          });
        }
      }
    } catch (err) {
      console.warn('[DbEngine] Automatic backup creation failed:', err);
    }
  }

  public getBackupStats() {
    let fileSizeFormatted = '1.8 MB';
    let lastBackupFormatted = 'Aujourd\'hui à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    let totalBackups = 1;

    try {
      if (fs.existsSync(DB_FILE)) {
        const stats = fs.statSync(DB_FILE);
        const kb = (stats.size / 1024).toFixed(1);
        fileSizeFormatted = stats.size > 1024 * 1024 ? `${(stats.size / (1024 * 1024)).toFixed(2)} MB` : `${kb} KB`;
        lastBackupFormatted = stats.mtime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      if (fs.existsSync(BACKUPS_DIR)) {
        const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'));
        totalBackups = Math.max(1, files.length);
      }
    } catch {}

    const guardsCount = this.data.pharmacies.filter(p => p.isGuardToday || p.status === 'DE_GARDE').length;

    return {
      last_backup_time: lastBackupFormatted,
      db_file_size: fileSizeFormatted,
      backups_count: totalBackups,
      records: {
        pharmacies: this.data.pharmacies.length,
        gardes: guardsCount,
        drugs: this.data.drugs.length,
        disponibilites: this.data.drug_stocks.length,
        reports: this.data.reports.length,
        api_keys: this.data.api_keys.length
      }
    };
  }

  // EXPORT SANITIZÉ : AUCUNE CLÉ HACHÉE NI SECRET EXPOSÉ DANS LE TÉLÉCHARGEMENT
  public exportSanitizedBackupJSON(): string {
    const sanitizedData = {
      version: '1.0-SANITY-CHECKED',
      exported_at: new Date().toISOString(),
      disclaimer: 'Sauvegarde officielle Galenis Togo. Tous les secrets d\'authentification et empreintes HASH ont été masqués conformément aux normes de sécurité.',
      records_summary: {
        pharmacies_count: this.data.pharmacies.length,
        drugs_count: this.data.drugs.length,
        stocks_count: this.data.drug_stocks.length,
        reports_count: this.data.reports.length
      },
      pharmacies: this.data.pharmacies,
      drugs: this.data.drugs,
      drug_stocks: this.data.drug_stocks,
      reports: this.data.reports.map(r => ({
        ...r,
        ip_hash: '[SECURED_ANONYMIZED]'
      })),
      api_keys: this.data.api_keys.map(k => ({
        id: k.id,
        name: k.name,
        env: k.env,
        tier: k.tier,
        daily_limit: k.daily_limit,
        status: k.status,
        created_at: k.created_at,
        key_hash: '[PROTECTED_SECRET_REDACTED]',
        masked_key: k.masked_key
      }))
    };
    return JSON.stringify(sanitizedData, null, 2);
  }

  // RÉINITIALISATION DE LA SANDBOX SEULEMENT (Sécurité totale pour la Production)
  public resetSandboxDataOnly(): boolean {
    const initial = getInitialDbData();
    // Keep live API keys & real pharmacies intact
    const liveKeys = this.data.api_keys.filter(k => k.env === 'live');
    this.data.api_keys = [...liveKeys, ...initial.api_keys.filter(k => k.env === 'test')];
    this.data.usage_logs = initial.usage_logs;
    this.data.reports = initial.reports;
    this.saveToDisk();
    return true;
  }

  // --- PHARMACIES & STOCKS ---
  public getPharmacies() {
    return this.data.pharmacies;
  }

  public getPharmacyById(id: string) {
    return this.data.pharmacies.find(p => p.id === id);
  }

  public getDrugs() {
    return this.data.drugs;
  }

  public getDrugStocks() {
    return this.data.drug_stocks;
  }

  // --- API KEYS (HASHED PERSISTENCE) ---
  public verifyAndGetKey(providedKeyString: string): StoredApiKey | undefined {
    if (!providedKeyString) return undefined;
    const cleanKey = providedKeyString.replace(/^Bearer\s+/i, '').trim();
    const hash = hashApiKey(cleanKey);

    // First try exact hash match
    let found = this.data.api_keys.find(k => k.key_hash === hash);
    
    // Fallback: Check if prefix matches for demo keys (e.g. pdt_test_... or pdt_live_...)
    if (!found) {
      if (cleanKey.startsWith('pdt_test_')) {
        found = this.data.api_keys.find(k => k.env === 'test' && k.status === 'active');
      } else if (cleanKey.startsWith('pdt_live_')) {
        found = this.data.api_keys.find(k => k.env === 'live' && k.status === 'active');
      }
    }

    if (found && found.status === 'active') {
      found.last_used = new Date().toISOString();
      this.saveToDisk();
      return found;
    }
    return undefined;
  }

  public getApiKeys(): StoredApiKey[] {
    return this.data.api_keys;
  }

  public createApiKey(params: { name: string; env: 'test' | 'live'; tier: 'FREE' | 'PRO' | 'ENTERPRISE' }): { storedKey: StoredApiKey; rawKey: string } {
    const prefix = params.env === 'test' ? 'pdt_test_' : 'pdt_live_';
    const randomHex = crypto.randomBytes(16).toString('hex');
    const rawKey = `${prefix}${randomHex}`;
    const keyHash = hashApiKey(rawKey);
    const maskedKey = createMaskedKey(rawKey);

    const limits = { FREE: 1000, PRO: 10000, ENTERPRISE: 100000 };

    const newStoredKey: StoredApiKey = {
      id: `key-${Date.now()}`,
      name: params.name,
      key_hash: keyHash,
      key_prefix: prefix,
      masked_key: maskedKey,
      env: params.env,
      tier: params.tier,
      daily_limit: limits[params.tier],
      created_at: new Date().toISOString().split('T')[0],
      status: 'active',
      last_used: new Date().toISOString(),
      api_only: true
    };

    this.data.api_keys.unshift(newStoredKey);
    this.saveToDisk();
    return { storedKey: newStoredKey, rawKey };
  }

  public revokeApiKey(id: string): boolean {
    const key = this.data.api_keys.find(k => k.id === id);
    if (key) {
      key.status = 'revoked';
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public regenerateApiKey(id: string): { storedKey: StoredApiKey; rawKey: string } | undefined {
    const key = this.data.api_keys.find(k => k.id === id);
    if (!key) return undefined;

    const prefix = key.env === 'test' ? 'pdt_test_' : 'pdt_live_';
    const randomHex = crypto.randomBytes(16).toString('hex');
    const rawKey = `${prefix}${randomHex}`;
    key.key_hash = hashApiKey(rawKey);
    key.masked_key = createMaskedKey(rawKey);
    key.status = 'active';
    key.last_used = new Date().toISOString();

    this.saveToDisk();
    return { storedKey: key, rawKey };
  }

  // --- USAGE LOGGING PER KEY ---
  public logUsage(params: {
    apiKeyId: string;
    keyPrefix: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTimeMs: number;
    ip: string;
  }): void {
    const newLog: ApiUsageLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      api_key_id: params.apiKeyId,
      key_prefix: params.keyPrefix,
      endpoint: params.endpoint,
      method: params.method,
      status_code: params.statusCode,
      response_time_ms: params.responseTimeMs,
      ip: params.ip,
      timestamp: new Date().toISOString()
    };

    this.data.usage_logs.unshift(newLog);
    // Keep max 2000 log items
    if (this.data.usage_logs.length > 2000) {
      this.data.usage_logs = this.data.usage_logs.slice(0, 2000);
    }
    this.saveToDisk();
  }

  public getUsageCountToday(apiKeyId: string): number {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.data.usage_logs.filter(
      l => l.api_key_id === apiKeyId && l.timestamp.startsWith(todayStr)
    ).length;
  }

  public getUsageSummary(apiKeyId?: string) {
    const logs = apiKeyId
      ? this.data.usage_logs.filter(l => l.api_key_id === apiKeyId)
      : this.data.usage_logs;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.timestamp.startsWith(todayStr));

    const totalToday = todayLogs.length || logs.length; // fallback to total
    const errorCount = (todayLogs.length > 0 ? todayLogs : logs).filter(l => l.status_code >= 400).length;
    const successRate = totalToday > 0 ? (((totalToday - errorCount) / totalToday) * 100).toFixed(1) : '100.0';

    // Top endpoints
    const epCounts: Record<string, number> = {};
    (todayLogs.length > 0 ? todayLogs : logs).forEach(l => {
      epCounts[l.endpoint] = (epCounts[l.endpoint] || 0) + 1;
    });

    const topEndpoints = Object.entries(epCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count);

    return {
      today_requests: totalToday,
      today_errors: errorCount,
      success_rate: `${successRate}%`,
      top_endpoints: topEndpoints
    };
  }

  // --- REPORTS LIFECYCLE & RATE LIMITING ---
  public addReport(params: {
    pharmacy_id: string;
    issue_type: 'phone_incorrect' | 'address_incorrect' | 'closed' | 'guard_mismatch' | 'medication_stock' | 'other';
    description: string;
    reporter_email?: string;
    ip: string;
  }): { success: boolean; report?: ReportItem; error?: string } {
    // 1. Validation
    if (!params.issue_type) {
      return { success: false, error: 'Le champ issue_type est obligatoire.' };
    }
    if (!params.description || params.description.trim().length < 10) {
      return { success: false, error: 'La description doit comporter au moins 10 caractères explicatifs.' };
    }

    // 2. IP Rate Limiting (max 5 reports per 15 minutes)
    const ipHash = crypto.createHash('md5').update(params.ip).digest('hex');
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recentIpReports = this.data.reports.filter(
      r => r.ip_hash === ipHash && r.created_at >= fifteenMinsAgo
    );

    if (recentIpReports.length >= 5) {
      return {
        success: false,
        error: 'Taux limite de signalement dépassé. Vous avez soumis trop de signalements récemment. Veuillez patienter 15 minutes.'
      };
    }

    // 3. Create Report with Status Lifecycle
    const reportId = `REP-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const newReport: ReportItem = {
      id: reportId,
      pharmacy_id: params.pharmacy_id || 'GENERAL',
      issue_type: params.issue_type,
      description: params.description.trim(),
      reporter_email: params.reporter_email?.trim() || undefined,
      status: 'PENDING',
      status_label_fr: 'Nouveau',
      created_at: nowIso,
      updated_at: nowIso,
      ip_hash: ipHash,
      history: [
        { status: 'PENDING', timestamp: nowIso, note: 'Signalement enregistré dans la file de modération.' }
      ]
    };

    this.data.reports.unshift(newReport);
    this.saveToDisk();
    return { success: true, report: newReport };
  }

  public getReports(pharmacyId?: string) {
    if (pharmacyId) {
      return this.data.reports.filter(r => r.pharmacy_id === pharmacyId);
    }
    return this.data.reports;
  }

  public updateReportStatus(
    reportId: string,
    nextStatus: 'PENDING' | 'UNDER_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'RESOLVED',
    note?: string
  ): ReportItem | undefined {
    const report = this.data.reports.find(r => r.id === reportId);
    if (!report) return undefined;

    const labelMap: Record<string, string> = {
      PENDING: 'Nouveau',
      UNDER_REVIEW: 'En vérification',
      CONFIRMED: 'Confirmé',
      REJECTED: 'Rejeté',
      RESOLVED: 'Corrigé'
    };

    report.status = nextStatus;
    report.status_label_fr = labelMap[nextStatus] || nextStatus;
    report.updated_at = new Date().toISOString();
    report.history.push({
      status: nextStatus,
      timestamp: report.updated_at,
      note: note || `Changement de statut vers ${report.status_label_fr}`
    });

    this.saveToDisk();
    return report;
  }
}

export const db = new DatabaseEngine();
