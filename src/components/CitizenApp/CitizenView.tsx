import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pharmacy, Drug, PharmacyDrugStock, UserSession } from '../../types';
import { PharmacyCard } from './PharmacyCard';
import { InteractiveMap } from './InteractiveMap';
import { PharmacyDetailModal } from './PharmacyDetailModal';
import { ReportErrorModal } from './ReportErrorModal';
import { GuardScheduleModal } from './GuardScheduleModal';
import { InsuranceSimulatorModal } from './InsuranceSimulatorModal';
import { PriceEstimateBeforeTravelModal } from './PriceEstimateBeforeTravelModal';
import { DrugAvailabilitySearch } from './DrugAvailabilitySearch';
import { TogoNetworkMap } from './TogoNetworkMap';
import { PartnerMarquee } from '../PartnerMarquee';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';
import { TOGO_CITIES } from '../../data/mockPharmacies';
import { calculateDistanceKm, getSanitaryAlerts } from '../../services/pharmacyStorage';
import { PharmacyUiverseLoader } from '../common/PharmacyUiverseLoader';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import { NewReportModal } from '../CommunityVigilance/NewReportModal';
import { NewReviewModal } from '../CommunityVigilance/NewReviewModal';
import headerBgImage from '../../assets/images/pharmacy_header_bg_1786197240812.jpg';
import galenisMascotImg from '../../assets/images/galenis_assistant_mascot.jpg';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal, 
  Map as MapIcon, 
  List, 
  CheckCircle2, 
  Navigation,
  PhoneCall,
  Calendar,
  ArrowUpDown,
  MessageSquareText,
  Clock,
  Truck,
  CreditCard,
  X,
  AlertTriangle,
  ShieldAlert,
  MessageSquareHeart,
  ChevronRight,
  Share2,
  Smartphone,
  Info,
  Bot,
  Lock,
  Calculator
} from 'lucide-react';

interface CitizenViewProps {
  pharmacies?: Pharmacy[];
  drugs?: Drug[];
  stocks?: PharmacyDrugStock[];
  currentUser?: UserSession | null;
  onOpenPharmacyDashboard?: () => void;
  onOpenCommunityVigilance?: () => void;
  onOpenAiAssistant?: () => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  pharmacies = [],
  drugs = [],
  stocks = [],
  currentUser,
  onOpenPharmacyDashboard,
  onOpenCommunityVigilance,
  onOpenAiAssistant
}) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP' | 'SPLIT'>('SPLIT');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('TOUTES');
  const [filterGuardOnly, setFilterGuardOnly] = useState<boolean>(false);
  const [filterOpenNow, setFilterOpenNow] = useState<boolean>(false);
  const [filterDelivery, setFilterDelivery] = useState<boolean>(false);
  const [filterMobilePay, setFilterMobilePay] = useState<boolean>(false);

  // Modals
  const [detailPharmacy, setDetailPharmacy] = useState<Pharmacy | null>(null);
  const [reportPharmacy, setReportPharmacy] = useState<Pharmacy | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isGuardModalOpen, setIsGuardModalOpen] = useState<boolean>(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState<boolean>(false);
  const [insuranceDrug, setInsuranceDrug] = useState<Drug | null>(null);
  const [showEmergencyShareGuide, setShowEmergencyShareGuide] = useState<boolean>(false);
  const [estimatePharmacy, setEstimatePharmacy] = useState<Pharmacy | null>(null);
  const [isPriceEstimatorOpen, setIsPriceEstimatorOpen] = useState<boolean>(false);

  const activeAlerts = (getSanitaryAlerts() || []).filter(a => a.status === 'ACTIVE');
  const topCriticalAlert = activeAlerts.find(a => a.severity === 'CRITIQUE') || activeAlerts[0];

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Drug Search State
  const [drugSearchQuery, setDrugSearchQuery] = useState('');

  // Drug Search Results: matching drugs & available stocks sorted by distance
  const matchingDrugs = drugSearchQuery.trim() 
    ? (drugs || []).filter(d => 
        (d.name || '').toLowerCase().includes(drugSearchQuery.toLowerCase()) || 
        (d.dci || '').toLowerCase().includes(drugSearchQuery.toLowerCase())
      )
    : [];

  const matchingDrugIds = new Set(matchingDrugs.map(d => d.id));

  const pharmaciesWithDrug = (stocks || [])
    .filter(s => s.status === 'AVAILABLE' && matchingDrugIds.has(s.drugId))
    .map(s => {
      const pharma = (pharmacies || []).find(p => p.id === s.pharmacyId);
      const drug = (drugs || []).find(d => d.id === s.drugId);
      let distanceKm: number = 0;
      if (pharma) {
        const uLat = userLocation?.lat || 6.1375;
        const uLng = userLocation?.lng || 1.2125;
        distanceKm = calculateDistanceKm(uLat, uLng, pharma.lat, pharma.lng);
      }
      return { stock: s, pharmacy: pharma, drug, distanceKm };
    })
    .filter(item => item.pharmacy !== undefined)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Geolocation trigger
  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setIsLocating(false);
        },
        () => {
          // Fallback to Lomé Center if location fails
          setUserLocation({ lat: 6.1375, lng: 1.2125 });
          setIsLocating(false);
        }
      );
    }
  };

  // Filter logic
  const filteredPharmacies = pharmacies.filter((p) => {
    const matchesQuery = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.quarter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'TOUTES' || p.city.toLowerCase() === selectedCity.toLowerCase();

    const isGuard = p.status === 'DE_GARDE' || p.isGuardToday;
    const matchesGuard = !filterGuardOnly || isGuard;

    const isOpen = p.status === 'OPEN' || isGuard;
    const matchesOpen = !filterOpenNow || isOpen;

    const matchesDelivery = !filterDelivery || p.services.includes('LIVRAISON');
    const matchesMobilePay = !filterMobilePay || p.mobilePayments.length > 0;

    return matchesQuery && matchesCity && matchesGuard && matchesOpen && matchesDelivery && matchesMobilePay;
  });

  // Calculate distance if user location is set
  const pharmaciesWithDistance = filteredPharmacies.map((p) => {
    let distanceKm: number | undefined;
    if (userLocation) {
      distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng);
    }
    return { pharmacy: p, distanceKm };
  });

  // Sort by guard first, then distance or name
  pharmaciesWithDistance.sort((a, b) => {
    const aGuard = a.pharmacy.status === 'DE_GARDE' || a.pharmacy.isGuardToday;
    const bGuard = b.pharmacy.status === 'DE_GARDE' || b.pharmacy.isGuardToday;
    if (aGuard && !bGuard) return -1;
    if (!aGuard && bGuard) return 1;

    if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
      return a.distanceKm - b.distanceKm;
    }
    return a.pharmacy.name.localeCompare(b.pharmacy.name);
  });

  const deGardeTotal = pharmacies.filter(p => p.status === 'DE_GARDE' || p.isGuardToday).length;

  return (
    <div className="space-y-6">
      
      {/* Emergency Speed Dial & Unified Action Bar */}
      <div className="relative bg-white text-slate-900 rounded-2xl p-4 shadow-xs overflow-hidden text-xs border border-slate-200">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${headerBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/95 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[#008760]" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>Urgences Médicales Togo 24h/24</span>
                <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">DIRECT</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 mt-1">
                <span>SAMU / Sapeurs-Pompiers : <a href="tel:118" className="text-[#008760] font-bold hover:underline">118</a></span>
                <span>Police Secours : <a href="tel:117" className="text-[#008760] font-bold hover:underline">117</a></span>
                <span>CHU Sylvanus Olympio : <a href="tel:+22822212501" className="text-[#008760] font-bold hover:underline">+228 22 21 25 01</a></span>
                <span>CHU Campus : <a href="tel:+22822254712" className="text-[#008760] font-bold hover:underline">+228 22 25 47 12</a></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGuardModalOpen(true)}
              className="bg-[#008760] hover:bg-[#007050] text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs transition-colors text-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Calendrier des gardes</span>
            </button>

            {onOpenCommunityVigilance && (
              <button
                onClick={onOpenCommunityVigilance}
                className="bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 border border-slate-300 font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs transition-colors text-xs cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Avis & Alertes santé</span>
                {activeAlerts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                    {activeAlerts.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assistant Santé Galenis (Mascot Card with Direct Action) */}
      {onOpenAiAssistant && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-emerald-800/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md border-2 border-emerald-400/40 shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={galenisMascotImg} 
                alt="Galenis - Votre assistant santé" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/galenis-assistant-mascot.jpg';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-extrabold">
                <TogoLionIcon className="w-3.5 h-3.5 text-emerald-300" />
                <span>Assistant Santé Intelligent</span>
                {!currentUser && (
                  <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Connexion requise
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Besoin d'aide pour comprendre une ordonnance ?
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                L'assistant Galenis vous explique vos médicaments, leurs horaires et leurs précautions simplement. <strong className="text-emerald-300">100% confidentiel et sans données personnelles.</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00A859] hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            {currentUser ? (
              <TogoLionIcon className="w-4 h-4 text-white" />
            ) : (
              <Lock className="w-4 h-4 text-white" />
            )}
            <span>{currentUser ? "Ouvrir l'Assistant Santé" : "Accéder à l'Assistant Santé"}</span>
          </button>
        </div>
      )}

      {/* Guide Pratique Citoyen : Partage d'Urgence WhatsApp & Mode SMS sans connexion */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Entraide & Urgence
                </span>
                <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">
                  Pratique
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                Envoyer une pharmacie de garde à un proche
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEmergencyShareGuide(!showEmergencyShareGuide)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showEmergencyShareGuide ? 'Masquer les conseils' : 'Comment faire ?'}</span>
          </button>
        </div>

        {/* Expandable Details */}
        {showEmergencyShareGuide && (
          <div className="mt-4 pt-4 border-t border-emerald-200/60 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs animate-in fade-in duration-200">
            {/* Box 1: WhatsApp */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>1. Par WhatsApp (avec plan GPS)</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Envoie l'adresse complète et le lien Google Maps pour guider facilement un proche ou un chauffeur de taxi/zémidjan.
              </p>
            </div>

            {/* Box 2: SMS 2G */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>2. Par SMS (sans Internet)</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Fonctionne même sans connexion internet ou forfait data, et vers les téléphones classiques à touches.
              </p>
            </div>

            {/* Box 3: Comment faire */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>3. Utilisation simple</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Sur la pharmacie de votre choix ci-dessous, cliquez sur le bouton <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">Partager</span> pour envoyer les infos en un clic.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Official Sanitary Alert Ticker Bar */}
      {topCriticalAlert && (
        <div 
          onClick={onOpenCommunityVigilance}
          className="bg-[#E11D48] border border-rose-800 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between gap-3 cursor-pointer hover:bg-rose-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-white" />
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#E11D48] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Alerte Sanitaire Officielle
                </span>
                <span className="text-[11px] text-rose-100 font-semibold">{topCriticalAlert.source}</span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">{topCriticalAlert.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-rose-100 shrink-0">
            <span>Consulter les détails</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Top Banner & Title */}
      <div className="space-y-4">
        <SponsoredAdBanner placement="HOME_TOP" />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF7EE] text-emerald-800 border border-[#00A878]/30 mb-2">
              <span>Pharmacies de garde & Médicaments</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#17324D] tracking-tight">
              Trouvez votre pharmacie au Togo
            </h2>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
              Adresses, téléphones directs, localisation GPS, horaires d'ouverture et pharmacies ouvertes 24h/24 en temps réel.
            </p>
          </div>

          <div className="bg-[#F4F8FA] border border-slate-200 p-3 rounded-xl text-xs space-y-1 shrink-0">
            <div className="font-bold text-[#17324D] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A878]" />
              <span>Données Officielles Vérifiées</span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              Tours de garde mis à jour régulièrement
            </div>
          </div>
        </div>

        {/* Directory Filters & Drug Search Bar */}
        <div className="mt-4 space-y-4">
            
            {/* Dedicated Drug Search Bar (Requirement 5) */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl border border-slate-200 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="font-extrabold text-xs text-emerald-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <Search className="w-4 h-4 text-[#00A878] shrink-0" />
                  <span>Trouver un médicament en pharmacie</span>
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded font-medium">
                  Pharmacies les plus proches de vous en premier
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={drugSearchQuery}
                  onChange={(e) => setDrugSearchQuery(e.target.value)}
                  placeholder="Tapez le nom d'un médicament (ex: Paracétamol, Amoxicilline, Insuline, Efferalgan...)"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-[#00A878] focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
                {drugSearchQuery && (
                  <button
                    onClick={() => setDrugSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Drug Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-slate-500 text-xs font-bold w-full sm:w-auto mb-1 sm:mb-0">Essayer :</span>
                {drugs.slice(0, 5).map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDrugSearchQuery(d.name)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 px-3.5 py-2 rounded-xl border border-emerald-300/60 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* Drug Search Results Panel */}
              {drugSearchQuery.trim() !== '' && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
                  <SponsoredAdBanner placement="DRUG_SEARCH" compact />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-700">
                      Résultats pour "{drugSearchQuery}" ({pharmaciesWithDrug.length} pharmacies en stock)
                    </span>
                    <span className="text-[10px] text-slate-500">Classées de la plus proche à la plus éloignée</span>
                  </div>

                  {pharmaciesWithDrug.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-xs border border-slate-200">
                      Aucune pharmacie ayant ce médicament disponible en stock n'a été trouvée.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {pharmaciesWithDrug.map(({ pharmacy, stock, drug, distanceKm }) => (
                        <div
                          key={`${pharmacy!.id}-${stock.drugId}`}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#00A878] transition-colors"
                        >
                          <div>
                            <div className="font-mono font-bold text-sm text-amber-600">
                              {pharmacy!.name.toUpperCase()} - {pharmacy!.quarter || pharmacy!.address} - {pharmacy!.phone}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-2">
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#00A878] shrink-0" />
                                <span>Distance: ~{distanceKm} km</span>
                              </span>
                              <span>•</span>
                              <span>Produit: <strong className="text-slate-900">{drug?.name}</strong></span>
                              <span>•</span>
                              <span className="text-amber-600 font-bold">Prix: {stock.priceFcfa} FCFA</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-xs">
                            <a
                              href={`tel:${pharmacy!.phone.replace(/\s+/g, '')}`}
                              className="bg-[#00A878] hover:bg-[#009267] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Appeler</span>
                            </a>
                            <button
                              onClick={() => setDetailPharmacy(pharmacy!)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200"
                            >
                              Voir Fiche
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search text */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher pharmacie par nom, quartier (Agoè, Totsi, Tokoin...)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 text-xs text-[#17324D] bg-[#F4F8FA] font-medium"
                />
              </div>

              {/* City selector */}
              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-[#00A878] text-xs font-bold text-[#17324D] bg-[#F4F8FA]"
                >
                  <option value="TOUTES">Toutes les villes du Togo</option>
                  {TOGO_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.region}) — {c.pharmacyCount} pharmacies
                    </option>
                  ))}
                </select>
              </div>

              {/* Geolocation Button */}
              <div className="md:col-span-2">
                <button
                  onClick={handleLocateUser}
                  disabled={isLocating}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#DDF7EE] hover:bg-[#c9f1e3] text-emerald-800 border border-[#00A878]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className={`w-3.5 h-3.5 text-[#00A878] ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{userLocation ? 'GPS Activé' : 'Plus proche (GPS)'}</span>
                </button>
              </div>

              {/* View Layout Toggle */}
              <div className="md:col-span-2 flex items-center justify-end bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setViewMode('SPLIT')}
                  className={`p-1.5 rounded-lg ${viewMode === 'SPLIT' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
                  title="Vue Mixte Liste + Carte"
                >
                  <ArrowUpDown className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`p-1.5 rounded-lg ${viewMode === 'LIST' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
                  title="Vue Liste Seule"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('MAP')}
                  className={`p-1.5 rounded-lg ${viewMode === 'MAP' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
                  title="Vue Carte Seule"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <button
                onClick={() => setFilterGuardOnly(!filterGuardOnly)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  filterGuardOnly
                    ? 'bg-[#D97706] text-white border-amber-700 shadow-xs'
                    : 'bg-[#F4F8FA] text-[#17324D] border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 stroke-[2.25] ${filterGuardOnly ? "text-white" : "text-amber-600"}`} />
                <span>De Garde uniquement ({deGardeTotal})</span>
              </button>

              <button
                onClick={() => setFilterOpenNow(!filterOpenNow)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  filterOpenNow
                    ? 'bg-[#00A878] text-white border-[#009267] shadow-xs'
                    : 'bg-[#F4F8FA] text-[#17324D] border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 stroke-[2.25] ${filterOpenNow ? "text-white" : "text-[#00A878]"}`} />
                <span>Ouvertes actuellement</span>
              </button>

              <button
                onClick={() => setFilterDelivery(!filterDelivery)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  filterDelivery
                    ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                    : 'bg-[#F4F8FA] text-[#17324D] border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Truck className={`w-3.5 h-3.5 stroke-[2.25] ${filterDelivery ? "text-white" : "text-emerald-800"}`} />
                <span>Livraison à domicile</span>
              </button>

              <button
                onClick={() => setFilterMobilePay(!filterMobilePay)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  filterMobilePay
                    ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                    : 'bg-[#F4F8FA] text-[#17324D] border-slate-200 hover:bg-slate-200'
                }`}
              >
                <CreditCard className={`w-3.5 h-3.5 stroke-[2.25] ${filterMobilePay ? "text-white" : "text-slate-600"}`} />
                <span>Paiement Mobile (T-Money / Flooz)</span>
              </button>
            </div>
          </div>
        </div>

      {/* Main Content Area - National Directory */}
      <div>
        {viewMode === 'SPLIT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List column */}
            <div className="lg:col-span-7 space-y-4">
              {isLocating && (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
                  <PharmacyUiverseLoader 
                    size="sm"
                    theme="emerald"
                    label="Calcul des pharmacies les plus proches par GPS..."
                    subLabel="Positionnement haute précision Togo"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>{pharmaciesWithDistance.length} pharmacies correspondant à vos critères</span>
                {userLocation && <span className="text-emerald-600 font-bold">Triées par distance GPS</span>}
              </div>

              {pharmacies.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                  <PharmacyUiverseLoader 
                    size="md"
                    label="Chargement du répertoire national des pharmacies..."
                    subLabel="Extraction du cadastre sanitaire DPML Togo"
                  />
                </div>
              ) : pharmaciesWithDistance.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  Aucune pharmacie ne correspond exactement à vos filtres. Essayez de choisir "Toutes les villes" ou de désactiver "De Garde uniquement".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pharmaciesWithDistance.map(({ pharmacy, distanceKm }) => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      distanceKm={distanceKm}
                      onSelect={(p) => setDetailPharmacy(p)}
                      onReportError={(p) => setReportPharmacy(p)}
                      onEstimatePrice={(p) => {
                        setEstimatePharmacy(p);
                        setIsPriceEstimatorOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Map Column */}
            <div className="lg:col-span-5 sticky top-24">
              <InteractiveMap
                pharmacies={filteredPharmacies}
                selectedPharmacy={detailPharmacy}
                onSelectPharmacy={(p) => setDetailPharmacy(p)}
              />
            </div>
          </div>
        )}

        {viewMode === 'LIST' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-semibold">
              {pharmaciesWithDistance.length} pharmacies listées
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pharmaciesWithDistance.map(({ pharmacy, distanceKm }) => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  distanceKm={distanceKm}
                  onSelect={(p) => setDetailPharmacy(p)}
                  onReportError={(p) => setReportPharmacy(p)}
                  onEstimatePrice={(p) => {
                    setEstimatePharmacy(p);
                    setIsPriceEstimatorOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'MAP' && (
          <InteractiveMap
            pharmacies={filteredPharmacies}
            selectedPharmacy={detailPharmacy}
            onSelectPharmacy={(p) => setDetailPharmacy(p)}
          />
        )}

        {/* Drug Availability & Stock Search Component */}
        <div className="my-8">
          <DrugAvailabilitySearch
            drugs={drugs}
            pharmacies={pharmacies}
            stocks={stocks}
            onSelectPharmacy={(p) => {
              setDetailPharmacy(p);
            }}
            onOpenInsuranceSimulator={(drug) => {
              setInsuranceDrug(drug || null);
              setIsInsuranceModalOpen(true);
            }}
          />
        </div>

        {/* Togo Network Interconnected Map Section */}
        <TogoNetworkMap
          selectedCity={selectedCity}
          onSelectCity={(cityName) => {
            setSelectedCity(cityName);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        />

        {/* Partner & Health Ecosystem Carousel */}
        <div className="my-8">
          <PartnerMarquee theme="light" className="rounded-3xl shadow-xs border border-slate-200" />
        </div>

        {/* Bottom Health Sponsor Banner */}
        <div className="my-6">
          <SponsoredAdBanner placement="HOME_BOTTOM" />
        </div>
      </div>
      </div>

      {/* Modals wrapped in createPortal to escape motion.div bounding box */}
      {createPortal(
        <>
          <PharmacyDetailModal
            pharmacy={detailPharmacy}
            stocks={stocks}
            drugs={drugs}
            onClose={() => setDetailPharmacy(null)}
            onReportError={(p) => {
              setDetailPharmacy(null);
              setReportPharmacy(p);
            }}
            onOpenPriceEstimator={(p) => {
              setEstimatePharmacy(p);
              setIsPriceEstimatorOpen(true);
            }}
          />

          <PriceEstimateBeforeTravelModal
            isOpen={isPriceEstimatorOpen}
            onClose={() => setIsPriceEstimatorOpen(false)}
            pharmacy={estimatePharmacy || detailPharmacy || pharmacies[0]}
            drugs={drugs}
            stocks={stocks}
            distanceKm={
              estimatePharmacy
                ? calculateDistanceKm(
                    userLocation?.lat || 6.1375,
                    userLocation?.lng || 1.2125,
                    estimatePharmacy.lat,
                    estimatePharmacy.lng
                  )
                : 3.2
            }
          />

          {reportPharmacy && (
            <NewReportModal
              pharmacies={pharmacies}
              preselectedPharmacy={reportPharmacy}
              onClose={() => setReportPharmacy(null)}
              onSuccess={() => setReportPharmacy(null)}
            />
          )}

          {isReviewModalOpen && (
            <NewReviewModal
              pharmacies={pharmacies}
              onClose={() => setIsReviewModalOpen(false)}
              onSuccess={() => setIsReviewModalOpen(false)}
            />
          )}

          <GuardScheduleModal
            isOpen={isGuardModalOpen}
            onClose={() => setIsGuardModalOpen(false)}
            pharmacies={pharmacies}
          />

          <InsuranceSimulatorModal
            isOpen={isInsuranceModalOpen}
            onClose={() => setIsInsuranceModalOpen(false)}
            drugs={drugs}
            preselectedDrug={insuranceDrug || undefined}
          />
        </>,
        document.body
      )}
    </div>
  );
};
