import React, { useState } from 'react';
import { TogoFlag, TogoCoatOfArms } from '../TogoEmblems';
import { LionIcon } from '../LionIcon';
import { 
  Layers, 
  ShieldCheck, 
  Users, 
  Building2, 
  Code2, 
  Heart, 
  Server, 
  Activity, 
  Database, 
  Cpu, 
  Bot, 
  Terminal, 
  Check, 
  Clock, 
  Zap, 
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  CreditCard,
  Pill,
  Globe,
  Rocket,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

/* =========================================================================
   CUSTOM SPOT ILLUSTRATIONS FOR VISION & STRATÉGIE
   ========================================================================= */

export const SpotIllustrationCitoyens: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="60" cy="60" r="42" fill="url(#citoyen-grad)"/>
      <path d="M40 75C40 66.7157 46.7157 60 55 60H65C73.2843 60 80 66.7157 80 75V80H40V75Z" fill="#10B981" fillOpacity="0.2"/>
      <circle cx="60" cy="46" r="12" fill="#047857"/>
      <path d="M32 78C32 71.3726 37.3726 66 44 66H48" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      <path d="M88 78C88 71.3726 82.6274 66 76 66H72" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="52" r="7" fill="#059669"/>
      <circle cx="80" cy="52" r="7" fill="#059669"/>
      {/* Smartphone GPS overlay */}
      <rect x="70" y="65" width="22" height="34" rx="4" fill="#065F46" stroke="#34D399" strokeWidth="2"/>
      <path d="M81 72C78.7909 72 77 73.7909 77 76C77 78.5 81 83 81 83C81 83 85 78.5 85 76C85 73.7909 83.2091 72 81 72Z" fill="#34D399"/>
      <circle cx="81" cy="75" r="1.5" fill="#065F46"/>
      <defs>
        <linearGradient id="citoyen-grad" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D1FAE5"/>
          <stop offset="1" stopColor="#A7F3D0"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const SpotIllustrationHopitaux: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="60" cy="60" r="42" fill="url(#hopital-grad)"/>
      {/* Hospital Building */}
      <rect x="38" y="42" width="44" height="42" rx="4" fill="#1E40AF"/>
      <rect x="52" y="30" width="16" height="12" rx="2" fill="#3B82F6"/>
      {/* Red/Medical Cross */}
      <rect x="57" y="32" width="6" height="8" rx="1" fill="#FFFFFF"/>
      <rect x="56" y="34" width="8" height="4" rx="1" fill="#FFFFFF"/>
      {/* Windows Grid */}
      <rect x="44" y="48" width="8" height="8" rx="1.5" fill="#93C5FD"/>
      <rect x="68" y="48" width="8" height="8" rx="1.5" fill="#93C5FD"/>
      <rect x="44" y="60" width="8" height="8" rx="1.5" fill="#93C5FD"/>
      <rect x="68" y="60" width="8" height="8" rx="1.5" fill="#93C5FD"/>
      {/* Hospital Door */}
      <rect x="54" y="68" width="12" height="16" rx="1" fill="#60A5FA"/>
      {/* Pulse line badge */}
      <circle cx="85" cy="40" r="14" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2"/>
      <path d="M76 40H80L82 35L85 45L88 38L90 40H94" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="hopital-grad" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DBEAFE"/>
          <stop offset="1" stopColor="#BFDBFE"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const SpotIllustrationAssurances: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="60" cy="60" r="42" fill="url(#assur-grad)"/>
      {/* Protection Shield */}
      <path d="M60 28L82 38V58C82 72.5 72.8 85.5 60 90C47.2 85.5 38 72.5 38 58V38L60 28Z" fill="#6B21A8" stroke="#C084FC" strokeWidth="2"/>
      <path d="M60 34L76 42V58C76 69 69 79 60 83C51 79 44 69 44 58V42L60 34Z" fill="#9333EA"/>
      {/* Checkmark inside shield */}
      <path d="M52 58L57 63L68 50" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Star Badge */}
      <circle cx="85" cy="75" r="11" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2"/>
      <path d="M85 69L86.8 72.6L90.8 73.2L87.9 76L88.6 80L85 78.1L81.4 80L82.1 76L79.2 73.2L83.2 72.6L85 69Z" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="assur-grad" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E8FF"/>
          <stop offset="1" stopColor="#E9D5FF"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const SpotIllustrationPharmacies: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="60" cy="60" r="42" fill="url(#pharma-grad)"/>
      {/* Pharmacy Store Canopy */}
      <path d="M34 45L40 32H80L86 45H34Z" fill="#0F766E"/>
      <path d="M34 45C34 47.5 36 49 38 49C40 49 42 47.5 42 45C42 47.5 44 49 46 49C48 49 50 47.5 50 45C50 47.5 52 49 54 49C56 49 58 47.5 58 45C58 47.5 60 49 62 49C64 49 66 47.5 66 45C66 47.5 68 49 70 49C72 49 74 47.5 74 45C74 47.5 76 49 78 49C80 49 82 47.5 82 45H34Z" fill="#0D9488"/>
      {/* Store Front Body */}
      <rect x="38" y="49" width="44" height="34" fill="#115E59" rx="2"/>
      {/* Green Glowing Cross */}
      <rect x="56" y="56" width="8" height="20" rx="2" fill="#34D399"/>
      <rect x="50" y="62" width="20" height="8" rx="2" fill="#34D399"/>
      {/* Pill Capsule Overlay */}
      <g transform="translate(75, 28) rotate(35)">
        <rect x="0" y="0" width="12" height="24" rx="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M0 12H12V18C12 21.3137 9.31371 24 6 24C2.68629 24 0 21.3137 0 18V12Z" fill="#059669"/>
      </g>
      <defs>
        <linearGradient id="pharma-grad" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6FFFA"/>
          <stop offset="1" stopColor="#99F6E4"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const SpotIllustrationDeveloppeurs: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="60" cy="60" r="42" fill="url(#dev-grad)"/>
      {/* Code Terminal Window */}
      <rect x="34" y="36" width="52" height="42" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
      {/* Window Controls */}
      <circle cx="42" cy="44" r="2" fill="#EF4444"/>
      <circle cx="48" cy="44" r="2" fill="#F59E0B"/>
      <circle cx="54" cy="44" r="2" fill="#10B981"/>
      {/* Code lines */}
      <path d="M42 54L47 58L42 62" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="51" y1="62" x2="60" y2="62" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      <line x1="42" y1="68" x2="72" y2="68" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
      {/* AI Robot Head Badge */}
      <rect x="70" y="60" width="22" height="22" rx="5" fill="#D97706" stroke="#FFFFFF" strokeWidth="2"/>
      <circle cx="76" cy="68" r="2" fill="#FFFFFF"/>
      <circle cx="86" cy="68" r="2" fill="#FFFFFF"/>
      <path d="M77 75C77 75 79 77 81 77C83 77 85 75 85 75" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="81" y1="56" x2="81" y2="60" stroke="#D97706" strokeWidth="2"/>
      <circle cx="81" cy="55" r="1.5" fill="#F59E0B"/>
      <defs>
        <linearGradient id="dev-grad" x1="18" y1="18" x2="102" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7"/>
          <stop offset="1" stopColor="#FDE68A"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* =========================================================================
   MAIN STRATEGY VIEW COMPONENT
   ========================================================================= */

export const StrategyView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('citoyens');

  const consumerDetails: Record<string, { title: string; desc: string; metrics: string[]; illustration: React.ReactNode }> = {
    citoyens: {
      title: 'Citoyens & Patients',
      desc: 'Accès libre et sans frais à la géolocalisation des officines de garde, aux numéros d\'urgence direct et à la grille des prix publics réglementés.',
      metrics: ['Accès 100% Gratuit', '0 Compte obligatoire', 'Appel direct 1-clic'],
      illustration: <SpotIllustrationCitoyens className="w-16 h-16" />
    },
    hopitaux: {
      title: 'Hôpitaux & Urgences',
      desc: 'Orientation rapide des malades vers les pharmacies de garde ouvertes les plus proches pour la fourniture des molécules d\'urgence.',
      metrics: ['Accès Urgence 24/7', 'Flux API Référentiel', 'Proximité GPS'],
      illustration: <SpotIllustrationHopitaux className="w-16 h-16" />
    },
    assurances: {
      title: 'Assurances & Mutuelles',
      desc: 'Vérification de l\'homologation des prix publics des médicaments et conformité des officines répertoriées sur le territoire togolais.',
      metrics: ['Contrôle des Tarifs', 'Calculateur de Débours', 'Transparence'],
      illustration: <SpotIllustrationAssurances className="w-16 h-16" />
    },
    pharmacies: {
      title: 'Pharmacies & Officines',
      desc: 'Espace pharmacien sécurisé pour déclarer les gardes du weekend, les numéros de téléphone et le statut binaire des médicaments vitaux.',
      metrics: ['Mise à jour directe', 'Déclaration de garde', 'Visibilité locale'],
      illustration: <SpotIllustrationPharmacies className="w-16 h-16" />
    },
    developpeurs: {
      title: 'Développeurs & API',
      desc: 'Portail API ouvert pour connecter des bots WhatsApp, des applications mobiles de santé ou des systèmes d\'information hospitaliers.',
      metrics: ['Clés API sécurisées', 'Galenis AI Developer', 'SDK & Documentation'],
      illustration: <SpotIllustrationDeveloppeurs className="w-16 h-16" />
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Vision Header */}
      <div className="bg-[#F7F9FC] text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <TogoCoatOfArms className="w-16 h-16 shrink-0 drop-shadow-sm" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                  <span>Galenis • Référentiel numérique des pharmacies</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Galenis</span>
                </h1>
                <p className="text-emerald-700 font-extrabold text-base mt-0.5">
                  L'infrastructure numérique des données pharmaceutiques du Togo.
                </p>
              </div>
            </div>

            {/* Live Infrastructure System Status Monitor */}
            <div className="bg-white border border-emerald-200 p-4 rounded-2xl space-y-2 shrink-0 text-xs shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">État Infrastructure</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  API Opérationnelle
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 font-mono font-bold pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-emerald-600" />
                  <span>API REST: 99.9%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Base: 221 Officines</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  <span>Gardes: En direct</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  <span>IA Dev: Prêt</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-4xl leading-relaxed font-medium">
            Galenis Togo est une infrastructure numérique dédiée au référencement et à l'interopérabilité des données pharmaceutiques au Togo. Elle fournit un référentiel structuré des pharmacies et des services associés, ainsi qu'une API permettant aux applications, professionnels de santé et partenaires autorisés d'accéder à ces données.
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram with Spot Illustrations */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Architecture de Référencement & d'Interopérabilité</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Réseau National de Santé Togo</span>
          </div>

          {/* Level 1: Primary Inputs */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-extrabold text-slate-500 text-center tracking-wider">
              1. Sources & Acteurs de Santé
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto text-xs">
              <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl text-center text-emerald-950 font-extrabold shadow-xs flex items-center justify-center gap-2">
                <SpotIllustrationPharmacies className="w-8 h-8" />
                <span>Pharmacies</span>
              </div>
              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl text-center text-blue-950 font-extrabold shadow-xs flex items-center justify-center gap-2">
                <SpotIllustrationHopitaux className="w-8 h-8" />
                <span>Institutions</span>
              </div>
              <div className="bg-purple-50/80 border border-purple-200 p-3 rounded-xl text-center text-purple-950 font-extrabold shadow-xs flex items-center justify-center gap-2">
                <SpotIllustrationAssurances className="w-8 h-8" />
                <span>Partenaires</span>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-emerald-400 mx-auto rounded-full" />

          {/* Level 2: Core Platform Node with Enlarge Visual */}
          <div className="max-w-xl mx-auto bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-5 rounded-2xl text-center space-y-4 shadow-md relative overflow-hidden">
            <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 shadow-inner group min-h-[300px] sm:min-h-[380px] w-full flex items-center justify-center bg-slate-950">
              <img 
                src={new URL('../../assets/images/network_neon_doodle_1786471150531.jpg', import.meta.url).href}
                alt="Réseau d'Interopérabilité" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[300px] sm:min-h-[380px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="inline-flex items-center gap-2 text-emerald-900 text-base font-black tracking-wide">
              <LionIcon className="w-5 h-5 text-emerald-400" />
              <span>GALENIS</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-700">
              Référentiel National • API • Qualité des Données • Interopérabilité
            </p>
          </div>

          <div className="w-0.5 h-6 bg-emerald-400 mx-auto rounded-full" />

          {/* Level 3: Access Channels */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-extrabold text-slate-500 text-center tracking-wider">
              2. Couches d'Accès aux Données
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-xs text-center font-black">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 stroke-[2.25]" />
                <span>API REST</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600 stroke-[2.25]" />
                <span>Portail Web</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs">
                <Bot className="w-4 h-4 text-emerald-700 stroke-[2.25]" />
                <span>AI Developer</span>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-emerald-400 mx-auto rounded-full" />

          {/* Level 4: Interactive Downstream Consumers with Spot Illustrations */}
          <div className="space-y-4">
            <div className="text-[10px] uppercase font-extrabold text-slate-500 text-center tracking-wider">
              3. Applications, Services & Utilisateurs (Cliquez une illustration pour inspecter)
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {[
                { id: 'citoyens', label: 'Citoyens', spot: <SpotIllustrationCitoyens className="w-12 h-12" /> },
                { id: 'hopitaux', label: 'Hôpitaux', spot: <SpotIllustrationHopitaux className="w-12 h-12" /> },
                { id: 'assurances', label: 'Assurances', spot: <SpotIllustrationAssurances className="w-12 h-12" /> },
                { id: 'pharmacies', label: 'Pharmacies', spot: <SpotIllustrationPharmacies className="w-12 h-12" /> },
                { id: 'developpeurs', label: 'Développeurs', spot: <SpotIllustrationDeveloppeurs className="w-12 h-12" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedNode(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 cursor-pointer ${
                    selectedNode === item.id 
                      ? 'bg-emerald-50 border-2 border-emerald-600 text-slate-900 shadow-md scale-102 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {item.spot}
                  <span className="font-extrabold text-xs">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Node Details View with Spot Illustration Hero */}
            {selectedNode && consumerDetails[selectedNode] && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs space-y-3 animate-in fade-in duration-200 shadow-xs">
                <div className="flex items-center gap-4">
                  {consumerDetails[selectedNode].illustration}
                  <div>
                    <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                      <span>{consumerDetails[selectedNode].title}</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">Acteur clé</span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed mt-1">
                      {consumerDetails[selectedNode].desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {consumerDetails[selectedNode].metrics.map((m, i) => (
                    <span key={i} className="bg-white text-emerald-900 text-[11px] px-3 py-1 rounded-lg border border-emerald-200 font-extrabold shadow-2xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>{m}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Niveau de Fiabilité de la Donnée with Spot Badges */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard de Transparence & Qualité</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Index des Niveaux de Fiabilité des Données
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-medium">
            Pour garantir la crédibilité du référentiel, chaque information est qualifiée selon un niveau de certification explicite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <CheckCircle2 className="w-5 h-5 text-slate-900 stroke-[2.25]" />
              </div>
              <div>
                <span className="font-extrabold text-emerald-950 text-xs block">Vérifié aujourd'hui</span>
                <span className="text-[10px] text-emerald-800 font-bold uppercase">Confiance Maximale</span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
              Information confirmée directement par l'officine ou vérifiée par l'équipe technique dans les dernières 24 heures.
            </p>
            <div className="text-[10px] text-emerald-800 font-extrabold bg-white p-2 rounded-xl border border-emerald-200 text-center shadow-2xs">
              Certification Temps Réel 24h
            </div>
          </div>

          <div className="p-4.5 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Clock className="w-5 h-5 text-slate-900 stroke-[2.25]" />
              </div>
              <div>
                <span className="font-extrabold text-amber-950 text-xs block">Déclaré par la pharmacie</span>
                <span className="text-[10px] text-amber-800 font-bold uppercase">Confiance Élevée</span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
              Mise à jour déclarative récente (&lt; 7 jours) issue du tableau de bord officiel du pharmacien.
            </p>
            <div className="text-[10px] text-amber-800 font-extrabold bg-white p-2 rounded-xl border border-amber-200 text-center shadow-2xs">
              Déclaration Officielle récente
            </div>
          </div>

          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-400 text-slate-900 flex items-center justify-center font-black shadow-xs shrink-0">
                <HelpCircle className="w-5 h-5 text-slate-900 stroke-[2.25]" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">Mise à jour ancienne</span>
                <span className="text-[10px] text-slate-600 font-bold uppercase">Avis téléphonique</span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
              Donnée référencée enregistrée depuis plus de 7 jours sans modification récente.
            </p>
            <div className="text-[10px] text-slate-700 font-extrabold bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
              Confirmation téléphonique conseillée
            </div>
          </div>

          <div className="p-4.5 rounded-2xl border border-rose-200 bg-rose-50/60 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <AlertCircle className="w-5 h-5 text-slate-900 stroke-[2.25]" />
              </div>
              <div>
                <span className="font-extrabold text-rose-950 text-xs block">Information non vérifiée</span>
                <span className="text-[10px] text-rose-800 font-bold uppercase">Contrôle requis</span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
              Coordonnées brutes en cours de vérification terrain. Reconfirmation nécessaire avant déplacement.
            </p>
            <div className="text-[10px] text-rose-800 font-extrabold bg-white p-2 rounded-xl border border-rose-200 text-center shadow-2xs">
              Appel préalable recommandé
            </div>
          </div>
        </div>
      </div>

      {/* Galenis AI Developer Highlight Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <SpotIllustrationDeveloppeurs className="w-14 h-14" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span>Assistant Intégrateur Local</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Galenis AI Developer Assistant</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs">
            <Terminal className="w-4 h-4 text-emerald-700" />
            <span>npm i @galenis/togo-sdk</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Pour accélérer l'adoption de l'API par les développeurs togolais et internationaux, Galenis intègre un assistant IA développeur. Il permet de comprendre la structure des endpoints, de générer du code d'intégration en JavaScript, Python ou cURL, de tester un appel d'API en direct et d'expliquer les codes d'erreur HTTP.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-extrabold text-emerald-800 text-xs">Génération de Code</div>
            <p className="text-[11px] text-slate-600 font-medium">Extraits de code prêts à copier-coller pour vos applications React, Flutter ou Python.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-extrabold text-emerald-800 text-xs">Explorateur OpenAPI</div>
            <p className="text-[11px] text-slate-600 font-medium">Documentation Swagger/OpenAPI interactive interrogeable en langage naturel.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-extrabold text-emerald-800 text-xs">Diagnostic d'Erreur</div>
            <p className="text-[11px] text-slate-600 font-medium">Explication immédiate des codes de retour et dépannage des requêtes API.</p>
          </div>
        </div>
      </div>

      {/* 5 Phase Evolution Grid with Spot Badges */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Évolution Produit en 5 Phases Nationales
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Une progression pragmatique adaptée aux infrastructures locales et au terrain pharmaceutique togolais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {[
            { phase: 'Phase 1', title: 'Pharmacies & Gardes', desc: 'Référentiel 100% des pharmacies du Togo + gardes du weekend mises à jour.', label: 'Opérationnel', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.25]" />, color: 'text-emerald-800 bg-emerald-50 border-emerald-200', spot: <SpotIllustrationPharmacies className="w-10 h-10" /> },
            { phase: 'Phase 2', title: 'Médicaments & Prix', desc: 'Tarifs publics homologués + statut binaire (Disponible, Indisponible).', label: 'Intégré', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.25]" />, color: 'text-emerald-800 bg-emerald-50 border-emerald-200', spot: <SpotIllustrationAssurances className="w-10 h-10" /> },
            { phase: 'Phase 3', title: 'Qualité & Certification', desc: 'Indice de fiabilité des données et vérification directe avec les officines.', label: 'En cours', icon: <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[2.25]" />, color: 'text-amber-800 bg-amber-50 border-amber-200', spot: <SpotIllustrationHopitaux className="w-10 h-10" /> },
            { phase: 'Phase 4', title: 'API Interopérabilité', desc: 'Accès sécurisé V1 pour applications de santé, hôpitaux et bots WhatsApp.', label: 'À venir', icon: <Rocket className="w-3.5 h-3.5 text-indigo-600 stroke-[2.25]" />, color: 'text-indigo-800 bg-indigo-50 border-indigo-200', spot: <SpotIllustrationDeveloppeurs className="w-10 h-10" /> },
            { phase: 'Phase 5', title: 'Assistant Développeur', desc: 'Galenis AI Developer & outils de secours SMS/USSD.', label: 'À venir', icon: <Rocket className="w-3.5 h-3.5 text-indigo-600 stroke-[2.25]" />, color: 'text-indigo-800 bg-indigo-50 border-indigo-200', spot: <SpotIllustrationCitoyens className="w-10 h-10" /> },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    {item.phase}
                  </span>
                  {item.spot}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-slate-600 font-medium text-[11px] leading-relaxed">{item.desc}</p>
              </div>
              <div className={`pt-2 border-t border-slate-200 font-extrabold text-[11px] flex items-center gap-1.5 ${item.color}`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
