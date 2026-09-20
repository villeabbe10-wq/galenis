import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Cookie, 
  Search, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Download, 
  RefreshCw, 
  ExternalLink,
  Info,
  Building2,
  HeartHandshake,
  Lock,
  EyeOff,
  Database,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';
import { ActiveTab, LegalSectionType } from '../../types';
import { TogoFlag, TogoLionIcon, ONPTLogo, TogoCoatOfArms } from '../TogoEmblems';

interface LegalSpaceViewProps {
  initialSection?: LegalSectionType;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenFeedback?: () => void;
}

export const LegalSpaceView: React.FC<LegalSpaceViewProps> = ({
  initialSection = 'TERMS',
  onNavigateToTab,
  onOpenFeedback
}) => {
  const [activeSection, setActiveSection] = useState<LegalSectionType>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage management state
  const [localStorageSize, setLocalStorageSize] = useState<number>(0);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const [clearSuccess, setClearSuccess] = useState(false);

  // Preference toggles
  const [rememberRegion, setRememberRegion] = useState<boolean>(() => {
    return localStorage.getItem('galenis_pref_remember_region') !== 'false';
  });
  const [enableOfflineCache, setEnableOfflineCache] = useState<boolean>(() => {
    return localStorage.getItem('galenis_pref_offline_cache') !== 'false';
  });
  const [rememberSearchHistory, setRememberSearchHistory] = useState<boolean>(() => {
    return localStorage.getItem('galenis_pref_search_history') !== 'false';
  });

  // Calculate local storage footprint
  const refreshStorageStats = () => {
    try {
      let totalBytes = 0;
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
          const val = localStorage.getItem(key) || '';
          totalBytes += (key.length + val.length) * 2;
        }
      }
      setLocalStorageSize(totalBytes);
      setLocalStorageKeys(keys);
    } catch {
      setLocalStorageSize(0);
      setLocalStorageKeys([]);
    }
  };

  useEffect(() => {
    refreshStorageStats();
  }, []);

  // Update initial section if prop changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleClearPreferences = () => {
    try {
      // Clear non-critical keys
      const keysToKeep = ['user_session']; // Preserve active login if desired
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          allKeys.push(key);
        }
      }
      allKeys.forEach(k => localStorage.removeItem(k));
      setClearSuccess(true);
      refreshStorageStats();
      setTimeout(() => setClearSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPreferences = () => {
    try {
      const data: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify({
        dateExport: new Date().toISOString(),
        plateforme: "Galenis Togo - Ordre National des Pharmaciens du Togo",
        donneesEnregistrees: data
      }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `galenis-togo-mes-donnees-locales-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRememberRegion = (val: boolean) => {
    setRememberRegion(val);
    localStorage.setItem('galenis_pref_remember_region', val ? 'true' : 'false');
    if (!val) {
      localStorage.removeItem('selected_region');
      localStorage.removeItem('selected_city');
    }
    refreshStorageStats();
  };

  const toggleOfflineCache = (val: boolean) => {
    setEnableOfflineCache(val);
    localStorage.setItem('galenis_pref_offline_cache', val ? 'true' : 'false');
    refreshStorageStats();
  };

  const toggleSearchHistory = (val: boolean) => {
    setRememberSearchHistory(val);
    localStorage.setItem('galenis_pref_search_history', val ? 'true' : 'false');
    if (!val) {
      localStorage.removeItem('recent_drug_searches');
      localStorage.removeItem('recent_pharmacy_searches');
    }
    refreshStorageStats();
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Back Button & National Breadcrumb */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToTab('CITIZEN');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Retour à l'accueil citoyen</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <span>République Togolaise</span>
              <TogoFlag className="w-4 h-3 rounded-xs shadow-xs" />
            </div>
          </div>

          {/* Title & Emblem */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <TogoLionIcon className="w-4 h-4 text-emerald-400" />
                <span>Documents Officiels de Référence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Cadre Légal, Vie Privée & Données Locales
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Consultez en toute transparence nos engagements déontologiques, les règles d'utilisation du service public, la protection de votre vie privée et la gestion de vos témoins de connexion.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer shadow-xs"
                title="Imprimer cette page officielle"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Imprimer la page</span>
              </button>

              <div className="text-[11px] text-slate-400 text-right">
                Dernière révision officielle : <strong className="text-white">Septembre 2026</strong>
              </div>
            </div>
          </div>

          {/* Quick Search inside legal texts */}
          <div className="mt-8 relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un terme (ex: gratuit, ordonnance, garde, effacer, Lomé)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
              >
                Effacer
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            
            {/* Tab 1: Conditions Générales d'Utilisation */}
            <button
              type="button"
              onClick={() => {
                setActiveSection('TERMS');
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'TERMS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Conditions Générales d'Utilisation</span>
            </button>

            {/* Tab 2: Protection de la Vie Privée */}
            <button
              type="button"
              onClick={() => {
                setActiveSection('PRIVACY');
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'PRIVACY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Protection de la Vie Privée & Données</span>
            </button>

            {/* Tab 3: Gestion des Témoins de Connexion */}
            <button
              type="button"
              onClick={() => {
                setActiveSection('COOKIES');
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'COOKIES'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Cookie className="w-4 h-4" />
              <span>Gestion des Témoins de Connexion</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* SECTION 1: CONDITIONS GÉNÉRALES D'UTILISATION */}
        {activeSection === 'TERMS' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Introductory Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Conditions Générales d'Utilisation du Service Public
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Règles d'accès et principes déontologiques applicables aux citoyens, aux professionnels de santé et aux partenaires
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 leading-relaxed space-y-1">
                <div className="font-extrabold flex items-center gap-2 text-emerald-950">
                  <TogoLionIcon className="w-4 h-4 text-emerald-700" />
                  <span>Engagement citoyen et déontologie pharmaceutique</span>
                </div>
                <p>
                  L'application Galenis Togo a pour vocation exclusive de faciliter l'accès aux soins de santé en permettant à toute personne se trouvant sur le territoire togolais de repérer immédiatement la pharmacie la plus proche, de consulter les tours de garde officiels et de vérifier les prix publics des médicaments.
                </p>
              </div>
            </div>

            {/* Article Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Article 1 */}
              {matchesSearch("objet gratuité citoyen accès") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">1</span>
                    <h3>Gratuité totale et libre accès pour tous les citoyens</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'accès aux fonctionnalités citoyennes (recherche d'officines, numéros de téléphone d'urgence, géolocalisation des pharmacies de garde dans les 5 régions, consultation des prix indicatifs des médicaments) est <strong>entièrement gratuit</strong> et ne nécessite <strong>aucune création de compte</strong> préalable pour le patient.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Aucun abonnement payant exigé des patients.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Fonctionnement sans publicité commerciale intrusive.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Article 2 */}
              {matchesSearch("responsabilité garde exactitude pharmacien") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">2</span>
                    <h3>Exactitude des données et engagement des pharmaciens</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les informations relatives aux officines (horaires réguliers, roulement de garde de jour et de nuit, numéros d'appel de garde) sont déclarées et validées sous la responsabilité des <strong>pharmaciens titulaires diplômés</strong> et inscrits au tableau de l'Ordre National des Pharmaciens du Togo.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En cas de garde de nuit ou d'urgence médicale vitale, il demeure vivement recommandé d'appeler directement la pharmacie par téléphone avant tout déplacement nocturne.
                  </p>
                </div>
              )}

              {/* Article 3 */}
              {matchesSearch("médicaments prix disponibilité ordonnance") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">3</span>
                    <h3>Prix publics et délivrance des médicaments</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les prix affichés dans l'application sont conformes aux tarifs officiels réglementés en francs CFA applicables en République Togolaise. La délivrance de médicaments soumis à prescription médicale demeure subordonnée à la présentation d'une ordonnance valide délivrée par un professionnel de santé habilité.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La plateforme ne pratique aucune vente de médicaments par correspondance non autorisée.
                  </p>
                </div>
              )}

              {/* Article 4 */}
              {matchesSearch("urgences secours 118 15 hôpital") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">4</span>
                    <h3>Prise en charge des urgences vitales</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cette application est un outil d'orientation et ne se substitue en aucun cas aux services publics d'intervention d'urgence. En cas de détresse respiratoire, d'accident grave ou d'urgence vitale, composez sans délai les numéros officiels d'assistance :
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                      Pompiers : <span className="text-rose-600 font-black">118</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                      Urgences Médicales : <span className="text-emerald-700 font-black">15 ou 112</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Article 5 */}
              {matchesSearch("signalement citoyen bienveillance erreur") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">5</span>
                    <h3>Signalements citoyens et entraide communautaire</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tout utilisateur a la possibilité de signaler un changement d'horaires, un numéro temporairement injoignable ou une précision géographique. Ces contributions doivent être rédigées dans le respect des équipes soignantes et font l'objet d'une vérification avant actualisation.
                  </p>
                </div>
              )}

              {/* Article 6 */}
              {matchesSearch("partenaires développeurs interface utilisation éthique") && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">6</span>
                    <h3>Règles pour les partenaires et développeurs</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'accès aux interfaces de programmation et aux annuaires pour les cliniques, compagnies d'assurance ou créateurs d'applications de santé est soumis à une clé d'accès sécurisée et à l'interdiction formelle de détourner ces informations à des fins de spéculation ou de concurrence déloyale.
                  </p>
                </div>
              )}

            </div>

            {/* Footer Contact for Terms */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Une question concernant ces conditions ? Notre équipe juridique et déontologique est à votre disposition.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onNavigateToTab('CONTACTS');
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-bold border border-slate-300 transition-colors shrink-0"
              >
                Contacter l'Ordre des Pharmaciens
              </button>
            </div>

          </div>
        )}

        {/* SECTION 2: POLITIQUE DE PROTECTION DE LA VIE PRIVÉE */}
        {activeSection === 'PRIVACY' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Introductory Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Politique de Protection des Données Personnelles et de la Vie Privée
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Conforme à l'Article 28 de la Constitution togolaise et à la Loi relative à la protection des données à caractère personnel
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 leading-relaxed space-y-1">
                <div className="font-extrabold flex items-center gap-2 text-blue-900">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Principe fondamental : la santé est une affaire privée</span>
                </div>
                <p>
                  Galenis Togo applique une politique stricte de minimisation des données : nous ne collectons que le strict nécessaire au fonctionnement du service et ne procédons à aucun pistage de vos habitudes médicales ou de vos trajets.
                </p>
              </div>
            </div>

            {/* What we NEVER collect vs What we collect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* NEVER COLLECT */}
              <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-rose-700 font-extrabold text-sm pb-2 border-b border-rose-100">
                  <EyeOff className="w-5 h-5 text-rose-600" />
                  <h3>Ce que nous ne collectons JAMAIS</h3>
                </div>
                
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Aucun dossier médical ou ordonnance</strong>
                      <span>Vos ordonnances et consultations restent strictement confidentielles entre vous, votre médecin et votre pharmacien d'officine.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Aucun suivi géographique continu</strong>
                      <span>Votre position géographique n'est jamais transmise à des tiers ni enregistrée sur nos serveurs. Elle est calculée localement sur votre téléphone pour indiquer la distance vers l'officine la plus proche.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Aucune revente de données personnelles</strong>
                      <span>Aucune information n'est cédée, louée ou commercialisée à des régies publicitaires, des laboratoires ou des courtiers en données.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Aucune coordonnée bancaire enregistrée</strong>
                      <span>Les paiements mobiles éventuels sont gérés directement par les opérateurs agréés au Togo (T-Money, Flooz) via leurs canaux sécurisés.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* WHAT WE COLLECT WITH CONSENT */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-sm pb-2 border-b border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3>Ce qui est enregistré avec votre accord</h3>
                </div>
                
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Données publiques des officines</strong>
                      <span>Nom de la pharmacie, identité du pharmacien titulaire, numéro d'inscription à l'Ordre, horaires de garde et numéros d'appel d'urgence.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Vos préférences d'affichage locales</strong>
                      <span>Votre choix de région (ex: Région Maritime, Plateaux, Centrale, Kara ou Savanes) pour afficher directement les gardes pertinentes à l'ouverture de l'application.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Signalements et suggestions volontaires</strong>
                      <span>Les détails que vous communiquez librement pour améliorer le service (signalement d'une erreur d'horaires ou d'un changement de localisation).</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Identifiants professionnels pour les comptes déclarés</strong>
                      <span>Adresse de messagerie électronique professionnelle et mot de passe chiffré pour les pharmaciens titulaires accédant à leur tableau de bord.</span>
                    </div>
                  </li>
                </ul>
              </div>

            </div>

            {/* Individual Rights Guaranteed */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Vos droits fondamentaux garantis par la loi togolaise</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">Droit d'accès et d'information</div>
                  <p className="text-slate-600 leading-relaxed">
                    Vous avez le droit de savoir exactement quelles informations vous concernant sont stockées et d'en obtenir une copie intégrale et gratuite.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">Droit de rectification</div>
                  <p className="text-slate-600 leading-relaxed">
                    Tout pharmacien ou utilisateur peut faire modifier ou mettre à jour sans délai une information devenue inexacte ou incomplète.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">Droit à l'effacement définitif</div>
                  <p className="text-slate-600 leading-relaxed">
                    Vous pouvez demander à tout instant la suppression complète de votre compte professionnel ou effacer vos données locales d'un simple clic.
                  </p>
                </div>
              </div>
            </div>

            {/* Security & Hosting */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Sécurité technique et chiffrement des transmissions</h4>
                  <p className="text-xs text-slate-400">Mesures de protection déployées pour la sécurité de l'ensemble des usagers</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Toutes les communications entre votre téléphone ou ordinateur et nos serveurs s'effectuent par le biais de protocoles de transmission chiffrés et sécurisés. Les mots de passe des professionnels sont irréversiblement hachés et les bases de données font l'objet de sauvegardes régulières et étanches.
              </p>
            </div>

          </div>
        )}

        {/* SECTION 3: GESTION DES TÉMOINS DE CONNEXION (COOKIES) ET STOCKAGE LOCAL */}
        {activeSection === 'COOKIES' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Introductory Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Politique et Gestion des Témoins de Connexion (Cookies)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comprendre ce qui est conservé dans votre navigateur et gérer vos préférences en direct
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed space-y-1">
                <div className="font-extrabold flex items-center gap-2 text-amber-900">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Qu'est-ce qu'un témoin de connexion (cookie) ?</span>
                </div>
                <p>
                  Un témoin de connexion est un très petit fichier texte temporaire conservé dans la mémoire de votre appareil (téléphone ou ordinateur). Il permet à l'application de se souvenir de votre ville préférée afin que vous n'ayez pas à la resélectionner à chaque consultation.
                </p>
              </div>
            </div>

            {/* Types of Storage Explained */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Type 1 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Indispensables</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Fonctionnement Technique</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permettent de maintenir votre session ouverte si vous êtes pharmacien titulaire, et d'enregistrer vos paramètres d'affichage. Sans ces fichiers, l'application devrait vous redemander vos préférences à chaque clic.
                </p>
                <div className="text-[10px] font-mono bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                  Durée : Session ou 30 jours
                </div>
              </div>

              {/* Type 2 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Accès Hors-Ligne</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Mémoire de Secours</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Une copie légère de l'annuaire officiel des pharmacies est gardée dans la mémoire de votre téléphone afin que vous puissiez trouver une pharmacie ouverte même en cas de coupure de connexion internet ou de forfait épuisé.
                </p>
                <div className="text-[10px] font-mono bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                  Durée : Jusqu'à actualisation
                </div>
              </div>

              {/* Type 3 */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Zéro Publicité</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Témoins Publicitaires Tiers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Aucun témoin publicitaire n'est utilisé.</strong> Nous n'intégrons aucun traceur de réseau social ni aucun outil commercial de revente de profil. Votre santé ne fait l'objet d'aucun ciblage marketing.
                </p>
                <div className="text-[10px] font-mono bg-rose-50 text-rose-700 p-2 rounded-lg border border-rose-100 font-bold">
                  Présence : 0% (Strictement banni)
                </div>
              </div>

            </div>

            {/* LIVE INTERACTIVE COOKIE & LOCAL STORAGE MANAGER */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Gestionnaire Interactif de Votre Mémoire Locale
                    </h3>
                    <p className="text-xs text-slate-500">
                      Visualisez et contrôlez en temps réel ce qui est stocké sur votre appareil
                    </p>
                  </div>
                </div>

                {/* Footprint Indicator */}
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <span className="text-xs text-slate-500">Espace occupé :</span>
                  <span className="text-xs font-black text-emerald-700">
                    {(localStorageSize / 1024).toFixed(1)} Ko
                  </span>
                  <button
                    type="button"
                    onClick={refreshStorageStats}
                    title="Actualiser la mesure"
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Success Notification if cleared */}
              {clearSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vos préférences locales et historiques temporaires ont été effacés avec succès.</span>
                </div>
              )}

              {/* Toggles Grid */}
              <div className="space-y-4">
                
                {/* Toggle 1: Remember Region */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">
                      Mémoriser ma région et ville préférée
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Permet d'ouvrir immédiatement la carte sur votre ville habituelle (Lomé, Kara, Sokodé, etc.)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRememberRegion(!rememberRegion)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      rememberRegion ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        rememberRegion ? 'left-6.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Offline Cache */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">
                      Conserver l'annuaire hors-ligne pour les urgences
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Enregistre la liste des pharmacies pour qu'elle reste consultable sans connexion internet
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleOfflineCache(!enableOfflineCache)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      enableOfflineCache ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        enableOfflineCache ? 'left-6.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3: Search History */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">
                      Mémoriser mes dernières recherches de médicaments
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Facilite la ressaisie de vos recherches fréquentes de médicaments sur votre téléphone
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSearchHistory(!rememberSearchHistory)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      rememberSearchHistory ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        rememberSearchHistory ? 'left-6.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* Action Buttons: Export & Clear */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPreferences}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Télécharger une copie de mes préférences (Fichier texte)</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearPreferences}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-rose-200"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Vider toutes les données locales de mon appareil</span>
                </button>
              </div>

            </div>

            {/* How to disable in your browser */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Comment gérer les témoins dans les paramètres de votre navigateur ?</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vous pouvez également configurer votre navigateur internet (Google Chrome, Safari, Mozilla Firefox, Samsung Internet) pour refuser systématiquement tout témoin ou pour les effacer automatiquement dès la fermeture de la fenêtre. Veuillez noter que la désactivation complète du stockage local peut empêcher le fonctionnement de l'annuaire hors-ligne en cas de coupure de réseau.
              </p>
            </div>

          </div>
        )}

        {/* Bottom National Partnership & Order of Pharmacists reference */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <TogoCoatOfArms className="w-10 h-10 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <span>RÉPUBLIQUE TOGOLAISE</span>
                <TogoFlag className="w-3.5 h-2.5" />
              </div>
              <p className="text-[11px] text-slate-500">
                Ordre National des Pharmaciens du Togo • Ministère de la Santé et de l'Hygiène Publique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors"
              >
                Poser une question sur ces documents
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigateToTab('CITIZEN');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Retour à l'application
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
