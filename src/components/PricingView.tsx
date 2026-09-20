import React, { useRef, useState } from 'react';
import { LionIcon } from './LionIcon';
import { 
  Check, 
  ShieldCheck, 
  Building2, 
  Heart, 
  Scale, 
  PhoneCall, 
  BadgeCheck,
  CheckCircle2,
  Sparkles,
  Truck,
  Globe2,
  ArrowRight,
  Code2,
  Bot,
  Zap
} from 'lucide-react';
import { TogoFlag } from './TogoEmblems';
import { DeveloperOnboardingWizard } from './DeveloperOnboardingWizard';

interface PricingViewProps {
  onNavigateToApiPortal?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigateToApiPortal }) => {
  const wizardRef = useRef<HTMLDivElement>(null);
  const [wizardTier, setWizardTier] = useState<'FREE_CITIZEN' | 'FREE_OFFICINE' | 'DEV_API' | 'INSTITUTIONAL'>('DEV_API');

  const scrollToWizard = (tier: 'FREE_CITIZEN' | 'FREE_OFFICINE' | 'DEV_API' | 'INSTITUTIONAL') => {
    setWizardTier(tier);
    if (wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Hero Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#00A878]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-[#00A878]/40">
            <Scale className="w-3.5 h-3.5 text-[#00A878]" />
            <span>TARIFS & PLATAFORME DÉVELOPPEUR API</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-3">
            <span>Tarifs & Parcours Intégration API</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Galenis Togo est l'infrastructure numérique des données pharmaceutiques du Togo. Choisissez une offre et démarrez instantanément votre parcours d'intégration avec l'assistance de <strong className="text-emerald-700">Galenis AI Developer</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToWizard('DEV_API')}
              className="bg-[#00A878] hover:bg-[#009267] text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Bot className="w-4 h-4" />
              <span>Démarrer avec Galenis AI Developer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="space-y-4">
        {/* FedaPay Trust Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              F
            </div>
            <div>
              <div className="font-black text-slate-900 text-xs flex items-center gap-2">
                <span>Passerelle de Paiement Agréée FedaPay Togo</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  Agrégateur National & UEMOA
                </span>
              </div>
              <p className="text-slate-600 text-[11px] font-medium mt-0.5">
                Règlements sécurisés via <strong>T-Money (Togocom)</strong>, <strong>Moov Money (Flooz)</strong> et <strong>Cartes Visa / Mastercard</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chiffrement SSL 256-bit</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>1. Choisissez une Offre Tarifaire</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Accès instantané aux environnements Sandbox & Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tier 1: Citoyen */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Citoyen & Patient
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900">0 FCFA</div>
                <p className="text-[11px] text-slate-500 font-medium">Utilité publique gratuit à vie</p>
              </div>

              <h3 className="text-base font-bold text-slate-900">Portail Citoyen & Gardes</h3>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Recherche & géolocalisation des pharmacies de garde.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Consultation des tarifs publics homologués par le Ministère.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Appel téléphonique direct en 1 clic vers l'officine.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Signalement citoyen et numéros d'urgence.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => scrollToWizard('FREE_CITIZEN')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Accéder au portail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[10px] text-center text-slate-400 font-medium">
                Service public accessible sans création de compte.
              </div>
            </div>
          </div>

          {/* Tier 2: Officine & Galenis Pro */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-500 shadow-md relative space-y-5 flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full shadow">
              Offre Officine
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  Pharmacie / Officine
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900">0 FCFA <span className="text-xs font-normal text-slate-500">de base</span></div>
                <p className="text-[11px] text-emerald-600 font-bold">Galenis Pro : 5 000 FCFA / mois</p>
              </div>

              <h3 className="text-base font-bold text-slate-900">Référencement & Galenis Pro</h3>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Référencement national (0 FCFA)</strong> : fiche vérifiée & déclaration des gardes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pro (5 000 FCFA/mois)</strong> : gestion avancée de l'officine & statistiques.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Alertes stock bas & historique détaillé des tours de garde.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès multi-utilisateurs & support prioritaire officines.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => scrollToWizard('FREE_OFFICINE')}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>S'inscrire comme Officine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[10px] text-center text-slate-400 font-medium">
                Référencement gratuit • Option Pro 5 000 FCFA/mois.
              </div>
            </div>
          </div>

          {/* Tier 3: Developer & Startup API (Recommended) */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500 shadow-xl relative space-y-5 flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] uppercase font-black px-3 py-0.5 rounded-full shadow flex items-center gap-1">
              <LionIcon className="w-3.5 h-3.5 text-slate-950" />
              <span>Choix Développeurs & API</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Développeurs & Startups
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-emerald-400">5 000 FCFA <span className="text-xs font-normal text-slate-300">/ mois</span></div>
                <p className="text-[11px] text-slate-300 font-medium">10 000 req/mois • Sandbox gratuit (1k req/mois)</p>
              </div>

              <h3 className="text-base font-bold text-white">Developer API Production</h3>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sandbox Gratuit (0 FCFA)</strong> : 1 000 req/mois, test instantané.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Production (5 000 FCFA)</strong> : Clé Live, 10 000 req/mois & logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Assistant <strong>Galenis AI Developer</strong> (500 questions/mois).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Console REST interactive & SDKs (Node, Python, Flutter).</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => scrollToWizard('DEV_API')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Lancer l'Intégration API</span>
              </button>
              <div className="text-[10px] text-center text-slate-400 font-medium">
                Démarrez en Sandbox gratuit puis passez en Live.
              </div>
            </div>
          </div>

          {/* Tier 4: Institutionnel & Santé */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                  Institutionnel
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-purple-400">300 000 FCFA <span className="text-xs font-normal text-slate-400">/ an</span></div>
                <p className="text-[11px] text-slate-400 font-medium">500 000 req/mois • Clés multiples & SLA</p>
              </div>

              <h3 className="text-base font-bold text-white">Réseau Hôpitaux & Assurances</h3>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Accès API REST temps réel 500k req/mois.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Interconnexion logicielle (Hôpitaux, Cliniques & Mutuelles).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Webhooks temps réel & contrôle des règles métier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>SLA 99.9% garanti avec support VIP dédié.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => scrollToWizard('INSTITUTIONAL')}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Contacter l'Équipe B2B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[10px] text-center text-slate-400 font-medium">
                Pour hôpitaux, assureurs et ministères (sur-mesure).
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Developer Onboarding Pipeline Wizard */}
      <div ref={wizardRef} className="pt-4">
        <DeveloperOnboardingWizard 
          initialTier={wizardTier}
          onCompleteToApiPortal={onNavigateToApiPortal}
        />
      </div>

      {/* Realistic Togolese Supply Chain Context Note */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>Cadre Approvisionnement & Partenaires Grossistes du Togo</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Conformément aux réalités d'approvisionnement des officines au Togo (commandes auprès des grossistes répartiteurs nationaux agréés tels que <strong>UBIPHARM TOGO</strong> et <strong>UNIPHART TOGO</strong>, ainsi que les commandes d'importation spécialisées hors-Togo), Galenis Togo met l'accent sur la déclaration directe de disponibilité et le contact direct, sans imposer de système de vente en ligne ou de télé-réservation non adapté.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="font-extrabold text-slate-900">UBIPHARM TOGO</div>
            <p className="text-[11px] text-slate-500">Grossiste répartiteur agréé pour l'approvisionnement pharmaceutique national.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="font-extrabold text-slate-900">UNIPHART TOGO</div>
            <p className="text-[11px] text-slate-500">Union Pharmacie Togo, partenaire de distribution des produits de santé.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

