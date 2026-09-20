import React, { useState } from 'react';
import { PharmacyRegistrationForm } from './PharmacyRegistrationForm';
import { VitrinePosterModal } from './VitrinePosterModal';
import { StockImportModal } from './StockImportModal';
import { GalenisBrandIdent } from '../GalenisBrandIdent';
import { LionIcon } from '../LionIcon';
import { TogoLionIcon } from '../TogoEmblems';
import { PharmacyUiverseLoader } from '../common/PharmacyUiverseLoader';

import { createPortal } from 'react-dom';
import { Pharmacy, PharmacyDrugStock, Drug, Reservation, ServiceType, MobilePaymentType } from '../../types';
import { 
  updatePharmacy, 
  updateGuardStatus, 
  updateDrugStock, 
  updateReservationStatus,
  addDrug,
  StockMergeResult
} from '../../services/pharmacyStorage';
import { 
  Building2, 
  Clock, 
  Phone, 
  Calendar, 
  Pill, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Edit3, 
  Save, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Plus,
  Globe,
  Smartphone,
  UserCheck,
  KeyRound,
  LogIn,
  LogOut,
  ArrowRight,
  Lock,
  UserPlus,
  FileCheck,
  Building,
  FileText,
  X,
  Shield,
  Check,
  Mail,
  RefreshCw,
  Star,
  AlertTriangle,
  HelpCircle,
  Send,
  Printer,
  QrCode,
  Upload,
  FileSpreadsheet,
  Camera
} from 'lucide-react';

interface DashboardViewProps {
  pharmacies: Pharmacy[];
  drugs: Drug[];
  stocks: PharmacyDrugStock[];
  reservations: Reservation[];
  onRefreshData: () => void;
  currentUser?: { id: string; name: string; role: string; organization?: string; } | null;
  onNavigateToLogin?: () => void;
  onSetCurrentUser?: (user: any) => void;
  onOpenFaq?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pharmacies,
  drugs,
  stocks,
  reservations,
  onRefreshData,
  currentUser,
  onNavigateToLogin,
  onSetCurrentUser,
  onOpenFaq
}) => {
  const [selectedPharmaId, setSelectedPharmaId] = useState<string>(pharmacies[0]?.id || 'pharma-1');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'GARDE' | 'STOCKS'>('PROFILE');
  const [showPosterModal, setShowPosterModal] = useState(false);

  // Onboarding & Auth State
  // Auto-select pharmacy based on current user's organization
  React.useEffect(() => {
    if (currentUser?.role === 'PHARMACIEN' && currentUser.organization) {
      const matched = pharmacies.find(p => p.name.toLowerCase().includes(currentUser.organization!.toLowerCase()));
      if (matched) setSelectedPharmaId(matched.id);
    }
  }, [currentUser, pharmacies]);

  const pharma = pharmacies.find(p => p.id === selectedPharmaId) || pharmacies[0];
  const pharmaStocks = stocks.filter(s => s.pharmacyId === pharma?.id);

  // Profile Edit State
  const [editName, setEditName] = useState(pharma?.name || '');
  const [editAddress, setEditAddress] = useState(pharma?.address || '');
  const [editPhone, setEditPhone] = useState(pharma?.phone || '');
  const [editWhatsapp, setEditWhatsapp] = useState(pharma?.whatsapp || '');
  const [editWebsite, setEditWebsite] = useState(pharma?.website || '');
  const [editServices, setEditServices] = useState<ServiceType[]>(pharma?.services || []);
  const [editMobilePayments, setEditMobilePayments] = useState<MobilePaymentType[]>(pharma?.mobilePayments || []);
  const [editLat, setEditLat] = useState(pharma?.lat || 6.1375);
  const [editLng, setEditLng] = useState(pharma?.lng || 1.2125);
  const [editWeekdayHours, setEditWeekdayHours] = useState(pharma?.hours.weekday || '');
  const [editSaturdayHours, setEditSaturdayHours] = useState(pharma?.hours.saturday || '');
  const [editSundayHours, setEditSundayHours] = useState(pharma?.hours.sunday || '');
  const [editPharmacist, setEditPharmacist] = useState(pharma?.pharmacistInCharge || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const ALL_MOBILE_PAYMENTS: MobilePaymentType[] = ['T-Money', 'Flooz', 'Carte Bancaire'];
  const ALL_SERVICES: { key: ServiceType; label: string }[] = [
    { key: 'GARDE_24H', label: 'GARDE 24H' },
    { key: 'PAIEMENT_MOBILE', label: 'PAIEMENT MOBILE' },
    { key: 'LIVRAISON', label: 'LIVRAISON' },
    { key: 'TEST_RAPIDE_PALU', label: 'TEST RAPIDE PALU' },
    { key: 'PRISE_TENSION', label: 'PRISE TENSION' },
    { key: 'TEST_GLYCEMIE', label: 'TEST GLYCÉMIE' },
    { key: 'CONSEIL_ORAL', label: 'CONSEIL PHARMACEUTIQUE' },
  ];

  const toggleMobilePayment = (mp: MobilePaymentType) => {
    if (editMobilePayments.includes(mp)) {
      setEditMobilePayments(editMobilePayments.filter(x => x !== mp));
    } else {
      setEditMobilePayments([...editMobilePayments, mp]);
    }
  };

  const toggleService = (srv: ServiceType) => {
    if (editServices.includes(srv)) {
      setEditServices(editServices.filter(x => x !== srv));
    } else {
      setEditServices([...editServices, srv]);
    }
  };

  // Add Drug State
  const [showAddDrugForm, setShowAddDrugForm] = useState(false);
  const [showStockImportModal, setShowStockImportModal] = useState(false);
  const [stockImportReport, setStockImportReport] = useState<StockMergeResult | null>(null);
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugDci, setNewDrugDci] = useState('');
  const [newDrugCategory, setNewDrugCategory] = useState('Général');
  const [newDrugPrice, setNewDrugPrice] = useState<number>(1500);
  const [newDrugStatus, setNewDrugStatus] = useState<'AVAILABLE' | 'OUT_OF_STOCK'>('AVAILABLE');
  const [drugAddSuccess, setDrugAddSuccess] = useState(false);

  // Add new drug
  const handleAddNewDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName.trim()) return;

    const createdDrug = addDrug({
      name: newDrugName.trim(),
      dci: newDrugDci.trim() || newDrugName.trim(),
      genericName: newDrugDci.trim() || newDrugName.trim(),
      category: newDrugCategory,
      description: 'Médicament ajouté à la base nationale'
    });

    if (pharma) {
      updateDrugStock(pharma.id, createdDrug.id, newDrugStatus, newDrugPrice);
    }

    setNewDrugName('');
    setNewDrugDci('');
    setDrugAddSuccess(true);
    setTimeout(() => setDrugAddSuccess(false), 3000);
    onRefreshData();
  };

  // Sync edit state when pharma changes
  const handleSelectPharma = (id: string) => {
    setSelectedPharmaId(id);
    const p = pharmacies.find(x => x.id === id);
    if (p) {
      setEditName(p.name);
      setEditAddress(p.address);
      setEditPhone(p.phone);
      setEditWhatsapp(p.whatsapp);
      setEditWebsite(p.website || '');
      setEditServices(p.services || []);
      setEditMobilePayments(p.mobilePayments || []);
      setEditLat(p.lat);
      setEditLng(p.lng);
      setEditWeekdayHours(p.hours.weekday);
      setEditSaturdayHours(p.hours.saturday);
      setEditSundayHours(p.hours.sunday);
      setEditPharmacist(p.pharmacistInCharge);
    }
  };

  // Toggle Guard Status
  const handleToggleGuard = (isGuard: boolean) => {
    if (!pharma) return;
    updateGuardStatus(pharma.id, isGuard, isGuard ? 'DE_GARDE' : 'OPEN');
    onRefreshData();
  };

  // Toggle Drug Stock Availability
  const handleSetStockStatus = (drugId: string, status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ORDER_POSSIBLE', price: number) => {
    if (!pharma) return;
    updateDrugStock(pharma.id, drugId, status, price);
    onRefreshData();
  };

  // Update Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharma) return;

    updatePharmacy({
      ...pharma,
      name: editName,
      address: editAddress,
      phone: editPhone,
      whatsapp: editWhatsapp,
      website: editWebsite.trim() || undefined,
      services: editServices,
      mobilePayments: editMobilePayments,
      lat: Number(editLat),
      lng: Number(editLng),
      pharmacistInCharge: editPharmacist,
      hours: {
        weekday: editWeekdayHours,
        saturday: editSaturdayHours,
        sunday: editSundayHours
      },
      lastVerified: 'Mis à jour par la pharmacie',
      claimed: true
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefreshData();
  };

  const handleRegister = (data: any) => {
    const newId = `pharma-${Date.now()}`;
    const formattedName = data.name.trim().toLowerCase().startsWith('pharmacie') 
       ? data.name.trim() 
       : `Pharmacie ${data.name.trim()}`;
       
    const newPharmacy: Pharmacy = {
      validationStatus: 'PENDING',
      id: newId,
      name: formattedName,
      pharmacistInCharge: data.pharmacistInCharge.trim(),
      city: data.city.trim() || 'Lomé',
      region: data.region,
      quarter: data.city.trim().split('-')[1]?.trim() || 'Lomé Centre',
      address: data.address.trim() || `${data.city}, Togo`,
      phone: data.phone.trim(),
      whatsapp: data.whatsapp.trim() || data.phone.trim(),
      email: data.email.trim(),
      lat: 6.1375 + (Math.random() - 0.5) * 0.04,
      lng: 1.2125 + (Math.random() - 0.5) * 0.04,
      hours: {
        weekday: '07h30 - 20h00',
        saturday: '08h00 - 18h00',
        sunday: 'Fermé (sauf garde)'
      },
      status: 'OPEN',
      is24h: data.services.includes('GARDE_24H'),
      isGuardToday: false,
      services: data.services,
      mobilePayments: data.mobilePayments,
      photos: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60'],
      rating: 5.0,
      reviewCount: 1,
      verificationSource: 'Déclaration pharmacie',
      claimed: true,
      lastVerified: 'Officine Enregistrée & Validée'
    };

    updatePharmacy(newPharmacy);
    onRefreshData();
    
    if (onSetCurrentUser) {
      onSetCurrentUser({
        id: `user-${Date.now()}`,
        name: data.pharmacistInCharge,
        role: 'PHARMACIEN',
        organization: formattedName
      });
    }
  };

  if (!currentUser || currentUser.role !== 'PHARMACIEN') {
    return (
      <PharmacyRegistrationForm 
        onRegister={handleRegister} 
        onLoginClick={() => onNavigateToLogin?.()} 
      />
    );
  }


  if (!pharma) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex items-center justify-center min-h-[50vh]">
        <PharmacyUiverseLoader 
          size="lg"
          theme="emerald"
          label="Chargement du tableau de bord de l'officine..."
          subLabel="Accès sécurisé ONPT & synchronisation des stocks de garde"
        />
      </div>
    );
  }

  if (pharma.validationStatus === 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Compte en cours de vérification</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Bienvenue Dr. {pharma.pharmacistInCharge}. Votre inscription pour l'officine <strong>{pharma.name}</strong> est bien enregistrée. 
          Un administrateur de l'Ordre National ou de la DPML doit valider vos informations professionnelles (N° ONPT) avant que vous ne puissiez accéder aux outils de gestion des stocks et de garde.
        </p>
        <button
          onClick={() => {
            if (onSetCurrentUser) onSetCurrentUser(null);
            if (onNavigateToLogin) onNavigateToLogin();
          }}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Se déconnecter en attendant
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">      
      {/* Official Animated Galenis Brand Ident */}
      <GalenisBrandIdent autoPlay={true} loop={false} />

      {/* Top Header Bar when Logged In */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00A878]/20 text-emerald-700 border border-[#00A878]/40 flex items-center justify-center shrink-0 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 flex flex-wrap items-center gap-2">
              <span>{pharma.name}</span>
              <span className="bg-[#00A878] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                Officine Active
              </span>
            </div>
            <div className="text-slate-600 text-xs mt-0.5">
              Titulaire: <strong className="text-slate-900">Dr. {pharma.pharmacistInCharge}</strong> • {pharma.city} ({pharma.region})
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Pharmacy Selection Switcher */}
          <select
            value={selectedPharmaId}
            onChange={(e) => handleSelectPharma(e.target.value)}
            className="bg-emerald-50 text-emerald-800 font-bold text-xs py-2 px-3 rounded-xl border border-emerald-200 focus:border-emerald-500 w-full sm:w-auto"
          >
            {pharmacies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>

          {onOpenFaq && (
            <button
              type="button"
              onClick={onOpenFaq}
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shrink-0 w-full sm:w-auto shadow-2xs cursor-pointer"
              title="Consulter le Guide & FAQ Officine (Lion du Togo)"
            >
              <TogoLionIcon className="w-4 h-4 text-emerald-600" />
              <span>Guide & FAQ Officine</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onSetCurrentUser) onSetCurrentUser(null);
              if (onNavigateToLogin) onNavigateToLogin();
            }}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors shrink-0 w-full sm:w-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Top Pharmacy Switcher & Analytics Cards */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-700/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border-emerald-200 text-emerald-700 border border-[#00A878]/30 mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Espace Officine & Gestion Pharmacie</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Tableau de Bord Pharmacie
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Gérez votre fiche officielle, basculez vos tours de garde en 1 clic et informez les citoyens sur la disponibilité de vos stocks.
            </p>
          </div>

          {/* Pharmacy Selection Dropdown */}
          <div className="bg-emerald-50 border-emerald-200/80 border border-emerald-200 p-3 rounded-xl shrink-0">
            <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-bold mb-1">
              Sélectionner votre officine
            </label>
            <select
              value={selectedPharmaId}
              onChange={(e) => handleSelectPharma(e.target.value)}
              className="bg-slate-50 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg border border-slate-300 focus:border-[#00A878] w-full sm:w-64"
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city}) {p.claimed ? '(Revendiquée)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Metrics for the selected pharmacy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-emerald-50 border-emerald-200/50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-[11px] text-slate-600 font-semibold uppercase flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Vues de Fiche (30j)</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">1 842</div>
            <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#00A878]" /> +24% via l'API Citoyenne
            </div>
          </div>

          <div className="bg-emerald-50 border-emerald-200/50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-[11px] text-slate-600 font-semibold uppercase flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>Clics WhatsApp</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">319</div>
            <div className="text-[10px] text-slate-600 mt-1">Patients redirigés direct</div>
          </div>

          <div className="bg-emerald-50 border-emerald-200/50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-[11px] text-slate-600 font-semibold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Base Nationale</span>
            </div>
            <div className="text-sm font-extrabold text-emerald-700 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A878] stroke-[2.25]" />
              <span>Synchronisé</span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Officine Référencée</div>
          </div>

          <div className="bg-emerald-50 border-emerald-200/50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-[11px] text-slate-600 font-semibold uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Statut Garde</span>
            </div>
            <div className="text-sm font-bold mt-2">
              {pharma.status === 'DE_GARDE' ? (
                <span className="text-white font-bold bg-[#D97706] px-2 py-1 rounded border border-amber-400/40 flex items-center gap-1.5 w-fit shadow-2xs">
                  <TogoLionIcon className="w-3.5 h-3.5 text-white" />
                  <span>DE GARDE ACTIF</span>
                </span>
              ) : (
                <span className="text-slate-600 font-medium bg-emerald-50 border-emerald-200 px-2 py-1 rounded">
                  Service Normal
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts / Notifications */}
      <div className="space-y-3 mb-6">
        {(!pharma.guardSchedule || pharma.guardSchedule.length === 0) && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-800 text-xs shadow-sm">
             <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
             <div>
               <strong className="block text-sm font-extrabold text-rose-900 mb-0.5">Mise à jour des Gardes Requise</strong>
               Votre planning de garde n'est pas renseigné. Les patients et le Ministère de la Santé se basent sur ces données pour les urgences. Veuillez le mettre à jour dans l'onglet "Planning & Gardes".
             </div>
          </div>
        )}
        {pharmaStocks.length > 0 && pharmaStocks.some(s => {
           const lu = new Date(s.lastUpdated);
           const sevenDaysAgo = new Date();
           sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
           return isNaN(lu.getTime()) || lu < sevenDaysAgo;
        }) && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-800 text-xs shadow-sm">
             <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
             <div>
               <strong className="block text-sm font-extrabold text-amber-900 mb-0.5">Inventaire Stagnant (&gt; 7 Jours)</strong>
               Certains de vos stocks de médicaments n'ont pas été actualisés depuis plus de 7 jours. Maintenir des prix et disponibilités à jour attire les citoyens et évite les déplacements inutiles.
             </div>
          </div>
        )}
      </div>

      {/* Dashboard Feature Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-3 font-semibold text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'PROFILE'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. Fiche Renseignements Officine (Nom, Adresse, Tél, GPS, Horaires)</span>
          </button>

          <button
            onClick={() => setActiveTab('GARDE')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'GARDE'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Statut & Tour de Garde (1 Clic)</span>
          </button>

          <button
            onClick={() => setActiveTab('STOCKS')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'STOCKS'
                ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-4 h-4 text-emerald-400" />
            <span>3. Indication Disponibilité Médicaments Essentiels</span>
          </button>

          {/* Quick A4 Poster Button */}
          <button
            type="button"
            onClick={() => setShowPosterModal(true)}
            className="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold shadow-sm cursor-pointer ml-auto shrink-0 border border-emerald-500/50"
            title="Générer et imprimer l'affiche A4 officielle avec QR Code pour la vitrine de l'officine"
          >
            <Printer className="w-4 h-4" />
            <span>Affiche Vitrine A4 (Garde & QR Code)</span>
          </button>
        </div>

        {/* TAB 1: GARDE MANAGER */}
        {activeTab === 'GARDE' && (
          <div className="py-6 space-y-6">
            
            {/* Vitrine Poster Notice & Explanatory Guide for Pharmacists */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                        Espace Pharmacien Titulaire • Obligation Déontologique
                      </span>
                      <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                        Conforme ONPT & DPML
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">
                      Affiche Officielle de Vitrine A4 avec QR Code Intelligent
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Générez en 1 clic l'affiche réglementaire à apposer sur la vitrine extérieure de votre officine.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPosterModal(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-2 shrink-0 active:scale-98"
                >
                  <Printer className="w-4 h-4" />
                  <span>Ouvrir & Imprimer l'Affiche A4</span>
                </button>
              </div>

              {/* 3 Practical Explanatory Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-emerald-200/70 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>1. Obligation Légale d'Affichage</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Selon la réglementation pharmaceutique en vigueur au Togo, toute officine doit obligatoirement informer les usagers de son statut de garde ou indiquer les officines ouvertes les plus proches en cas de fermeture.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span>2. QR Code Intelligent de Nuit</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Si vous êtes <strong>fermé</strong>, le passant flashe le QR Code à travers la vitre avec son smartphone et est immédiatement orienté avec guidage GPS direct vers la garde ouverte sans déranger l'équipe officinale.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>3. Conseils de Pose & Visibilité</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Imprimez sur papier A4 standard, insérez dans une pochette étanche ou un cadre vitrine éclairé à environ 1,50 m du sol pour une lecture facile du QR code depuis la rue.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span>Déclaration Directe de Tour de Garde</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Plus besoin de téléphoner à l'administrateur. Activez ou désactivez le statut "De Garde" pour mettre à jour instantanément la carte citoyenne, les applications et le ministère.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleGuard(true)}
                    className={`px-5 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 ${
                      pharma.status === 'DE_GARDE'
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>ACTIVER MODE GARDE</span>
                  </button>

                  <button
                    onClick={() => handleToggleGuard(false)}
                    className={`px-4 py-3 rounded-xl font-bold text-xs transition-all ${
                      pharma.status !== 'DE_GARDE'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    }`}
                  >
                    Désactiver (Service Normal)
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <strong>Statut actuel dans le Référentiel National : </strong>
                  {pharma.status === 'DE_GARDE' ? (
                    <span className="font-extrabold text-amber-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Pharmacie de Garde (Affichée en priorité sur la carte Togo)</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-700">
                      Horaires normaux ({pharma.hours.weekday})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-amber-800">
                  Màj: {pharma.lastVerified}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMPLE DRUG STOCK TOGGLE & ADD DRUG */}
        {activeTab === 'STOCKS' && (
          <div className="py-6 space-y-6">

            {/* IMPORT SUCCESS NOTIFICATION BANNER */}
            {stockImportReport && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-extrabold text-sm text-emerald-900">
                      Mise à jour du stock par document réussie !
                    </h4>
                    <p className="mt-0.5 text-emerald-800">
                      <strong>+{stockImportReport.addedCount}</strong> nouvelles références ajoutées, <strong>{stockImportReport.updatedCount}</strong> prix/statuts actualisés, et <strong>{stockImportReport.unchangedCount}</strong> références existantes préservées intactes sans suppression.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStockImportReport(null)}
                  className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ACTION BANNER: DOCUMENT/IMAGE UPLOAD VS MANUAL */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-slate-700">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-900/90 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Nouveau • Import Automatisé
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    Bordereaux CAMEG, Ubipharm, Laborex, Tedis, CSV, Photos
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  Mettez à jour vos stocks en 1 clic sans saisie manuelle
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prenez en photo votre bordereau de livraison grossiste ou téléversez un fichier d'inventaire. L'IA extrait automatiquement les médicaments et fusionne les données <strong>sans jamais supprimer l'existant</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowStockImportModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 text-xs transition-all active:scale-98 cursor-pointer"
                >
                  <LionIcon className="w-4 h-4 text-slate-950" />
                  <span>Importer Bordereau / Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddDrugForm(!showAddDrugForm)}
                  className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-3.5 py-3 rounded-xl flex items-center gap-2 text-xs transition-colors border border-white/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{showAddDrugForm ? 'Fermer la saisie' : '+ Ajout Manuel'}</span>
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2">
                <strong>Bascule rapide au comptoir :</strong>
                <span>Cliquez directement sur</span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold border border-emerald-300 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  <span>Disponible</span>
                </span>
                <span>ou</span>
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-extrabold border border-rose-300 text-[10px]">
                  <XCircle className="w-3 h-3 text-rose-600 stroke-[2.5]" />
                  <span>En Rupture</span>
                </span>
                <span>dans le tableau ci-dessous pour changer la disponibilité instantanément.</span>
              </div>
            </div>

            {/* Add New Drug Form */}
            {showAddDrugForm && (
              <form onSubmit={handleAddNewDrug} className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 text-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Médicament à Référencer</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddDrugForm(false)}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    Fermer
                  </button>
                </div>

                {drugAddSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-200 font-bold rounded-xl text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.25]" />
                    <span>Nouveau médicament référencé avec succès !</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nom Commercial (ex: Efferalgan 1000mg)</label>
                    <input
                      type="text"
                      required
                      value={newDrugName}
                      onChange={e => setNewDrugName(e.target.value)}
                      placeholder="Nom du médicament..."
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">DCI / Molécule (ex: Paracétamol)</label>
                    <input
                      type="text"
                      value={newDrugDci}
                      onChange={e => setNewDrugDci(e.target.value)}
                      placeholder="DCI..."
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Catégorie</label>
                    <select
                      value={newDrugCategory}
                      onChange={e => setNewDrugCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold"
                    >
                      <option value="Antalgique / Anti-inflammatoire">Antalgique / Anti-inflammatoire</option>
                      <option value="Antibiotique">Antibiotique</option>
                      <option value="Antipaludéen">Antipaludéen</option>
                      <option value="Antihypertenseur / Cardio">Antihypertenseur / Cardio</option>
                      <option value="Diabète / Insuline">Diabète / Insuline</option>
                      <option value="Général">Autre catégorie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Prix indicatif FCFA</label>
                    <input
                      type="number"
                      value={newDrugPrice}
                      onChange={e => setNewDrugPrice(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-300">Statut initial pour {pharma.name} :</span>
                    <button
                      type="button"
                      onClick={() => setNewDrugStatus('AVAILABLE')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                        newDrugStatus === 'AVAILABLE' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>En Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewDrugStatus('OUT_OF_STOCK')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                        newDrugStatus === 'OUT_OF_STOCK' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rupture</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-md"
                  >
                    Enregistrer le Produit
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drugs.map((drug) => {
                const stock = pharmaStocks.find(s => s.drugId === drug.id);
                const currentStatus = stock?.status || 'OUT_OF_STOCK';
                const currentPrice = stock?.priceFcfa || 500;

                return (
                  <div key={drug.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{drug.name}</h4>
                        <span className="text-[11px] text-slate-500">DCI: {drug.dci}</span>
                      </div>

                      {/* Price editor */}
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500 font-semibold">Prix (FCFA):</span>
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => {
                            const newPrice = parseInt(e.target.value) || 0;
                            handleSetStockStatus(drug.id, currentStatus, newPrice);
                          }}
                          className="w-20 p-1 border border-slate-300 rounded font-bold text-slate-900 bg-white text-right"
                        />
                      </div>
                    </div>

                    {/* Stock status toggle buttons */}
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        onClick={() => handleSetStockStatus(drug.id, 'AVAILABLE', currentPrice)}
                        className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === 'AVAILABLE'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disponible</span>
                      </button>

                      <button
                        onClick={() => handleSetStockStatus(drug.id, 'OUT_OF_STOCK', currentPrice)}
                        className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === 'OUT_OF_STOCK'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rupture</span>
                      </button>

                      <button
                        onClick={() => handleSetStockStatus(drug.id, 'ORDER_POSSIBLE', currentPrice)}
                        className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === 'ORDER_POSSIBLE'
                            ? 'bg-amber-600 text-white shadow'
                            : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Commande</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & HOURS EDIT */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="py-6 space-y-4 text-xs max-w-2xl">
            {savedSuccess && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fiche Renseignements Officine mise à jour avec succès dans le Référentiel National Togo !
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 mb-2">
              <h4 className="font-bold text-slate-900 text-sm">Base Nationale Pharmacies Togo</h4>
              <p className="text-slate-600">
                Chaque officine dispose d'un accès sécurisé pour maintenir ses informations officielles en temps réel (Nom, Adresse, Téléphone, GPS, Horaires, Garde).
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom Officiel de la Pharmacie</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Adresse Physique Complète & Repères</label>
              <input
                type="text"
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pharmacien Titulaire / Dr Responsable</label>
              <input
                type="text"
                value={editPharmacist}
                onChange={e => setEditPharmacist(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone de l'Officine</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Numéro WhatsApp Direct</label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={e => setEditWhatsapp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Site Web Officiel de la Pharmacie (Optionnel)</span>
              </label>
              <input
                type="url"
                value={editWebsite}
                onChange={e => setEditWebsite(e.target.value)}
                placeholder="https://www.pharmacie-agoe.tg"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Lien vers le site officiel de votre officine s'il existe.</p>
            </div>

            {/* Config Payment Methods */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Moyens de Paiement Accéptés</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_MOBILE_PAYMENTS.map(mp => {
                  const isSelected = editMobilePayments.includes(mp);
                  return (
                    <button
                      type="button"
                      key={mp}
                      onClick={() => toggleMobilePayment(mp)}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {mp === 'Carte Bancaire' ? <CreditCard className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      </div>
                      <span>{mp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config Services Offered */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Services proposés par l'officine</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_SERVICES.map(srv => {
                  const isSelected = editServices.includes(srv.key);
                  return (
                    <button
                      type="button"
                      key={srv.key}
                      onClick={() => toggleService(srv.key)}
                      className={`p-2.5 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span>{srv.label}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {isSelected ? 'Activé' : 'Désactivé'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Coordonnées GPS Officine (Géolocalisation Carte)</span>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setEditLat(parseFloat(pos.coords.latitude.toFixed(5)));
                          setEditLng(parseFloat(pos.coords.longitude.toFixed(5)));
                        },
                        (err) => {
                          alert("Impossible de récupérer la position GPS. Entrez la latitude et longitude manuellement.");
                        }
                      );
                    }
                  }}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 stroke-[2.25]" />
                  <span>Capture GPS Automatique</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Latitude (ex: 6.2085)</label>
                  <input
                    type="number"
                    step="any"
                    value={editLat}
                    onChange={e => setEditLat(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Longitude (ex: 1.2135)</label>
                  <input
                    type="number"
                    step="any"
                    value={editLng}
                    onChange={e => setEditLng(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <h5 className="font-bold text-slate-800">Horaires d'Ouverture</h5>
              <div>
                <label className="block text-slate-600 text-[11px] font-semibold mb-0.5">Semaine (Lundi - Vendredi)</label>
                <input
                  type="text"
                  value={editWeekdayHours}
                  onChange={e => setEditWeekdayHours(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-0.5">Samedi</label>
                  <input
                    type="text"
                    value={editSaturdayHours}
                    onChange={e => setEditSaturdayHours(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-0.5">Dimanche</label>
                  <input
                    type="text"
                    value={editSundayHours}
                    onChange={e => setEditSundayHours(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-md text-xs transition-colors flex items-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer dans la Base Nationale</span>
            </button>
          </form>
        )}

      </div>

      {/* VITRINE POSTER A4 MODAL */}
      <VitrinePosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        pharmacy={pharma}
        allPharmacies={pharmacies}
      />

      {/* STOCK BULK IMPORT VIA OCR / DOCUMENT / IMAGE MODAL */}
      {pharma && (
        <StockImportModal
          isOpen={showStockImportModal}
          onClose={() => setShowStockImportModal(false)}
          pharmacy={pharma}
          onSuccess={(result) => {
            setStockImportReport(result);
            onRefreshData();
          }}
        />
      )}
    </div>
  );
};
