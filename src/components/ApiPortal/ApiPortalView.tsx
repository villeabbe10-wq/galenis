import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ApiKey, Pharmacy } from '../../types';
import { 
  createApiKey, 
  getApiKeys, 
  incrementApiKeyUsage, 
  revokeApiKey, 
  regenerateApiKey, 
  updateKeyRestrictions,
  getPharmacies,
  getDeveloperDossiers,
  getDeveloperDossierByEmail
} from '../../services/pharmacyStorage';
import { DeveloperOnboardingWizard } from '../DeveloperOnboardingWizard';
import { PaymentModal } from '../PaymentModal';
import { GovernanceAndRolesDocs } from './GovernanceAndRolesDocs';
import { WidgetEmbedSection } from './WidgetEmbedSection';
import { DeveloperKycModal } from './DeveloperKycModal';
import { LionIcon } from '../LionIcon';
import { TogoLionIcon } from '../TogoEmblems';
import { 
  ShoppingBag,
  Radio,
  FileSpreadsheet,
  Filter,
  Smartphone,
  CreditCard,
  ChevronDown,
  Download,
  Code2, 
  Code,
  Play, 
  Key, 
  Copy, 
  Check, 
  Globe, 
  Database, 
  Layers, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Plus,
  Activity,
  FileCode2,
  HelpCircle,
  Clock,
  Search,
  ExternalLink,
  Info,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  History,
  Send,
  Flag,
  FileText,
  Bookmark,
  Sparkles,
  Bot,
  Bell,
  MessageSquare,
  Cpu,
  Boxes,
  Compass,
  RefreshCw,
  Sliders,
  ShieldAlert,
  BarChart3,
  XCircle,
  Users,
  Scale
} from 'lucide-react';

export type ApiPortalTab = 
  | 'OVERVIEW' 
  | 'QUICKSTART' 
  | 'GOVERNANCE'
  | 'DOCS' 
  | 'TESTER' 
  | 'ERRORS' 
  | 'KEYS'
  | 'SDK'
  | 'WIDGET'
  | 'WEBHOOKS'
  | 'LOGS'
  | 'EVENTS'
  | 'STATUS' 
  | 'CHANGELOG' 
  | 'REPORT'
  | 'AI_ASSISTANT'
  | 'AI_GENERATE'
  | 'SUPPORT';

interface ApiPortalViewProps {
  onOpenFaq?: () => void;
}

export const ApiPortalView: React.FC<ApiPortalViewProps> = ({ onOpenFaq }) => {
  const [activeTab, setActiveTab] = useState<ApiPortalTab>('OVERVIEW');
  const [pharmacies] = useState<Pharmacy[]>(() => getPharmacies());
  const [showFedapayRechargeModal, setShowFedapayRechargeModal] = useState(false);
  const [rechargePack, setRechargePack] = useState({ name: 'Recharge Quota API (Pack 10 000 requêtes)', amount: 5000 });
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Developer Account State (Synced with Admin via localStorage & events)
  const [developerAccount, setDeveloperAccount] = useState<{
    name: string;
    ref: string;
    isValidated: boolean;
    status?: 'SANDBOX' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    tier: string;
    email: string;
    dailyLimit: number;
    requestPending: boolean;
    rejectionReason?: string;
  }>(() => {
    try {
      const stored = localStorage.getItem('galenis_dev_account');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      name: 'SADPlus',
      ref: 'acc_2209219218',
      isValidated: false,
      status: 'PENDING_REVIEW',
      tier: 'Sandbox (Test)',
      email: 'contact@sadplus.tg',
      dailyLimit: 1000,
      requestPending: true
    };
  });

  // Sync with Admin validation events
  useEffect(() => {
    const handleAccountSync = () => {
      try {
        const stored = localStorage.getItem('galenis_dev_account');
        if (stored) {
          setDeveloperAccount(JSON.parse(stored));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleAccountSync);
    window.addEventListener('galenis_dev_account_updated', handleAccountSync);
    return () => {
      window.removeEventListener('storage', handleAccountSync);
      window.removeEventListener('galenis_dev_account_updated', handleAccountSync);
    };
  }, []);

  const handleOpenKycModal = () => {
    setIsKycModalOpen(true);
  };

  // API Request Logs State
  const [apiLogs, setApiLogs] = useState<Array<{
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    status: number;
    statusText: string;
    latencyMs: number;
    timestamp: string;
    ip: string;
    keyId: string;
    userAgent: string;
    requestBody?: string;
    responsePayload?: any;
  }>>([
    {
      id: 'req_live_9941a82',
      method: 'GET',
      path: '/api/v1/gardes?city=Lome&guardOnly=true',
      status: 200,
      statusText: 'OK',
      latencyMs: 38,
      timestamp: 'Il y a 2 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: {
        status: 'success',
        count: 42,
        city: 'Lomé',
        data: [{ id: 'pharma-1', name: 'Pharmacie Populaire Tokoin', isGuard: true }]
      }
    },
    {
      id: 'req_live_8831c94',
      method: 'GET',
      path: '/api/v1/pharmacies?limit=10',
      status: 200,
      statusText: 'OK',
      latencyMs: 44,
      timestamp: 'Il y a 5 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { status: 'success', page: 1, total: 210 }
    },
    {
      id: 'req_live_7720d12',
      method: 'POST',
      path: '/api/v1/reports',
      status: 201,
      statusText: 'Created',
      latencyMs: 76,
      timestamp: 'Il y a 14 min',
      ip: '41.207.162.14 (Moov Togo)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-Backend/1.0',
      requestBody: '{\n  "pharmacy_id": "pharma-12",\n  "issue": "Ajustement garde"\n}',
      responsePayload: { status: 'success', ticket_id: 'TG-REP-9102' }
    },
    {
      id: 'req_live_6619e05',
      method: 'GET',
      path: '/api/v1/disponibilites?drug=Insuline',
      status: 200,
      statusText: 'OK',
      latencyMs: 51,
      timestamp: 'Il y a 22 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { drug: 'Insuline Mixtard', inStock: 3, pharmacies_count: 2 }
    },
    {
      id: 'req_live_5508f33',
      method: 'GET',
      path: '/api/v1/gardes?city=Kara',
      status: 429,
      statusText: 'Too Many Requests',
      latencyMs: 14,
      timestamp: 'Il y a 38 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { error: 'Rate limit exceeded', limit: 1000, retry_after: 86400 }
    },
    {
      id: 'req_live_4497a11',
      method: 'GET',
      path: '/api/v1/pharmacies/non_existent_id',
      status: 404,
      statusText: 'Not Found',
      latencyMs: 22,
      timestamp: 'Il y a 1 heure',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { error: 'Pharmacy not found', code: 'PHARMA_NOT_FOUND' }
    }
  ]);

  const [logFilter, setLogFilter] = useState<'ALL' | '200' | '429' | 'ERRORS'>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);

  const handleSimulateApiCall = () => {
    const endpoints = [
      { path: '/api/v1/gardes?city=Lome', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/pharmacies?city=Sokode', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/disponibilites?drug=Paracetamol', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/reports', method: 'POST' as const, status: 201, text: 'Created' },
      { path: '/api/v1/gardes?city=Kpalime', method: 'GET' as const, status: Math.random() > 0.8 ? 429 : 200, text: 'OK' }
    ];
    const picked = endpoints[Math.floor(Math.random() * endpoints.length)];
    const newLog = {
      id: `req_live_${Math.random().toString(36).substring(2, 9)}`,
      method: picked.method,
      path: picked.path,
      status: picked.status,
      statusText: picked.text,
      latencyMs: Math.floor(18 + Math.random() * 65),
      timestamp: "À l'instant",
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: {
        status: 'success',
        timestamp: new Date().toISOString(),
        queried_endpoint: picked.path
      }
    };
    setApiLogs(prev => [newLog, ...prev]);
  };

  // System Events Stream State
  const [systemEvents, setSystemEvents] = useState<Array<{
    id: string;
    event: string;
    category: 'GUARD' | 'STOCK' | 'SYSTEM' | 'SECURITY';
    summary: string;
    timestamp: string;
    source: string;
    payload: any;
  }>>([
    {
      id: 'evt_tg_9921',
      event: 'pharmacy.guard_turnover',
      category: 'GUARD',
      summary: 'Changement de garde effectif pour 42 officines de Lomé',
      timestamp: "Aujourd'hui à 20h00",
      source: 'Comité de Garde DPML',
      payload: { city: 'Lomé', active_guards: 42, period: 'Nuit & Weekend', published_by: 'ONPT' }
    },
    {
      id: 'evt_tg_9920',
      event: 'stock.critical_alert',
      category: 'STOCK',
      summary: 'Alerte stock critique : Insuline Mixtard 100UI (Rupture signalée Tokoin)',
      timestamp: 'Il y a 18 min',
      source: 'Pharmacie Populaire Tokoin',
      payload: { drug_id: 'med-insuline-100', current_stock: 2, status: 'CRITICAL', tension: 'Nationale' }
    },
    {
      id: 'evt_tg_9919',
      event: 'api.quota_warning_80',
      category: 'SYSTEM',
      summary: "Seuil d'alerte de quota 80% atteint pour la clé pdt_live_...3210",
      timestamp: 'Il y a 45 min',
      source: 'Galenis Gateway',
      payload: { key: 'pdt_live_free_...3210', used: 870, limit: 1000, percentage: 87 }
    },
    {
      id: 'evt_tg_9918',
      event: 'webhook.delivery_success',
      category: 'SYSTEM',
      summary: 'Webhook délivré avec succès à https://api.sadplus.tg/webhooks (HTTP 200)',
      timestamp: 'Il y a 1 heure',
      source: 'Galenis Webhook Dispatcher',
      payload: { target_url: 'https://api.sadplus.tg/webhooks', http_code: 200, latency_ms: 42 }
    },
    {
      id: 'evt_tg_9917',
      event: 'security.key_rotation',
      category: 'SECURITY',
      summary: 'Rotation automatique de certificat TLS & Signature HMAC SHA-256',
      timestamp: 'Ce matin à 06h00',
      source: 'Galenis Vault',
      payload: { certificate_valid_until: '2027-09-08', algorithm: 'HMAC-SHA256' }
    }
  ]);

  const [eventCategoryFilter, setEventCategoryFilter] = useState<'ALL' | 'GUARD' | 'STOCK' | 'SYSTEM' | 'SECURITY'>('ALL');

  const handleTriggerTestEvent = () => {
    const testEvt = {
      id: `evt_tg_${Math.floor(1000 + Math.random() * 9000)}`,
      event: 'pharmacy.guard_ping',
      category: 'GUARD' as const,
      summary: 'Test de synchronisation de garde en direct (Lomé Centre)',
      timestamp: "À l'instant",
      source: 'Simulateur Événement Dev',
      payload: { ping: true, time: new Date().toLocaleTimeString(), status: 'TEST_DELIVERED' }
    };
    setSystemEvents(prev => [testEvt, ...prev]);
  };

  // Interactive REST Tester State
  const [testerEndpoint, setTesterEndpoint] = useState<string>('/api/v1/pharmacies');
  const [testerMethod, setTesterMethod] = useState<'GET' | 'POST'>('GET');
  const [testerParam, setTesterParam] = useState<string>('city=Lome&limit=5');
  const [testerBody, setTesterBody] = useState<string>('{\n  "issue_type": "phone_incorrect",\n  "description": "Numéro non attribué",\n  "pharmacy_id": "pharma-1"\n}');
  const [testerEnv, setTesterEnv] = useState<'test' | 'live'>('live');
  const [testerKey, setTesterKey] = useState<string>('pdt_live_••••••••3210');
  const [showHeaders, setShowHeaders] = useState<boolean>(true);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});

  // API Key creation & dashboard
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(getApiKeys());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newKeyDetails, setNewKeyDetails] = useState<{
    name: string;
    company: string;
    tier: ApiKey['tier'];
    env: 'test' | 'live';
    scopes: string[];
  }>({
    name: '',
    company: '',
    tier: 'FREE',
    env: 'live',
    scopes: ['pharmacies:read', 'gardes:read']
  });

  // Newly created unmasked key modal state
  const [createdUnmaskedKey, setCreatedUnmaskedKey] = useState<ApiKey | null>(null);
  const [revealedKeysMap, setRevealedKeysMap] = useState<Record<string, boolean>>({});

  // Security Restrictions State per Key
  const [ipRestrictedMap, setIpRestrictedMap] = useState<Record<string, { enabled: boolean; ips: string }>>({});
  const [domainRestrictedMap, setDomainRestrictedMap] = useState<Record<string, { enabled: boolean; domains: string }>>({});
  const [apiOnlyMap, setApiOnlyMap] = useState<Record<string, boolean>>({});
  const [statusLastChecked, setStatusLastChecked] = useState<number>(12);
  const [statusChecking, setStatusChecking] = useState<boolean>(false);

  // Report issue form state
  const [reportPharmacyId, setReportPharmacyId] = useState<string>('pharma-1');
  const [reportType, setReportType] = useState<string>('phone_incorrect');
  const [reportDesc, setReportDesc] = useState<string>('');
  const [reportSubmittedTicket, setReportSubmittedTicket] = useState<string | null>(null);
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);

  // Copying state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<'curl' | 'js' | 'python' | 'php'>('js');

  // Transversal AI Assistant State
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'AI' | 'USER'; text: string; time: string; codeSnippet?: string }>>([
    {
      sender: 'AI',
      text: "Bonjour ! Je suis Galenis AI Developer, votre assistant transversal. Je peux vous aider à intégrer nos API REST v1, diagnostiquer des réponses, écrire du code ou configurer vos webhooks.",
      time: 'Maintenant'
    }
  ]);

  // Webhook Simulator State
  const [webhookUrl, setWebhookUrl] = useState<string>('https://mon-app-sante.tg/api/webhooks/galenis');
  const [webhookSecret, setWebhookSecret] = useState<string>('whsec_9876543210fedcba9876543210');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['pharmacy.guard_changed', 'stock.alert_low']);
  const [webhookTesting, setWebhookTesting] = useState<boolean>(false);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ id: string; event: string; status: number; latency: number; timestamp: string; payload: any }>>([
    {
      id: 'evt_101',
      event: 'pharmacy.guard_changed',
      status: 200,
      latency: 42,
      timestamp: 'Aujourd\'hui 00:00',
      payload: { event: 'pharmacy.guard_changed', pharmacy_id: 'pharma-1', pharmacy_name: 'Pharmacie Agoè Assiyéyé', city: 'Lomé', guard_status: 'DE_GARDE' }
    }
  ]);

  // SDK interactive view state
  const [sdkLanguage, setSdkLanguage] = useState<'js' | 'python' | 'flutter'>('js');

  // Trigger contextual AI Assistant with pre-filled question grounded in OpenAPI 3.0 spec
  const askAiContextual = (promptText: string) => {
    const userMsg = {
      sender: 'USER' as const,
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // OpenAPI 3.0.3 Schema-grounded response engine
    let aiReplyText = "";
    const lowerPrompt = promptText.toLowerCase();

    if (lowerPrompt.includes('authentifier') || lowerPrompt.includes('x-api-key') || lowerPrompt.includes('clé')) {
      aiReplyText = `📜 [Connexion OpenAPI 3.0.3 - Component: SecurityScheme 'ApiKeyAuth']\nConformément à la spécification OpenAPI officielle de Galenis v1.0.0, chaque requête vers l'API doit contenir l'en-tête HTTP obligatoire :\n\`X-API-Key: pdt_live_...\` (en Production) ou \`pdt_test_...\` (en Sandbox).\n\nExemple de requête cURL :\ncurl -X GET 'https://galenis.tg/api/v1/pharmacies?city=Lome&guardOnly=true' \\\n  -H 'X-API-Key: pdt_live_free_9876543210' \\\n  -H 'Accept: application/json'`;
    } else if (lowerPrompt.includes('429') || lowerPrompt.includes('rate limit') || lowerPrompt.includes('quota') || lowerPrompt.includes('cache')) {
      aiReplyText = `📜 [Connexion OpenAPI 3.0.3 - Headers: X-RateLimit-Limit & X-RateLimit-Remaining]\nSelon le schéma OpenAPI v1.0.0 :\n- Limite Plan Gratuit : 1 000 requêtes / 24 heures.\n- En-têtes de réponse : \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset: 86400\`.\n- En cas de dépassement, l'API renvoie une erreur HTTP 429 Too Many Requests.\n\nConseil d'intégration : Conservez en cache local les listes de garde (TTL de 60 minutes) pour économiser vos quotas.`;
    } else if (lowerPrompt.includes('kara') || lowerPrompt.includes('sokodé') || lowerPrompt.includes('garde') || lowerPrompt.includes('rechercher')) {
      aiReplyText = `📜 [Connexion OpenAPI 3.0.3 - Path: /gardes & /pharmacies]\nPour récupérer les pharmacies de garde dans une localité au Togo, interrogez l'endpoint :\n\`GET /api/v1/gardes?city=Kara\` ou \`GET /api/v1/pharmacies?city=Kara&guardOnly=true\`\n\nSchéma de réponse garantie (#/components/schemas/Pharmacy) :\n{\n  "status": "success",\n  "data": [\n    {\n      "id": "pharma-kara-1",\n      "name": "Pharmacie Kara Centre",\n      "city": "Kara",\n      "phone": "+228 26 60 11 22",\n      "isGuardToday": true,\n      "lastVerified": "2026-08-11"\n    }\n  ]\n}`;
    } else if (lowerPrompt.includes('webhook') || lowerPrompt.includes('express') || lowerPrompt.includes('report') || lowerPrompt.includes('signalement')) {
      aiReplyText = `📜 [Connexion OpenAPI 3.0.3 - Path: /reports - Schema: #/components/schemas/ReportInput]\nPour envoyer un signalement ou une mise à jour d'officine :\n\`POST /api/v1/reports\`\n\nHeaders :\nContent-Type: application/json\nX-API-Key: pdt_live_free_9876543210\n\nPayload JSON :\n{\n  "pharmacy_id": "pharma-1",\n  "issue_type": "guard_mismatch",\n  "description": "Information de garde de nuit mise à jour par le titulaire",\n  "reporter_email": "dev@galenis.tg"\n}`;
    } else if (lowerPrompt.includes('partenariat') || lowerPrompt.includes('relèvement') || lowerPrompt.includes('augmentation')) {
      aiReplyText = `📜 [Connexion OpenAPI 3.0.3 - Plan Enterprise / Institutionnel]\nVotre demande d'augmentation de quota a été enregistrée pour votre projet en production.\nUn jeton de test à haut débit (100 000 req/jour) avec garantie de temps de réponse < 50ms vous sera attribué sous 24h après validation par le Comité Technique.`;
    } else {
      aiReplyText = `📜 [Analyse OpenAPI 3.0.3 - Spec v1.0.0]\nJ'ai analysé votre demande : "${promptText}" par rapport à la spécification OpenAPI officielle de Galenis Togo.\n\nEndpoints OpenAPI disponibles :\n- GET /api/v1/status : État de santé des services\n- GET /api/v1/pharmacies : Liste paginée des officines\n- GET /api/v1/gardes : Liste certifiée des pharmacies de garde\n- GET /api/v1/disponibilites : Recherche de médicaments en stock\n- POST /api/v1/reports : Signalement d'anomalies\n- GET /api/v1/openapi.json : Spécification brute OpenAPI 3.0\n\nTous les endpoints nécessitent l'en-tête HTTP \`X-API-Key\`.`;
    }

    const aiMsg = {
      sender: 'AI' as const,
      text: aiReplyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg, aiMsg]);
    setActiveTab('AI_ASSISTANT');
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label || text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Trigger HTTP test against real backend Express server
  const handleTestApi = async () => {
    setLoading(true);
    const start = performance.now();

    try {
      let url = testerEndpoint;
      const options: RequestInit = {
        method: testerMethod,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': testerEnv === 'test' ? 'pdt_test_9a87f6b5c4d3e210' : 'pdt_live_free_9876543210'
        }
      };

      if (testerMethod === 'GET' && testerParam) {
        url += (url.includes('?') ? '&' : '?') + testerParam;
      } else if (testerMethod === 'POST' && testerBody) {
        try {
          options.body = JSON.stringify(JSON.parse(testerBody));
        } catch (e) {
          options.body = testerBody;
        }
      }

      const res = await fetch(url, options);
      const status = res.status;
      const data = await res.json();
      const latency = Math.round(performance.now() - start);

      // Increment real key usage in localStorage & refresh local state
      incrementApiKeyUsage(testerEnv);
      setApiKeys(getApiKeys());

      setResponseStatus(status);
      setResponseLatency(latency);
      setApiResponse(data);
      setResponseHeaders({
        'content-type': 'application/json; charset=utf-8',
        'x-ratelimit-limit': '1000',
        'x-ratelimit-remaining': String(Math.max(0, 1000 - (apiKeys[0]?.usedToday || 1))),
        'x-ratelimit-reset': '86400',
        'x-galenis-version': 'v1.0'
      });
    } catch (err) {
      setResponseStatus(500);
      setApiResponse({
        error: {
          code: 'SERVER_CONNECTION_FAILED',
          message: 'Échec de connexion au serveur Express Backend Galenis Togo',
          request_id: `req_${Date.now()}`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Create API Key
  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyDetails.name || !newKeyDetails.company) return;

    const created = createApiKey(
      newKeyDetails.name,
      newKeyDetails.company,
      newKeyDetails.tier,
      newKeyDetails.env,
      newKeyDetails.scopes
    );

    setApiKeys(getApiKeys());
    setIsCreateModalOpen(false);
    setCreatedUnmaskedKey(created);
    setNewKeyDetails({
      name: '',
      company: '',
      tier: 'FREE',
      env: 'live',
      scopes: ['pharmacies:read', 'gardes:read']
    });
  };

  // Submit Report Form
  const handleSubmitReportForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      const res = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacy_id: reportPharmacyId,
          issue_type: reportType,
          description: reportDesc
        })
      });
      const data = await res.json();
      if (data.data?.report_id) {
        setReportSubmittedTicket(data.data.report_id);
        setReportDesc('');
      }
    } catch (err) {
      setReportSubmittedTicket(`REPORT-${Math.floor(10000 + Math.random() * 90000)}`);
    } finally {
      setSubmittingReport(false);
    }
  };

  const toggleScope = (scope: string) => {
    setNewKeyDetails(prev => {
      const exists = prev.scopes.includes(scope);
      return {
        ...prev,
        scopes: exists ? prev.scopes.filter(s => s !== scope) : [...prev.scopes, scope]
      };
    });
  };

  // Code Snippet Generator
  const getCodeSnippet = (lang: 'curl' | 'js' | 'python' | 'php', endpoint = testerEndpoint, params = testerParam) => {
    const fullUrl = `${window.location.origin}${endpoint}${params && testerMethod === 'GET' ? (endpoint.includes('?') ? '&' : '?') + params : ''}`;
    const dummyKey = testerEnv === 'test' ? 'pdt_test_9a87f6b5c4d3e210' : 'pdt_live_free_9876543210';

    if (lang === 'curl') {
      if (testerMethod === 'POST') {
        return `curl -X POST "${fullUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${dummyKey}" \\
  -d '${testerBody.replace(/\n/g, ' ')}'`;
      }
      return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: ${dummyKey}"`;
    }

    if (lang === 'js') {
      if (testerMethod === 'POST') {
        return `// Node.js (v18+) / Modern JS
const response = await fetch("${fullUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "${dummyKey}"
  },
  body: JSON.stringify(${testerBody})
});

const result = await response.json();
console.log("Ticket:", result.data.report_id);`;
      }
      return `// Node.js (v18+) & Modern Browsers
const response = await fetch("${fullUrl}", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "X-API-Key": "${dummyKey}"
  }
});

const result = await response.json();
console.log("Statut:", result.status);
console.log("Données:", result.data);`;
    }

    if (lang === 'python') {
      return `# Python (requests)
import requests

url = "${fullUrl}"
headers = {
    "Accept": "application/json",
    "X-API-Key": "${dummyKey}"
}

response = requests.get(url, headers=headers)
data = response.json()
print("Statut:", data.get("status"))
print("Données:", data.get("data"))`;
    }

    if (lang === 'php') {
      return `<?php
// PHP cURL
$ch = curl_init("${fullUrl}");
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Accept: application/json',
    'X-API-Key: ${dummyKey}'
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);`;
    }

    return '';
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans bg-[#F7F9FC] p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
      
      {/* Requirement 1: Global Sandbox / Production Toggle Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>ENVIRONNEMENT API :</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTesterEnv('test');
                setTesterKey('pdt_test_9a87f6b5c4d3e210');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                testerEnv === 'test'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>🟡 Sandbox</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTesterEnv('live');
                setTesterKey('pdt_live_free_9876543210');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                testerEnv === 'live'
                  ? 'bg-[#009A63] text-white font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>⚪ Production</span>
            </button>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-300 flex flex-wrap items-center gap-2">
          {testerEnv === 'test' ? (
            <span className="bg-amber-500/10 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>Sandbox active :</strong> Tests isolés avec données simulées (Clé <code className="font-mono font-bold">pdt_test_...</code>)</span>
            </span>
          ) : (
            <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Production live :</strong> API connectée au registre officiel national (Clé <code className="font-mono font-bold">pdt_live_...</code>)</span>
            </span>
          )}

          {onOpenFaq && (
            <button
              type="button"
              onClick={onOpenFaq}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-bold transition-colors cursor-pointer text-xs"
              title="Consulter le Guide & FAQ Développeur (Lion du Togo)"
            >
              <TogoLionIcon className="w-4 h-4 text-emerald-400" />
              <span>Guide & FAQ Développeur</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Professional Header */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Infrastructure de Données de Santé • API REST v1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Portail API & Développeurs <span className="text-emerald-700">Galenis API</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              Une API fiable, versionnée et sécurisée pour accéder aux données officielles des pharmacies du Togo : géolocalisation, gardes nationales et disponibilités déclarées.
            </p>
          </div>

          {/* Real Status Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 shrink-0 sm:min-w-[250px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">État des Services</span>
              <span className="flex items-center gap-1.5 text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                API Opérationnelle
              </span>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">Quota Gratuit : 1 000 req/jour</div>
              <p className="text-[10px] text-slate-600 mt-0.5">En-tête requis : <code className="text-amber-700 font-mono font-bold">X-API-Key</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured 2-Column Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Vertical Developer Sidebar Navigation */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-5 sticky top-4">
          

          {/* Developer Account Badge - Inspired by SADPlus & Ref: acc_... */}
          <div className="p-3.5 bg-gradient-to-br from-purple-50/90 to-indigo-50/70 border border-purple-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-xs text-purple-950 flex items-center gap-1">
                    <span>{developerAccount.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-700 font-bold">
                    <span>Ref: {developerAccount.ref}</span>
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(developerAccount.ref, 'acc_ref')} 
                      className="hover:text-purple-950 cursor-pointer p-0.5 rounded hover:bg-purple-100"
                      title="Copier la référence de compte"
                    >
                      {copiedText === 'acc_ref' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-purple-500" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between">
              <span className={`text-[11px] font-black flex items-center gap-1.5 ${
                developerAccount.isValidated 
                  ? 'text-emerald-700' 
                  : (developerAccount.status === 'PENDING_REVIEW' || developerAccount.requestPending)
                  ? 'text-amber-700'
                  : developerAccount.status === 'REJECTED'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  developerAccount.isValidated 
                    ? 'bg-emerald-500' 
                    : (developerAccount.status === 'PENDING_REVIEW' || developerAccount.requestPending)
                    ? 'bg-amber-500 animate-pulse'
                    : developerAccount.status === 'REJECTED'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`} />
                <span>
                  {developerAccount.isValidated 
                    ? 'Prod Validée' 
                    : (developerAccount.status === 'PENDING_REVIEW' || developerAccount.requestPending)
                    ? 'En examen Admin'
                    : developerAccount.status === 'REJECTED'
                    ? 'Non Conforme'
                    : 'Mode Sandbox'}
                </span>
              </span>
              
              <button 
                type="button"
                onClick={handleOpenKycModal}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  developerAccount.isValidated 
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                    : (developerAccount.status === 'PENDING_REVIEW' || developerAccount.requestPending)
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : developerAccount.status === 'REJECTED'
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                title="Gérer les documents d'accréditation et passage en production"
              >
                {developerAccount.isValidated ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>100k req/j</span>
                  </>
                ) : (developerAccount.status === 'PENDING_REVIEW' || developerAccount.requestPending) ? (
                  <>
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Dossier KYC</span>
                  </>
                ) : developerAccount.status === 'REJECTED' ? (
                  <span>Corriger</span>
                ) : (
                  <span>Passer en Prod</span>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: GUIDE & ACCUEIL */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              GUIDE & ACCUEIL
            </div>
            {[
              { id: 'OVERVIEW', label: "Vue d'ensemble", icon: Globe },
              { id: 'QUICKSTART', label: 'Démarrage rapide', icon: Zap },
              { id: 'GOVERNANCE', label: 'Rôles & Accréditation Dev', icon: ShieldCheck }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 2: RÉFÉRENCE API / V1 */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              RÉFÉRENCE API / V1
            </div>
            {[
              { id: 'DOCS', label: 'Documentation API', icon: FileCode2 },
              { id: 'TESTER', label: 'Console REST Live', icon: Terminal },
              { id: 'ERRORS', label: 'Codes Erreurs HTTP', icon: AlertTriangle }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>


          {/* Section >_ API (Inspired by developer console: Événements, Logs, Webhooks) */}
          <div className="space-y-1">
            <div className="text-[10px] font-black text-indigo-700 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>&gt;_ API</span>
            </div>
            {[
              { id: 'EVENTS', label: 'Événements', icon: Radio },
              { id: 'LOGS', label: 'Logs', icon: FileSpreadsheet },
              { id: 'WEBHOOKS', label: 'Webhooks', icon: Bell }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: INTÉGRATION */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              INTÉGRATION
            </div>
            {[
              { id: 'KEYS', label: 'Clés API & Quotas', icon: Key },
              { id: 'SDK', label: 'SDK & Exemples', icon: Boxes },
              { id: 'WIDGET', label: 'Widget Web Embed', icon: Code2, badge: 'Nouveau' }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 4: DONNÉES & QUALITÉ */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              DONNÉES & QUALITÉ
            </div>
            {[
              { id: 'STATUS', label: 'Qualité & Statut', icon: Activity },
              { id: 'CHANGELOG', label: 'Changelog API', icon: History },
              { id: 'REPORT', label: 'Signaler une erreur', icon: Flag }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 5: AI DEVELOPER */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider px-3 py-1 flex items-center gap-1">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI DEVELOPER</span>
            </div>
            {[
              { id: 'AI_ASSISTANT', label: 'Assistant IA', icon: Bot },
              { id: 'AI_GENERATE', label: 'Générer une intégration', icon: Code2 }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-amber-300 shadow-sm border border-emerald-700'
                      : 'text-slate-800 hover:bg-indigo-50 font-bold bg-indigo-50/40 border border-indigo-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-amber-300' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 6: SUPPORT */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              SUPPORT
            </div>
            {[
              { id: 'SUPPORT', label: 'Support Développeur', icon: MessageSquare }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-white shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Content View Section */}
        <div className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              
              {/* 3 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Sécurisée & Versionnée</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Endpoints normés sous <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono border border-slate-200 font-bold">/v1/</code>, clés gérées avec permissions granulaires et isolation test/live.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Qualité & Provenance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Chaque donnée comporte sa source de vérification (<code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono border border-slate-200 font-bold">source</code>) et son horodatage (<code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono border border-slate-200 font-bold">updated_at</code>).
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Intégration en 5 Min</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Documentation claire, console live interactive et exemples de code prêts à être copiés.
                  </p>
                </div>
              </div>

              {/* Governance & Reliability Documents Callout Banner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 font-extrabold text-teal-800 text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Gouvernance & Conformité</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Exigences d'Accréditation Développeur & Matrice des Rôles</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Découvrez les documents de fiabilité obligatoires (RCCM, NIF, Charte de données) et la matrice comparative des permissions pour Citoyens, Développeurs, Pharmaciens et Administrateurs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('GOVERNANCE')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <span>Consulter le Référentiel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quickstart Call to Action Banner */}
              <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-extrabold text-emerald-700 text-xs uppercase tracking-wider">
                    <LionIcon className="w-4 h-4 text-emerald-600" />
                    <span>Nouveau développeur ?</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">Suivez le guide de Démarrage Rapide en 3 étapes</h3>
                  <p className="text-xs text-slate-600 font-medium">Faites votre premier appel d'API en moins de 3 minutes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('QUICKSTART')}
                  className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <span>Lancer le tutoriel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Architecture Diagram */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">Architecture Produit & Passerelle API</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Conception Scalable</span>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 text-slate-100 font-mono text-xs space-y-5 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
                      <LionIcon className="w-4 h-4 text-emerald-400" />
                      <span>Schéma & Circuit d'une requête API :</span>
                    </div>
                  </div>

                  {/* Generated Neon Line Art Doodle Illustration Image - Enlarged & Clean */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 group shadow-xl min-h-[360px] sm:min-h-[460px] w-full flex items-center justify-center bg-slate-950">
                    <img 
                      src={new URL('../../assets/images/api_neon_doodle_1786471134858.jpg', import.meta.url).href}
                      alt="Schéma Architecture API" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[360px] sm:min-h-[460px]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl space-y-1">
                      <div className="text-emerald-400 font-bold">1. Application</div>
                      <div className="text-[10px] text-slate-400">Bot WhatsApp, App Mobile</div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl space-y-1">
                      <div className="text-amber-400 font-bold">2. API Gateway</div>
                      <div className="text-[10px] text-slate-400">Auth & Rate Limit</div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl space-y-1">
                      <div className="text-emerald-400 font-bold">3. API Pharma V1</div>
                      <div className="text-[10px] text-slate-400">REST JSON Standardisé</div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl space-y-1">
                      <div className="text-slate-300 font-bold">4. Database</div>
                      <div className="text-[10px] text-slate-400">Base Pharmacies Togo</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: GOVERNANCE & ROLES RECAP */}
          {activeTab === 'GOVERNANCE' && (
            <GovernanceAndRolesDocs
              onOpenOnboarding={() => setActiveTab('AI_GENERATE')}
              onOpenKeys={() => setActiveTab('KEYS')}
            />
          )}

          {/* TAB 2: QUICKSTART (DÉMARRAGE EN 3 ÉTAPES) */}
          {activeTab === 'QUICKSTART' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-8">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Démarrage Rapide en 3 Étapes</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">Intégrez les données pharmaceutiques du Togo dans vos projets en moins de 5 minutes.</p>
              </div>

              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#009A63] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    01
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Obtenir une Clé API</h3>
                </div>

                <div className="pl-11 space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
                  <p>
                    Pour utiliser l'API Galenis, vous devez fournir une clé API via l'en-tête HTTP <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold border border-slate-200">X-API-Key</code>.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">Clé Démo Publique (Gratuite) :</div>
                      <code className="text-emerald-700 font-mono text-xs font-bold">pdt_live_free_9876543210</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('KEYS')}
                      className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shrink-0 transition-colors cursor-pointer"
                    >
                      Créer ma propre clé
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#009A63] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    02
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Effectuer votre Première Requête</h3>
                </div>

                <div className="pl-11 space-y-3">
                  <div className="flex items-center justify-between bg-slate-900 px-4 py-2 rounded-t-2xl border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">Exemple HTTP GET /v1/pharmacies</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {(['js', 'curl', 'python', 'php'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-2.5 py-1 rounded-md uppercase transition-colors cursor-pointer text-[10px] ${
                            codeLang === lang ? 'bg-[#009A63] text-white font-extrabold' : 'text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-b-2xl p-4 font-mono text-xs text-emerald-400 relative border border-slate-800">
                    <button
                      onClick={() => copyToClipboard(getCodeSnippet(codeLang, '/api/v1/pharmacies', 'city=Lome&limit=3'), 'quickstartCode')}
                      className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer border border-slate-700"
                    >
                      {copiedText === 'quickstartCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'quickstartCode' ? 'Copié !' : 'Copier'}</span>
                    </button>
                    <pre className="pr-16 leading-relaxed">{getCodeSnippet(codeLang, '/api/v1/pharmacies', 'city=Lome&limit=3')}</pre>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#009A63] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    03
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Exploiter la Réponse JSON Standardisée</h3>
                </div>

                <div className="pl-11 space-y-3">
                  <p className="text-xs text-slate-600 font-medium">
                    Toutes les réponses de l'API utilisent la structure enveloppe <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold border border-slate-200">status</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold border border-slate-200">data</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold border border-slate-200">pagination</code> et <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold border border-slate-200">meta</code> (avec traçabilité <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono border border-slate-200">request_id</code>).
                  </p>

                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs border border-slate-800 overflow-x-auto">
                    <pre>{JSON.stringify({
                      status: "success",
                      data: [
                        {
                          id: "pharma-1",
                          name: "Pharmacie Agoè Assiyéyé",
                          city: "Lomé",
                          quarter: "Agoè-Nyivé",
                          status: "DE_GARDE",
                          isGuardToday: true,
                          phone: "+228 22 25 10 10",
                          source: "verified_pharmacy"
                        }
                      ],
                      pagination: { page: 1, limit: 3, total: 143, total_pages: 48 },
                      meta: { request_id: "req_17861920", timestamp: "2026-08-08T11:20:00.000Z", version: "v1.0" }
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DOCUMENTATION REFERENCE /v1 */}
          {activeTab === 'DOCS' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Référence des Endpoints REST /v1</h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Structure JSON normée et gestion explicite des en-têtes HTTP.</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-amber-800 px-3 py-1.5 rounded-xl border border-slate-200">
                    Base URL : https://api.galenis.tg/v1
                  </span>
                </div>

                {/* Endpoints Table */}
                <div className="space-y-6">
                  {[
                    {
                      method: 'GET',
                      path: '/api/v1/pharmacies',
                      title: 'Liste des pharmacies avec filtres',
                      desc: 'Retourne la liste des pharmacies correspondant aux critères géographiques, de ville ou de statut de garde.',
                      params: [
                        { name: 'city', type: 'string', req: 'Non', desc: 'Ville (ex: Lome, Kara, Sokode)' },
                        { name: 'quarter', type: 'string', req: 'Non', desc: 'Quartier (ex: Agoe, Be, Hedzranawoe)' },
                        { name: 'guardOnly', type: 'boolean', req: 'Non', desc: 'Filtrer uniquement les pharmacies de garde' },
                        { name: 'limit', type: 'integer', req: 'Non', desc: 'Nombre de résultats par page (défaut: 20)' },
                        { name: 'page', type: 'integer', req: 'Non', desc: 'Numéro de page pour la pagination' }
                      ]
                    },
                    {
                      method: 'GET',
                      path: '/api/v1/gardes',
                      title: 'Pharmacies de garde aujourd\'hui',
                      desc: 'Retourne la liste des officines assurant la garde pharmaceutique nationale aujourd\'hui.',
                      params: [
                        { name: 'city', type: 'string', req: 'Non', desc: 'Filtrer les gardes par ville' }
                      ]
                    },
                    {
                      method: 'GET',
                      path: '/api/v1/disponibilites',
                      title: 'Disponibilité & Prix déclarés des médicaments',
                      desc: 'Consultez la disponibilité déclarée d\'un médicament par les officines avec le score de confiance et la traçabilité temporelle.',
                      params: [
                        { name: 'q', type: 'string', req: 'Oui', desc: 'Nom ou DCI du médicament (ex: paracetamol, artemether)' },
                        { name: 'drugId', type: 'string', req: 'Non', desc: 'Identifiant unique du médicament' }
                      ]
                    },
                    {
                      method: 'POST',
                      path: '/api/v1/reports',
                      title: 'Signaler une donnée incorrecte',
                      desc: 'Transmettez un signalement au système de modération (ex: numéro erroné, pharmacie fermée, horaire obsolète).',
                      params: [
                        { name: 'pharmacy_id', type: 'string', req: 'Non', desc: 'Identifiant de la pharmacie concernée' },
                        { name: 'issue_type', type: 'string', req: 'Oui', desc: 'Type (phone_incorrect, address_incorrect, closed, other)' },
                        { name: 'description', type: 'string', req: 'Non', desc: 'Explication détaillée' }
                      ]
                    },
                    {
                      method: 'GET',
                      path: '/api/v1/status',
                      title: 'Statut du système & Métriques',
                      desc: 'Vérifiez la disponibilité des microservices et la synchronisation nationale.',
                      params: []
                    }
                  ].map((ep, idx) => (
                    <div key={idx} className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-3 hover:border-emerald-500 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-extrabold ${
                            ep.method === 'POST' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'bg-emerald-600 text-white'
                          }`}>
                            {ep.method}
                          </span>
                          <code className="text-sm font-extrabold text-slate-900 font-mono">{ep.path}</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-600 hidden sm:inline">{ep.title}</span>
                          <button
                            type="button"
                            onClick={() => askAiContextual(`Peux-tu m'expliquer en détail comment fonctionne l'endpoint ${ep.method} ${ep.path} et me donner un exemple de code d'intégration ?`)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <LionIcon className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Expliquer avec AI</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">{ep.desc}</p>

                      {ep.params.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Paramètres de requête :</div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-100">
                                  <th className="p-2">Paramètre</th>
                                  <th className="p-2">Type</th>
                                  <th className="p-2">Obligatoire</th>
                                  <th className="p-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ep.params.map((p, pidx) => (
                                  <tr key={pidx} className="border-b border-slate-200/60 text-slate-600">
                                    <td className="p-2 font-mono font-bold text-emerald-700">{p.name}</td>
                                    <td className="p-2 font-mono text-[11px] text-slate-500">{p.type}</td>
                                    <td className="p-2 font-bold text-slate-800">{p.req}</td>
                                    <td className="p-2 text-slate-600 font-medium">{p.desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Versioning & Deprecation Policy */}
              <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
                <h3 className="font-extrabold text-sm flex items-center gap-2 text-emerald-800">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Politique de Versionnage & Dépréciation</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  L'API <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded font-mono font-bold border border-amber-200">/v1/</code> est garantie stable. Tout changement rétro-incompatible entraînera le lancement d'une nouvelle version (<code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded font-mono font-bold border border-amber-200">/v2/</code>) avec un préavis d'au moins 6 mois transmis aux développeurs enregistrés.
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: CONSOLE REST LIVE TESTER */}
          {activeTab === 'TESTER' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Panel: Request Configuration */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">Console REST Live Interactive</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Serveur Express Connecté
                  </span>
                </div>

                {/* Sandbox / Production Environment Toggle */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Environnement d'exécution :</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {testerEnv === 'test' ? 'Données simulées sécurisées (Sandbox)' : 'Données réelles du réseau national (Production)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        setTesterEnv('test');
                        setTesterKey('pdt_test_9a87f6b5c4d3e210');
                      }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        testerEnv === 'test' ? 'bg-amber-400 text-slate-950 font-extrabold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTesterEnv('live');
                        setTesterKey('pdt_live_free_9876543210');
                      }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        testerEnv === 'live' ? 'bg-[#009A63] text-white font-extrabold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Production
                    </button>
                  </div>
                </div>

                {/* Endpoint Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">Sélectionner un endpoint /v1 :</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { method: 'GET', path: '/api/v1/pharmacies', label: 'GET /api/v1/pharmacies', defaultParam: 'city=Lome&limit=5', body: '' },
                      { method: 'GET', path: '/api/v1/gardes', label: 'GET /api/v1/gardes', defaultParam: '', body: '' },
                      { method: 'GET', path: '/api/v1/disponibilites', label: 'GET /api/v1/disponibilites', defaultParam: 'q=paracetamol', body: '' },
                      { method: 'POST', path: '/api/v1/reports', label: 'POST /api/v1/reports', defaultParam: '', body: '{\n  "pharmacy_id": "pharma-1",\n  "issue_type": "phone_incorrect",\n  "description": "Numéro de téléphone erroné"\n}' },
                      { method: 'GET', path: '/api/v1/status', label: 'GET /api/v1/status', defaultParam: '', body: '' }
                    ].map((ep) => (
                      <button
                        key={ep.path}
                        type="button"
                        onClick={() => {
                          setTesterEndpoint(ep.path);
                          setTesterMethod(ep.method as 'GET' | 'POST');
                          setTesterParam(ep.defaultParam);
                          if (ep.body) setTesterBody(ep.body);
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          testerEndpoint === ep.path
                            ? 'bg-[#009A63] text-white border-emerald-600 font-bold shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                        }`}
                      >
                        <div className={`font-mono text-[11px] font-bold ${testerEndpoint === ep.path ? 'text-slate-900' : 'text-emerald-700'}`}>{ep.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Query Params or Body depending on method */}
                {testerMethod === 'GET' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Paramètres de requête (Query String) :</label>
                    <input
                      type="text"
                      value={testerParam}
                      onChange={e => setTesterParam(e.target.value)}
                      placeholder="Ex: city=Lome&limit=5"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50 focus:border-emerald-600 outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Corps de la requête (JSON Body) :</label>
                    <textarea
                      value={testerBody}
                      onChange={e => setTesterBody(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50 focus:border-emerald-600 outline-none"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={loading}
                  className="w-full bg-[#009A63] hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{loading ? 'Exécution HTTP en cours...' : 'Exécuter la Requête Live'}</span>
                </button>

              </div>

              {/* Right Panel: Live Response */}
              <div className="lg:col-span-5 space-y-5">
                
                <div className="bg-white text-slate-900 rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 text-xs gap-2">
                    <span className="font-bold text-slate-700">Réponse Serveur V1 :</span>
                    <div className="flex items-center gap-2">
                      {responseStatus && (
                        <>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            responseStatus >= 200 && responseStatus < 300 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {responseStatus} OK
                          </span>
                          {responseLatency && (
                            <span className="text-slate-500 text-[10px] font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 stroke-[2.25]" />
                              <span>{responseLatency} ms</span>
                            </span>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => askAiContextual(`Peux-tu analyser cette réponse d'API de l'endpoint ${testerEndpoint} (Statut ${responseStatus || 200}) : ${JSON.stringify(apiResponse || { note: "aucun test lancé" })}`)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      >
                        <LionIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Analyser avec AI</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-emerald-400 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-80 border border-slate-800 shadow-inner">
                    {apiResponse ? (
                      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    ) : (
                      <span className="text-slate-500 italic">
                        Cliquez sur "Exécuter" pour lancer la requête...
                      </span>
                    )}
                  </div>
                </div>

                {/* Code Export Box */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Copier Code d'Intégration</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      {(['js', 'curl', 'python', 'php'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-2 py-1 rounded-md uppercase transition-colors cursor-pointer ${
                            codeLang === lang ? 'bg-[#009A63] text-white font-extrabold' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-emerald-400 relative group overflow-x-auto border border-slate-800">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getCodeSnippet(codeLang), 'testerSnippet')}
                      className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1 cursor-pointer border border-slate-700"
                    >
                      {copiedText === 'testerSnippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'testerSnippet' ? 'Copié' : 'Copier'}</span>
                    </button>
                    <pre className="pr-16 leading-relaxed">{getCodeSnippet(codeLang)}</pre>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: ERRORS REFERENCE */}
          {activeTab === 'ERRORS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Codes Erreurs HTTP Standardisés</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">Toutes les erreurs retournent un objet explicite comportant un <code className="bg-slate-100 text-emerald-700 font-mono px-1 py-0.5 rounded border border-slate-200">request_id</code> pour le support technique.</p>
                </div>
                <button
                  type="button"
                  onClick={() => askAiContextual("Comment diagnostiquer et corriger les erreurs HTTP 401, 403 et 429 lors de l'intégration de l'API Galenis ?")}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LionIcon className="w-4 h-4 text-emerald-700" />
                  <span>Diagnostiquer avec AI</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3">Code HTTP</th>
                      <th className="p-3">Code Interne</th>
                      <th className="p-3">Description & Diagnostic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-emerald-700">200 OK</td>
                      <td className="p-3 font-mono font-bold text-slate-900">SUCCESS</td>
                      <td className="p-3">Requête exécutée avec succès.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">400 Bad Request</td>
                      <td className="p-3 font-mono font-bold text-slate-900">MISSING_QUERY_PARAMETER</td>
                      <td className="p-3">Paramètre obligatoire manquant ou format JSON invalide.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-rose-700">401 Unauthorized</td>
                      <td className="p-3 font-mono font-bold text-slate-900">INVALID_API_KEY</td>
                      <td className="p-3">Clé API absente ou expirée. Fournir l'en-tête <code className="font-mono bg-slate-100 text-emerald-700 px-1 py-0.5 rounded border border-slate-200 font-bold">X-API-Key</code>.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">403 Forbidden</td>
                      <td className="p-3 font-mono font-bold text-slate-900">INSUFFICIENT_PERMISSIONS</td>
                      <td className="p-3">Votre clé API ne possède pas la permission requise (ex: <code className="font-mono bg-slate-100 text-emerald-700 px-1 py-0.5 rounded border border-slate-200 font-bold">disponibilite:read</code>).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600">404 Not Found</td>
                      <td className="p-3 font-mono font-bold text-slate-900">RESOURCE_NOT_FOUND</td>
                      <td className="p-3">Ressource inexistante (ex: identifiant pharmacie inexistant).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-rose-700">429 Too Many Requests</td>
                      <td className="p-3 font-mono font-bold text-slate-900">RATE_LIMIT_EXCEEDED</td>
                      <td className="p-3">Quota quotidien dépassé (1000 req/jour pour le plan gratuit).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-rose-700">500 Internal Error</td>
                      <td className="p-3 font-mono font-bold text-slate-900">INTERNAL_ERROR</td>
                      <td className="p-3">Anomalie serveur. Transmettez le <code className="font-mono bg-slate-100 text-emerald-700 px-1 py-0.5 rounded border border-slate-200 font-bold">request_id</code> au support.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sample JSON Error Body */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900">Format d'erreur JSON standard :</div>
                <div className="bg-slate-900 text-rose-400 p-4 rounded-2xl font-mono text-xs border border-slate-800 overflow-x-auto">
                  <pre>{JSON.stringify({
                    error: {
                      code: "INVALID_API_KEY",
                      message: "La clé API fournie est invalide ou désactivée.",
                      request_id: "req_8f92k31"
                    }
                  }, null, 2)}</pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: API KEYS & QUOTAS */}
          {activeTab === 'KEYS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-600" />
                    <span>Clés API, Utilisation & Sécurité</span>
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">Contrôle d'accès granulaire, révocations instantanées et métriques de consommation.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer une Clé API</span>
                </button>
              </div>

              {/* 📈 INTERFACE 2: UTILISATION API */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">UTILISATION API</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">Aujourd'hui</span>
                </div>

                {(() => {
                  const rawUsed = apiKeys.reduce((sum, k) => sum + (k.usedToday || 0), 0);
                  const displayUsed = rawUsed > 0 ? rawUsed : 870; // Baseline 327 requêtes
                  const activeKey = apiKeys.find(k => k.env === testerEnv) || apiKeys[0];
                  const limit = activeKey ? activeKey.dailyLimit : 1000;
                  const percentage = Math.min(100, Math.round((displayUsed / limit) * 100));

                  return (
                    <div className="space-y-4">
                      {/* Bar Visualization */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-slate-700">Consommation globale quotidienne</span>
                          <span className="text-emerald-800">{displayUsed.toLocaleString()} / {limit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
                          <div className="bg-[#009A63] h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(4, percentage)}%` }} />
                        </div>
                      </div>

                      {/* Recharge Rapide via Passerelle FedaPay */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                              Recharge Immédiate via Passerelle FedaPay Togo
                            </h4>
                            <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                              T-Money • Flooz • Cartes
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            Besoin de plus de requêtes ? Créditez votre compte instantanément sans rupture de service.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setRechargePack({ name: 'Recharge Quota API (Pack 10 000 requêtes)', amount: 5000 });
                              setShowFedapayRechargeModal(true);
                            }}
                            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-black text-xs transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>+10k req (5 000 FCFA)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRechargePack({ name: 'Recharge Quota API (Pack 50 000 requêtes)', amount: 25000 });
                              setShowFedapayRechargeModal(true);
                            }}
                            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>+50k req (25 000 FCFA)</span>
                          </button>
                        </div>
                      </div>

                      
                      {/* Alert Quota */}
                      {percentage >= 80 && (
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-4">
                          <div className="flex gap-3">
                            <div className="bg-rose-100 p-2 rounded-full h-fit">
                              <AlertTriangle className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-rose-900 text-sm">Attention : Quota API presque atteint ({percentage}%)</h4>
                              <p className="text-xs text-rose-700 mt-1 font-medium">Votre clé API atteindra bientôt sa limite journalière de {limit.toLocaleString()} requêtes. Vous risquez des erreurs HTTP 429.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => askAiContextual("Bonjour, mon application approche de la limite de quota gratuit. Je souhaite demander une extension ou mettre à jour mon plan tarifaire.")}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow-sm transition-colors cursor-pointer shrink-0"
                          >
                            Augmenter mon quota
                          </button>
                        </div>
                      )}

                      {/* Stat Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] uppercase font-extrabold text-slate-500">Volume Exécuté</div>
                          <div className="text-xl font-black font-mono text-slate-900 mt-0.5">{displayUsed} requêtes</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] uppercase font-extrabold text-slate-500">Erreurs HTTP</div>
                          <div className="text-xl font-black font-mono text-rose-600 mt-0.5">12 erreurs</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] uppercase font-extrabold text-slate-500">Taux de Succès</div>
                          <div className="text-xl font-black font-mono text-emerald-700 mt-0.5">98,7 % succès</div>
                        </div>
                      </div>

                      {/* Top Used Endpoints Table */}
                      <div className="pt-2 space-y-2">
                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Endpoints les plus utilisés :</div>
                        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 font-mono text-xs overflow-hidden">
                          <div className="p-2.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                            <span className="font-bold text-slate-900">GET /v1/gardes</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">182</span>
                          </div>
                          <div className="p-2.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                            <span className="font-bold text-slate-900">GET /v1/pharmacies</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">96</span>
                          </div>
                          <div className="p-2.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                            <span className="font-bold text-slate-900">GET /v1/disponibilites</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">49</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 🔐 INTERFACE 1: SÉCURITÉ API & CLÉS ACTIVES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">SÉCURITÉ API</h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Clés actives ({apiKeys.length})</span>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((k) => {
                    const isRevoked = k.status === 'revoked';
                    const isRevealed = revealedKeysMap[k.id];
                    const maskedDisplay = k.maskedKey || `${k.key.substring(0, 8)}••••••••${k.key.substring(k.key.length - 2)}`;
                    const displayKey = isRevealed ? k.key : maskedDisplay;

                    const ipRest = ipRestrictedMap[k.id] || { enabled: false, ips: '197.214.12.0/24' };
                    const domainRest = domainRestrictedMap[k.id] || { enabled: false, domains: 'https://monapplication.tg' };
                    const apiOnly = apiOnlyMap[k.id] ?? true;

                    return (
                      <div key={k.id} className={`p-5 rounded-2xl border transition-all space-y-4 ${
                        isRevoked ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}>
                        {/* Key Info Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{k.name}</span>
                              {isRevoked ? (
                                <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>🔴 Révoquée</span>
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>🟢 Active</span>
                                </span>
                              )}
                              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-300">
                                {k.env === 'test' ? 'Sandbox' : 'Production'}
                              </span>
                            </div>

                            {/* Key display string */}
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <code className={`px-3 py-1 rounded-lg border font-bold ${
                                isRevoked ? 'bg-rose-100 text-rose-700 border-rose-300 line-through' : 'bg-white text-emerald-800 border-slate-300'
                              }`}>
                                {displayKey}
                              </code>

                              {!isRevoked && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setRevealedKeysMap(prev => ({ ...prev, [k.id]: !prev[k.id] }))}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                    title={isRevealed ? "Masquer la clé" : "Afficher la clé"}
                                  >
                                    {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(k.key, `key-${k.id}`)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                    title="Copier la clé"
                                  >
                                    {copiedText === `key-${k.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 text-xs font-medium text-slate-600 pt-1">
                              <div>Créée le : <strong className="text-slate-800">{k.createdAt}</strong></div>
                              <div>Dernière utilisation : <strong className="text-emerald-800">{k.lastUsed || '11:24'}</strong></div>
                            </div>
                          </div>

                          {/* Action Buttons: Révoquer & Régénérer */}
                          <div className="flex items-center gap-2 shrink-0">
                            {!isRevoked ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Êtes-vous sûr de vouloir révoquer immédiatement la clé "${k.name}" ?`)) {
                                      revokeApiKey(k.id);
                                      setApiKeys(getApiKeys());
                                    }
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                  <span>[ Révoquer ]</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const res = regenerateApiKey(k.id);
                                    if (res) {
                                      setApiKeys(res.keys);
                                      alert(`Nouvelle clé générée avec succès : ${res.newKey.key}`);
                                    }
                                  }}
                                  className="bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                                  <span>[ Régénérer ]</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const res = regenerateApiKey(k.id);
                                  if (res) {
                                    setApiKeys(res.keys);
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-900" />
                                <span>Réactiver Clé</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Restrictions Controls */}
                        {!isRevoked && (
                          <div className="border-t border-slate-200/80 pt-3 space-y-2.5">
                            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-slate-600" />
                              <span>Restrictions d'accès :</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              {/* Option 1: API uniquement */}
                              <label className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition-all">
                                <input
                                  type="checkbox"
                                  checked={apiOnly}
                                  onChange={(e) => setApiOnlyMap(prev => ({ ...prev, [k.id]: e.target.checked }))}
                                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-900">☑ API uniquement</span>
                                  <p className="text-[10px] text-slate-500 leading-tight">Accès restreint aux endpoints REST /v1</p>
                                </div>
                              </label>

                              {/* Option 2: IP autorisées */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={ipRest.enabled}
                                    onChange={(e) => setIpRestrictedMap(prev => ({
                                      ...prev,
                                      [k.id]: { ...ipRest, enabled: e.target.checked }
                                    }))}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="font-bold text-slate-900">☐ IP autorisées</span>
                                </label>
                                {ipRest.enabled && (
                                  <input
                                    type="text"
                                    value={ipRest.ips}
                                    onChange={(e) => setIpRestrictedMap(prev => ({
                                      ...prev,
                                      [k.id]: { ...ipRest, ips: e.target.value }
                                    }))}
                                    placeholder="Ex: 197.214.12.0/24"
                                    className="w-full text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-300 focus:outline-none focus:border-emerald-600"
                                  />
                                )}
                              </div>

                              {/* Option 3: Domaines autorisés */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={domainRest.enabled}
                                    onChange={(e) => setDomainRestrictedMap(prev => ({
                                      ...prev,
                                      [k.id]: { ...domainRest, enabled: e.target.checked }
                                    }))}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="font-bold text-slate-900">☐ Domaines autorisés</span>
                                </label>
                                {domainRest.enabled && (
                                  <input
                                    type="text"
                                    value={domainRest.domains}
                                    onChange={(e) => setDomainRestrictedMap(prev => ({
                                      ...prev,
                                      [k.id]: { ...domainRest, domains: e.target.value }
                                    }))}
                                    placeholder="Ex: https://monapplication.tg"
                                    className="w-full text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-300 focus:outline-none focus:border-emerald-600"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: STATUS & DATA QUALITY */}
          {activeTab === 'STATUS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>Statut Galenis & Infrastructure</span>
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">Contrôle permanent de la viabilité des services et de l'état des registres.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Tous les services opérationnels</span>
                </div>
              </div>

              {/* 🟢 INTERFACE 3: STATUT GALENIS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-700" />
                    <span>STATUT GALENIS</span>
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dernière vérification : il y a {statusLastChecked} secondes</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setStatusChecking(true);
                        setTimeout(() => {
                          setStatusChecking(false);
                          setStatusLastChecked(0);
                        }, 600);
                      }}
                      className="p-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="Rafraîchir les vérifications"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${statusChecking ? 'animate-spin text-emerald-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Table of 5 operational services */}
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 font-sans text-xs overflow-hidden shadow-2xs">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>API REST</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Opérationnelle</span>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Base de données</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Opérationnelle</span>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Authentification</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Opérationnelle</span>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Console API</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Opérationnelle</span>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>AI Developer</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Opérationnelle</span>
                  </div>
                </div>

                {/* Historique 30 jours */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="font-bold text-slate-800">Historique de disponibilité :</div>
                  <div className="bg-emerald-900 text-amber-300 font-mono font-black px-3 py-1 rounded-lg border border-emerald-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>99,9 % disponibilité — 30 derniers jours (Démonstration / Sandbox)</span>
                  </div>
                </div>
              </div>

              {/* Data Quality Levels */}
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Niveaux de Confiance des Données (Data Provenance)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 border border-emerald-300 p-4 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-emerald-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span>Donnée Vérifiée (<code className="font-mono">verified</code>)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      Confirmée directement par le pharmacien titulaire ou visite de contrôle terrain.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-amber-300 p-4 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-amber-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Déclarée (<code className="font-mono">pharmacy_reported</code>)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      Renseignée directement par l'officine sur le portail pharmacien sans audit physique immédiat.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>En cours (<code className="font-mono">unverified</code>)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      Ancienne donnée publique nécessitant une reconfirmation par l'équipe.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: CHANGELOG */}
          {activeTab === 'CHANGELOG' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Changelog & Historique des Versions API</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">Suivez l'évolution des fonctionnalités et des corrections de Galenis API.</p>
              </div>

              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                
                {/* Version 1.2.0 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-[#009A63] border-2 border-white ring-4 ring-emerald-100" />
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm font-mono">v1.2.0</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">08 août 2026</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-300">Actuelle</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 leading-relaxed font-medium">
                    <li><strong className="text-slate-900 font-extrabold">Nouveau Endpoint :</strong> Création de <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-emerald-800 border border-slate-200">POST /api/v1/reports</code> pour permettre aux applications de signaler des anomalies sur les officines.</li>
                    <li><strong className="text-slate-900 font-extrabold">Data Provenance :</strong> Ajout du champ <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800 border border-slate-200 font-bold">source</code> et du score de confiance dans les réponses de disponibilité de médicaments.</li>
                    <li><strong className="text-slate-900 font-extrabold">Sécurité Clés :</strong> Isolement strict entre clés Sandbox (<code className="bg-amber-50 px-1 py-0.5 rounded font-mono text-amber-900 border border-amber-200 font-bold">pdt_test_</code>) et clés Live (<code className="bg-emerald-50 px-1 py-0.5 rounded font-mono text-emerald-800 border border-emerald-200 font-bold">pdt_live_</code>).</li>
                  </ul>
                </div>

                {/* Version 1.1.0 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-slate-400 border-2 border-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm font-mono">v1.1.0</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-300">01 août 2026</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 leading-relaxed font-medium">
                    <li>Standardisation des routes REST sous le préfixe explicite <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800 border border-slate-200 font-bold">/v1/</code>.</li>
                    <li>Inclusion obligatoire de l'identifiant de traçabilité unique <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800 border border-slate-200 font-bold">request_id</code> dans toutes les enveloppes JSON.</li>
                    <li>Gestion automatique des en-têtes de Rate Limit (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700 border border-slate-200">X-RateLimit-Limit</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700 border border-slate-200">X-RateLimit-Remaining</code>).</li>
                  </ul>
                </div>

                {/* Version 1.0.0 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm font-mono">v1.0.0</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-300">15 juillet 2026</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 leading-relaxed font-medium">
                    <li>Lancement initial du référentiel numérique des pharmacies du Togo (Lomé, Kara, Sokodé, Atakpamé).</li>
                    <li>Authentification par clé API et console d'essai interactive.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}
          {activeTab === 'SDK' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">SDK Officiels & Bibliothèques Client</h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Intégrez l'API Galenis Togo dans vos projets avec typage strict et gestion automatique du cache.</p>
                </div>
                <button
                  type="button"
                  onClick={() => askAiContextual("Peux-tu me générer le code d'initialisation du SDK Galenis avec gestion des erreurs et retry automatique ?")}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LionIcon className="w-4 h-4 text-emerald-700" />
                  <span>Générer SDK avec AI</span>
                </button>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: 'js', label: 'Node.js / TypeScript', cmd: 'npm install @galenis/sdk' },
                  { id: 'python', label: 'Python (PyPI)', cmd: 'pip install galenis' },
                  { id: 'flutter', label: 'Flutter / Dart', cmd: 'flutter pub add galenis_sdk' }
                ].map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSdkLanguage(lang.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      sdkLanguage === lang.id ? 'bg-[#009A63] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Command Box */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs flex items-center justify-between gap-3 text-emerald-400">
                <code className="font-bold">
                  {sdkLanguage === 'js' && 'npm install @galenis/sdk'}
                  {sdkLanguage === 'python' && 'pip install galenis'}
                  {sdkLanguage === 'flutter' && 'flutter pub add galenis_sdk'}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(
                    sdkLanguage === 'js' ? 'npm install @galenis/sdk' : sdkLanguage === 'python' ? 'pip install galenis' : 'flutter pub add galenis_sdk',
                    'sdkInstallCmd'
                  )}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  {copiedText === 'sdkInstallCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'sdkInstallCmd' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              {/* Code Example Snippet */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900">Exemple d'initialisation :</div>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs border border-slate-800 overflow-x-auto leading-relaxed">
                  <pre>{sdkLanguage === 'js' ? `import { GalenisClient } from '@galenis/sdk';

const client = new GalenisClient({
  apiKey: process.env.GALENIS_API_KEY,
  environment: 'production' // ou 'sandbox'
});

// Récupérer les pharmacies de garde à Lomé
const gardes = await client.pharmacies.getGardeList({ city: 'Lome' });
console.log(\`Officines de garde : \${gardes.length}\`);` : sdkLanguage === 'python' ? `from galenis import GalenisClient

client = GalenisClient(
    api_key="pdt_live_free_9876543210",
    environment="production"
)

# Liste des pharmacies de garde à Kara
gardes = client.pharmacies.get_gardes(city="Kara")
for pharma in gardes:
    print(f"{pharma.name} - Phone: {pharma.phone}")` : `import 'package:galenis_sdk/galenis_sdk.dart';

final client = GalenisClient(
  apiKey: 'pdt_live_free_9876543210',
);

final result = await client.getGardesToday(city: 'Lome');
print('Pharmacies actives : \${result.data.length}');`}</pre>
                </div>
              </div>

              {/* SDK Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-extrabold text-xs text-slate-900">Typage TypeScript Explicite</div>
                  <p className="text-[11px] text-slate-600 font-medium">Autocomplétion complète des objets Pharmacy, Stock & Guard.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-extrabold text-xs text-slate-900">Retry Exponentiel Automatique</div>
                  <p className="text-[11px] text-slate-600 font-medium">Gestion native des micro-coupures réseau et limites 429.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-extrabold text-xs text-slate-900">Cache En-Mémoire Intelligente</div>
                  <p className="text-[11px] text-slate-600 font-medium">Réduction de la consommation de quota pour les gardes nationales.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WIDGET EMBED (NOUVEAU) */}
          {activeTab === 'WIDGET' && (
            <WidgetEmbedSection pharmacies={pharmacies} />
          )}

          {/* TAB: WEBHOOKS */}
          {activeTab === 'WEBHOOKS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Webhooks & Notifications Événementielles</h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Recevez des alertes en temps réel lorsque le statut de garde ou les disponibilités changent.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-300">
                  Signature HMAC SHA-256
                </span>
              </div>

              {/* Webhook Endpoint Config Form */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Configuration de votre Endpoint Webhook</div>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">URL de votre Webhook HTTP(S) :</label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={e => setWebhookUrl(e.target.value)}
                      placeholder="https://monapp.tg/api/webhooks/galenis"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Clé Secrète de Signature (whsec) :</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded-xl border border-slate-300 font-mono text-emerald-800 font-bold flex-1">
                        {webhookSecret}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(webhookSecret, 'whsec')}
                        className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl hover:bg-slate-700 cursor-pointer text-xs"
                      >
                        {copiedText === 'whsec' ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Événements souscrits :</label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'pharmacy.guard_changed', label: 'pharmacy.guard_changed (Mise à jour des officines de garde à minuit)' },
                        { id: 'stock.alert_low', label: 'stock.alert_low (Alerte sur médicament critique en faible stock)' },
                        { id: 'pharmacy.report_flagged', label: 'pharmacy.report_flagged (Signalement validé par la modération)' }
                      ].map(evt => (
                        <label key={evt.id} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={webhookEvents.includes(evt.id)}
                            onChange={() => {
                              setWebhookEvents(prev => prev.includes(evt.id) ? prev.filter(e => e !== evt.id) : [...prev, evt.id]);
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-600"
                          />
                          <span>{evt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWebhookTesting(true);
                      setTimeout(() => {
                        setWebhookLogs(prev => [
                          {
                            id: `evt_${Date.now()}`,
                            event: 'pharmacy.guard_changed',
                            status: 200,
                            latency: Math.floor(35 + Math.random() * 40),
                            timestamp: 'À l\'instant',
                            payload: { event: 'pharmacy.guard_changed', pharmacy_id: 'pharma-2', pharmacy_name: 'Pharmacie de la Paix', city: 'Lomé', guard_status: 'DE_GARDE' }
                          },
                          ...prev
                        ]);
                        setWebhookTesting(false);
                      }, 800);
                    }}
                    disabled={webhookTesting}
                    className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{webhookTesting ? 'Envoi du test...' : 'Envoyer un Webhook de Test (Simuler)'}</span>
                  </button>
                </div>
              </div>

              {/* Webhook Log History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="uppercase tracking-wider">Historique de Livraison des Webhooks</span>
                  <span className="text-slate-500 font-medium">En-tête : <code className="font-mono text-emerald-700">X-Galenis-Signature</code></span>
                </div>

                <div className="space-y-2">
                  {webhookLogs.map(log => (
                    <div key={log.id} className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/40">
                            HTTP {log.status} OK
                          </span>
                          <span className="font-bold text-amber-300">{log.event}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 stroke-[2.25]" />
                          <span>{log.latency} ms • {log.timestamp}</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto">
                        <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* TAB: LOGS (Console de Logs d'appels API en temps réel) */}
          {activeTab === 'LOGS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-extrabold text-slate-900">Console de Logs d'Appels API Live</h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Surveillance en temps réel de toutes les requêtes exécutées avec votre clé API Galenis Togo.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateApiCall}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simuler un appel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apiLogs, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `galenis_api_logs_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Metric KPI Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Volume Total 24h</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{apiLogs.length + 1480} reqs</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+12% vs hier</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Taux de Succès</span>
                  <div className="text-xl font-black text-emerald-900 mt-1">98.8 %</div>
                  <span className="text-[10px] text-emerald-700 font-bold">200 OK & 201 Created</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Latence Moyenne</span>
                  <div className="text-xl font-black text-slate-900 mt-1">41 ms</div>
                  <span className="text-[10px] text-slate-500 font-medium">Lomé Edge Cloud</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-800">Erreurs / 429</span>
                  <div className="text-xl font-black text-amber-900 mt-1">
                    {apiLogs.filter(l => l.status >= 400).length}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">Quota ou 404</span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'ALL', label: 'Tous les logs' },
                    { id: '200', label: '200 OK (Succès)' },
                    { id: '429', label: '429 (Rate Limit)' },
                    { id: 'ERRORS', label: 'Erreurs (4xx / 5xx)' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setLogFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        logFilter === filter.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={e => setLogSearchQuery(e.target.value)}
                    placeholder="Filtrer par route, ID..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Interactive Logs Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-[11px] text-slate-600 font-extrabold uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Statut</th>
                      <th className="py-2.5 px-4">Méthode</th>
                      <th className="py-2.5 px-4">Endpoint / Route</th>
                      <th className="py-2.5 px-4">Latence</th>
                      <th className="py-2.5 px-4">Horodatage</th>
                      <th className="py-2.5 px-4">Trace ID</th>
                      <th className="py-2.5 px-4 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apiLogs
                      .filter(log => {
                        if (logFilter === '200') return log.status >= 200 && log.status < 300;
                        if (logFilter === '429') return log.status === 429;
                        if (logFilter === 'ERRORS') return log.status >= 400 && log.status !== 429;
                        return true;
                      })
                      .filter(log => {
                        if (!logSearchQuery) return true;
                        return log.path.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                               log.id.toLowerCase().includes(logSearchQuery.toLowerCase());
                      })
                      .map(log => {
                        const is2xx = log.status >= 200 && log.status < 300;
                        const is429 = log.status === 429;
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-4">
                              <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                                is2xx ? 'bg-emerald-100 text-emerald-800' :
                                is429 ? 'bg-amber-100 text-amber-900' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {log.status} {log.statusText}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-800">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                log.method === 'GET' ? 'bg-blue-100 text-blue-800 font-black' : 'bg-purple-100 text-purple-800 font-black'
                              }`}>
                                {log.method}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {log.path}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 font-semibold">
                              {log.latencyMs} ms
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                              {log.timestamp}
                            </td>
                            <td className="py-2.5 px-4 text-slate-400 text-[10px]">
                              {log.id}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedLogDetail(log)}
                                className="text-emerald-700 hover:text-emerald-800 font-sans font-extrabold text-xs underline cursor-pointer"
                              >
                                Inspecter
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Inspector Modal for selected log */}
              {selectedLogDetail && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-400">TRACE ID: {selectedLogDetail.id}</div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-xs rounded font-black">{selectedLogDetail.method}</span>
                          <span className="font-mono text-sm">{selectedLogDetail.path}</span>
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedLogDetail(null)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">CODE HTTP</span>
                        <span className="font-black text-slate-900">{selectedLogDetail.status} {selectedLogDetail.statusText}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">LATENCE</span>
                        <span className="font-black text-slate-900">{selectedLogDetail.latencyMs} ms</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">CLIENT IP</span>
                        <span className="font-bold text-slate-900 truncate block">{selectedLogDetail.ip}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">HORODATAGE</span>
                        <span className="font-bold text-slate-900">{selectedLogDetail.timestamp}</span>
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-700 uppercase">En-têtes de Requête (Request Headers)</div>
                      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs space-y-1">
                        <div><span className="text-slate-400">X-API-Key:</span> <span className="text-amber-300">{selectedLogDetail.keyId}</span></div>
                        <div><span className="text-slate-400">User-Agent:</span> <span className="text-emerald-400">{selectedLogDetail.userAgent}</span></div>
                        <div><span className="text-slate-400">Accept:</span> <span className="text-blue-300">application/json</span></div>
                      </div>
                    </div>

                    {/* Response Payload JSON */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 uppercase">
                        <span>Corps de Réponse (Response Payload JSON)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(JSON.stringify(selectedLogDetail.responsePayload, null, 2), 'log_payload')}
                          className="text-emerald-700 hover:text-emerald-800 text-[10px] font-sans flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'log_payload' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copier JSON</span>
                        </button>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-48">
                        <pre>{JSON.stringify(selectedLogDetail.responsePayload, null, 2)}</pre>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLogDetail(null)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Fermer l'inspecteur
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EVENTS (Événements de Santé en direct) */}
          {activeTab === 'EVENTS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-extrabold text-slate-900">Événements Santé & Système Galenis</h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Flux centralisé des événements diffusés sur le réseau national togolais (gardes, stocks, alertes DPML).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerTestEvent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Déclencher un événement test</span>
                </button>
              </div>

              {/* Event Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'ALL', label: 'Tous les flux' },
                  { id: 'GUARD', label: 'Rotations de Gardes' },
                  { id: 'STOCK', label: 'Ruptures & Stocks' },
                  { id: 'SYSTEM', label: 'Système & Webhooks' },
                  { id: 'SECURITY', label: 'Sécurité & Clés' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventCategoryFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      eventCategoryFilter === item.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Events Stream Cards */}
              <div className="space-y-3">
                {systemEvents
                  .filter(evt => eventCategoryFilter === 'ALL' || evt.category === eventCategoryFilter)
                  .map(evt => {
                    const isGuard = evt.category === 'GUARD';
                    const isStock = evt.category === 'STOCK';
                    const isSecurity = evt.category === 'SECURITY';
                    return (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all bg-white hover:bg-slate-50/50 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isGuard ? 'bg-emerald-100 text-emerald-800' :
                              isStock ? 'bg-amber-100 text-amber-900' :
                              isSecurity ? 'bg-rose-100 text-rose-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {evt.event}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">{evt.summary}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <div className="text-[11px] text-slate-500 font-medium">
                            Émetteur officiel : <span className="font-bold text-slate-700">{evt.source}</span>
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">ID: {evt.id}</div>
                        </div>

                        <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto">
                          <span className="text-slate-400 text-[10px] block mb-1 uppercase font-sans font-bold">Données associées (Payload) :</span>
                          <pre className="text-emerald-400">{JSON.stringify(evt.payload, null, 2)}</pre>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}


          {/* TAB: REPORT AN ERROR */}
          {activeTab === 'REPORT' && (
            <div className="space-y-6">
              {/* Header Banner - Clean Light Theme */}
              <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300/80 mb-1">
                      <Flag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Référentiel Qualité & Signalement Togo</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                      <span>Signaler une Erreur ou une Anomalie</span>
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
                      Aidez-nous à maintenir le <strong>Référentiel National des Pharmacies du Togo</strong> à 100% exact. Signalez une information obsolète, une garde non synchronisée ou un dysfonctionnement technique API.
                    </p>
                  </div>
                  <div className="shrink-0 bg-white p-3.5 rounded-2xl border border-emerald-200 text-center space-y-1 shadow-2xs">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700">Prise en Charge SLA</div>
                    <div className="text-lg font-black text-emerald-700 font-mono">&lt; 2 Heures</div>
                    <div className="text-[10px] text-slate-500 font-medium">Equipe Modération Togo</div>
                  </div>
                </div>
              </div>

              {/* Grid Layout: Form (Left) & Tracker/FAQ (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Form */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Formulaire de Signalement Officiel</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Toutes les soumissions sont vérifiées par notre comité d'intégrité.</p>
                    </div>
                  </div>

                  {reportSubmittedTicket ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-6 rounded-2xl space-y-4 shadow-sm animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#009A63] text-white flex items-center justify-center font-bold shadow-md">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">Ticket Enregistré</div>
                          <h4 className="text-lg font-black text-emerald-950 font-mono">Référence : #{reportSubmittedTicket}</h4>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                        Merci pour votre contribution au Référentiel National ! Votre signalement concernant <strong>{reportPharmacyId || 'la cible indiquée'}</strong> a été transmis au comité de modération.
                      </p>

                      <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs font-medium space-y-1">
                        <div className="font-bold text-emerald-950 flex items-center gap-1">
                          <LionIcon className="w-4 h-4 text-emerald-700" />
                          <span>Ce qui va se passer maintenant :</span>
                        </div>
                        <ul className="list-disc list-inside text-emerald-800 text-[11px] space-y-1">
                          <li>Un modérateur vérifie l'information auprès de l'officine ou du registre national.</li>
                          <li>Une notification de mise à jour sera diffusée par Webhook & API v1 dès correction.</li>
                        </ul>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setReportSubmittedTicket(null);
                            setReportDesc('');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#009A63] text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                        >
                          Soumettre un autre signalement
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmittingReport(true);
                        setTimeout(() => {
                          const ticketId = 'TG-REP-' + Math.floor(1000 + Math.random() * 9000);
                          setReportSubmittedTicket(ticketId);
                          setSubmittingReport(false);
                        }, 600);
                      }}
                      className="space-y-4"
                    >
                      {/* Category Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-2">Type d'Anomalie :</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {[
                            { id: 'phone_incorrect', label: 'Coordonnées / Horaires inexacts', icon: Info },
                            { id: 'guard_mismatch', label: 'Pharmacie de garde non synchronisée', icon: Clock },
                            { id: 'medication_stock', label: 'Prix ou stock médicament erroné', icon: Database },
                            { id: 'api_bug', label: 'Bug technique API / HTTP 5xx', icon: Code2 },
                            { id: 'other', label: 'Autre remarque ou suggestion', icon: HelpCircle }
                          ].map(item => {
                            const ItemIcon = item.icon;
                            const selected = reportType === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setReportType(item.id)}
                                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                                }`}
                              >
                                <ItemIcon className={`w-4 h-4 shrink-0 ${selected ? 'text-emerald-700' : 'text-slate-400'}`} />
                                <span className="text-[11px] leading-snug">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Entity / Pharmacy Concerned */}
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          Nom de la pharmacie ou Endpoint API concerné :
                        </label>
                        <input
                          type="text"
                          value={reportPharmacyId}
                          onChange={e => setReportPharmacyId(e.target.value)}
                          placeholder="Ex: Pharmacie du Boulevard (Lomé) ou /v1/gardes"
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 font-medium focus:border-emerald-600 outline-none"
                          required
                        />
                      </div>

                      {/* Detailed Description */}
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          Description précise de l'erreur observée :
                        </label>
                        <textarea
                          rows={4}
                          value={reportDesc}
                          onChange={e => setReportDesc(e.target.value)}
                          placeholder="Décrivez l'anomalie constatée, les valeurs attendues vs observées, ou le numéro de téléphone réel..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 font-medium focus:border-emerald-600 outline-none"
                          required
                        />
                      </div>

                      {/* Reporter Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Nom / Organisation :</label>
                          <input
                            type="text"
                            placeholder="Ex: Dr K. Lawson / Dev Tech Togo"
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Email de contact :</label>
                          <input
                            type="email"
                            placeholder="contact@exemple.tg"
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 font-medium"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submittingReport}
                          className="w-full py-3 rounded-2xl bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          <span>{submittingReport ? 'Transmission en cours...' : 'Soumettre le Signalement au Comité'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right: Ticket Tracker & Guidelines */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Ticket Tracker History */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <History className="w-4 h-4 text-emerald-700" />
                        <span>Signalements Récents du Référentiel</span>
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">Public</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'TG-REP-8492',
                          target: 'Pharmacie Sabbat (Lomé)',
                          issue: 'Ajustement numéro de téléphone garde',
                          status: 'RÉSOLU',
                          time: 'Aujourd\'hui 09:15',
                          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        },
                        {
                          id: 'TG-REP-8488',
                          target: 'Pharmacie du Centre (Kara)',
                          issue: 'Validation planning garde weekend',
                          status: 'EN COURS',
                          time: 'Hier 16:40',
                          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
                        },
                        {
                          id: 'TG-REP-8470',
                          target: 'Endpoint /v1/medications',
                          issue: 'Mise à jour Prix Maximal (PMVP)',
                          status: 'RÉSOLU',
                          time: '10 Août 2026',
                          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }
                      ].map(item => (
                        <div key={item.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900 text-[11px]">{item.id}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${item.badgeBg}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="font-extrabold text-slate-800 text-xs">{item.target}</div>
                          <p className="text-[11px] text-slate-600 font-medium">{item.issue}</p>
                          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60 flex items-center justify-between">
                            <span>Mise à jour : {item.time}</span>
                            <span className="text-emerald-700 font-bold">Certifié Togo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quality SLA Box */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-extrabold text-sm text-slate-900">Charte d'Incorruptibilité des Données</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Toutes les données de santé diffusées via Galenis Togo sont validées avec le concours des syndicats et représentants officiels des pharmaciens du Togo.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-300 font-bold border-t border-slate-800">
                      <span>Contact direct Modération :</span>
                      <a href="mailto:moderation@galenis.tg" className="text-emerald-400 underline font-mono">moderation@galenis.tg</a>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === 'AI_ASSISTANT' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold border border-emerald-700 shadow-xs">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <span>Galenis AI Developer</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">Co-Pilote OpenAPI</span>
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Assistant connecté en temps réel aux spécifications OpenAPI 3.0.3 de Galenis Togo.</p>
                  </div>
                </div>

                <a
                  href="/api/v1/openapi.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Spécification openapi.json</span>
                </a>
              </div>

              {/* OpenAPI Grounded Schema Banner */}
              <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span><strong>Ancrage RAG OpenAPI :</strong> Réponses générées à partir du contrat d'interface officiel v1.0.0 (Schemas, Path parameters, Headers <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-emerald-900">X-API-Key</code>).</span>
                </div>
                <span className="text-[10px] bg-emerald-700 text-white font-mono font-bold px-2 py-0.5 rounded-md shrink-0">v1.0.0 Certified</span>
              </div>

              {/* Quick Prompt Presets */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Questions fréquentes & Suggestions :</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    "Comment authentifier mes requêtes avec X-API-Key ?",
                    "Comment gérer le Rate Limit 429 et mettre en cache les gardes ?",
                    "Exemple complet de Webhook en Node.js Express",
                    "Comment rechercher les pharmacies de garde à Kara ou Sokodé ?"
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => askAiContextual(q)}
                      className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 max-h-[420px] overflow-y-auto">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col space-y-1 ${
                      msg.sender === 'USER' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <span>{msg.sender === 'USER' ? 'Vous (Développeur)' : 'Galenis AI'}</span>
                      <span>• {msg.time}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-xl font-medium ${
                        msg.sender === 'USER'
                          ? 'bg-[#009A63] text-white rounded-br-none shadow-2xs font-bold'
                          : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-none shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!aiPromptInput.trim()) return;
                  askAiContextual(aiPromptInput);
                  setAiPromptInput('');
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={e => setAiPromptInput(e.target.value)}
                  placeholder="Posez n'importe quelle question technique sur Galenis API..."
                  className="flex-1 p-3 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:border-emerald-600 outline-none font-medium"
                />
                <button
                  type="submit"
                  className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: AI GENERATE INTEGRATION */}
          {activeTab === 'AI_GENERATE' && (
            <div className="space-y-6">
              <DeveloperOnboardingWizard
                initialTier="DEV_API"
                onCompleteToApiPortal={() => setActiveTab('KEYS')}
              />
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'SUPPORT' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Support Développeurs & SLA</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">Une équipe technique dédiée pour répondre à vos questions d'intégration au Togo.</p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">Email Développeur</div>
                  <p className="text-xs text-slate-600 font-medium">Réponse sous 4 heures ouvrées.</p>
                  <a href="mailto:dev@galenis.tg" className="text-xs font-bold text-emerald-700 hover:underline block font-mono">dev@galenis.tg</a>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                    <LionIcon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">Communauté Telegram</div>
                  <p className="text-xs text-slate-600 font-medium">Échangez avec les dev Togo.</p>
                  <a href="https://t.me/GalenisDevsTogo" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 hover:underline block font-mono">@GalenisDevsTogo</a>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#009A63] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">SLA & Disponibilité</div>
                  <p className="text-xs text-slate-600 font-medium">Engagement 99.9% uptime.</p>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">Statut : 100% Opérationnel</span>
                </div>
              </div>

              {/* Demande de relèvement de quota form */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm">Demander un surcroît de quota (Production / Enterprise)</h3>
                <p className="text-xs text-slate-600 font-medium">Vous prévoyez un déploiement massif (ex: Hôpital, Ministère, Bot National) ?</p>
                <button
                  type="button"
                  onClick={() => askAiContextual("Bonjour, je souhaite demander une augmentation de quota de requêtes API pour mon application en production.")}
                  className="bg-[#009A63] hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <LionIcon className="w-4 h-4 text-emerald-200" />
                  <span>Soumettre ma demande avec l'Assistant IA</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE API KEY MODAL */}
      {createPortal(
        <>
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base">Créer une Clé API</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateKeySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Nom du projet / Application :</label>
                    <input
                      type="text"
                      value={newKeyDetails.name}
                      onChange={e => setNewKeyDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Bot WhatsApp Pharmacie Lomé"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 placeholder-slate-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Organisation / Entreprise :</label>
                    <input
                      type="text"
                      value={newKeyDetails.company}
                      onChange={e => setNewKeyDetails(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Ex: Togo Health Tech"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 placeholder-slate-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Environnement :</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setNewKeyDetails(prev => ({ ...prev, env: 'test' }))}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          newKeyDetails.env === 'test' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Test (Sandbox)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewKeyDetails(prev => ({ ...prev, env: 'live' }))}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          newKeyDetails.env === 'live' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Production (Live)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Permissions (Scopes) :</label>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: 'pharmacies:read', label: 'pharmacies:read (Liste & Détails Officines)' },
                        { id: 'gardes:read', label: 'gardes:read (Gardes Nationales)' },
                        { id: 'disponibilite:read', label: 'disponibilite:read (Stocks Médicaments)' }
                      ].map(s => (
                        <label key={s.id} className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={newKeyDetails.scopes.includes(s.id)}
                            onChange={() => toggleScope(s.id)}
                            className="rounded text-emerald-600 focus:ring-emerald-600 bg-slate-50 border-slate-300"
                          />
                          <span className="font-mono text-[11px]">{s.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#009A63] text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      Générer la Clé
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* UNMASKED NEW KEY DISPLAY POPUP (SHOWN ONCE AFTER CREATION) */}
          {createdUnmaskedKey && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Clé API Générée avec Succès !</h3>
                    <p className="text-xs text-slate-500 font-medium">Attention : Cette clé ne sera plus affichée en clair.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Votre clé secrète ({createdUnmaskedKey.env.toUpperCase()}) :</div>
                  <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs">
                    <code className="text-emerald-800 font-mono text-xs font-bold truncate">
                      {createdUnmaskedKey.key}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdUnmaskedKey.key, 'createdKeyModal')}
                      className="bg-[#009A63] hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === 'createdKeyModal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'createdKeyModal' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Sécurité Obligatoire</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    Veuillez copier cette clé maintenant et la conserver dans un environnement sécurisé (par exemple vos variables d'environnement serveur <code className="font-mono">.env</code>).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreatedUnmaskedKey(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-[#009A63] text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  J'ai enregistré ma clé en lieu sûr
                </button>
              </div>
            </div>
          )}
        </>,
        document.body
      )}


      {/* MODAL PAIEMENT & RECHARGE FEDAPAY */}
      <PaymentModal
        isOpen={showFedapayRechargeModal}
        onClose={() => setShowFedapayRechargeModal(false)}
        onSuccess={() => {
          setShowFedapayRechargeModal(false);
          alert("Recharge FedaPay validée ! Vos quotas ont été immédiatement rehaussés sur le serveur Galenis.");
        }}
        planName={rechargePack.name}
        amountFcfa={rechargePack.amount}
        clientName="SADPlus (Ref: acc_2209219218)"
        clientEmail="contact@sadplus.tg"
      />

      {/* MODAL DOSSIER ACCRÉDITATION DÉVELOPPEUR & KYC */}
      <DeveloperKycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        currentDossier={getDeveloperDossierByEmail(developerAccount.email) || null}
        onDossierSubmitted={(updatedDossier) => {
          setDeveloperAccount({
            name: updatedDossier.name,
            ref: updatedDossier.ref,
            isValidated: updatedDossier.status === 'APPROVED',
            status: updatedDossier.status,
            tier: updatedDossier.tier,
            email: updatedDossier.email,
            dailyLimit: updatedDossier.dailyLimit,
            requestPending: updatedDossier.status === 'PENDING_REVIEW'
          });
        }}
      />

    </div>
  );
};
