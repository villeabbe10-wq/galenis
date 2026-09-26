import React, { useState, useEffect } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createPortal } from 'react-dom';
import { 
  BarChart3, CalendarDays, Wallet, Banknote, ShoppingBag, Smartphone, CreditCard, ArrowUpRight, 
  ShieldCheck, 
  Database, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  FileJson,
  UserPlus,
  LogOut,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Send,
  Filter,
  Lightbulb,
  Radio,
  Activity,
  Flame,
  Pill,
  Clock,
  MapPin,
  TrendingUp,
  Receipt,
  Server,
  Building2,
  RefreshCw,
  Search,
  Plus,
  ShieldAlert,
  History,
  CheckSquare,
  Users,
  Compass,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  HelpCircle,
  XCircle,
  FileCheck,
  X,
  Coins
} from 'lucide-react';
import { TogoLionIcon } from './TogoEmblems';
import { PaymentModal } from './PaymentModal';
import { InvoiceModal, InvoiceData } from './InvoiceModal';
import { AdminMonetizationManagement } from './Admin/AdminMonetizationManagement';
import { 
  exportDataJSON, 
  importDataJSON, 
  getAppFeedbacks, 
  updateAppFeedbackStatus, 
  deleteAppFeedback,
  getSanitaryAlerts,
  addSanitaryAlert,
  archiveSanitaryAlert,
  getCommunityReports,
  getActivityLogs,
  getApiKeys,
  getPharmacies, updatePharmacy, addActivityLog,
  getAdminInvitations,
  saveAdminInvitation,
  resetStorageToDefault,
  getDeveloperDossiers,
  reviewDeveloperDossier
} from '../services/pharmacyStorage';
import { 
  AppFeedback, 
  AppFeedbackStatus, 
  SanitaryAlert, 
  CommunityReport, 
  ActivityLogItem, 
  ApiKey, 
  UserRole,
  DeveloperAccreditationDossier
} from '../types';
import { DeveloperDossierReviewModal } from './AdminDashboard/DeveloperDossierReviewModal';
import { DrugDemandAnalyticsView } from './AdminDashboard/DrugDemandAnalyticsView';

interface AdminDashboardViewProps {
  onLogout: () => void;
  onRefreshData: () => void;
  role: 'SUPER_ADMIN' | 'DATA_ADMIN';
  onOpenFaq?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onLogout, onRefreshData, role, onOpenFaq }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'live_radar' | 'drug_analytics' | 'user_needs' | 'roles' | 'audit' | 'data' | 'billing' | 'revenue' | 'monetization'>('overview');
  const [toastMessage, setToastMessage] = useState('');

  // Developer Accreditation Dossiers State (Synced with ApiPortal & Storage)
  const [devDossiers, setDevDossiers] = useState<DeveloperAccreditationDossier[]>(() => getDeveloperDossiers());
  const [selectedDossierForReview, setSelectedDossierForReview] = useState<DeveloperAccreditationDossier | null>(null);
  const [dossierStatusFilter, setDossierStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    const handleAccountSync = () => {
      setDevDossiers(getDeveloperDossiers());
    };

    const handleAdminNotification = (e: any) => {
      setDevDossiers(getDeveloperDossiers());
      if (e?.detail?.message) {
        showToast(`🔔 Alerte Admin : ${e.detail.message}`);
      }
    };

    window.addEventListener('storage', handleAccountSync);
    window.addEventListener('galenis_dev_account_updated', handleAccountSync);
    window.addEventListener('galenis_admin_notification', handleAdminNotification);
    return () => {
      window.removeEventListener('storage', handleAccountSync);
      window.removeEventListener('galenis_dev_account_updated', handleAccountSync);
      window.removeEventListener('galenis_admin_notification', handleAdminNotification);
    };
  }, []);

  const handleOpenDossierReview = (dossier: DeveloperAccreditationDossier) => {
    setSelectedDossierForReview(dossier);
  };

  // FedaPay Gateway Configuration & Test Modal State
  const [isFedapayConfigOpen, setIsFedapayConfigOpen] = useState(false);
  const [showAdminPaymentModal, setShowAdminPaymentModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [fedapayConfig, setFedapayConfig] = useState({
    merchantId: 'fed_acc_tg_91823',
    merchantName: 'Galenis HealthTech Togo SARL (Plateforme Galenis)',
    publicKeyLive: 'pk_live_tg_883019238120491',
    secretKeyLive: 'sk_live_tg_••••••••••••••••••••••••',
    publicKeySandbox: 'pk_sandbox_tg_test_992140',
    mode: 'LIVE' as 'LIVE' | 'SANDBOX',
    webhookUrl: 'https://api.galenis.tg/v1/fedapay/webhooks',
    webhookSecret: 'whsec_fp_99382104918239012',
    autoPayoutBank: 'Orabank Togo (Compte Galenis HealthTech N° 0918204912)',
    payoutThreshold: 500000
  });

  // Transaction Filters & Data (reactive to FedaPay payments)
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'TMONEY' | 'FLOOZ' | 'CARD'>('ALL');
  
  const defaultTransactions = [
    { id: 'fp_tx_live_89124', operatorRef: 'TMG-89124', client: 'Pharmacie Populaire Tokoin', type: 'Galenis Pro (Mensuel)', method: 'T-Money', amount: '5 000 FCFA', date: "Aujourd'hui à 11:32", status: 'APPROVED' },
    { id: 'fp_tx_live_78210', operatorRef: 'FLZ-78210', client: 'Pharmacie Agoè Assiyéyé', type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: "Aujourd'hui à 09:15", status: 'APPROVED' },
    { id: 'fp_tx_live_67192', operatorRef: 'TMG-67192', client: 'SADPlus (Ref: acc_2209219218)', type: 'Recharge Quota API (Pack 50k)', method: 'T-Money', amount: '25 000 FCFA', date: 'Hier à 16:40', status: 'APPROVED' },
    { id: 'fp_tx_live_54018', operatorRef: 'GIM-54018', client: 'SmartPharma Cloud', type: 'Galenis Enterprise', method: 'Carte Bancaire', amount: '25 000 FCFA', date: 'Hier à 14:10', status: 'APPROVED' },
    { id: 'fp_tx_live_43921', operatorRef: 'FLZ-43921', client: "Pharmacie de l'Aéroport", type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: '06/09/2026', status: 'APPROVED' },
    { id: 'fp_tx_live_32810', operatorRef: 'TMG-32810', client: 'Pharmacie Gbossimé', type: 'Galenis Pro (Trimestriel)', method: 'T-Money', amount: '14 250 FCFA', date: '05/09/2026', status: 'APPROVED' }
  ];

  const [transactionsData, setTransactionsData] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('galenis_fedapay_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...parsed, ...defaultTransactions];
      }
    } catch (e) {}
    return defaultTransactions;
  });

  useEffect(() => {
    const handleNewTx = () => {
      try {
        const stored = localStorage.getItem('galenis_fedapay_transactions');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTransactionsData([...parsed, ...defaultTransactions]);
        }
      } catch (err) {}
    };
    window.addEventListener('galenis_transaction_completed', handleNewTx);
    window.addEventListener('storage', handleNewTx);
    return () => {
      window.removeEventListener('galenis_transaction_completed', handleNewTx);
      window.removeEventListener('storage', handleNewTx);
    };
  }, []);

  
  // App Feedbacks moderation state
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [replyingFeedbackId, setReplyingFeedbackId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Live Radar & Alert states
  const [sanitaryAlerts, setSanitaryAlerts] = useState<SanitaryAlert[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [adminInvitations, setAdminInvitations] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [pwaInstalls, setPwaInstalls] = useState<number>(0);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  
  // Modal states
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('PHARMACIEN');

  // Flash Alert Form
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

  // Billing & Quota Form
  const [billingConfig, setBillingConfig] = useState({
    freeQuota: 500,
    proPriceFcfa: 5000,
    enterprisePriceFcfa: 25000,
    developerApiLimit: 10000,
    activeTrialDays: 14
  });

  const handleSaveBillingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configuration tarifaire et quotas mise à jour avec succès !');
  };

  
  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Acteur', 'Entite'];
    const rows = activityLogs.map(log => [
      log.timestamp || '',
      log.type || '',
      (log.title || log.description || '').replace(/,/g, ' '),
      log.userRole || 'Systeme',
      log.entityName || '-'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_galenis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 168, 120);
    doc.text("Rapport d'Audit et Activité - Galenis Togo", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 28);
    
    doc.text(`Total des événements enregistrés : ${activityLogs.length}`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [['Date', 'Type', 'Description', 'Acteur', 'Entité']],
      body: activityLogs.map(log => [
        log.timestamp || '',
        log.type || '',
        log.title || log.description || '',
        log.userRole || 'Système',
        log.entityName || '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 168, 120] },
      styles: { fontSize: 8 }
    });

    doc.save(`audit_galenis_${Date.now()}.pdf`);
  };

  const loadAllAdminData = () => {
    setFeedbacks(getAppFeedbacks());
    setSanitaryAlerts(getSanitaryAlerts());
    setCommunityReports(getCommunityReports());
    setActivityLogs(getActivityLogs());
    setApiKeys(getApiKeys());
    setAdminInvitations(getAdminInvitations());
    setPharmacies(getPharmacies());
    setDevDossiers(getDeveloperDossiers());
    setPwaInstalls(0);
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);


  const handleValidatePharmacy = (pharmaId: string, status: 'APPROVED' | 'REJECTED') => {
    const pharma = pharmacies.find(p => p.id === pharmaId);
    if (pharma) {
      updatePharmacy({ ...pharma, validationStatus: status });
      addActivityLog({
        type: status === 'APPROVED' ? 'PHARMACY_VERIFIED' : 'PHARMACY_REJECTED',
        title: `Officine ${status === 'APPROVED' ? 'Validée' : 'Rejetée'} : ${pharma.name}`,
        description: `L'officine ${pharma.name} a été ${status === 'APPROVED' ? 'approuvée' : 'rejetée'} par l'administration.`,
        userRole: 'ADMIN',
        entityId: pharma.id,
        entityName: pharma.name
      });
      loadAllAdminData();
      showToast(`Officine ${status === 'APPROVED' ? 'validée' : 'rejetée'} avec succès`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExport = (env: 'PROD' | 'SANDBOX') => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galenis_togo_backup_${env.toLowerCase()}_sanitized_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Sauvegarde ${env} exportée avec succès !`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!window.confirm("Attention, cette action va remplacer toutes les données actuelles. Confirmer ?")) {
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
         try {
           const success = importDataJSON(content);
           if (success) {
             showToast('Données restaurées avec succès !');
             onRefreshData();
             loadAllAdminData();
           } else {
             showToast('Erreur: Format de fichier invalide.');
           }
         } catch(e) {
           showToast('Erreur lors de la restauration.');
         }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    saveAdminInvitation({
      email: inviteEmail.trim(),
      name: inviteName.trim() || inviteEmail.split('@')[0],
      role: inviteRole,
      invitedBy: 'Super Admin Galenis Togo'
    });
    loadAllAdminData();
    setIsInviteModalOpen(false);
    showToast(`Invitation ${inviteRole} envoyée à ${inviteEmail} !`);
    setInviteEmail('');
    setInviteName('');
  };

  const handleCreateSanitaryAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.title.trim()) return;

    addSanitaryAlert({
      title: newAlertForm.title.trim(),
      category: newAlertForm.category,
      severity: newAlertForm.severity,
      region: newAlertForm.region,
      source: newAlertForm.source,
      summary: newAlertForm.summary.trim() || newAlertForm.title.trim(),
      content: newAlertForm.content.trim(),
      affectedProducts: newAlertForm.affectedProducts ? newAlertForm.affectedProducts.split(',').map(s => s.trim()) : [],
      recommendations: newAlertForm.recommendations ? newAlertForm.recommendations.split('\n').map(s => s.trim()).filter(Boolean) : []
    });

    loadAllAdminData();
    setIsAlertModalOpen(false);
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
    showToast('Alerte flash officielle diffusée sur l\'ensemble du réseau !');
  };

  const handleStatusChange = (id: string, newStatus: AppFeedbackStatus) => {
    updateAppFeedbackStatus(id, newStatus);
    loadAllAdminData();
    showToast(`Statut mis à jour : ${newStatus}`);
  };

  const handleSendAdminReply = (id: string) => {
    if (!replyMessage.trim()) return;
    updateAppFeedbackStatus(id, 'UNDER_REVIEW', {
      author: 'Équipe Galenis Togo',
      message: replyMessage.trim()
    });
    setReplyingFeedbackId(null);
    setReplyMessage('');
    loadAllAdminData();
    showToast('Réponse officielle publiée avec succès !');
  };

  const handleDeleteFeedback = (id: string) => {
    if (window.confirm('Supprimer définitivement ce retour d\'expérience ?')) {
      deleteAppFeedback(id);
      loadAllAdminData();
      showToast('Retour supprimé.');
    }
  };

  const filteredFeedbacks = selectedStatusFilter === 'ALL'
    ? feedbacks
    : feedbacks.filter(f => f.status === selectedStatusFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Banner - Light & Refined */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-700 shadow-2xs">
             {role === 'SUPER_ADMIN' ? <ShieldCheck className="w-7 h-7" /> : <Database className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Console de Gouvernance
              </span>
              <span className="text-xs text-slate-400 font-medium">• ONPT & Ministère de la Santé</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Cockpit de Gestion {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Data Admin'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Supervision de l'accès aux soins, radar d'activité live et baromètre des besoins citoyens au Togo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenFaq && (
            <button
              type="button"
              onClick={onOpenFaq}
              className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              title="Consulter le Guide & FAQ Administration (Lion du Togo)"
            >
              <TogoLionIcon className="w-4 h-4 text-emerald-600" />
              <span>Guide & FAQ Administration</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsLiveSyncing(true);
              setTimeout(() => {
                setIsLiveSyncing(false);
                loadAllAdminData();
                showToast('Données nationales du réseau synchronisées avec succès !');
              }, 1000);
            }}
            disabled={isLiveSyncing}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin' : ''}`} />
            <span>{isLiveSyncing ? 'Synchro...' : 'Actualiser'}</span>
          </button>

          <button 
            onClick={onLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Light, Crisp, High Contrast */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Cockpit & Métriques</span>
        </button>

        <button
          onClick={() => setActiveTab('live_radar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'live_radar'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Radar en Direct</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
            activeTab === 'live_radar' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('drug_analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'drug_analytics'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4 text-[#00A859]" />
          <span>Analyse de la Demande</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
            activeTab === 'drug_analytics' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            Recharts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('user_needs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'user_needs'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Besoins des Utilisateurs</span>
          {feedbacks.filter(f => f.status === 'SUBMITTED').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
              {feedbacks.filter(f => f.status === 'SUBMITTED').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rôles & Accréditations</span>
          {devDossiers.filter(d => d.status === 'PENDING_REVIEW').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse flex items-center gap-1">
              <span>{devDossiers.filter(d => d.status === 'PENDING_REVIEW').length}</span>
              <span className="hidden sm:inline">KYC</span>
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Journal d'Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'data'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Gestion Données</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Tarifs & Quotas</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Revenus & Abonnements</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'monetization'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Bannières Pub & Régie</span>
        </button>

      </div>

      {/* 1. OVERVIEW — Cockpit & Métriques Nationales */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* URGENT ADMIN ALERT: Pending Developer KYC Dossiers */}
          {devDossiers.filter(d => d.status === 'PENDING_REVIEW').length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                      Contrôle Conformité Requis ({devDossiers.filter(d => d.status === 'PENDING_REVIEW').length})
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      Passage Sandbox ➔ Production API
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-amber-950 mt-0.5">
                    Dossier d'Agrément Développeur reçu : {devDossiers.filter(d => d.status === 'PENDING_REVIEW')[0].organization}
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Le responsable technique <strong>{devDossiers.filter(d => d.status === 'PENDING_REVIEW')[0].name}</strong> a soumis les pièces justificatives (RCCM/NIF, CNI, Cahier des charges). Vérifiez la conformité avant d'activer les quotas de Production (100k req/j).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenDossierReview(devDossiers.filter(d => d.status === 'PENDING_REVIEW')[0])}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <TogoLionIcon className="w-4 h-4 text-white" />
                  <span>Examiner les Pièces & Valider</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Officines Référencées</span>
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">210</div>
              <div className="text-xs text-emerald-700 font-bold mt-1">100% Ordre National (ONPT)</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">De Garde ce Week-end</span>
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2">48 Officines</div>
              <div className="text-xs text-emerald-700 font-bold mt-1">24h/24 & Nuit certifiées</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Recherches / Semaine</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">14,820</div>
              <div className="text-xs text-blue-700 font-bold mt-1">+22.4% vs mois précédent</div>
            </div>

                        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800">Installations PWA</span>
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-2">{pwaInstalls}</div>
              <div className="text-xs text-blue-800 font-bold mt-1">Appareils Mobiles</div>
            </div>
          </div>
          {/* Regional Health & Guard Coverage */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Couverture Territoriale par Région du Togo</span>
                </h3>
                <p className="text-xs text-slate-500">Répartition des officines et astreintes de garde</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                5 Régions Sanitaires
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {[
                { region: 'Maritime & Grand Lomé', total: 142, garde: 32, dispo: '93%', cities: 'Lomé, Tsévié, Aného, Vogan' },
                { region: 'Région des Plateaux', total: 28, garde: 6, dispo: '89%', cities: 'Kpalimé, Atakpamé, Notsé' },
                { region: 'Région Centrale', total: 18, garde: 4, dispo: '86%', cities: 'Sokodé, Tchamba, Sotouboua' },
                { region: 'Région de la Kara', total: 14, garde: 4, dispo: '87%', cities: 'Kara, Niamtougou, Bafilo' },
                { region: 'Région des Savanes', total: 8, garde: 2, dispo: '82%', cities: 'Dapaong, Mango, Cinkassé' },
              ].map((reg) => (
                <div key={reg.region} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-sm text-slate-900">{reg.region}</div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {reg.garde} en garde
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{reg.total} officines</span>
                    <span className="font-bold text-slate-800">Dispo stocks: {reg.dispo}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">Villes: {reg.cities}</div>
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

          {/* System Gateways & Health Status - Crisp Light Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Statut des Passerelles & Systèmes Connectés</span>
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Tous les services opérationnels
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Passerelle Logiciels Caisse (LGO)</div>
                <div className="font-black text-slate-900 mt-1 text-sm">18 Officines connectées</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">WinPharma, SmartPharma, LGO Togo</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Serveur DPML Togo</div>
                <div className="font-black text-slate-900 mt-1 text-sm">Opérationnel • 24ms</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1">Alertes sanitaires & rappels de lots</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Passerelle Mobile Money</div>
                <div className="font-black text-slate-900 mt-1 text-sm">TMoney & Flooz</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">Paiements officines actifs</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Hub Tiers-Payant Assurances</div>
                <div className="font-black text-slate-900 mt-1 text-sm">INAM, AMU, SUNU, SANLAM</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">11 Organismes intégrés</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE RADAR — "Un œil sur ce qui se passe sur l'app" */}
      {activeTab === 'live_radar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span>Radar d'Activité en Direct</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Surveillance des recherches nocturnes de garde, médicaments d'urgence et flux citoyens en temps réel
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Flux Live Connecté</span>
              </span>
            </div>

            {/* Anomaly Detection Banners - Clean Light Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Détection Zone en Tension Nocturne</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  <strong>Zanguéra / Mission Tové :</strong> 62 recherches de garde depuis 21h sans officine ouverte à moins de 7.5 km.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-amber-800 font-medium">Recommandation : Mobiliser garde d'appui Agoè</span>
                  <button
                    onClick={() => showToast('Notification envoyée aux officines du secteur Nord-Ouest Lomé.')}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
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
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  <strong>Sérum Antivenimeux Polyvalent :</strong> +310% de requêtes enregistrées dans les Savanes (Dapaong, Mango).
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-rose-800 font-medium">Stock régional déclaré : 14 flacons</span>
                  <button
                    onClick={() => showToast('Demande de réapprovisionnement transmise à la CAMEG Togo.')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                  >
                    Notifier CAMEG
                  </button>
                </div>
              </div>
            </div>

            {/* Live Stream of Activity */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Dernières Recherches & Requêtes Citoyennes</span>
                </h3>
                <span className="text-xs text-slate-500">Mise à jour en continu</span>
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
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">{event.time}</span>
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-900 block truncate">{event.query}</span>
                        <span className="text-[11px] text-slate-500">{event.city} • {event.type}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                        event.isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active DPML Health Alerts */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Alertes Sanitaires Actives du Ministère & DPML Togo ({sanitaryAlerts.filter(a => a.status === 'ACTIVE').length})</span>
                </h3>
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publier Alerte Flash</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {sanitaryAlerts.filter(a => a.status === 'ACTIVE').map((alert) => (
                  <div key={alert.id} className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                            {alert.severity}
                          </span>
                          <span className="font-black text-rose-950 text-sm">{alert.title}</span>
                        </div>
                        <div className="text-[11px] text-rose-800 mt-1 font-medium">
                          Source: {alert.source} • Région: {alert.region} • Publié le {alert.publishedAt}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          archiveSanitaryAlert(alert.id);
                          loadAllAdminData();
                          showToast('Alerte sanitaire archivée.');
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
        </div>
      )}

      {/* 2.5 RECHARTS DRUG DEMAND ANALYTICS */}
      {activeTab === 'drug_analytics' && (
        <DrugDemandAnalyticsView />
      )}

      {/* 3. USER NEEDS & DEMAND ANALYTICS — "Ce dont les utilisateurs ont besoin" */}
      {activeTab === 'user_needs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>Besoins des Utilisateurs & Demandes Sanitaires</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Analyse des médicaments les plus recherchés en tension, cartographie des déserts de garde et modération de la boîte à retours
              </p>
            </div>

            {/* Module 1: Top Shortages & Tension Drugs */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Baromètre des Médicaments les Plus Recherchés en Tension au Togo</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Basé sur les 14,820 requêtes citoyennes sans stock immédiat ou nécessitant réapprovisionnement
                  </p>
                </div>
                <button
                  onClick={() => showToast('Rapport de tension exporté pour la CAMEG et les grossistes répartiteurs (TEDIS, COPHARMA, UBIPHARM).')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-slate-200"
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
                        <span className="text-[10px] text-slate-500">Régions: {item.regions}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                        item.tension === 'CRITIQUE'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.tension === 'ÉLEVÉE'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.tension}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-600 text-[11px]">{item.note}</span>
                      <span className="font-bold text-slate-900 shrink-0">{item.requests} requêtes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 2: Night Guard Deserts - Refined Light Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Zones de Forte Demande en Garde Nocturne (Déserts Identifiés)</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium">Géolocalisations citoyens 20h-06h</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <div className="font-extrabold text-slate-900">Zanguéra & Mission Tové</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">84 recherches / nuit</div>
                  <div className="text-[10px] text-slate-500 mt-1">Distance moyenne officine garde: 8.2 km</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <div className="font-extrabold text-slate-900">Baguida & Avépozo</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">67 recherches / nuit</div>
                  <div className="text-[10px] text-slate-500 mt-1">Besoin d'alternance garde bord de mer</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
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
                    <span>Demandes & Boîte à Idées des Utilisateurs ({feedbacks.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Traitement des retours citoyens et pharmaciens avec publication de réponses officielles
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'IMPLEMENTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatusFilter(st)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedStatusFilter === st
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
                {filteredFeedbacks.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-medium">
                    Aucun retour dans cette catégorie.
                  </div>
                ) : (
                  filteredFeedbacks.map((item) => (
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
                            onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="SUBMITTED">Reçu</option>
                            <option value="UNDER_REVIEW">À l'étude</option>
                            <option value="PLANNED">Prévu v1.2</option>
                            <option value="IMPLEMENTED">Déployé</option>
                            <option value="DECLINED">Non retenu</option>
                          </select>

                          <button
                            onClick={() => setReplyingFeedbackId(replyingFeedbackId === item.id ? null : item.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Répondre</span>
                          </button>

                          <button
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="p-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {item.description}
                      </p>

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

                      {replyingFeedbackId === item.id && (
                        <div className="pt-2 space-y-2 border-t border-slate-200">
                          <textarea
                            rows={2}
                            placeholder="Rédiger la réponse officielle de l'équipe Galenis Togo..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setReplyingFeedbackId(null); setReplyMessage(''); }}
                              className="px-3 py-1 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-lg cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleSendAdminReply(item.id)}
                              className="px-3.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publier</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ROLES & ACCREDITATIONS ONPT */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Gouvernance des Rôles & Accréditations ONPT
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Validation des pharmaciens titulaires, agrément des développeurs d'APIs et gestion des privilèges santé
                </p>
              </div>

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Inviter un Professionnel</span>
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Dr. Mensah Agbéyomé', email: 'mensah.agbeyome@ordredespharmaciens.tg', role: 'PHARMACIEN', title: 'Pharmacien Titulaire ONPT', org: 'Pharmacie de la Marina (Lomé)', status: 'VÉRIFIÉ ONPT' },
                { name: 'Kodjo Amétépé', email: 'kodjo.dev@tech-togo.com', role: 'DEVELOPPEUR', title: 'Lead Architecte Solutions', org: 'Intégration WinPharma Togo', status: 'AGRÉÉ API' },
                { name: 'Dr. Edwige Akouété', email: 'edwige.akouete@sante.gouv.tg', role: 'DATA_ADMIN', title: 'Coordinatrice DPML', org: 'Ministère de la Santé Togo', status: 'ADMIN NATIONAL' },
                { name: 'Afiwa Lawson', email: 'afiwa.lawson@email.tg', role: 'CITOYEN', title: 'Assurée Santé Multi-Régimes', org: 'Lomé - Tokoin', status: 'COMPTE ACTIF' }
              ].map((acc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs">
                      {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{acc.name}</div>
                      <div className="text-[11px] text-slate-500">{acc.email} • {acc.org}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {acc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION DÉDIÉE : DOSSIERS D'AGRÉMENT DÉVELOPPEUR & KYC DPML */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Dossiers d'Agrément Développeurs & Clés API Production
                  </h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    KYC DPML / ONPT
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Vérification obligatoire des pièces légales (RCCM, NIF, CNI, Cahier des charges) pour passage du mode Sandbox (1k req/j) en Production (100k req/j)
                </p>
              </div>

              {/* Filtres de statut */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'Tous' },
                  { id: 'PENDING_REVIEW', label: 'En attente' },
                  { id: 'APPROVED', label: 'Agréés Prod' },
                  { id: 'REJECTED', label: 'Refusés' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDossierStatusFilter(f.id as any)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      dossierStatusFilter === f.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{f.label}</span>
                    {f.id === 'PENDING_REVIEW' && devDossiers.filter(d => d.status === 'PENDING_REVIEW').length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full">
                        {devDossiers.filter(d => d.status === 'PENDING_REVIEW').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des Dossiers */}
            <div className="space-y-3">
              {devDossiers
                .filter(d => dossierStatusFilter === 'ALL' || d.status === dossierStatusFilter)
                .map((dossier) => (
                  <div 
                    key={dossier.id} 
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      dossier.status === 'PENDING_REVIEW'
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                        : dossier.status === 'APPROVED'
                        ? 'bg-white border-slate-200 hover:border-emerald-300'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-extrabold text-base text-slate-900">
                            {dossier.organization}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            (Ref: {dossier.ref})
                          </span>

                          {dossier.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              AGRÉÉ PRODUCTION (100k req/j)
                            </span>
                          ) : dossier.status === 'PENDING_REVIEW' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              EN ATTENTE DE VÉRIFICATION
                            </span>
                          ) : dossier.status === 'REJECTED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-extrabold">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              REJETÉ / NON CONFORME
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                              SANDBOX (TEST)
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-y-1 gap-x-3">
                          <span>Responsable : <strong>{dossier.name}</strong></span>
                          <span>•</span>
                          <span>Email : <strong>{dossier.email}</strong></span>
                          <span>•</span>
                          <span>Projet : <span className="font-bold text-indigo-700">{dossier.projectType}</span></span>
                        </div>

                        {/* Badges des pièces justificatives fournies */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            RCCM/NIF: {dossier.documents.rccmNif || 'Déclaré'}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            CNI: {dossier.documents.idCardName || 'CNI.pdf'}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                            <FileCheck className="w-3 h-3 text-indigo-600" />
                            Cahier Charges: {dossier.documents.specsDocName || 'Doc.pdf'}
                          </span>

                          {dossier.documents.complianceSigned && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-emerald-800">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Engagement DPML Signé
                            </span>
                          )}
                        </div>

                        {dossier.rejectionReason && (
                          <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                            <strong>Motif du refus :</strong> {dossier.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Bouton d'action */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDossierReview(dossier)}
                          className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                            dossier.status === 'PENDING_REVIEW'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : dossier.status === 'APPROVED'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          <TogoLionIcon className="w-4 h-4 text-white" />
                          <span>
                            {dossier.status === 'PENDING_REVIEW' 
                              ? 'Examiner & Valider la Prod' 
                              : 'Détails & Conformité'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Audit & Activité Réseau</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Supervision en temps réel des inscriptions, des stocks et de l'accès API
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExportCSV}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exporter en CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
              <button 
                onClick={handleExportPDF}
                className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exporter en PDF"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Direct
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne 1 : Inscriptions Récentes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Inscriptions Récentes</h3>
              </div>
              <div className="space-y-3">
                {pharmacies.slice(-5).reverse().map((p, i) => (
                  <div key={p.id || i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Nouveau</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Titulaire: Dr. {p.pharmacistInCharge}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {p.city} ({p.region})
                    </div>
                  </div>
                ))}
                {pharmacies.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">Aucune inscription récente</div>
                )}
              </div>
            </div>

            {/* Colonne 2 : Modifications de Stocks */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Modifications de Stock</h3>
              </div>
              <div className="space-y-3">
                {activityLogs
                  .filter(log => log.type === 'STOCK_UPDATED' || log.description.toLowerCase().includes('stock'))
                  .slice(0, 5)
                  .map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-slate-900 text-xs truncate pr-2">{log.title || 'Mise à jour stock'}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 whitespace-nowrap">Stock</span>
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-2">
                      {log.description}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                      <span>{log.entityName || 'Système'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.timestamp}</span>
                    </div>
                  </div>
                ))}
                {activityLogs.filter(log => log.type === 'STOCK_UPDATED' || log.description.toLowerCase().includes('stock')).length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">Aucune modification récente</div>
                )}
              </div>
            </div>

            {/* Colonne 3 : Demandes d'Accès API */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Demandes d'Accès API</h3>
              </div>
              <div className="space-y-3">
                {apiKeys.slice(0, 5).map((apiKey) => (
                  <div key={apiKey.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-slate-900 text-xs truncate pr-2">{apiKey.company}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${apiKey.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {apiKey.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Application: {apiKey.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{apiKey.tier}</span>
                      <span>Créé le {apiKey.createdAt}</span>
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">Aucune demande API</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Section: Journal d'activité complet */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Journal d'Activité Global</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">{activityLogs.length} événements</span>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.title || log.description}</span>
                      {log.region && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-slate-200 text-slate-600">{log.region}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {log.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Par: <strong>{log.userRole || 'Système'}</strong> {log.entityName ? `(${log.entityName})` : ''}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 shrink-0 self-start sm:self-auto">
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DATA MANAGEMENT */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900">Sauvegarde & Exportation</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Téléchargez l'intégralité des données (officines, stocks, tours de garde, alertes sanitaires et retours) au format JSON sécurisé.
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('PROD')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Exporter Sauvegarde JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-black text-slate-900">Restauration de Données</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Restaurez une sauvegarde JSON existante pour réinitialiser ou synchroniser l'environnement de production.
            </p>

            <div className="relative inline-block">
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Importer & Restaurer Fichier JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. BILLING & QUOTAS — Gestion des tarifs */}
      {activeTab === 'billing' && (
        <form onSubmit={handleSaveBillingConfig} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900">Configuration des Tarifs & Quotas</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Gérez ici les paramètres de tarification de Galenis, les limites de gratuité de l'API publique pour les développeurs, ainsi que les tarifs mensuels applicables aux officines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Quota Gratuit Mensuel (Appels API)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={billingConfig.freeQuota}
                    onChange={(e) => setBillingConfig({ ...billingConfig, freeQuota: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">requêtes</div>
                </div>
                <p className="text-[10px] text-slate-500">S'applique au plan de base pour les développeurs indépendants.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Limite Hard Quota Développeur</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={billingConfig.developerApiLimit}
                    onChange={(e) => setBillingConfig({ ...billingConfig, developerApiLimit: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">requêtes</div>
                </div>
                <p className="text-[10px] text-slate-500">Coupure automatique de la clé API après ce seuil.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Tarif Mensuel Galenis Pro (Officines)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={billingConfig.proPriceFcfa}
                    onChange={(e) => setBillingConfig({ ...billingConfig, proPriceFcfa: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">FCFA/mois</div>
                </div>
                <p className="text-[10px] text-slate-500">Prix facturé aux pharmacies pour l'accès aux Analytics & Historique.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Tarif Galenis Enterprise (Réseaux / Grossistes)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={billingConfig.enterprisePriceFcfa}
                    onChange={(e) => setBillingConfig({ ...billingConfig, enterprisePriceFcfa: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">FCFA/mois</div>
                </div>
                <p className="text-[10px] text-slate-500">Prix pour les intégrateurs et partenaires nationaux.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Période d'essai gratuite (Jours)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={billingConfig.activeTrialDays}
                    onChange={(e) => setBillingConfig({ ...billingConfig, activeTrialDays: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">jours</div>
                </div>
                <p className="text-[10px] text-slate-500">Durée d'évaluation offerte aux nouvelles inscriptions.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enregistrer la Configuration</span>
              </button>
            </div>
          </div>
        </form>
      )}

      
      {/* 8. REVENUS & ABONNEMENTS */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Revenus & Abonnements</h2>
              <p className="text-sm text-slate-500 font-medium">Suivi financier des souscriptions Galenis Pro et Enterprise</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs">
                <Download className="w-4 h-4" />
                <span>Exporter le rapport</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>MRR (Revenu Mensuel Récurrent)</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">1,250,000 FCFA</div>
              <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% ce mois</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Abonnements Actifs</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">184</div>
              <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+8 nouvelles officines</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Banknote className="w-4 h-4 text-amber-600" />
                <span>En attente de paiement</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">125,000 FCFA</div>
              <div className="text-xs text-amber-600 font-bold mt-1 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                <span>5 factures échues</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-6">Évolution des Revenus (6 derniers mois)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Mars', revenue: 850000 },
                    { month: 'Avril', revenue: 920000 },
                    { month: 'Mai', revenue: 1050000 },
                    { month: 'Juin', revenue: 1100000 },
                    { month: 'Juillet', revenue: 1180000 },
                    { month: 'Août', revenue: 1250000 }
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenu']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Prochaines Échéances</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-md">7 jours</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {[
                  { name: 'Pharmacie Populaire Tokoin', plan: 'Galenis Pro', date: 'Demain', amount: '5 000 FCFA' },
                  { name: 'Pharmacie Agoè Assiyéyé', plan: 'Galenis Pro', date: 'Dans 2 jours', amount: '5 000 FCFA' },
                  { name: "Pharmacie de l'Aéroport", plan: 'Galenis Pro', date: 'Dans 3 jours', amount: '5 000 FCFA' },
                  { name: 'SmartPharma Cloud', plan: 'Enterprise', date: 'Dans 5 jours', amount: '25 000 FCFA' },
                  { name: 'Pharmacie Gbossimé', plan: 'Galenis Pro', date: 'Dans 6 jours', amount: '5 000 FCFA' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.plan} • Échéance : {item.date}</div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-700">{item.amount}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer">
                Voir toutes les échéances
              </button>
            </div>
          </div>

          {/* SECTION: BALANCES & PASSERELLE AGRÉGÉE FEDAPAY TOGO */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    F
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Agrégateur de Paiement FedaPay Togo (T-Money, Flooz & Cartes)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                    Agréé FedaPay UEMOA
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Passerelle de collecte nationale unifiée via FedaPay : T-Money (Togocom), Moov Flooz et Cartes GIM/Visa.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsFedapayConfigOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Paramètres FedaPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminPaymentModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tester Paiement FedaPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Virement Payout FedaPay initié avec succès vers le compte bancaire Orabank Togo de Galenis HealthTech Togo SARL (Réf: VIR-FEDAPAY-TG-2026-9812 - Montant: 1 600 000 FCFA).");
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Décaisser vers Orabank</span>
                </button>
              </div>
            </div>

            {/* Balances Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* T-Money */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009A63]" />
                    T-Money (Togocom)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">Actif</span>
                </div>
                <div className="text-2xl font-black text-slate-900">780 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60 font-medium">
                  <span>84 transactions réussies</span>
                  <span className="font-bold text-emerald-700">Frais 1.2%</span>
                </div>
              </div>

              {/* Moov Flooz */}
              <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-blue-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Moov Money Flooz
                  </span>
                  <span className="text-[10px] font-bold bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">Actif</span>
                </div>
                <div className="text-2xl font-black text-slate-900">470 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-blue-200/60 font-medium">
                  <span>48 transactions réussies</span>
                  <span className="font-bold text-blue-700">Frais 1.2%</span>
                </div>
              </div>

              {/* Cartes & Total */}
              <div className="p-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/70 to-fuchsia-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-purple-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-700" />
                    Cartes GIM-UEMOA / Visa
                  </span>
                  <span className="text-[10px] font-bold bg-purple-200/70 text-purple-800 px-2 py-0.5 rounded-full">En ligne</span>
                </div>
                <div className="text-2xl font-black text-slate-900">350 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-purple-200/60 font-medium">
                  <span>16 transactions</span>
                  <span className="font-bold text-purple-700">Sécurisé 3D-S</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: TRANSACTIONS & RÈGLEMENTS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-700" />
                  <span>Dernières Transactions & Règlements Encaissés</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Historique des souscriptions et recharges API Galenis Pro & Développeurs</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'Tous' },
                  { id: 'TMONEY', label: 'T-Money' },
                  { id: 'FLOOZ', label: 'Flooz' },
                  { id: 'CARD', label: 'Carte Bancaire' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTransactionFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      transactionFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Réf. FedaPay</th>
                    <th className="py-2.5 px-4">Réf. Opérateur</th>
                    <th className="py-2.5 px-4">Client / Organisation</th>
                    <th className="py-2.5 px-4">Motif</th>
                    <th className="py-2.5 px-4">Moyen</th>
                    <th className="py-2.5 px-4">Montant</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-center">Statut</th>
                    <th className="py-2.5 px-4 text-right">Facture / Reçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactionsData
                    .filter(tx => {
                      if (transactionFilter === 'TMONEY') return tx.method === 'T-Money';
                      if (transactionFilter === 'FLOOZ') return tx.method === 'Moov Flooz';
                      if (transactionFilter === 'CARD') return tx.method === 'Carte Bancaire';
                      return true;
                    })
                    .map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 text-[11px]">
                          <span className="text-emerald-700 font-black">{tx.id}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {tx.operatorRef || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tx.client}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tx.type}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            tx.method === 'T-Money' ? 'bg-emerald-100 text-emerald-800' :
                            tx.method === 'Moov Flooz' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          {tx.amount}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Validé</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const rawAmount = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 5000;
                              const vat = Math.round(rawAmount * 0.18);
                              setCurrentInvoice({
                                invoiceNumber: `FAC-TG-${tx.id.toUpperCase()}`,
                                transactionId: tx.id,
                                operatorRef: tx.operatorRef || 'N/A',
                                clientName: tx.client,
                                clientEmail: 'contact@galenis.tg',
                                serviceDescription: tx.type,
                                amountHt: rawAmount - vat,
                                tva: vat,
                                amountTtc: rawAmount,
                                paymentMethod: tx.method,
                                date: tx.date,
                                environment: fedapayConfig.mode
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
                            title="Afficher et imprimer la facture officielle A4"
                          >
                            <FileText className="w-3 h-3 text-emerald-700" />
                            <span>Facture A4</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Notice Juridique, Fiscale & Rapprochement Comptable (À l'attention des comptables et auditeurs) */}
            <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="font-black text-sm uppercase tracking-wide">
                  Notice Juridique, Fiscale & Rapprochement Comptable (FedaPay / OTR)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-600">
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Société Émettrice des Factures</span>
                  </div>
                  <p className="leading-relaxed">
                    Les factures sont émises exclusivement par <strong>Galenis HealthTech Togo SARL</strong> (RCCM : <code>TG-LFW-01-2024-B12-00492</code>, NIF : <code>1001849201</code>), société commerciale privée éditrice de la plateforme.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Statut Institutionnel (ONPT & DPML)</span>
                  </div>
                  <p className="leading-relaxed">
                    L'Ordre National des Pharmaciens et le Ministère de la Santé agissent comme partenaires de régulation déontologique et scientifique. Ils n'encaissent pas les règlements des services numériques.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Validité Fiscale & Pièces Justificatives</span>
                  </div>
                  <p className="leading-relaxed">
                    Les factures A4 générées sont des pièces comptables probantes déductibles selon le Code Général des Impôts togolais (TVA 18% UEMOA) et comportent la référence opérateur T-Money/Flooz faisant foi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: VALIDATION DES COMPTES DÉVELOPPEURS & ACCRÉDITATIONS API */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Agréments Développeurs & Validation des Comptes API
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Gouvernance des accès tiers, passage de Sandbox (Test) vers Production Certifiée DPML.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Supervision Ordre National des Pharmaciens
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Projet / Entité</th>
                    <th className="py-2.5 px-4">Référence Unique</th>
                    <th className="py-2.5 px-4">Contact</th>
                    <th className="py-2.5 px-4">Statut Actuel</th>
                    <th className="py-2.5 px-4">Plafond Req/j</th>
                    <th className="py-2.5 px-4 text-right">Action Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Dynamic developer accounts synced from dossiers */}
                  {devDossiers.map((dossier) => (
                    <tr key={dossier.id} className="hover:bg-purple-50/40 bg-purple-50/15 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-950 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <span>{dossier.organization}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-700">
                        {dossier.ref}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {dossier.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] ${
                          dossier.status === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : dossier.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            dossier.status === 'APPROVED' ? 'bg-emerald-600' : dossier.status === 'PENDING_REVIEW' ? 'bg-amber-500' : 'bg-rose-600'
                          }`} />
                          <span>
                            {dossier.status === 'APPROVED' 
                              ? 'Agréé (Production)' 
                              : dossier.status === 'PENDING_REVIEW'
                              ? 'En attente KYC'
                              : dossier.status === 'REJECTED'
                              ? 'Refusé'
                              : 'Sandbox (Test)'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                        {dossier.dailyLimit.toLocaleString('fr-FR')} / j
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDossierReview(dossier)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                            dossier.status === 'PENDING_REVIEW'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : dossier.status === 'APPROVED'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {dossier.status === 'PENDING_REVIEW' ? 'Examiner les Pièces' : 'Contrôle KYC'}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Other verified partners */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        CB
                      </div>
                      <span>Clinique Biasa SI</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      acc_19482031
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      dsi@cliniquebiasa.tg
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Validé (Production)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                      100 000 / j
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-slate-400 font-bold">Agréé DPML</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        SP
                      </div>
                      <span>SmartPharma Togo</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      acc_88301923
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      api@smartpharma.tg
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Validé (Production)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                      100 000 / j
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-slate-400 font-bold">Agréé DPML</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 9. MONETIZATION & AD BANNERS */}
      {activeTab === 'monetization' && (
        <AdminMonetizationManagement onShowToast={showToast} />
      )}

      {/* Modal: Diffuser Alerte Flash DPML */}
      {isAlertModalOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Diffuser Alerte Sanitaire Flash (DPML Togo)</span>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSanitaryAlert} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Titre de l'alerte</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rappel de lot - Sirop Antitussif X"
                  value={newAlertForm.title}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sévérité</label>
                  <select
                    value={newAlertForm.severity}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, severity: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="VIGILANCE">VIGILANCE</option>
                    <option value="ALERTE_GRAVE">ALERTE GRAVE</option>
                    <option value="URGENCE_VITALE">URGENCE VITALE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Région</label>
                  <select
                    value={newAlertForm.region}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, region: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
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

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Résumé public</label>
                <textarea
                  rows={2}
                  placeholder="Résumé pour les pharmaciens et le grand public..."
                  value={newAlertForm.summary}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Diffuser Immédiatement
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: Inviter Professionnel */}
      {isInviteModalOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Inviter un Professionnel de Santé</span>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nom & Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Kodjo Lawson"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email professionnel</label>
                <input
                  type="email"
                  required
                  placeholder="pharmacien@domaine.tg"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Rôle attribué</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="PHARMACIEN">Pharmacien Titulaire ONPT</option>
                  <option value="DEVELOPPEUR">Développeur / Intégrateur LGO</option>
                  <option value="DATA_ADMIN">Administrateur DPML / Ministère</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Envoyer l'Accréditation
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toastMessage && createPortal(
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in z-[100] text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}


      {/* MODAL CONFIGURATION FEDAPAY */}
      {isFedapayConfigOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setIsFedapayConfigOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Passerelle FedaPay Togo</span>
              </div>
              <h3 className="text-lg font-black text-white">Paramétrage Agrégateur FedaPay</h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Configuration des clés d'API FedaPay (Live & Sandbox), Webhooks et Payouts bancaires.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              {/* Account info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Compte FedaPay Marchand</span>
                  <span className="font-bold text-slate-900">{fedapayConfig.merchantName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">ID Compte FedaPay</span>
                  <span className="font-mono font-bold text-emerald-800">{fedapayConfig.merchantId}</span>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div>
                  <span className="font-bold text-slate-900 block">Environnement Actif FedaPay</span>
                  <span className="text-[11px] text-slate-500">Basculez entre le mode Sandbox (Test) et Production (Live).</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFedapayConfig({ ...fedapayConfig, mode: 'SANDBOX' })}
                    className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                      fedapayConfig.mode === 'SANDBOX' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setFedapayConfig({ ...fedapayConfig, mode: 'LIVE' })}
                    className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                      fedapayConfig.mode === 'LIVE' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live (Prod)
                  </button>
                </div>
              </div>

              {/* API Keys */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clé Publique FedaPay (Public Key)</label>
                  <input
                    type="text"
                    readOnly
                    value={fedapayConfig.mode === 'LIVE' ? fedapayConfig.publicKeyLive : fedapayConfig.publicKeySandbox}
                    className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clé Secrète FedaPay (Secret Key)</label>
                  <input
                    type="text"
                    readOnly
                    value={fedapayConfig.secretKeyLive}
                    className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 font-bold"
                  />
                </div>
              </div>

              {/* Webhook */}
              <div className="space-y-1.5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900">URL Webhook Écouteur Galenis</span>
                  <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Actif 200 OK</span>
                </div>
                <code className="block font-mono text-[11px] text-emerald-800 bg-white p-2 rounded-lg border border-emerald-200 break-all font-bold">
                  {fedapayConfig.webhookUrl}
                </code>
                <p className="text-[10px] text-emerald-800 font-medium">
                  Événements écoutés : <code className="font-bold">transaction.created</code>, <code className="font-bold">transaction.approved</code>, <code className="font-bold">payout.success</code>.
                </p>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFedapayConfigOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFedapayConfigOpen(false);
                    setToastMessage("Paramètres FedaPay enregistrés avec succès.");
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                >
                  Enregistrer les Clés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TEST PAYMENT MODAL */}
      <PaymentModal
        isOpen={showAdminPaymentModal}
        onClose={() => setShowAdminPaymentModal(false)}
        onSuccess={() => {
          setShowAdminPaymentModal(false);
          setToastMessage("Paiement FedaPay de test validé avec succès !");
        }}
        planName="Galenis Pro Test (Mensuel)"
        amountFcfa={5000}
        clientName="Pharmacie Populaire Tokoin"
        clientEmail="contact@pharmacietokoin.tg"
      />

      {/* OFFICIAL A4 INVOICE MODAL */}
      {currentInvoice && (
        <InvoiceModal
          isOpen={!!currentInvoice}
          onClose={() => setCurrentInvoice(null)}
          invoice={currentInvoice}
        />
      )}

      {/* DEVELOPER DOSSIER REVIEW MODAL */}
      {selectedDossierForReview && (
        <DeveloperDossierReviewModal
          isOpen={!!selectedDossierForReview}
          onClose={() => setSelectedDossierForReview(null)}
          dossier={selectedDossierForReview}
          adminName={role === 'SUPER_ADMIN' ? 'Super Administrateur Central (DPML/ONPT)' : 'Data Administrateur National'}
          onReviewCompleted={(updatedDossier) => {
            loadAllAdminData();
            showToast(
              updatedDossier.status === 'APPROVED'
                ? `Agrément de Production validé avec succès pour ${updatedDossier.organization} (100k req/j) !`
                : `Dossier de ${updatedDossier.organization} marqué non conforme / refusé.`
            );
          }}
        />
      )}

    </div>
  );
};

