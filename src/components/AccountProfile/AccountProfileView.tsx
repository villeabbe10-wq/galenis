import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Users, 
  BarChart3, 
  History, 
  CreditCard, 
  MapPin, 
  KeyRound, 
  FileText, 
  UserPlus, 
  ShieldCheck, 
  Building2, 
  Award, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Save,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  HeartHandshake,
  FileCheck,
  Code2,
  Terminal,
  RefreshCw,
  Eye,
  EyeOff,
  Heart,
  Pill,
  Bookmark,
  ShieldAlert,
  Flame,
  Globe,
  Sliders,
  CheckCheck,
  HelpCircle,
  Plus,
  Play,
  Cpu,
  Zap,
  Radio,
  Layers,
  Boxes,
  Server,
  Database,
  LogOut,
  Calculator,
  Trash2,
  Shield,
  Receipt,
  TrendingDown,
  Info,
  Lightbulb,
  Download,
  Upload,
  Send,
  MessageSquare,
  Filter,
  Bell,
  AlertTriangle,
  Search,
  Building,
  ThumbsUp,
  CheckSquare,
  FileSpreadsheet,
  Compass,
  RotateCcw,
  Car,
  Navigation,
  Coins
} from 'lucide-react';
import { 
  Pharmacy, 
  Drug, 
  PharmacyDrugStock, 
  UserRole, 
  UserSession,
  AppFeedback,
  AppFeedbackStatus,
  SanitaryAlert,
  CommunityReport,
  ActivityLogItem,
  ApiKey
} from '../../types';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';
import { InsuranceSimulatorModal } from '../CitizenApp/InsuranceSimulatorModal';
import { PriceEstimateBeforeTravelModal } from '../CitizenApp/PriceEstimateBeforeTravelModal';
import { GalenisBrandIdent } from '../GalenisBrandIdent';
import { AiPrivacyGatewayView } from '../AiPrivacyGateway/AiPrivacyGatewayView';
import { PrivacyApdpSecurityPanel } from '../common/PrivacyApdpSecurityPanel';
import { CriticalAction2faModal } from '../common/CriticalAction2faModal';
import { AdminMonetizationManagement } from '../Admin/AdminMonetizationManagement';
import { 
  getAppFeedbacks, 
  updateAppFeedbackStatus, 
  deleteAppFeedback, 
  getSanitaryAlerts, 
  addSanitaryAlert, 
  archiveSanitaryAlert, 
  getCommunityReports, 
  getActivityLogs, 
  addActivityLog, 
  getApiKeys, 
  exportDataJSON, 
  importDataJSON, 
  getAdminInvitations, 
  saveAdminInvitation 
} from '../../services/pharmacyStorage';

interface AccountProfileViewProps {
  currentRole?: UserRole;
  currentUser?: UserSession | null;
  pharmacies?: Pharmacy[];
  drugs?: Drug[];
  stocks?: PharmacyDrugStock[];
  onNavigateToDashboard?: () => void;
  onNavigateToCitizen?: () => void;
  onNavigateToApiPortal?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  currentRole = 'PHARMACIEN',
  currentUser,
  pharmacies = [],
  drugs = [],
  stocks = [],
  onNavigateToDashboard,
  onNavigateToCitizen,
  onNavigateToApiPortal,
  onLogout,
  onSwitchAccount
}) => {
  // Role is strictly derived from the authenticated user's session
  const activeRole: 'PHARMACIEN' | 'DEVELOPPEUR' | 'CITOYEN' | 'ADMIN' = useMemo(() => {
    const role = currentUser?.role || currentRole;
    if (role === 'DEVELOPPEUR') return 'DEVELOPPEUR';
    if (role === 'CITOYEN') return 'CITOYEN';
    if (role === 'SUPER_ADMIN' || role === 'DATA_ADMIN') return 'ADMIN';
    return 'PHARMACIEN';
  }, [currentUser?.role, currentRole]);

  // Active section per role
  const [pharmaSection, setPharmaSection] = useState<'dashboard' | 'officine' | 'team' | 'stocks' | 'inam' | 'address' | 'gardes' | 'confreres'>('dashboard');
  const [devSection, setDevSection] = useState<'integration' | 'dashboard' | 'api_keys' | 'caisse' | 'endpoints' | 'logs' | 'documentation'>('integration');
  const [citoyenSection, setCitoyenSection] = useState<'dashboard' | 'price_estimate' | 'inam_simulation' | 'copay_calculator' | 'ai_privacy_gateway' | 'profile' | 'favorites' | 'vigilance' | 'privacy_security'>('dashboard');
  const [adminSection, setAdminSection] = useState<'overview' | 'live_radar' | 'user_needs' | 'roles' | 'audit' | 'monetization' | 'actions'>('overview');

  // Admin Pro Management Hub State (Supervision, Radar, Besoins Usagers, Gouvernance)
  const [adminRegionFilter, setAdminRegionFilter] = useState<string>('ALL');
  const [adminFeedbacks, setAdminFeedbacks] = useState<AppFeedback[]>([]);
  const [adminFeedbackFilter, setAdminFeedbackFilter] = useState<string>('ALL');
  const [adminFeedbackCategoryFilter, setAdminFeedbackCategoryFilter] = useState<string>('ALL');
  const [adminReplyingId, setAdminReplyingId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const [adminSanitaryAlerts, setAdminSanitaryAlerts] = useState<SanitaryAlert[]>([]);
  const [adminCommunityReports, setAdminCommunityReports] = useState<CommunityReport[]>([]);
  const [adminActivityLogs, setAdminActivityLogs] = useState<ActivityLogItem[]>([]);
  const [adminApiKeys, setAdminApiKeys] = useState<ApiKey[]>([]);
  const [adminInvitations, setAdminInvitations] = useState<any[]>([]);
  const [adminNewAlertModalOpen, setAdminNewAlertModalOpen] = useState(false);
  const [adminNewInviteModalOpen, setAdminNewInviteModalOpen] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [adminSelectedTensionDrug, setAdminSelectedTensionDrug] = useState<string | null>(null);
  const [adminNeedsSearch, setAdminNeedsSearch] = useState<string>('');
  const [adminLiveSyncRunning, setAdminLiveSyncRunning] = useState(false);

  // Admin New Alert Form
  const [newAlertForm, setNewAlertForm] = useState({
    title: '',
    category: 'RUPTURE_NATIONALE' as SanitaryAlert['category'],
    severity: 'VIGILANCE' as SanitaryAlert['severity'],
    region: 'Toutes' as SanitaryAlert['region'],
    source: 'Ministère de la Santé' as SanitaryAlert['source'],
    summary: '',
    content: '',
    affectedProducts: '',
    recommendations: ''
  });

  // Admin New Invite Form
  const [newInviteForm, setNewInviteForm] = useState({
    email: '',
    name: '',
    role: 'PHARMACIEN' as UserRole
  });

  const reloadAdminData = () => {
    setAdminFeedbacks(getAppFeedbacks());
    setAdminSanitaryAlerts(getSanitaryAlerts());
    setAdminCommunityReports(getCommunityReports());
    setAdminActivityLogs(getActivityLogs());
    setAdminApiKeys(getApiKeys());
    setAdminInvitations(getAdminInvitations());
  };

  useEffect(() => {
    reloadAdminData();
  }, []);

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Citizen Multi-Insurance Simulation & Copay Calculator States (All Togo Insurers)
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isPriceEstimatorModalOpen, setIsPriceEstimatorModalOpen] = useState(false);
  const [estimateSelectedPharmacyId, setEstimateSelectedPharmacyId] = useState<string>('');
  const [estimateTransportType, setEstimateTransportType] = useState<'ZEM' | 'TAXI' | 'GOZEM' | 'PERSO'>('ZEM');
  const [estimateCustomTransportFee, setEstimateCustomTransportFee] = useState<number>(500);
  const [simScheme, setSimScheme] = useState<string>('INAM');
  const [simSchemeName, setSimSchemeName] = useState<string>('INAM Togo');
  const [simRate, setSimRate] = useState<number>(80);
  const [simDrugId, setSimDrugId] = useState<string>('');
  const [simCustomPrice, setSimCustomPrice] = useState<number>(3200);
  const [simQuantity, setSimQuantity] = useState<number>(1);
  const [copayBasket, setCopayBasket] = useState<Array<{ id: string; name: string; price: number; quantity: number; isCovered: boolean }>>([
    { id: '1', name: 'Coartem 80/480mg (Artéméther / Luméfantrine)', price: 3200, quantity: 1, isCovered: true },
    { id: '2', name: 'Paracétamol 1g Comprimés (Bte de 16)', price: 850, quantity: 2, isCovered: true },
    { id: '3', name: 'Vitamine C 1000mg Effervescente', price: 1500, quantity: 1, isCovered: false }
  ]);
  const [newBasketDrugName, setNewBasketDrugName] = useState('');
  const [newBasketDrugPrice, setNewBasketDrugPrice] = useState('');
  const [newBasketDrugCovered, setNewBasketDrugCovered] = useState(true);

  // Developer API Integration & Simulator states
  const [devCodeLang, setDevCodeLang] = useState<'curl' | 'javascript' | 'python' | 'php' | 'dart' | 'csharp'>('curl');
  const [devTestEndpoint, setDevTestEndpoint] = useState<'gardes' | 'drugs' | 'inam' | 'sync'>('gardes');
  const [devTestRegion, setDevTestRegion] = useState<string>('Maritime');
  const [devTestCity, setDevTestCity] = useState<string>('Lomé');
  const [devTestQuery, setDevTestQuery] = useState<string>('Artéméther');
  const [devTestLoading, setDevTestLoading] = useState<boolean>(false);
  const [devTestResult, setDevTestResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: Record<string, string>;
    data: any;
  } | null>(null);
  const [devCaisseSoftware, setDevCaisseSoftware] = useState<string>('LGO_TOGO');
  const [devCaisseSyncInterval, setDevCaisseSyncInterval] = useState<string>('5min');
  const [devCaisseStatus, setDevCaisseStatus] = useState<'CONNECTED' | 'SYNCING'>('CONNECTED');
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [critical2faDetails, setCritical2faDetails] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    severity?: 'normal' | 'danger';
  } | null>(null);

  // Pharmacist form data (Strictly pharmaceutical & medical, zero API keys)
  const [galenis, setGalenis] = useState({
    name: 'Dr. Mensah Koffi',
    title: 'Pharmacien Titulaire & Directeur Technique',
    pharmacyName: 'Pharmacie Populaire Tokoin',
    onptNumber: 'ONPT-TG-2018-042',
    licenseNumber: 'MS-DGS-AUT-2018-091',
    email: 'contact@pharmacie-populaire-tokoin.tg',
    phone: '+228 90 12 34 56',
    secondaryPhone: '+228 22 21 00 11',
    city: 'Lomé',
    region: 'Maritime',
    quarter: 'Tokoin-Nifidji',
    landmark: 'En face de l’Église Évangélique Presbytérienne',
    openingHours: 'Lundi au Samedi: 07h30 - 21h30 | Garde: 24h/24',
    inamConvention: 'INAM-AGR-2024-884',
    inamCoverageRate: 80,
    coldChainCertified: true
  });

  // Developer form data (Strictly technical & API keys)
  const [devData, setDevData] = useState({
    name: 'Amouzou Kodjovi',
    orgName: 'TogoHealth Technologies SARL',
    email: 'tech@togohealth.tg',
    phone: '+228 91 99 88 77',
    plan: 'Plan Production Santé',
    liveApiKey: 'pd_live_tg_9a8b7c6d5e4f3a2b1c0998',
    sandboxApiKey: 'pd_test_tg_11223344556677889900aa',
    webhookUrl: 'https://api.togohealth.tg/webhooks/galenis',
    monthlyQuota: 100000,
    monthlyUsed: 38420
  });

  // Citizen data (Patient, multi-insurance support for all Togolese insurers & mutuals)
  const [citoyenData, setCitoyenData] = useState({
    name: 'Afi Akouvi',
    phone: '+228 92 34 56 78',
    email: 'afi.akouvi@email.tg',
    city: 'Lomé',
    quarter: 'Bè-Kpota',
    insuranceCompany: 'INAM', // 'INAM' | 'AMU' | 'CNSS' | 'SUNU' | 'SANLAM' | 'GTA' | 'NSIA' | 'ASCOMA' | 'OLEA' | 'MUTUELLE' | 'NONE'
    insuranceName: 'INAM Togo',
    insuranceRate: 80,
    insuranceNumber: 'INAM-ASS-2023-45920',
    insuranceType: 'INAM (Régime Général Fonctionnaire / Tiers Payant 80%)'
  });

  // Team state for pharmacy
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'Dr. Mensah Koffi',
      role: 'Pharmacien Titulaire',
      email: 'dr.mensah@pharmacie-populaire-tokoin.tg',
      phone: '+228 90 12 34 56',
      onptNumber: 'ONPT-TG-2018-042',
      status: 'Actif'
    },
    {
      id: '2',
      name: 'Dr. Afiwa Lawson',
      role: 'Pharmacienne Adjointe',
      email: 'dr.lawson@pharmacie-populaire-tokoin.tg',
      phone: '+228 91 45 67 89',
      onptNumber: 'ONPT-TG-2021-119',
      status: 'Actif'
    },
    {
      id: '3',
      name: 'M. Kodjo Agbeko',
      role: 'Préparateur Diplômé en Pharmacie',
      email: 'k.agbeko@pharmacie-populaire-tokoin.tg',
      phone: '+228 98 76 54 32',
      status: 'Actif'
    },
    {
      id: '4',
      name: 'Mme. Essi Amegan',
      role: 'Gestionnaire de Stock & Caissière',
      email: 'e.amegan@pharmacie-populaire-tokoin.tg',
      phone: '+228 93 11 22 33',
      status: 'Actif'
    }
  ]);

  // Citizen Family members (Ayants droit)
  const [familyMembers, setFamilyMembers] = useState([
    { id: '1', name: 'Koffi Junior (Fils)', inamNumber: 'INAM-AD-2023-45920-1', coverage: '80%' },
    { id: '2', name: 'Abla (Fille)', inamNumber: 'INAM-AD-2023-45920-2', coverage: '80%' }
  ]);

  // Citizen Favorite pharmacies
  const [favoritePharmacies, setFavoritePharmacies] = useState([
    { id: '1', name: 'Pharmacie Populaire Tokoin', quarter: 'Tokoin-Nifidji', phone: '+228 90 12 34 56', isGarde: true },
    { id: '2', name: 'Pharmacie de la Paix', quarter: 'Bè-Château', phone: '+228 91 22 33 44', isGarde: false }
  ]);

  // Citizen Prescriptions
  const [prescriptions, setPrescriptions] = useState([
    { id: '1', drug: 'Artéméther + Luméfantrine 20/120mg', dosage: '1 cp matin et soir', duration: '3 jours', renewedDate: '26 Août 2026' },
    { id: '2', drug: 'Paracétamol 1g', dosage: '1 cp si fièvre (max 3/j)', duration: '5 jours', renewedDate: '20 Août 2026' }
  ]);

  // UI helpers
  const [saveToast, setSaveToast] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showSandboxKey, setShowSandboxKey] = useState(false);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('Pharmacien Adjoint');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamPhone, setNewTeamPhone] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        role: newTeamRole,
        email: newTeamEmail || `${newTeamName.toLowerCase().replace(/\s+/g, '.')}@pharmacie.tg`,
        phone: newTeamPhone || '+228 90 00 00 00',
        status: 'Actif'
      }
    ]);
    setNewTeamName('');
    setNewTeamEmail('');
    setNewTeamPhone('');
    setIsAddingTeamMember(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = () => {
    setDevTestLoading(true);
    setDevTestResult(null);

    setTimeout(() => {
      let dataResult: any = {};

      if (devTestEndpoint === 'gardes') {
        dataResult = {
          status: 'success',
          timestamp: new Date().toISOString(),
          total_count: 8,
          region: devTestRegion,
          city: devTestCity,
          data: [
            {
              id: 'ph_populaire_tokoin',
              name: 'Pharmacie Populaire Tokoin',
              quarter: 'Tokoin-Nifidji',
              city: 'Lomé',
              phone: '+228 90 12 34 56',
              isOpen24h: true,
              gardeStatus: 'EN_GARDE_24H',
              latitude: 6.1375,
              longitude: 1.2125,
              inamConventioned: true,
              inamRate: 80
            },
            {
              id: 'ph_paix_be',
              name: 'Pharmacie de la Paix Bè',
              quarter: 'Bè-Kpota',
              city: 'Lomé',
              phone: '+228 91 23 45 67',
              isOpen24h: true,
              gardeStatus: 'EN_GARDE_24H',
              latitude: 6.1311,
              longitude: 1.2418,
              inamConventioned: true,
              inamRate: 80
            }
          ]
        };
      } else if (devTestEndpoint === 'drugs') {
        dataResult = {
          status: 'success',
          query: devTestQuery,
          count: 2,
          results: [
            {
              dci: 'Artéméther + Luméfantrine',
              brand_name: 'Coartem 80/480mg',
              dosage: 'Comprimés boîte de 6',
              therapeutic_class: 'Antipaludiques ACT',
              regulated_price_cfa: 2450,
              inam_reimbursable: true,
              inam_copay_rate: 80,
              stock_availability: 'Disponible en 24 officines de garde à Lomé'
            },
            {
              dci: 'Artésunate injectable',
              brand_name: 'Artesun 60mg',
              dosage: 'Poudre pour injection',
              therapeutic_class: 'Paludisme Grave Hospitalier',
              regulated_price_cfa: 4800,
              inam_reimbursable: true,
              inam_copay_rate: 80,
              stock_availability: 'Sous chaîne de froid certifiée'
            }
          ]
        };
      } else if (devTestEndpoint === 'inam') {
        dataResult = {
          status: 'success',
          convention_version: 'INAM-TOGO-2024-V2',
          base_coverage: '80%',
          patient_copay: '20%',
          eligibility_check: 'ONLINE_ACTIVE',
          supported_categories: ['Fonctionnaires', 'Enseignants', 'Retraités CRT', 'Étudiants AMU']
        };
      } else {
        dataResult = {
          status: 'success',
          sync_batch_id: 'sync_batch_' + Date.now(),
          connector: devCaisseSoftware,
          records_updated: 142,
          last_sync_timestamp: new Date().toISOString(),
          status_msg: 'Synchronisation automatique de stock officinal validée'
        };
      }

      setDevTestResult({
        status: 200,
        statusText: 'OK',
        durationMs: Math.floor(Math.random() * 20) + 32,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-galenis-ratelimit-limit': '1000',
          'x-galenis-ratelimit-remaining': '968',
          'x-galenis-region': 'TG-LFW',
          'access-control-allow-origin': '*'
        },
        data: dataResult
      });
      setDevTestLoading(false);
    }, 400);
  };

  const getCodeSnippet = (lang: string, apiKey: string) => {
    if (lang === 'curl') {
      return `# 1. Récupérer les pharmacies de garde au Togo (Région Maritime / Lomé)
curl -X GET "https://api.galenis.tg/v1/pharmacies/de-garde?region=Maritime&city=Lom%C3%A9" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Accept: application/json"

# 2. Rechercher un médicament avec DCI & prix officiel réglementé en FCFA
curl -X GET "https://api.galenis.tg/v1/drugs/search?q=Artemether" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Accept: application/json"`;
    }
    if (lang === 'javascript') {
      return `// Installation: npm install @galenis/togo-sdk
import { GalenisClient } from '@galenis/togo-sdk';

const client = new GalenisClient({
  apiKey: '${apiKey}',
  environment: 'production' // ou 'sandbox'
});

async function getPharmaciesDeGarde() {
  const result = await client.pharmacies.listDeGarde({
    region: 'Maritime',
    city: 'Lomé'
  });
  console.log('Pharmacies de garde ouvertes :', result.data);
}

getPharmaciesDeGarde();`;
    }
    if (lang === 'python') {
      return `# Installation: pip install galenis-togo
from galenis import GalenisClient

client = GalenisClient(api_key="${apiKey}")

# Récupérer les pharmacies de garde en temps réel
response = client.pharmacies.get_de_garde(region="Maritime", city="Lomé")
for pharma in response.data:
    print(f"{pharma.name} ({pharma.quarter}) - Tél: {pharma.phone}")`;
    }
    if (lang === 'php') {
      return `<?php
// Installation: composer require galenis/togo-sdk
require 'vendor/autoload.php';

use Galenis\\Client;

$client = new Client(['api_key' => '${apiKey}']);

$gardes = $client->pharmacies->getDeGarde([
    'region' => 'Maritime',
    'city' => 'Lomé'
]);

foreach ($gardes['data'] as $pharmacy) {
    echo $pharmacy['name'] . " - " . $pharmacy['phone'] . "\\n";
}`;
    }
    if (lang === 'dart') {
      return `// Flutter / Dart (pub.dev: galenis_togo)
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<dynamic>> fetchPharmaciesDeGarde() async {
  final url = Uri.parse('https://api.galenis.tg/v1/pharmacies/de-garde?region=Maritime&city=Lomé');
  final response = await http.get(
    url,
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Accept': 'application/json',
    },
  );
  if (response.statusCode == 200) {
    final body = jsonDecode(response.body);
    return body['data'];
  }
  throw Exception('Erreur API Galenis Togo');
}`;
    }
    return `// C# .NET SDK
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", "${apiKey}");
        
        var response = await client.GetStringAsync(
            "https://api.galenis.tg/v1/pharmacies/de-garde?region=Maritime&city=Lomé");
        Console.WriteLine(response);
    }
}`;
  };

  return (
    <div className="space-y-6">
      {/* Official Animated Brand Ident Banner */}
      <GalenisBrandIdent autoPlay={true} loop={false} />

      {/* Top Banner Context - strictly displaying active authenticated user */}
      <div className="bg-gradient-to-r from-[#02281E] via-[#063E31] to-[#022018] rounded-2xl p-5 sm:p-7 text-white shadow-lg border border-emerald-600/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <ShieldCheck className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <TogoFlag className="w-4 h-3 rounded-xs shrink-0" />
                {activeRole === 'PHARMACIEN' && 'Compte Officinal Vérifié'}
                {activeRole === 'DEVELOPPEUR' && 'Compte Développeur Partenaire'}
                {activeRole === 'CITOYEN' && 'Compte Patient & Assuré INAM'}
                {activeRole === 'ADMIN' && 'Supervision Gouvernance & ONPT'}
              </span>
              <span className="text-xs font-bold text-emerald-200/90 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                {activeRole === 'PHARMACIEN' && 'Agrément Ministère de la Santé • Ordre National des Pharmaciens'}
                {activeRole === 'DEVELOPPEUR' && 'Accès Passerelle API & Intégration Caisse'}
                {activeRole === 'CITOYEN' && 'Tiers Payant & Suivi Sanitaire'}
                {activeRole === 'ADMIN' && 'Autorité Nationale de Contrôle'}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>
                {activeRole === 'PHARMACIEN' && (currentUser?.name || galenis.name)}
                {activeRole === 'DEVELOPPEUR' && (currentUser?.name || devData.name)}
                {activeRole === 'CITOYEN' && (currentUser?.name || citoyenData.name)}
                {activeRole === 'ADMIN' && (currentUser?.name || 'Administration Centrale Galenis')}
              </span>
              <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-emerald-500/30 border border-emerald-400/40 font-bold text-emerald-100">
                {activeRole === 'PHARMACIEN' && (currentUser?.badge || galenis.onptNumber)}
                {activeRole === 'DEVELOPPEUR' && (currentUser?.organization || devData.orgName)}
                {activeRole === 'CITOYEN' && (currentUser?.badge || citoyenData.insuranceNumber)}
                {activeRole === 'ADMIN' && 'SUPERVISION'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-2xl leading-relaxed">
              {activeRole === 'PHARMACIEN' && `${galenis.title} à la ${galenis.pharmacyName} (${galenis.quarter}, ${galenis.city}). Gestion de conformité, gardes et conventionnements.`}
              {activeRole === 'DEVELOPPEUR' && `Intégrateur officiel pour ${devData.orgName}. Gestion des clés API, documentation technique, webhooks et synchronisation des logiciels de caisse.`}
              {activeRole === 'CITOYEN' && `Patient assuré à ${citoyenData.city} (${citoyenData.quarter}). Gestion des ayants droit, pharmacies favorites et ordonnances.`}
              {activeRole === 'ADMIN' && `Console de gouvernance et audit des données sanitaires nationales du Togo.`}
            </p>
          </div>

          {/* Session Management Box (No fake morphing buttons) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session active & vérifiée</span>
            </div>

            <div className="flex items-center gap-2">
              {activeRole === 'PHARMACIEN' && onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Tableau de bord</span>
                </button>
              )}
              {activeRole === 'DEVELOPPEUR' && onNavigateToApiPortal && (
                <button
                  onClick={onNavigateToApiPortal}
                  className="px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Portail API Public</span>
                </button>
              )}
              {onSwitchAccount && (
                <button
                  onClick={onSwitchAccount}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  title="Changer de compte utilisateur"
                >
                  <LogOut className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Changer de compte</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Success Notification */}
      {saveToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Informations et préférences mises à jour avec succès sur Galenis Togo.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ROLE: PHARMACIEN (Officine, Équipe, Stocks, INAM, Gardes - NO API KEYS) */}
      {/* ========================================================================= */}
      {activeRole === 'PHARMACIEN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pharmacist Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Gestion Officinale
              </div>
              <button
                onClick={() => setPharmaSection('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${pharmaSection === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Tableau de Bord</span>
                </div>
                {pharmaSection === 'dashboard' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setPharmaSection('officine')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'officine'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${pharmaSection === 'officine' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Fiche Officine & Titulaire</span>
                </div>
                {pharmaSection === 'officine' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setPharmaSection('team')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'team'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${pharmaSection === 'team' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Équipe Officinale</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {teamMembers.length}
                </span>
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Disponibilités & Tiers Payant
              </div>

              <button
                onClick={() => setPharmaSection('stocks')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'stocks'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Pill className={`w-4 h-4 ${pharmaSection === 'stocks' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Disponibilités & Ruptures</span>
                </div>
                {pharmaSection === 'stocks' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setPharmaSection('inam')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'inam'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-4 h-4 ${pharmaSection === 'inam' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Convention INAM & CNSS</span>
                </div>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  80%
                </span>
              </button>

              <button
                onClick={() => setPharmaSection('address')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'address'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 ${pharmaSection === 'address' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Adresse & Repères Togo</span>
                </div>
                {pharmaSection === 'address' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Ordre & Gardes
              </div>

              <button
                onClick={() => setPharmaSection('gardes')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'gardes'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <History className={`w-4 h-4 ${pharmaSection === 'gardes' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Registre des Gardes ONPT</span>
                </div>
                {pharmaSection === 'gardes' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setPharmaSection('confreres')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  pharmaSection === 'confreres'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HeartHandshake className={`w-4 h-4 ${pharmaSection === 'confreres' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Réseau & Entraide Confrères</span>
                </div>
                {pharmaSection === 'confreres' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {/* Quick Pharmacist Hotline */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
              <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <TogoLionIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Assistance Ordinale ONPT</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                Service dédié aux pharmaciens pour validation de garde et urgences de stock.
              </p>
              <div className="text-[11px] font-black text-emerald-900 pt-1">
                Tél : +228 22 21 00 00 / 90 12 00 00
              </div>
            </div>
          </div>

          {/* Pharmacist Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 min-h-[550px]">
            
            {/* Pharmacist Dashboard */}
            {pharmaSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Tableau de Bord Officine</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Statut d'inscription ONPT, conformité INAM et indicateurs d'activité de votre officine.
                    </p>
                  </div>
                  {onNavigateToDashboard && (
                    <button
                      onClick={onNavigateToDashboard}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Accéder au Stock Officine</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* KPI Cards for Pharmacy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                      <span>Inscription ONPT</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="mt-2 text-xl font-black text-emerald-900">Valide & Conforme</div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-semibold">{galenis.onptNumber}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                    <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
                      <span>Convention INAM</span>
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="mt-2 text-xl font-black text-blue-900">Tiers Payant 80%</div>
                    <div className="text-[11px] text-blue-700 mt-1 font-semibold">Télétransmission active</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
                      <span>Prochaine Garde</span>
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="mt-2 text-xl font-black text-amber-900">Ce Dimanche</div>
                    <div className="text-[11px] text-amber-700 mt-1 font-semibold">Service 24h/24 déclaré</div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                    <div className="flex items-center justify-between text-purple-800 text-xs font-bold">
                      <span>Équipe Rattachée</span>
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="mt-2 text-xl font-black text-purple-900">{teamMembers.length} Professionnels</div>
                    <div className="text-[11px] text-purple-700 mt-1 font-semibold">Tous autorisés ONPT</div>
                  </div>
                </div>

                {/* Important notices for Pharmacy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Recherches Citoyennes Reçues</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Plus de <strong>1 420 patients</strong> ont consulté la fiche et les coordonnées de la <strong>{galenis.pharmacyName}</strong> ce mois-ci via Galenis Togo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Chaîne du Froid Certifiée (2-8°C)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Votre chambre froide et réfrigérateurs officinaux pour insulines et vaccins sont déclarés conformes selon la norme DGS Togo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pharmacist Officine & Titulaire */}
            {pharmaSection === 'officine' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Fiche Officine & Titulaire</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Informations réglementaires, numéro ONPT et coordonnées directes de votre pharmacie.
                  </p>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Nom & Prénoms du Titulaire</label>
                      <input
                        type="text"
                        value={galenis.name}
                        onChange={(e) => setGalenis({ ...galenis, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Titre & Qualification</label>
                      <input
                        type="text"
                        value={galenis.title}
                        onChange={(e) => setGalenis({ ...galenis, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Nom Officiel de la Pharmacie</label>
                      <input
                        type="text"
                        value={galenis.pharmacyName}
                        onChange={(e) => setGalenis({ ...galenis, pharmacyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">N° Inscription Ordre (ONPT)</label>
                      <input
                        type="text"
                        value={galenis.onptNumber}
                        onChange={(e) => setGalenis({ ...galenis, onptNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Téléphone Comptoir & Urgence</label>
                      <input
                        type="text"
                        value={galenis.phone}
                        onChange={(e) => setGalenis({ ...galenis, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Email Officiel</label>
                      <input
                        type="email"
                        value={galenis.email}
                        onChange={(e) => setGalenis({ ...galenis, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Horaires Habituels d'Ouverture</label>
                      <input
                        type="text"
                        value={galenis.openingHours}
                        onChange={(e) => setGalenis({ ...galenis, openingHours: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Pharmacist Team */}
            {pharmaSection === 'team' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Équipe Officinale</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Pharmaciens adjoints, préparateurs et gestionnaires autorisés pour l'officine.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingTeamMember(!isAddingTeamMember)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAddingTeamMember ? 'Fermer' : 'Ajouter un collaborateur'}</span>
                  </button>
                </div>

                {isAddingTeamMember && (
                  <form onSubmit={handleAddTeam} className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4">
                    <div className="font-black text-sm text-emerald-950">Nouveau Membre de l'Équipe</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nom et Prénoms *"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        required
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      />
                      <select
                        value={newTeamRole}
                        onChange={(e) => setNewTeamRole(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-semibold"
                      >
                        <option value="Pharmacien Adjoint">Pharmacien Adjoint</option>
                        <option value="Préparateur Diplômé">Préparateur Diplômé</option>
                        <option value="Gestionnaire de Stock">Gestionnaire de Stock</option>
                        <option value="Stagiaire Interné">Stagiaire Interné</option>
                      </select>
                      <input
                        type="email"
                        placeholder="Email professionnel"
                        value={newTeamEmail}
                        onChange={(e) => setNewTeamEmail(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Téléphone (+228)"
                        value={newTeamPhone}
                        onChange={(e) => setNewTeamPhone(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingTeamMember(false)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {teamMembers.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shrink-0">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <span>{m.name}</span>
                            {m.onptNumber && (
                              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                {m.onptNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">{m.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 font-medium shrink-0">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {m.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {m.phone}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pharmacist Stocks & Ruptures */}
            {pharmaSection === 'stocks' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Disponibilités & Suivi des Ruptures</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Gestion des stocks critiques, antipaludiques, insulines sous chaîne du froid et antibiotiques majeurs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-800">Taux de Disponibilité Global</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">94.8%</div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-semibold">148 références actives</div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs font-bold text-blue-800">Chaîne du Froid (2-8°C)</div>
                    <div className="text-2xl font-black text-blue-900 mt-1">100% OK</div>
                    <div className="text-[11px] text-blue-700 mt-1 font-semibold">Capteurs thermiques vérifiés</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-bold text-amber-800">Alertes Tension / Rupture</div>
                    <div className="text-2xl font-black text-amber-900 mt-1">2 Produits</div>
                    <div className="text-[11px] text-amber-700 mt-1 font-semibold">Signalés à la DGS Togo</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-sm text-slate-900">Top Médicaments recherchés dans votre quartier ({galenis.quarter})</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'Artéméther + Luméfantrine 20/120mg (Antipaludique)', stat: 'En stock (32 btes)' },
                      { name: 'Amoxicilline + Acide Clavulanique 1g', stat: 'En stock (18 btes)' },
                      { name: 'Insuline Rapide 100 UI/ml (Chaîne du froid)', stat: 'En stock (12 flacons)' },
                      { name: 'Paracétamol 1g Comprimés', stat: 'En stock (85 btes)' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                          {item.stat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pharmacist INAM */}
            {pharmaSection === 'inam' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Convention INAM & Tiers Payant Togo</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Paramètres d'accord de télétransmission, tiers payant 80% et encaissement mobile money.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-sm text-blue-950 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Convention INAM Officine Active</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs">
                      Tiers Payant 80%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Numéro de convention : <strong>{galenis.inamConvention}</strong>. Les assurés INAM ne règlent que 20% du tarif réglementé au comptoir, et vos bordereaux sont transmis directement à l'organisme payeur.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-700">Délai Moyen de Remboursement</div>
                    <div className="text-xl font-black text-slate-900">14 Jours Ouvrés</div>
                    <div className="text-[11px] text-slate-500">Par virement bancaire Trésor Public / INAM</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-700">Paiements Mobiles Comptoir</div>
                    <div className="text-xl font-black text-slate-900">T-Money & Flooz</div>
                    <div className="text-[11px] text-slate-500">Règlement instantané du ticket modérateur</div>
                  </div>
                </div>
              </div>
            )}

            {/* Pharmacist Address */}
            {pharmaSection === 'address' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Adresse & Repères Géographiques Togo</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Points de repère visuels essentiels pour orienter les patients jour et nuit à Lomé et dans les préfectures.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700">Région Sanitaire</div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">{galenis.region}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700">Ville</div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">{galenis.city}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700">Quartier</div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">{galenis.quarter}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-700">Point de Repère Usuel</div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold">{galenis.landmark}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <div className="text-xs">
                      <div className="font-extrabold text-emerald-950">Position GPS Validée</div>
                      <div className="text-emerald-700">Lat: 6.1375 • Lng: 1.2125 (Tokoin Lomé)</div>
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=6.1375,1.2125"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Vérifier sur Maps</span>
                  </a>
                </div>
              </div>
            )}

            {/* Pharmacist Gardes */}
            {pharmaSection === 'gardes' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Registre des Gardes ONPT</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Historique et planning officiel des tours de garde déclarés à l'Ordre National des Pharmaciens du Togo.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { date: 'Dimanche Prochain', type: 'Garde 24h/24', status: 'Confirmé ONPT', note: 'Affichage public et géolocalisation citoyenne activés' },
                    { date: '15 Août 2026', type: 'Garde Jour Férié (Assomption)', status: 'Effectué', note: '142 patients servis, 0 incident signalé' },
                    { date: '02 Août 2026', type: 'Garde Dimanche', status: 'Effectué', note: 'Continuité des soins assurée de 08h à 08h le lendemain' }
                  ].map((g, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          <span>{g.date}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{g.type}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{g.note}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-black self-start sm:self-auto">
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pharmacist Confreres */}
            {pharmaSection === 'confreres' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Réseau & Entraide Confraternelle</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Canal d'échange et de dépannage urgent de médicaments entre pharmaciens de garde dans la région.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-black text-sm text-emerald-950 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    <span>Dépannage d'Urgence Entre Officines</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    En cas de rupture imprévue pendant votre tour de garde de nuit, vous pouvez contacter directement vos confrères du secteur pour un transfert d'urgence de spécialité.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Pharmacie Tokoin Ouest', titulaire: 'Dr. Lawson', phone: '+228 90 22 33 44', distance: '850 m' },
                    { name: 'Pharmacie de l’Aéroport', titulaire: 'Dr. Gbedey', phone: '+228 91 33 44 55', distance: '1.4 km' },
                    { name: 'Pharmacie de la Paix Bè', titulaire: 'Dr. Adjamagbo', phone: '+228 92 44 55 66', distance: '2.1 km' }
                  ].map((c, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.titulaire} • à {c.distance}</div>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{c.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ROLE: DEVELOPPEUR (API Integration, SDKs, Interactive Sandbox, Keys, Caisse) */}
      {/* ========================================================================= */}
      {activeRole === 'DEVELOPPEUR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Developer Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Espace Développeur & API
              </div>

              <button
                onClick={() => setDevSection('integration')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'integration'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Code2 className={`w-4 h-4 ${devSection === 'integration' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Intégration API & SDKs</span>
                </div>
                {devSection === 'integration' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => {
                  setDevSection('sandbox' as any);
                  if (!devTestResult) handleRunApiTest();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === ('sandbox' as any)
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Terminal className={`w-4 h-4 ${devSection === ('sandbox' as any) ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Console & Tests API</span>
                </div>
                {devSection === ('sandbox' as any) && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('api_keys')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'api_keys'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className={`w-4 h-4 ${devSection === 'api_keys' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Clés API & Webhooks</span>
                </div>
                {devSection === 'api_keys' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('caisse')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'caisse'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className={`w-4 h-4 ${devSection === 'caisse' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Passerelle Logiciels Caisse</span>
                </div>
                {devSection === 'caisse' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-4 h-4 ${devSection === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Métriques & Uptime</span>
                </div>
                {devSection === 'dashboard' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('endpoints')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'endpoints'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-4 h-4 ${devSection === 'endpoints' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Consommation & Quotas</span>
                </div>
                {devSection === 'endpoints' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('logs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'logs'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <History className={`w-4 h-4 ${devSection === 'logs' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Logs des Requêtes Live</span>
                </div>
                {devSection === 'logs' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setDevSection('documentation')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  devSection === 'documentation'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${devSection === 'documentation' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Guides & OpenAPI Spec</span>
                </div>
                {devSection === 'documentation' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {onNavigateToApiPortal && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={onNavigateToApiPortal}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Portail Développeur Public</span>
                </button>
              </div>
            )}
          </div>

          {/* Developer Content Panel */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 min-h-[550px]">
            
            {/* 1. INTÉGRATION API & SDKS */}
            {devSection === 'integration' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">Intégration API & SDKs</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        v1.4 REST & GraphQL
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Intégrez en quelques lignes de code les pharmacies de garde, la nomenclature officielle des médicaments et les taux INAM.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setDevSection('sandbox' as any);
                      handleRunApiTest();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tester dans le Sandbox</span>
                  </button>
                </div>

                {/* Architecture Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Base URL Production</div>
                    <div className="font-mono text-xs font-bold text-slate-900 truncate">https://api.galenis.tg/v1</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">TLS 1.3 • Datacenter Lomé</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Authentification</div>
                    <div className="font-mono text-xs font-bold text-slate-900">Bearer Token (JWT)</div>
                    <div className="text-[10px] text-slate-500 font-medium">En-tête Authorization HTTP</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Format Réponses</div>
                    <div className="font-mono text-xs font-bold text-slate-900">JSON (UTF-8)</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Conforme RFC 8259</div>
                  </div>
                </div>

                {/* Multi-Language Code Snippet Generator */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                  {/* Language Selector Bar */}
                  <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black text-white">Exemples de Code Intégration</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1 rounded-lg border border-slate-800">
                      {[
                        { id: 'curl', label: 'cURL' },
                        { id: 'javascript', label: 'Node.js / TS' },
                        { id: 'python', label: 'Python' },
                        { id: 'php', label: 'PHP' },
                        { id: 'dart', label: 'Flutter / Dart' },
                        { id: 'csharp', label: 'C# .NET' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setDevCodeLang(item.id as any)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                            devCodeLang === item.id
                              ? 'bg-emerald-500 text-slate-950 shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => copyText(getCodeSnippet(devCodeLang, devData.liveApiKey), 'SNIPPET')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedKey === 'SNIPPET' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'SNIPPET' ? 'Copié !' : 'Copier le code'}</span>
                    </button>
                  </div>

                  {/* Code Editor Preview */}
                  <div className="p-4 sm:p-5 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                    <pre className="text-emerald-300">
                      {getCodeSnippet(devCodeLang, devData.liveApiKey)}
                    </pre>
                  </div>

                  {/* Bottom Footer Note */}
                  <div className="bg-slate-900/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Clé insérée automatiquement : {devData.liveApiKey.substring(0, 14)}••••••••</span>
                    <span className="text-emerald-400 font-bold">Quota : 100 000 req/mois</span>
                  </div>
                </div>

                {/* Core Endpoints List */}
                <div className="space-y-3">
                  <div className="font-extrabold text-sm text-slate-900">Endpoints Principaux & Formats Recommandés</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      {
                        method: 'GET',
                        path: '/v1/pharmacies/de-garde',
                        desc: 'Liste en temps réel des officines ouvertes de garde par région ou ville.',
                        params: 'region=Maritime&city=Lomé&garde=true'
                      },
                      {
                        method: 'GET',
                        path: '/v1/drugs/search',
                        desc: 'Recherche par DCI, spécialité commerciale, forme et prix officiel en FCFA.',
                        params: 'q=Artemether&limit=10'
                      },
                      {
                        method: 'GET',
                        path: '/v1/inam/rates',
                        desc: 'Grille officielle de prise en charge et taux de remboursement INAM Togo.',
                        params: 'class=antipaludiques'
                      },
                      {
                        method: 'POST',
                        path: '/v1/pos/sync/stock',
                        desc: 'Synchronisation automatique du stock pour logiciels de caisse officinaux.',
                        params: 'Content-Type: application/json'
                      }
                    ].map((ep, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                            ep.method === 'GET' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">{ep.path}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{ep.desc}</p>
                        <div className="text-[11px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                          {ep.params}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CONSOLE INTERACTIVE DE TEST (SANDBOX) */}
            {devSection === ('sandbox' as any) && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Console Interactive & Tests API</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Exécutez des requêtes réelles contre l'API Galenis Togo et inspectez le payload JSON en direct.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black self-start sm:self-auto flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-blue-600" />
                    <span>Mode Test Connecté</span>
                  </span>
                </div>

                {/* Request Builder Panel */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Paramètres de la Requête</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-xs font-bold text-slate-700">Endpoint Cible</label>
                      <select
                        value={devTestEndpoint}
                        onChange={(e) => setDevTestEndpoint(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                      >
                        <option value="gardes">GET /v1/pharmacies/de-garde</option>
                        <option value="drugs">GET /v1/drugs/search</option>
                        <option value="inam">GET /v1/inam/rates</option>
                        <option value="sync">POST /v1/pos/sync/stock</option>
                      </select>
                    </div>

                    {devTestEndpoint === 'gardes' && (
                      <>
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Région du Togo</label>
                          <select
                            value={devTestRegion}
                            onChange={(e) => setDevTestRegion(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                          >
                            <option value="Maritime">Maritime (Lomé)</option>
                            <option value="Plateaux">Plateaux (Atakpamé / Kpalimé)</option>
                            <option value="Centrale">Centrale (Sokodé)</option>
                            <option value="Kara">Kara (Kara / Bassar)</option>
                            <option value="Savanes">Savanes (Dapaong / Mango)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Ville</label>
                          <input
                            type="text"
                            value={devTestCity}
                            onChange={(e) => setDevTestCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                          />
                        </div>
                      </>
                    )}

                    {devTestEndpoint === 'drugs' && (
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Molécule DCI ou Nom Commercial</label>
                        <input
                          type="text"
                          value={devTestQuery}
                          onChange={(e) => setDevTestQuery(e.target.value)}
                          placeholder="Ex: Paracétamol, Artéméther, Amoxicilline..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                        />
                      </div>
                    )}

                    {devTestEndpoint === 'sync' && (
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Connecteur Logiciel</label>
                        <select
                          value={devCaisseSoftware}
                          onChange={(e) => setDevCaisseSoftware(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                        >
                          <option value="LGO_TOGO">LGO Togo (Passerelle Officine)</option>
                          <option value="PHARMAGEST">Pharmagest Togo / LGPI</option>
                          <option value="SMARTPHARMA">SmartPharma Cloud</option>
                          <option value="WINPHARMA">WinPharma Afrique</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleRunApiTest}
                      disabled={devTestLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                    >
                      {devTestLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Envoi de la requête...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Exécuter la Requête HTTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Response Visualizer */}
                {devTestResult && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md space-y-0">
                    <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-xs">
                          {devTestResult.status} {devTestResult.statusText}
                        </span>
                        <span className="text-xs font-mono text-slate-300">
                          Latence : <strong className="text-emerald-400">{devTestResult.durationMs} ms</strong>
                        </span>
                      </div>

                      <button
                        onClick={() => copyText(JSON.stringify(devTestResult.data, null, 2), 'JSON_RESP')}
                        className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'JSON_RESP' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'JSON_RESP' ? 'Copié !' : 'Copier JSON'}</span>
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                      <pre className="text-emerald-300">
                        {JSON.stringify(devTestResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PASSERELLE LOGICIELS DE CAISSE */}
            {devSection === 'caisse' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Passerelle Logiciels de Caisse</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Synchronisation automatique du stock et des ventes avec les progiciels d'officine au Togo.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Connecteur Actif</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Logiciel Caisse Installé</div>
                    <select
                      value={devCaisseSoftware}
                      onChange={(e) => setDevCaisseSoftware(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                    >
                      <option value="LGO_TOGO">LGO Togo (Passerelle Officine)</option>
                      <option value="PHARMAGEST">Pharmagest / LGPI Togo</option>
                      <option value="SMARTPHARMA">SmartPharma Cloud Togo</option>
                      <option value="WINPHARMA">WinPharma Afrique de l'Ouest</option>
                      <option value="CUSTOM">ERP Interne Sur Mesure</option>
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Module certifié compatible avec l'Ordre National des Pharmaciens du Togo (ONPT).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Fréquence de Synchronisation</div>
                    <select
                      value={devCaisseSyncInterval}
                      onChange={(e) => setDevCaisseSyncInterval(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                    >
                      <option value="realtime">Temps Réel (À chaque passage en caisse)</option>
                      <option value="5min">Toutes les 5 minutes</option>
                      <option value="15min">Toutes les 15 minutes</option>
                      <option value="hourly">Toutes les heures</option>
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Ajuste automatiquement les alertes de disponibilité pour les patients et citoyens.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-black text-sm text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Sécurité & Chiffrement de la Passerelle</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Toutes les transmissions de stocks sont chiffrées de bout en bout en AES-256 et validées par signature cryptographique HMAC. Aucune donnée nominative de patient n'est exportée du logiciel de caisse.
                  </p>
                </div>
              </div>
            )}

            {/* 4. METRIQUES & UPTIME */}
            {devSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Métriques Passerelle Développeur</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Performance en temps réel, requêtes et latence sur les serveurs Galenis Togo.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    API Live 99.98% Uptime
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500">Volume ce mois</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">38 420 / 100k</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-[38.4%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500">Latence Moyenne (Lomé)</div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">42 ms</div>
                    <div className="text-[11px] text-slate-500 mt-1">Nœud Cloud Lomé Datacenter</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500">Taux de Succès HTTP</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">99.85%</div>
                    <div className="text-[11px] text-slate-500 mt-1">Codes 200 OK & 304 Not Modified</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 space-y-3">
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Test Rapide cURL (Production)</span>
                  </div>
                  <pre className="p-3 bg-black/50 rounded-xl text-xs font-mono overflow-x-auto text-emerald-300">
                    {`curl -X GET "https://api.galenis.tg/v1/pharmacies/de-garde?region=Maritime" \\
  -H "Authorization: Bearer ${devData.liveApiKey}" \\
  -H "Accept: application/json"`}
                  </pre>
                </div>
              </div>
            )}

            {/* 5. CLES API & WEBHOOKS */}
            {devSection === 'api_keys' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Clés API & Identifiants Secrets</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Générez et sécurisez vos jetons d'accès pour vos applications et logiciels de caisse.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Live Key */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">PRODUCTION</span>
                        <span>Clé API Live (En direct)</span>
                      </div>
                      <button
                        onClick={() => copyText(devData.liveApiKey, 'LIVE')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'LIVE' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'LIVE' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type={showLiveKey ? 'text' : 'password'}
                        value={devData.liveApiKey}
                        readOnly
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold"
                      />
                      <button
                        onClick={() => setShowLiveKey(!showLiveKey)}
                        className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        {showLiveKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Key */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black">SANDBOX</span>
                        <span>Clé API Test (Données fictives)</span>
                      </div>
                      <button
                        onClick={() => copyText(devData.sandboxApiKey, 'SANDBOX')}
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'SANDBOX' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'SANDBOX' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type={showSandboxKey ? 'text' : 'password'}
                        value={devData.sandboxApiKey}
                        readOnly
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold"
                      />
                      <button
                        onClick={() => setShowSandboxKey(!showSandboxKey)}
                        className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        {showSandboxKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Webhook configuration */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-extrabold text-xs text-slate-900">Webhook URL (Événements de garde & alertes DGS)</div>
                    <input
                      type="url"
                      value={devData.webhookUrl}
                      onChange={(e) => setDevData({ ...devData, webhookUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                    />
                    <div className="text-[11px] text-slate-500">
                      Recevez un payload JSON à chaque changement de statut de garde ou alerte de rappel de lot.
                    </div>
                  </div>

                  {/* 2FA Critical Security Action: Rotate Keys */}
                  <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-xs text-red-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-red-700" />
                        <span>Rotation des Clés Secrètes d'API (Protection 2FA Requise)</span>
                      </div>
                      <p className="text-[11px] text-red-800 mt-0.5">
                        Invalide immédiatement les anciennes clés secrètes sur tous vos serveurs de production.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCritical2faDetails({
                          title: 'Régénération des Clés API de Production',
                          description: 'Attention : toutes les applications et passerelles de caisse connectées avec vos clés actuelles seront immédiatement déconnectées.',
                          severity: 'danger',
                          onConfirm: () => {
                            const newLive = `pd_live_tg_${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`;
                            setDevData(prev => ({ ...prev, liveApiKey: newLive }));
                            setSaveToast(true);
                            setTimeout(() => setSaveToast(false), 3500);
                          }
                        });
                        setIs2faModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      Régénérer Clé Live (2FA)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CONSOMMATION & QUOTAS */}
            {devSection === 'endpoints' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Consommation des Endpoints</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Répartition des appels API et respect des quotas alloués.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { path: 'GET /v1/pharmacies/de-garde', calls: 24150, share: '62%' },
                    { path: 'GET /v1/drugs/search', calls: 9800, share: '25%' },
                    { path: 'GET /v1/inam/rates', calls: 3200, share: '9%' },
                    { path: 'POST /v1/reservations', calls: 1270, share: '4%' }
                  ].map((ep, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="font-mono text-xs font-bold text-slate-800">{ep.path}</div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-slate-900">{ep.calls.toLocaleString()} appels</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">{ep.share}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. LOGS RESEAU LIVE */}
            {devSection === 'logs' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Journal d'Appels Réseau (Live Logs)</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Dernières requêtes reçues avec horodatage, statut et temps d'exécution.
                  </p>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {[
                    { time: '12:19:42', status: 200, method: 'GET', path: '/v1/pharmacies/de-garde?city=Lomé', ms: 38 },
                    { time: '12:18:11', status: 200, method: 'GET', path: '/v1/drugs/search?q=Artemether', ms: 45 },
                    { time: '12:15:02', status: 200, method: 'GET', path: '/v1/inam/rates/antipaludiques', ms: 29 },
                    { time: '12:09:55', status: 304, method: 'GET', path: '/v1/pharmacies/de-garde', ms: 14 }
                  ].map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 text-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{log.time}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{log.status}</span>
                        <span className="text-amber-300">{log.method}</span>
                        <span className="text-white">{log.path}</span>
                      </div>
                      <span className="text-slate-400">{log.ms}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. DOCUMENTATION & GUIDES */}
            {devSection === 'documentation' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Documentation & Intégration</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Guides d'implémentation pour le secteur de la santé au Togo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-sm text-slate-900">Spécification OpenAPI 3.0</div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Téléchargez le schéma JSON / YAML pour importer les routes dans Postman ou Swagger.
                    </p>
                    <a href="https://api.galenis.tg/openapi.json" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span>Télécharger swagger.json</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-sm text-slate-900">SDKs Officiels</div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Bibliothèques clientes disponibles en TypeScript (npm), Python (PyPI) et PHP Composer.
                    </p>
                    <div className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                      npm install @galenis/togo-sdk
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ROLE: CITOYEN (Espace Santé, Simulateur INAM, Calculateur Reste à Charge, Profil, Favoris, Vigilance) */}
      {/* ========================================================================= */}
      {activeRole === 'CITOYEN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Citizen Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Mon Espace Citoyen
              </div>
              
              <button
                onClick={() => setCitoyenSection('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${citoyenSection === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Mon Espace Santé</span>
                </div>
                {citoyenSection === 'dashboard' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* 1. Estimer Prix avant Déplacement (Connected Citizen Feature) */}
              <button
                onClick={() => setCitoyenSection('price_estimate')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'price_estimate'
                    ? 'bg-emerald-700 text-white font-extrabold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${citoyenSection === 'price_estimate' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Estimer Prix avant Déplacement</span>
                </div>
                {citoyenSection === 'price_estimate' ? (
                  <ChevronRight className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-850">Devis & Trajet</span>
                )}
              </button>

              {/* 2. Simuler Prise en Charge Assurance */}
              <button
                onClick={() => setCitoyenSection('inam_simulation')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'inam_simulation'
                    ? 'bg-emerald-100/80 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-emerald-50/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span className="truncate">Simuler Prise en Charge</span>
                </div>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900">{simRate}%</span>
              </button>

              {/* 3. Calculer reste à charge */}
              <button
                onClick={() => setCitoyenSection('copay_calculator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'copay_calculator'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${citoyenSection === 'copay_calculator' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Calculer reste à charge</span>
                </div>
                {citoyenSection === 'copay_calculator' && <ChevronRight className="w-4 h-4 text-white" />}
              </button>

              {/* Passerelle IA Santé & Secret Médical (Connected Citizen Only) */}
              <button
                onClick={() => setCitoyenSection('ai_privacy_gateway')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'ai_privacy_gateway'
                    ? 'bg-blue-50 text-blue-800 font-extrabold border border-blue-200 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${citoyenSection === 'ai_privacy_gateway' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Passerelle IA Santé (Secret Médical)</span>
                </div>
                {citoyenSection === 'ai_privacy_gateway' ? (
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                ) : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">IA</span>
                )}
              </button>

              <button
                onClick={() => setCitoyenSection('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'profile'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4 h-4 ${citoyenSection === 'profile' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Profil & Couverture Santé</span>
                </div>
                {citoyenSection === 'profile' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setCitoyenSection('favorites')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'favorites'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className={`w-4 h-4 ${citoyenSection === 'favorites' ? 'text-rose-500' : 'text-slate-500'}`} />
                  <span>Pharmacies Favorites</span>
                </div>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">{favoritePharmacies.length}</span>
              </button>

              <button
                onClick={() => setCitoyenSection('vigilance')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'vigilance'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={`w-4 h-4 ${citoyenSection === 'vigilance' ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span>Signalements Gardes</span>
                </div>
                {citoyenSection === 'vigilance' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setCitoyenSection('privacy_security')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  citoyenSection === 'privacy_security'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-4 h-4 ${citoyenSection === 'privacy_security' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>Vie Privée & APDP Togo</span>
                </div>
                {citoyenSection === 'privacy_security' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {onNavigateToCitizen && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={onNavigateToCitizen}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Voir Pharmacies de Garde</span>
                </button>
              </div>
            )}
          </div>

          {/* Citizen Content Panel */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 min-h-[550px]">
            
            {/* 1. Citoyen Dashboard Overview */}
            {citoyenSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mon Espace Santé & Couvertures Togo</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Tableau de bord citoyen : estimation pré-trajet vers l'officine, simulation de prise en charge multi-assurances et calcul du ticket modérateur.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {citoyenData.insuranceName} ({citoyenData.insuranceRate}%)
                  </span>
                </div>

                {/* Top Connected Feature Cards (Estimation & Remboursement) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Estimation de Prix avant Déplacement */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-md space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-black uppercase tracking-wider backdrop-blur-xs">
                          <Car className="w-3.5 h-3.5" />
                          Devis & Trajet Officine
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">
                          Réservé Citoyen
                        </span>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white">
                        Estimer le prix avant déplacement
                      </h3>
                      <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                        Constituez votre ordonnance, sélectionnez votre pharmacie à Lomé ou en région, calculez votre reste à charge avec l'assurance ({citoyenData.insuranceName}) et vos frais de transport (Zémidjan/Taxi) avant de partir.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <button
                        onClick={() => setCitoyenSection('price_estimate')}
                        className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                      >
                        <Car className="w-4 h-4 text-emerald-700" />
                        <span>Lancer l'estimation pré-trajet</span>
                      </button>
                      <button
                        onClick={() => {
                          const favPharma = pharmacies.find(p => favoritePharmacies.some(f => f.id === p.id || p.name.includes(f.name))) || pharmacies[0];
                          if (favPharma) setEstimateSelectedPharmacyId(favPharma.id);
                          setIsPriceEstimatorModalOpen(true);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 border border-white/20 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Mode Fenêtre</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Simulateur de Remboursement Togo */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-md space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                          <Shield className="w-3.5 h-3.5" />
                          INAM • AMU • CNSS • Mutuelles
                        </span>
                        <span className="text-[10px] font-black bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                          Togo 2026
                        </span>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white">
                        Simulateur de Remboursement & Prise en Charge
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Simulez la part remboursée directement par le tiers-payant en officine (70% à 100%) et calculez le ticket modérateur net restant à payer au comptoir.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <button
                        onClick={() => setCitoyenSection('inam_simulation')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                      >
                        <Shield className="w-4 h-4 text-slate-950" />
                        <span>Simuler ma prise en charge</span>
                      </button>
                      <button
                        onClick={() => setIsSimulatorModalOpen(true)}
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1 border border-white/15 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Simulateur Complet</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs font-bold text-blue-800 flex items-center justify-between">
                      <span>Régime Déclaré</span>
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-black text-blue-900 mt-1">{citoyenData.insuranceName} ({citoyenData.insuranceRate}%)</div>
                    <div className="text-[11px] text-blue-700 mt-1 font-medium font-mono">{citoyenData.insuranceNumber}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-800 flex items-center justify-between">
                      <span>Reste à Charge Moyen</span>
                      <Calculator className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-black text-emerald-900 mt-1">{100 - citoyenData.insuranceRate}% Ticket Modérateur</div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-medium">Calcul automatique pour officines</div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="text-xs font-bold text-rose-800 flex items-center justify-between">
                      <span>Pharmacies Favorites</span>
                      <Heart className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-xl font-black text-rose-900 mt-1">{favoritePharmacies.length} Enregistrées</div>
                    <div className="text-[11px] text-rose-700 mt-1 font-medium">1 de garde aujourd'hui</div>
                  </div>
                </div>

                {/* Direct Shortcut to Guard Pharmacy */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Pharmacie de garde recommandée à proximité :</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 gap-3">
                    <div>
                      <div className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                        <span>Pharmacie Populaire Tokoin</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">24H/24</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Tokoin-Nifidji • De garde ce jour • Tiers payant INAM/CNSS/Assurances accepté</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const p = pharmacies.find(ph => ph.name.includes('Populaire')) || pharmacies[0];
                          if (p) setEstimateSelectedPharmacyId(p.id);
                          setCitoyenSection('price_estimate');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-850 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Estimer devis</span>
                      </button>
                      <a href="tel:+22890123456" className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 transition-colors shadow-2xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Citoyen Dedicated Price & Travel Estimator (Estimer Prix avant Déplacement) */}
            {citoyenSection === 'price_estimate' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                      <span>Estimer le Prix & Reste à Charge avant Déplacement</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Espace citoyen connecté : préparez votre budget exact (médicaments + prise en charge assurance + transport) et confirmez avec l'officine par WhatsApp avant de quitter votre domicile.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPriceEstimatorModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mode Fenêtre</span>
                    </button>
                  </div>
                </div>

                {/* Step 1: Target Pharmacy Selection */}
                {(() => {
                  const targetPharmacy = pharmacies.find(p => p.id === estimateSelectedPharmacyId) || pharmacies[0];
                  
                  // Calculate totals for copayBasket
                  const totalDrugsPrice = copayBasket.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                  const coveredDrugsPrice = copayBasket
                    .filter(item => item.isCovered)
                    .reduce((acc, item) => acc + (item.price * item.quantity), 0);
                  const insuranceCoveredAmount = Math.round(coveredDrugsPrice * (simRate / 100));
                  const patientDrugRemaining = totalDrugsPrice - insuranceCoveredAmount;
                  
                  let transportCost = estimateCustomTransportFee;
                  if (estimateTransportType === 'PERSO') transportCost = 0;

                  const grandTotal = patientDrugRemaining + transportCost;

                  return (
                    <div className="space-y-6">
                      {/* Step 1: Choose Pharmacy */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Building className="w-4 h-4 text-emerald-600" />
                            <span>1. Pharmacie de destination (Lomé & Régions Togo)</span>
                          </label>
                          {targetPharmacy?.isOnDuty && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                              DE GARDE 24H/24
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-7">
                            <select
                              value={targetPharmacy?.id || ''}
                              onChange={(e) => setEstimateSelectedPharmacyId(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
                            >
                              {pharmacies.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} — {p.city} ({p.neighborhood || p.address}) {p.isOnDuty ? '★ [DE GARDE]' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-5 flex items-center gap-2">
                            {targetPharmacy?.phone && (
                              <a
                                href={`tel:${targetPharmacy.phone}`}
                                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{targetPharmacy.phone}</span>
                              </a>
                            )}
                            {targetPharmacy?.coordinates && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${targetPharmacy.coordinates.lat},${targetPharmacy.coordinates.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                              >
                                <Navigation className="w-3.5 h-3.5 text-slate-600" />
                                <span>GPS</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {targetPharmacy && (
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold">{targetPharmacy.address}, {targetPharmacy.city}</span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                              Tiers-payant accepté : INAM, AMU, CNSS, SUNU, SANLAM, NSIA
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Step 2: Prescription / Drug Items */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <Calculator className="w-4 h-4 text-emerald-600" />
                              <span>2. Composition de l'Ordonnance / Médicaments</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">Ajoutez les produits prescrits ou recherchez dans le catalogue officiel Togo</p>
                          </div>

                          {/* Quick Drug Quick-Add Dropdown */}
                          <div className="flex items-center gap-2">
                            <select
                              onChange={(e) => {
                                const selected = drugs.find(d => d.id === e.target.value);
                                if (selected) {
                                  setCopayBasket(prev => [
                                    ...prev,
                                    {
                                      id: Date.now().toString(),
                                      name: `${selected.name} (${selected.dci || ''})`.trim(),
                                      price: selected.price || 1500,
                                      quantity: 1,
                                      isCovered: true
                                    }
                                  ]);
                                }
                                e.target.value = '';
                              }}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-700 max-w-[200px]"
                              defaultValue=""
                            >
                              <option value="" disabled>+ Ajouter depuis le répertoire</option>
                              {drugs.slice(0, 30).map(d => (
                                <option key={d.id} value={d.id}>
                                  {d.name} — {d.price?.toLocaleString()} FCFA
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Prescription Manual Line Adder */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                          <div className="sm:col-span-6 space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700">Nom du médicament / Forme :</label>
                            <input
                              type="text"
                              placeholder="Ex: Amoxicilline 1g Bte 14"
                              value={newBasketDrugName}
                              onChange={(e) => setNewBasketDrugName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                            />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700">Prix public (FCFA) :</label>
                            <input
                              type="number"
                              placeholder="Ex: 2200"
                              value={newBasketDrugPrice}
                              onChange={(e) => setNewBasketDrugPrice(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <button
                              onClick={() => {
                                if (!newBasketDrugName.trim() || !newBasketDrugPrice) return;
                                setCopayBasket(prev => [
                                  ...prev,
                                  {
                                    id: Date.now().toString(),
                                    name: newBasketDrugName.trim(),
                                    price: Number(newBasketDrugPrice) || 1000,
                                    quantity: 1,
                                    isCovered: newBasketDrugCovered
                                  }
                                ]);
                                setNewBasketDrugName('');
                                setNewBasketDrugPrice('');
                              }}
                              className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Ajouter ligne</span>
                            </button>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="p-3">Médicament Prescrit</th>
                                <th className="p-3 text-right">Prix Unitaire</th>
                                <th className="p-3 text-center">Quantité</th>
                                <th className="p-3 text-center">Pris en Charge</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 text-center">Suppr.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium">
                              {copayBasket.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80">
                                  <td className="p-3 font-bold text-slate-900">{item.name}</td>
                                  <td className="p-3 text-right font-mono text-slate-700">{item.price.toLocaleString()} F</td>
                                  <td className="p-3 text-center">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        onClick={() => {
                                          setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p));
                                        }}
                                        className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-black flex items-center justify-center hover:bg-slate-300 cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center font-black">{item.quantity}</span>
                                      <button
                                        onClick={() => {
                                          setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
                                        }}
                                        className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-black flex items-center justify-center hover:bg-slate-300 cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={item.isCovered}
                                      onChange={(e) => {
                                        setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, isCovered: e.target.checked } : p));
                                      }}
                                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                  </td>
                                  <td className="p-3 text-right font-bold text-slate-900 font-mono">
                                    {(item.price * item.quantity).toLocaleString()} F
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      onClick={() => {
                                        setCopayBasket(prev => prev.filter(p => p.id !== item.id));
                                      }}
                                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                                      title="Supprimer la ligne"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Step 3 & 4: Insurance & Transport Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Insurance Selection */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-emerald-600" />
                              3. Régime de Couverture Assurance
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              {simRate}% pris en charge
                            </span>
                          </div>

                          <div className="space-y-2">
                            <select
                              value={simScheme}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSimScheme(val);
                                const names: Record<string, string> = {
                                  INAM: 'INAM Togo (80%)',
                                  ALD: 'INAM ALD (100%)',
                                  AMU: 'AMU Togo (80%)',
                                  CNSS: 'CNSS Togo (80%)',
                                  SUNU: 'SUNU Assurances (85%)',
                                  SANLAM: 'SANLAM Togo (85%)',
                                  GTA: 'GTA Assurances (85%)',
                                  NSIA: 'NSIA Assurances (85%)',
                                  MUTUELLE: 'Mutuelle Santé (70%)',
                                  NONE: 'Sans Assurance (0%)'
                                };
                                setSimSchemeName(names[val] || val);
                                if (val === 'ALD') setSimRate(100);
                                else if (val === 'NONE') setSimRate(0);
                                else if (val === 'MUTUELLE') setSimRate(70);
                                else if (['SUNU', 'SANLAM', 'GTA', 'NSIA'].includes(val)) setSimRate(85);
                                else setSimRate(80);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700"
                            >
                              <option value="INAM">INAM Togo (80% Tiers Payant)</option>
                              <option value="ALD">INAM ALD Affection Longue Durée (100%)</option>
                              <option value="AMU">AMU Assurance Maladie Universelle Togo (80%)</option>
                              <option value="CNSS">CNSS Caisse Nationale Sécurité Sociale (80%)</option>
                              <option value="SUNU">SUNU Assurances (85%)</option>
                              <option value="SANLAM">SANLAM Togo (85%)</option>
                              <option value="GTA">GTA Assurances (85%)</option>
                              <option value="NSIA">NSIA Assurances (85%)</option>
                              <option value="MUTUELLE">Autre Mutuelle Santé (70%)</option>
                              <option value="NONE">Sans Assurance (Plein tarif 0%)</option>
                            </select>
                            <p className="text-[11px] text-slate-500">
                              Votre carte d'assuré en cours de validité et votre ordonnance originale doivent être présentées au guichet.
                            </p>
                          </div>
                        </div>

                        {/* Transport Mode Selection */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-teal-600" />
                              4. Frais de Trajet Aller-Retour
                            </span>
                            <span className="text-xs font-black text-slate-900 font-mono">
                              {transportCost.toLocaleString()} FCFA
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEstimateTransportType('ZEM');
                                setEstimateCustomTransportFee(500);
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                estimateTransportType === 'ZEM'
                                  ? 'bg-teal-50 border-teal-500 text-teal-900 font-black shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>🛵 Zémidjan</span>
                              <span className="text-[10px] text-slate-500 font-mono">~500 FCFA</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEstimateTransportType('TAXI');
                                setEstimateCustomTransportFee(1000);
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                estimateTransportType === 'TAXI'
                                  ? 'bg-teal-50 border-teal-500 text-teal-900 font-black shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>🚕 Taxi Ville</span>
                              <span className="text-[10px] text-slate-500 font-mono">~1 000 FCFA</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEstimateTransportType('GOZEM');
                                setEstimateCustomTransportFee(1500);
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                estimateTransportType === 'GOZEM'
                                  ? 'bg-teal-50 border-teal-500 text-teal-900 font-black shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>🚗 Gozem / VTC</span>
                              <span className="text-[10px] text-slate-500 font-mono">~1 500 FCFA</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEstimateTransportType('PERSO');
                                setEstimateCustomTransportFee(0);
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                estimateTransportType === 'PERSO'
                                  ? 'bg-teal-50 border-teal-500 text-teal-900 font-black shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>🚶 À pied / Perso</span>
                              <span className="text-[10px] text-slate-500 font-mono">0 FCFA</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Step 5: Financial Synthesis Breakdown */}
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white shadow-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                              <Receipt className="w-4 h-4" />
                              <span>Bilan Financier Pré-Trajet & Budget Total à Prévoir</span>
                            </div>
                            <div className="text-xs text-slate-300 font-medium">
                              Pharmacie cible : <strong className="text-white">{targetPharmacy?.name}</strong> ({targetPharmacy?.city})
                            </div>
                          </div>
                          <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300">
                            {copayBasket.length} produit(s) prescrit(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[11px] text-slate-400 font-bold">Total Ordonnance</div>
                            <div className="text-lg font-black font-mono text-white mt-0.5">
                              {totalDrugsPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">FCFA</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-between">
                              <span>Pris en charge ({simRate}%)</span>
                            </div>
                            <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                              -{insuranceCoveredAmount.toLocaleString()} <span className="text-xs font-normal text-emerald-300">FCFA</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                            <div className="text-[11px] text-amber-300 font-bold">Reste en Caisse</div>
                            <div className="text-lg font-black font-mono text-amber-300 mt-0.5">
                              {patientDrugRemaining.toLocaleString()} <span className="text-xs font-normal text-amber-200">FCFA</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30">
                            <div className="text-[11px] text-teal-300 font-bold">Frais Déplacement</div>
                            <div className="text-lg font-black font-mono text-teal-300 mt-0.5">
                              +{transportCost.toLocaleString()} <span className="text-xs font-normal text-teal-200">FCFA</span>
                            </div>
                          </div>
                        </div>

                        {/* Grand Total Highlight */}
                        <div className="p-4 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
                              Budget Global Net à Emporter :
                            </div>
                            <div className="text-xs text-slate-300 font-medium">
                              (Ticket modérateur pharmacie + frais de transport aller-retour)
                            </div>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                            {grandTotal.toLocaleString()} <span className="text-sm font-semibold text-emerald-200">FCFA</span>
                          </div>
                        </div>

                        {/* Action Buttons: WhatsApp Quote & Phone Call */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              if (!targetPharmacy) return;
                              const drugLines = copayBasket
                                .map(i => `- ${i.name} (Qté: ${i.quantity}, Prix: ${i.price * i.quantity} F)`)
                                .join('\n');
                              const text = `Bonjour ${targetPharmacy.name},\nJe prépare mon déplacement vers votre officine. Pouvez-vous me confirmer la disponibilité des médicaments suivants :\n\n${drugLines}\n\n• Régime Assurance : ${simSchemeName} (${simRate}%)\n• Total estimé ordonnance : ${totalDrugsPrice} FCFA\n• Reste à charge estimé : ${patientDrugRemaining} FCFA\n\nMerci d'avance pour votre confirmation.`;
                              
                              const phoneClean = (targetPharmacy.phone || '+22890000000').replace(/[^0-9]/g, '');
                              window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                          >
                            <Send className="w-4 h-4" />
                            <span>Envoyer le devis par WhatsApp à la pharmacie</span>
                          </button>

                          {targetPharmacy?.phone && (
                            <a
                              href={`tel:${targetPharmacy.phone}`}
                              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20"
                            >
                              <Phone className="w-4 h-4 text-emerald-400" />
                              <span>Appeler avant de partir</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Passerelle IA Santé & Secret Médical (Connected Citizen Only) */}
            {citoyenSection === 'ai_privacy_gateway' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                      <span>Passerelle IA Santé & Analyse d'Ordonnance Sécurisée</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Espace privé réservé aux citoyens connectés : analyse confidentielle avec anonymisation stricte préalable (APDP Togo / Gemini).
                    </p>
                  </div>
                </div>

                <AiPrivacyGatewayView />
              </div>
            )}

            {/* 2. Citoyen Multi-Insurance Simulation */}
            {citoyenSection === 'inam_simulation' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-emerald-600" />
                      <span>Simuler Prise en Charge Assurance (Togo)</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Simulez instantanément le taux de remboursement officiel de vos médicaments selon votre régime d'assurance au Togo.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 self-start">
                    Conventions & Assurances Togo
                  </span>
                </div>

                {/* Scheme Selector (Public & Private Insurers in Togo) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">Sélectionnez votre Organisme / Régime d'Assurance :</label>
                    <span className="text-[11px] font-bold text-emerald-700">Organisme sélectionné : {simSchemeName}</span>
                  </div>

                  {/* Public & Universal Regimes */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">1. Régimes Nationaux & Publics</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { key: 'INAM', name: 'INAM Togo', label: 'INAM Général', rate: 80, desc: 'Fonctionnaires & Agents de l\'État' },
                        { key: 'ALD', name: 'INAM ALD (100%)', label: 'INAM ALD (100%)', rate: 100, desc: 'Affection Longue Durée' },
                        { key: 'AMU', name: 'AMU Togo', label: 'AMU Togo (80%)', rate: 80, desc: 'Assurance Maladie Universelle' },
                        { key: 'CNSS', name: 'CNSS Togo', label: 'CNSS Togo (80%)', rate: 80, desc: 'Salariés Secteur Privé' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setSimScheme(item.key);
                            setSimSchemeName(item.name);
                            setSimRate(item.rate);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            simScheme === item.key
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-extrabold text-xs text-slate-900">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                          <div className="mt-2 text-xs font-black text-emerald-700">{item.rate}% Couvert</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Private Insurers & Third-Party Administrators in Togo */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">2. Compagnies Privées & Tiers Payant (Togo)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { key: 'SUNU', name: 'SUNU Assurances Togo', label: 'SUNU Assurances', rate: 80, desc: 'Police Santé Entreprise / Individuel' },
                        { key: 'SANLAM', name: 'SANLAM Togo', label: 'SANLAM (ex-Saham)', rate: 80, desc: 'Assurance Santé Privée' },
                        { key: 'GTA', name: 'GTA Assurances Togo', label: 'GTA Assurances', rate: 80, desc: 'Compagnie d\'Assurance Togo' },
                        { key: 'NSIA', name: 'NSIA Assurances Togo', label: 'NSIA Assurances', rate: 80, desc: 'Groupe NSIA Santé' },
                        { key: 'ASCOMA', name: 'ASCOMA Santé Togo', label: 'ASCOMA Togo', rate: 80, desc: 'Gestionnaire Tiers Payant' },
                        { key: 'OLEA', name: 'OLEA / Gras Savoye Togo', label: 'OLEA Santé', rate: 80, desc: 'Courtage & Tiers Payant' },
                        { key: 'FIDELIA', name: 'Fidelia Assurances Togo', label: 'FIDELIA Assurances', rate: 80, desc: 'Assurance Privée Togo' },
                        { key: 'MUTUELLE', name: 'Mutuelle de Santé', label: 'Autre Mutuelle', rate: 70, desc: 'Mutuelle Communautaire' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setSimScheme(item.key);
                            setSimSchemeName(item.name);
                            setSimRate(item.rate);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            simScheme === item.key
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-extrabold text-xs text-slate-900">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                          <div className="mt-2 text-xs font-black text-emerald-700">{item.rate}% Couvert</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contract Rate Selector for Private/Custom schemes */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-700 font-bold">
                      Ajuster le taux de prise en charge contractuel de votre police ({simSchemeName}) :
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[70, 80, 85, 90, 100].map((rateOption) => (
                        <button
                          key={rateOption}
                          onClick={() => setSimRate(rateOption)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                            simRate === rateOption
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {rateOption}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drug Selection & Price */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Médicament à Simuler
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Choisir dans la liste nationale ou saisir :</label>
                      <select
                        value={simDrugId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSimDrugId(val);
                          const found = drugs.find(d => d.id === val);
                          if (found) {
                            const estPrice = found.category === 'ANTIPALUDIQUE' ? 3200 : found.category === 'ANTALGIQUE' ? 850 : found.category === 'ANTIBIOTIQUE' ? 4500 : 2500;
                            setSimCustomPrice(estPrice);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="">-- Sélectionner un médicament courant au Togo --</option>
                        {drugs.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.dci})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Prix Public (FCFA) :</label>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={simCustomPrice}
                        onChange={(e) => setSimCustomPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700">Quantité de boîtes prescrites :</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSimQuantity(Math.max(1, simQuantity - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-sm">{simQuantity}</span>
                      <button
                        onClick={() => setSimQuantity(simQuantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown Cards */}
                {(() => {
                  const totalPrice = simCustomPrice * simQuantity;
                  const coveredAmount = Math.round(totalPrice * (simRate / 100));
                  const patientRemainingAmount = totalPrice - coveredAmount;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-xs font-bold text-slate-500">Prix Total Ordonnance</div>
                          <div className="text-xl font-black text-slate-900 mt-1">
                            {totalPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">FCFA</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{simQuantity} boîte(s) × {simCustomPrice.toLocaleString()} FCFA</div>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                          <div className="text-xs font-bold text-emerald-800 flex items-center justify-between">
                            <span>Pris en Charge {simSchemeName} ({simRate}%)</span>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          </div>
                          <div className="text-xl font-black text-emerald-900 mt-1">
                            {coveredAmount.toLocaleString()} <span className="text-xs text-emerald-700 font-normal">FCFA</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 mt-0.5">Remboursé directement à l'officine (Tiers Payant)</div>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                          <div className="text-xs font-bold text-amber-800 flex items-center justify-between">
                            <span>Reste à Charge Patient</span>
                            <Receipt className="w-3.5 h-3.5 text-amber-700" />
                          </div>
                          <div className="text-xl font-black text-amber-950 mt-1">
                            {patientRemainingAmount.toLocaleString()} <span className="text-xs text-amber-700 font-normal">FCFA</span>
                          </div>
                          <div className="text-[10px] text-amber-800 mt-0.5">Ticket modérateur à régler au comptoir</div>
                        </div>
                      </div>

                      {/* Instructions Note */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 font-bold">Formalités en Pharmacie au Togo :</strong> Présentez votre ordonnance médicale conforme en cours de validité ainsi que votre carte d'assuré ({simSchemeName}) avec photo ou bon de prise en charge pour bénéficier immédiatement du tiers payant au guichet.
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => setCitoyenSection('copay_calculator')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Calculer pour plusieurs médicaments (Ordonnance complète)</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 3. Citoyen Copay Calculator (Calculateur Reste à Charge) */}
            {citoyenSection === 'copay_calculator' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Calculator className="w-6 h-6 text-emerald-600" />
                      <span>Calculateur Reste à Charge (Ticket Modérateur)</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Calculez précisément ce que vous devez payer au comptoir de l'officine pour l'ensemble de vos médicaments prescrits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={simScheme}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSimScheme(val);
                        const names: Record<string, string> = {
                          INAM: 'INAM Togo',
                          ALD: 'INAM ALD (100%)',
                          AMU: 'AMU Togo',
                          CNSS: 'CNSS Togo',
                          SUNU: 'SUNU Assurances',
                          SANLAM: 'SANLAM Togo',
                          GTA: 'GTA Assurances',
                          NSIA: 'NSIA Assurances',
                          ASCOMA: 'ASCOMA Santé',
                          OLEA: 'OLEA Santé',
                          MUTUELLE: 'Mutuelle'
                        };
                        setSimSchemeName(names[val] || val);
                        if (val === 'ALD') setSimRate(100);
                        else if (val === 'MUTUELLE') setSimRate(70);
                        else setSimRate(80);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700"
                    >
                      <option value="INAM">INAM (80%)</option>
                      <option value="ALD">INAM ALD (100%)</option>
                      <option value="AMU">AMU Togo (80%)</option>
                      <option value="CNSS">CNSS Togo (80%)</option>
                      <option value="SUNU">SUNU Assurances</option>
                      <option value="SANLAM">SANLAM Togo</option>
                      <option value="GTA">GTA Assurances</option>
                      <option value="NSIA">NSIA Assurances</option>
                      <option value="ASCOMA">ASCOMA Tiers-Payant</option>
                      <option value="OLEA">OLEA / Gras Savoye</option>
                      <option value="MUTUELLE">Autre Mutuelle</option>
                    </select>

                    <button
                      onClick={() => {
                        setCopayBasket([
                          { id: Date.now().toString(), name: 'Nouveau médicament prescrit', price: 2000, quantity: 1, isCovered: true }
                        ]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {/* Quick Add Prescription Item */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Ajouter une ligne d'ordonnance
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    <div className="sm:col-span-6 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">Nom du médicament / Posologie</label>
                      <input
                        type="text"
                        placeholder="Ex: Amoxicilline 500mg Gélules (Bte 24)"
                        value={newBasketDrugName}
                        onChange={(e) => setNewBasketDrugName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">Prix Unitaire (FCFA)</label>
                      <input
                        type="number"
                        placeholder="Ex: 2400"
                        value={newBasketDrugPrice}
                        onChange={(e) => setNewBasketDrugPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        onClick={() => {
                          if (!newBasketDrugName.trim() || !newBasketDrugPrice) return;
                          setCopayBasket(prev => [
                            ...prev,
                            {
                              id: Date.now().toString(),
                              name: newBasketDrugName.trim(),
                              price: Number(newBasketDrugPrice) || 1000,
                              quantity: 1,
                              isCovered: newBasketDrugCovered
                            }
                          ]);
                          setNewBasketDrugName('');
                          setNewBasketDrugPrice('');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Prescription Basket Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Médicament Prescrit</th>
                        <th className="p-3 text-right">Prix Unitaire</th>
                        <th className="p-3 text-center">Qté</th>
                        <th className="p-3 text-center">Couvert ({simSchemeName} {simRate}%)</th>
                        <th className="p-3 text-right">Total Ligne</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {copayBasket.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 text-right font-mono">{item.price.toLocaleString()} FCFA</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p));
                                }}
                                className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer hover:bg-slate-300"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold">{item.quantity}</span>
                              <button
                                onClick={() => {
                                  setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
                                }}
                                className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer hover:bg-slate-300"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setCopayBasket(prev => prev.map(p => p.id === item.id ? { ...p, isCovered: !p.isCovered } : p));
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                                item.isCovered ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.isCovered ? `OUI (${simRate}%)` : 'NON (0%)'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900 font-mono">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setCopayBasket(prev => prev.filter(p => p.id !== item.id));
                              }}
                              className="p-1 rounded hover:bg-rose-50 text-rose-600 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Grand Total Breakdown Card - Clean Light Theme */}
                {(() => {
                  const basketTotal = copayBasket.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                  const coveredTotal = copayBasket.reduce((sum, i) => i.isCovered ? sum + (i.price * i.quantity) : sum, 0);
                  const coveredShare = Math.round(coveredTotal * (simRate / 100));
                  const patientOutPocket = basketTotal - coveredShare;

                  return (
                    <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 text-slate-900 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="font-black text-sm text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                          <span>Récapitulatif Ticket Modérateur Officine ({simSchemeName})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          Taux {simRate}% appliqué
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="text-[11px] text-slate-500 font-bold">Total Facture Pharmacie</div>
                          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                            {basketTotal.toLocaleString()} <span className="text-xs text-slate-500 font-normal">FCFA</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="text-[11px] text-emerald-800 font-bold">Part Prise en Charge ({simSchemeName})</div>
                          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
                            - {coveredShare.toLocaleString()} <span className="text-xs text-emerald-700 font-normal">FCFA</span>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="text-[11px] text-amber-800 font-black uppercase tracking-wider">Net Reste à Payer (Patient)</div>
                          <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">
                            {patientOutPocket.toLocaleString()} <span className="text-sm text-amber-800 font-normal">FCFA</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-slate-600 text-[11px] font-medium">
                          Montant à acquitter en espèces, TMoney, Flooz ou Carte bancaire au guichet de l'officine de garde.
                        </span>
                        <button
                          onClick={() => setIsSimulatorModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Version Détaillée</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* 4. Citoyen Profile */}
            {citoyenSection === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mon Profil & Couverture Santé (Togo)</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Vos coordonnées et informations d'assurance (INAM, CNSS, AMU, SUNU, SANLAM, GTA, NSIA, Mutuelles) pour le calcul automatique en pharmacie.
                  </p>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Nom & Prénoms</label>
                      <input
                        type="text"
                        value={citoyenData.name}
                        onChange={(e) => setCitoyenData({ ...citoyenData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Téléphone Mobile</label>
                      <input
                        type="text"
                        value={citoyenData.phone}
                        onChange={(e) => setCitoyenData({ ...citoyenData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Ville / Quartier</label>
                      <input
                        type="text"
                        value={`${citoyenData.city} - ${citoyenData.quarter}`}
                        onChange={(e) => setCitoyenData({ ...citoyenData, quarter: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Organisme d'Assurance / Mutuelle</label>
                      <select
                        value={citoyenData.insuranceCompany}
                        onChange={(e) => {
                          const val = e.target.value;
                          const names: Record<string, string> = {
                            INAM: 'INAM Togo',
                            AMU: 'AMU Togo (Universelle)',
                            CNSS: 'CNSS Togo',
                            SUNU: 'SUNU Assurances Togo',
                            SANLAM: 'SANLAM Togo (ex-Saham)',
                            GTA: 'GTA Assurances Togo',
                            NSIA: 'NSIA Assurances Togo',
                            ASCOMA: 'ASCOMA Santé Togo',
                            OLEA: 'OLEA Santé Togo (Gras Savoye)',
                            FIDELIA: 'Fidelia Assurances Togo',
                            MUTUELLE: 'Mutuelle de Santé',
                            NONE: 'Sans Assurance (Paiement direct)'
                          };
                          setCitoyenData({
                            ...citoyenData,
                            insuranceCompany: val,
                            insuranceName: names[val] || val
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                      >
                        <optgroup label="Régimes Publics & Obligatoires">
                          <option value="INAM">INAM Togo (Institut National d'Assurance Maladie)</option>
                          <option value="AMU">AMU Togo (Assurance Maladie Universelle)</option>
                          <option value="CNSS">CNSS Togo (Caisse Nationale de Sécurité Sociale)</option>
                        </optgroup>
                        <optgroup label="Compagnies d'Assurances Privées (Togo)">
                          <option value="SUNU">SUNU Assurances Togo</option>
                          <option value="SANLAM">SANLAM Togo (ex-Saham Assurance)</option>
                          <option value="GTA">GTA Assurances Togo</option>
                          <option value="NSIA">NSIA Assurances Togo</option>
                          <option value="FIDELIA">FIDELIA Assurances Togo</option>
                        </optgroup>
                        <optgroup label="Gestionnaires Tiers-Payant & Mutuelles">
                          <option value="ASCOMA">ASCOMA Santé Togo (Tiers-Payant)</option>
                          <option value="OLEA">OLEA Santé Togo (Gras Savoye)</option>
                          <option value="MUTUELLE">Autre Mutuelle de Santé / Professionnelle</option>
                          <option value="NONE">Sans Assurance (Paiement direct 100%)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Taux de Prise en Charge Contractuel (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={citoyenData.insuranceRate}
                        onChange={(e) => setCitoyenData({ ...citoyenData, insuranceRate: Number(e.target.value) || 80 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">N° d'Assuré / Police / Matricule</label>
                      <input
                        type="text"
                        placeholder="Ex: INAM-ASS-2023-45920 ou POL-SUNU-8921"
                        value={citoyenData.insuranceNumber}
                        onChange={(e) => setCitoyenData({ ...citoyenData, insuranceNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer hover:bg-emerald-700"
                    >
                      Mettre à jour mon profil santé
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 5. Citoyen Favorites */}
            {citoyenSection === 'favorites' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mes Pharmacies Favorites</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Vos officines de quartier préférées avec statut de garde en direct.
                  </p>
                </div>

                <div className="space-y-3">
                  {favoritePharmacies.map((fav) => (
                    <div key={fav.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          <span>{fav.name}</span>
                          {fav.isGarde && (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black animate-pulse">
                              DE GARDE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{fav.quarter}</div>
                      </div>
                      <a href={`tel:${fav.phone}`} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{fav.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Citoyen Vigilance */}
            {citoyenSection === 'vigilance' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mes Signalements Citoyens</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Vos contributions pour la transparence et l'exactitude des gardes au Togo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="font-bold">Aucun signalement en attente</div>
                  <div className="text-[11px] mt-1 text-emerald-700">
                    Merci pour votre participation citoyenne au respect des horaires et des gardes.
                  </div>
                </div>
              </div>
            )}

            {/* 7. Citoyen Vie Privée & Bouclier APDP Togo */}
            {citoyenSection === 'privacy_security' && (
              <PrivacyApdpSecurityPanel 
                userRole="CITOYEN"
                userName={currentUser?.name || citoyenData.name}
                userEmail={currentUser?.email || citoyenData.email}
              />
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ROLE: ADMIN (Cockpit de Gestion Pro, Radar Live, Besoins Utilisateurs, Gouvernance) */}
      {/* ========================================================================= */}
      {activeRole === 'ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Admin Navigation Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 truncate">Supervision Centrale</div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Console Nationale Togo</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">
                Pilotage Stratégique
              </div>
              
              <button
                onClick={() => setAdminSection('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'overview'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Cockpit & Métriques</span>
                </div>
                {adminSection === 'overview' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setAdminSection('live_radar')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'live_radar'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Radar en Direct</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setAdminSection('user_needs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'user_needs'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Besoins & Demandes</span>
                </div>
                {adminFeedbacks.filter(f => f.status === 'SUBMITTED').length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                    {adminFeedbacks.filter(f => f.status === 'SUBMITTED').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminSection('roles')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'roles'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Rôles & Accréditations</span>
                </div>
                {adminSection === 'roles' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setAdminSection('audit')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'audit'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Journal d'Audit</span>
                </div>
                {adminSection === 'audit' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setAdminSection('monetization')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'monetization'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Régie & Monétisation</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  Pub & CA
                </span>
              </button>

              <button
                onClick={() => setAdminSection('actions')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  adminSection === 'actions'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-300 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Actions & Données</span>
                </div>
                {adminSection === 'actions' && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {/* Quick Status Pill - Clean Light Theme */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Passerelle ONPT Togo</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 100% Synchro
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Hub Tiers-Payant AMU/INAM</span>
                <span className="text-emerald-700 font-bold">Connecté (28ms)</span>
              </div>
            </div>
          </div>

          {/* Admin Main Content Panel */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 min-h-[600px] space-y-6">

            {/* Toast feedback */}
            {adminToast && (
              <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-lg animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{adminToast}</span>
              </div>
            )}

            {/* 1. OVERVIEW — Cockpit & Métriques Nationales Pro */}
            {adminSection === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        Gouvernance Santé Togo
                      </span>
                      <span className="text-xs text-slate-400">• ONPT & Ministère de la Santé</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Cockpit de Gestion & Supervision Nationale
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Vue consolidée des 210 officines, des tours de garde et de l'accès aux soins au Togo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAdminLiveSyncRunning(true);
                        setTimeout(() => {
                          setAdminLiveSyncRunning(false);
                          showAdminToast('Synchronisation nationale des gardes et stocks effectuée avec succès !');
                        }, 1200);
                      }}
                      disabled={adminLiveSyncRunning}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${adminLiveSyncRunning ? 'animate-spin' : ''}`} />
                      <span>{adminLiveSyncRunning ? 'Synchro en cours...' : 'Actualiser le Réseau'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Officines Référencées</span>
                      <Building2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">210</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">100% Ordre National (ONPT)</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800">De Garde ce Week-end</span>
                      <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">48 Officines</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">24h/24 & Nuit certifiées</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Recherches / Semaine</span>
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">14,820</div>
                    <div className="text-[11px] text-blue-700 font-bold mt-1">+22.4% vs mois précédent</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-800">Simulations Assurances</span>
                      <Receipt className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-1">1,420 / j</div>
                    <div className="text-[11px] text-amber-700 font-bold mt-1">INAM, AMU, CNSS, SUNU</div>
                  </div>
                </div>

                {/* Regional Health & Guard Coverage */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Couverture Territoriale par Région du Togo</span>
                    </h3>
                    <span className="text-xs text-slate-500">5 Régions Sanitaires</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { region: 'Maritime & Grand Lomé', total: 142, garde: 32, dispo: '93%', color: 'emerald', cities: 'Lomé, Tsévié, Aného, Vogan' },
                      { region: 'Région des Plateaux', total: 28, garde: 6, dispo: '89%', color: 'blue', cities: 'Kpalimé, Atakpamé, Notsé' },
                      { region: 'Région Centrale', total: 18, garde: 4, dispo: '86%', color: 'purple', cities: 'Sokodé, Tchamba, Sotouboua' },
                      { region: 'Région de la Kara', total: 14, garde: 4, dispo: '87%', color: 'amber', cities: 'Kara, Niamtougou, Bafilo' },
                      { region: 'Région des Savanes', total: 8, garde: 2, dispo: '82%', color: 'rose', cities: 'Dapaong, Mango, Cinkassé' },
                    ].map((reg) => (
                      <div key={reg.region} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-extrabold text-xs text-slate-900">{reg.region}</div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            {reg.garde} en garde
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>{reg.total} officines</span>
                          <span className="font-bold text-slate-800">Dispo stocks: {reg.dispo}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">Villes: {reg.cities}</div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${(reg.garde / (reg.total || 1)) * 100 * 3}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Gateways & Health Status - Clean Light Theme */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-600" />
                      <span>Statut des Passerelles & Systèmes Connectés</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Tous les services sont opérationnels
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500">Passerelle Logiciels Caisse (LGO)</div>
                      <div className="font-bold text-slate-900 mt-1">18 Officines connectées</div>
                      <div className="text-[10px] text-emerald-700 mt-1 font-medium">WinPharma, SmartPharma, LGO Togo</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500">Serveur DPML Togo</div>
                      <div className="font-bold text-slate-900 mt-1">Opérationnel • 24ms</div>
                      <div className="text-[10px] text-slate-500 mt-1">Alertes & rappels de lots</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500">Passerelle Mobile Money</div>
                      <div className="font-bold text-slate-900 mt-1">TMoney & Flooz</div>
                      <div className="text-[10px] text-emerald-700 mt-1 font-medium">Paiements officines actifs</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500">Hub Tiers-Payant Assurances</div>
                      <div className="font-bold text-slate-900 mt-1">INAM, AMU, SUNU, SANLAM</div>
                      <div className="text-[10px] text-emerald-700 mt-1 font-medium">11 Organismes intégrés</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LIVE RADAR — "Un œil sur ce qui se passe sur l'app" */}
            {adminSection === 'live_radar' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <span>Radar en Direct • Activité Temps Réel</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Surveillance instantanée des recherches de garde nocturne, requêtes de médicaments d'urgence et flux citoyens.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Flux Live Connecté</span>
                  </span>
                </div>

                {/* Anomaly Detection Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Détection Zone en Tension Nocturne</span>
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed">
                      <strong>Zanguéra / Mission Tové :</strong> 62 recherches de garde depuis 21h sans officine ouverte à moins de 7.5 km.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-amber-700">Recommandation : Mobiliser garde d'appui Agoè</span>
                      <button
                        onClick={() => showAdminToast('Notification envoyée aux officines du secteur Nord-Ouest Lomé.')}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer"
                      >
                        Alerter Secteur
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                      <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Pic Inhabituel de Recherche Médicament</span>
                    </div>
                    <p className="text-xs text-rose-800/90 leading-relaxed">
                      <strong>Sérum Antivenimeux Polyvalent :</strong> +310% de requêtes enregistrées dans les Savanes (Dapaong, Mango).
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-rose-700">Stock régional déclaré : 14 flacons</span>
                      <button
                        onClick={() => showAdminToast('Demande de réapprovisionnement transmise à la CAMEG Togo.')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Notifier CAMEG
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Stream of Activity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Dernières Recherches & Interactions En Direct</span>
                    </h3>
                    <span className="text-xs text-slate-400">Mise à jour en continu</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { time: 'Il y a 1 min', query: 'Coartem 80/480mg (Paludisme)', city: 'Lomé - Tokoin', type: 'Recherche Médicament', status: 'Trouvé (4 officines)', isSuccess: true },
                      { time: 'Il y a 3 min', query: 'Pharmacie de garde 24/24', city: 'Kara - Kozah', type: 'Garde Nuit', status: 'Itinéraire demandé', isSuccess: true },
                      { time: 'Il y a 5 min', query: 'Insuline Mixtard 100 UI', city: 'Sokodé', type: 'Recherche Tension', status: 'Stock Faible (1 officine)', isSuccess: false },
                      { time: 'Il y a 7 min', query: 'Simulation Ticket Modérateur INAM 80%', city: 'Lomé - Agoè', type: 'Tiers Payant', status: 'Calcul 4,500 FCFA', isSuccess: true },
                      { time: 'Il y a 10 min', query: 'Paracétamol Sirop 120mg pédiatrique', city: 'Atakpamé', type: 'Recherche Médicament', status: 'Trouvé (2 officines)', isSuccess: true },
                      { time: 'Il y a 14 min', query: 'Sérum Anti-Venimeux Fav-Afrique', city: 'Dapaong', type: 'Urgence Vitale', status: 'Alerte stock transmise', isSuccess: false }
                    ].map((event, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[11px] font-mono text-slate-400 shrink-0">{event.time}</span>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block truncate">{event.query}</span>
                            <span className="text-[11px] text-slate-500">{event.city} • {event.type}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            event.isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active DPML Health Alerts */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Alertes Sanitaires Actives du Ministère & DPML Togo ({adminSanitaryAlerts.filter(a => a.status === 'ACTIVE').length})</span>
                    </h3>
                    <button
                      onClick={() => setAdminNewAlertModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publier Alerte Flash</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {adminSanitaryAlerts.filter(a => a.status === 'ACTIVE').map((alert) => (
                      <div key={alert.id} className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                                {alert.severity}
                              </span>
                              <span className="font-black text-rose-950 text-sm">{alert.title}</span>
                            </div>
                            <div className="text-[11px] text-rose-800 mt-1">
                              Source: {alert.source} • Région: {alert.region} • Publié le {alert.publishedAt}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              archiveSanitaryAlert(alert.id);
                              reloadAdminData();
                              showAdminToast('Alerte sanitaire archivée.');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-700 font-bold hover:bg-rose-100 cursor-pointer shrink-0 text-[11px]"
                          >
                            Archiver
                          </button>
                        </div>

                        <p className="text-slate-700">{alert.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. USER NEEDS & DEMAND ANALYTICS — "Ce dont les utilisateurs ont besoin" */}
            {adminSection === 'user_needs' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span>Besoins des Utilisateurs & Demandes Sanitaires</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Analyse des médicaments les plus recherchés en tension, identification des déserts de garde et modération de la boîte à retours.
                  </p>
                </div>

                {/* Module 1: Top Shortages & Tension Drugs Demanded by Patients */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-600" />
                        <span>Baromètre des Médicaments les Plus Recherchés en Tension au Togo</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Basé sur les 14,820 requêtes citoyennes sans stock immédiat ou nécessitant commande
                      </p>
                    </div>
                    <button
                      onClick={() => showAdminToast('Rapport de tension exporté pour la CAMEG et les grossistes répartiteurs (TEDIS, COPHARMA, UBIPHARM).')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exporter Rapport CAMEG</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { drug: 'Insuline Mixtard 100UI/ml (Flacon)', requests: 412, tension: 'CRITIQUE', regions: 'Grand Lomé, Kara', note: 'Demande quotidienne diabète, rupture importateur' },
                      { drug: 'Paracétamol Sirop 120mg / 5ml (Pédiatrique)', requests: 388, tension: 'ÉLEVÉE', regions: 'Maritime, Plateaux', note: 'Forte demande nourrissons en saison des pluies' },
                      { drug: 'Coartem Dispersible 20/120mg (Enfants)', requests: 354, tension: 'ÉLEVÉE', regions: 'Toutes les régions', note: 'Paludisme simple enfant, pic épidémique' },
                      { drug: 'Sérum Antivenimeux Polyvalent Fav-Afrique', requests: 189, tension: 'CRITIQUE', regions: 'Savanes, Centrale', note: 'Morsures de serpents rurales, urgence vitale' },
                      { drug: 'Ventoline 100µg Solution Aérosol', requests: 164, tension: 'MODÉRÉE', regions: 'Lomé, Kpalimé', note: 'Asthme et crises respiratoires' },
                      { drug: 'Soluté Ringer Lactate 500ml Poche', requests: 142, tension: 'MODÉRÉE', regions: 'Kara, Savanes', note: 'Réhydratation d\'urgence maternité/soins' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block">{item.drug}</span>
                            <span className="text-[10px] text-slate-500">Régions concernées: {item.regions}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                            item.tension === 'CRITIQUE'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.tension === 'ÉLEVÉE'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.tension}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                          <span className="text-slate-600 text-[11px]">{item.note}</span>
                          <span className="font-bold text-slate-900 shrink-0">{item.requests} requêtes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module 2: Night Guard Deserts Demanded by Users - Clean Light Theme */}
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-900 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-700" />
                      <span>Zones de Forte Demande en Garde Nocturne (Déserts Identifiés)</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      Basé sur géolocalisations citoyens 20h-06h
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                      <div className="font-extrabold text-slate-900">Zanguéra & Mission Tové</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">84 recherches / nuit</div>
                      <div className="text-[10px] text-slate-500 mt-1">Distance moyenne officine garde: 8.2 km</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                      <div className="font-extrabold text-slate-900">Baguida & Avépozo</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">67 recherches / nuit</div>
                      <div className="text-[10px] text-slate-500 mt-1">Besoin d'alternance garde bord de mer</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                      <div className="font-extrabold text-slate-900">Mango & Cinkassé</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">43 recherches / nuit</div>
                      <div className="text-[10px] text-slate-500 mt-1">Besoin d'astreinte transfrontalière</div>
                    </div>
                  </div>
                </div>

                {/* Module 3: Boîte à Idées & Retours d'Expérience Usagers */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>Demandes & Boîte à Idées des Utilisateurs ({adminFeedbacks.length})</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Traitement des retours citoyens et pharmaciens avec publication de réponses officielles
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'IMPLEMENTED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setAdminFeedbackFilter(st)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            adminFeedbackFilter === st
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'ALL' && 'Tous'}
                          {st === 'SUBMITTED' && 'Reçus'}
                          {st === 'UNDER_REVIEW' && 'À l\'étude'}
                          {st === 'PLANNED' && 'Prévus'}
                          {st === 'IMPLEMENTED' && 'Déployés'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {adminFeedbacks
                      .filter(f => adminFeedbackFilter === 'ALL' || f.status === adminFeedbackFilter)
                      .map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                                  {item.category}
                                </span>
                                <span className="text-[11px] font-bold text-amber-600">
                                  ★ {item.rating}/5
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Par <strong>{item.authorName}</strong> ({item.authorRole || 'Citoyen'}) • {item.createdAt} • {item.upvotes} soutiens
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={item.status}
                                onChange={(e) => {
                                  updateAppFeedbackStatus(item.id, e.target.value as any);
                                  reloadAdminData();
                                  showAdminToast(`Statut mis à jour: ${e.target.value}`);
                                }}
                                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                              >
                                <option value="SUBMITTED">Reçu</option>
                                <option value="UNDER_REVIEW">À l'étude</option>
                                <option value="PLANNED">Prévu v1.2</option>
                                <option value="IMPLEMENTED">Déployé</option>
                                <option value="DECLINED">Non retenu</option>
                              </select>

                              <button
                                onClick={() => setAdminReplyingId(adminReplyingId === item.id ? null : item.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Répondre</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm('Supprimer ce retour ?')) {
                                    deleteAppFeedback(item.id);
                                    reloadAdminData();
                                    showAdminToast('Retour supprimé.');
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Existing Admin Response */}
                          {item.adminResponse && (
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{item.adminResponse.author}</span>
                                <span className="text-[10px] text-slate-500 font-normal">({item.adminResponse.respondedAt})</span>
                              </div>
                              <p className="text-slate-700">{item.adminResponse.message}</p>
                            </div>
                          )}

                          {/* Reply Form */}
                          {adminReplyingId === item.id && (
                            <div className="pt-2 space-y-2 border-t border-slate-200">
                              <textarea
                                rows={2}
                                placeholder="Rédiger la réponse officielle de l'équipe Galenis Togo..."
                                value={adminReplyText}
                                onChange={(e) => setAdminReplyText(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => { setAdminReplyingId(null); setAdminReplyText(''); }}
                                  className="px-3 py-1 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-lg cursor-pointer"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={() => {
                                    if (!adminReplyText.trim()) return;
                                    updateAppFeedbackStatus(item.id, 'UNDER_REVIEW', {
                                      author: 'Direction Galenis Togo',
                                      message: adminReplyText.trim()
                                    });
                                    setAdminReplyingId(null);
                                    setAdminReplyText('');
                                    reloadAdminData();
                                    showAdminToast('Réponse officielle publiée !');
                                  }}
                                  className="px-3.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Publier</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ROLES & ACCREDITATIONS ONPT */}
            {adminSection === 'roles' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Gouvernance des Rôles & Accréditations ONPT
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Validation des pharmaciens titulaires, agrément des développeurs d'APIs et gestion des privilèges santé.
                    </p>
                  </div>

                  <button
                    onClick={() => setAdminNewInviteModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Inviter un Professionnel</span>
                  </button>
                </div>

                {/* Directory of Accredited Accounts */}
                <div className="space-y-3">
                  {[
                    {
                      name: 'Dr. Mensah Koffi',
                      role: 'PHARMACIEN',
                      roleLabel: 'Pharmacien Titulaire ONPT',
                      org: 'Pharmacie Populaire Tokoin (Lomé)',
                      badge: 'N° ONPT: TG-2018-042',
                      status: 'Accrédité ONPT',
                      statusColor: 'emerald',
                      email: 'dr.mensah@pharmacie-populaire-tokoin.tg'
                    },
                    {
                      name: 'Dev Health Togo',
                      role: 'DEVELOPPEUR',
                      roleLabel: 'Intégrateur Logiciel LGO',
                      org: 'Passerelle SmartPharma / WinPharma Togo',
                      badge: 'Clé Prod: pdt_live_••••8921',
                      status: 'Certifié API',
                      statusColor: 'blue',
                      email: 'integration@smartpharma.tg'
                    },
                    {
                      name: 'Dr. Afiwa Lawson',
                      role: 'PHARMACIEN',
                      roleLabel: 'Pharmacienne Adjointe',
                      org: 'Pharmacie Agoè Assiyéyé',
                      badge: 'N° ONPT: TG-2021-119',
                      status: 'Accrédité ONPT',
                      statusColor: 'emerald',
                      email: 'dr.lawson@pharmacie.tg'
                    },
                    {
                      name: 'Dr. Komla Agbessi',
                      role: 'DATA_ADMIN',
                      roleLabel: 'Délégué Régional DGS / DPML',
                      org: 'Direction Générale de la Santé (Région Centrale)',
                      badge: 'Matricule MS: DGS-RC-04',
                      status: 'Officiel Ministère',
                      statusColor: 'purple',
                      email: 'k.agbessi@sante.gouv.tg'
                    }
                  ].map((acc, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800 text-sm shadow-2xs">
                          {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{acc.name}</span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {acc.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">{acc.roleLabel} • {acc.org}</div>
                          <div className="text-[11px] font-mono text-slate-400">{acc.badge} • {acc.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => showAdminToast(`Accréditation confirmée pour ${acc.name}.`)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                        >
                          Vérifier
                        </button>
                        <button
                          onClick={() => showAdminToast(`Droits mis à jour pour ${acc.name}.`)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                        >
                          Gérer Droits
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. AUDIT LOGS — Journal d'Audit */}
            {adminSection === 'audit' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Journal d'Audit & Traçabilité Réglementaire
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Historique certifié et infalsifiable des actions administratives et modifications sanitaires.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + adminActivityLogs.map(l => `${l.timestamp},${l.type},${l.title},${l.userRole}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `audit_log_galenis_togo_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      showAdminToast('Journal d\'audit exporté au format CSV.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {adminActivityLogs.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                          <span className="font-extrabold text-slate-900">{log.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            {log.type}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.description}</p>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                        {log.userRole || 'ADMIN'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. REGIE & MONETISATION */}
            {adminSection === 'monetization' && (
              <div className="space-y-6">
                <AdminMonetizationManagement onShowToast={showAdminToast} />
              </div>
            )}

            {/* 6. ACTIONS & DONNÉES */}
            {adminSection === 'actions' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Outils d'Administration & Gestion des Données
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Sauvegarde globale, synchronisation des bases de données et actions rapides du Super Administrateur.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">Exportation & Sauvegarde</h4>
                        <p className="text-xs text-slate-500">Télécharger la base complète certifiée JSON</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const jsonStr = exportDataJSON();
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `galenis_togo_backup_prod_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showAdminToast('Sauvegarde PROD exportée avec succès !');
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger Sauvegarde JSON</span>
                    </button>
                  </div>

                  {/* Import / Restore */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-amber-950">Restauration Sécurisée</h4>
                        <p className="text-xs text-amber-800/80">Restaurer les données depuis un fichier certifié</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!window.confirm("Attention, cette action va remplacer les données existantes. Confirmer la restauration ?")) {
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            if (content && importDataJSON(content)) {
                              reloadAdminData();
                              showAdminToast('Données restaurées avec succès !');
                            } else {
                              showAdminToast('Erreur: Format JSON non valide.');
                            }
                          };
                          reader.readAsText(file);
                          e.target.value = '';
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Importer un Fichier JSON</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Emergency Broadcast Flash */}
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>Flash Alerte Sanitaire Urgente (Ministère / DPML Togo)</span>
                  </div>
                  <p className="text-xs text-rose-800/90 leading-relaxed">
                    Diffuser un bandeau d'alerte prioritaire visible instantanément par tous les citoyens et pharmaciens connectés (ex: retrait de lot ou alerte contrefaçon).
                  </p>
                  <button
                    onClick={() => setAdminNewAlertModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer et Diffuser une Alerte Flash</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal: New Sanitary Alert */}
      {adminNewAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-base text-slate-900">Publier une Alerte Sanitaire</h3>
              </div>
              <button
                onClick={() => setAdminNewAlertModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAlertForm.title.trim() || !newAlertForm.summary.trim()) return;
                addSanitaryAlert({
                  title: newAlertForm.title.trim(),
                  category: newAlertForm.category,
                  severity: newAlertForm.severity,
                  region: newAlertForm.region,
                  source: newAlertForm.source,
                  summary: newAlertForm.summary.trim(),
                  content: newAlertForm.content.trim() || newAlertForm.summary.trim(),
                  affectedProducts: newAlertForm.affectedProducts ? newAlertForm.affectedProducts.split(',').map(p => p.trim()) : [],
                  recommendations: newAlertForm.recommendations ? newAlertForm.recommendations.split('\n').filter(r => r.trim()) : ['Consulter immédiatement un médecin ou pharmacien']
                });
                reloadAdminData();
                setAdminNewAlertModalOpen(false);
                setNewAlertForm({
                  title: '',
                  category: 'RUPTURE_NATIONALE',
                  severity: 'VIGILANCE',
                  region: 'Toutes',
                  source: 'Ministère de la Santé',
                  summary: '',
                  content: '',
                  affectedProducts: '',
                  recommendations: ''
                });
                showAdminToast('Alerte sanitaire diffusée à tous les utilisateurs !');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'alerte</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rappel de lot Paracétamol Sirop..."
                  value={newAlertForm.title}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Niveau de Sévérité</label>
                  <select
                    value={newAlertForm.severity}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="CRITIQUE">CRITIQUE (Urgence Vitale)</option>
                    <option value="VIGILANCE">VIGILANCE (Rappel / Tension)</option>
                    <option value="INFO">INFORMATION (Recommandation)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Région Sanitaire</label>
                  <select
                    value={newAlertForm.region}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, region: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Toutes">Toutes les régions</option>
                    <option value="Maritime">Maritime & Grand Lomé</option>
                    <option value="Plateaux">Plateaux</option>
                    <option value="Centrale">Centrale</option>
                    <option value="Kara">Kara</option>
                    <option value="Savanes">Savanes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Résumé / Message d'alerte</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Description claire du problème et consignes de sécurité pour les usagers..."
                  value={newAlertForm.summary}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Produits / Lots concernés (séparés par des virgules)</label>
                <input
                  type="text"
                  placeholder="Ex: Lot #TG-2026-991, Lot #TG-2026-992"
                  value={newAlertForm.affectedProducts}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, affectedProducts: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdminNewAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Diffuser l'Alerte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Professional Invitation */}
      {adminNewInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-slate-900">Inviter un Professionnel</h3>
              </div>
              <button
                onClick={() => setAdminNewInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newInviteForm.email.trim()) return;
                saveAdminInvitation({
                  email: newInviteForm.email.trim(),
                  name: newInviteForm.name.trim() || newInviteForm.email.split('@')[0],
                  role: newInviteForm.role,
                  invitedBy: 'Direction Super Admin'
                });
                reloadAdminData();
                setAdminNewInviteModalOpen(false);
                setNewInviteForm({ email: '', name: '', role: 'PHARMACIEN' });
                showAdminToast(`Invitation envoyée avec succès à ${newInviteForm.email} !`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rôle Attribué</label>
                <select
                  value={newInviteForm.role}
                  onChange={(e) => setNewInviteForm({ ...newInviteForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="PHARMACIEN">Pharmacien Titulaire d'Officine</option>
                  <option value="DEVELOPPEUR">Développeur / Intégrateur LGO</option>
                  <option value="DATA_ADMIN">Administrateur de Données Sanitaires</option>
                  <option value="SUPER_ADMIN">Super Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom et Prénom</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Koffi Mensah"
                  value={newInviteForm.name}
                  onChange={(e) => setNewInviteForm({ ...newInviteForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Professionnel</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: contact@pharmacie.tg"
                  value={newInviteForm.email}
                  onChange={(e) => setNewInviteForm({ ...newInviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdminNewInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Envoyer l'Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Insurance Simulator Modal (INAM Togo) */}
      <InsuranceSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        drugs={drugs}
      />

      {/* Price Estimate Before Travel Modal (Connected Citizen) */}
      <PriceEstimateBeforeTravelModal
        isOpen={isPriceEstimatorModalOpen}
        onClose={() => setIsPriceEstimatorModalOpen(false)}
        pharmacy={pharmacies.find(p => p.id === estimateSelectedPharmacyId) || pharmacies[0] || null}
        drugs={drugs}
        stocks={stocks}
        userInsuranceScheme={citoyenData.insuranceName}
        userInsuranceRate={citoyenData.insuranceRate}
      />

      {/* 2FA Verification Modal for Sensitive Operations */}
      {critical2faDetails && (
        <CriticalAction2faModal
          isOpen={is2faModalOpen}
          onClose={() => {
            setIs2faModalOpen(false);
            setCritical2faDetails(null);
          }}
          onConfirm={critical2faDetails.onConfirm}
          title={critical2faDetails.title}
          description={critical2faDetails.description}
          severity={critical2faDetails.severity}
          actionButtonLabel="Valider avec mon code 2FA"
        />
      )}

    </div>
  );
};
