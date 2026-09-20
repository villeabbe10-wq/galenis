import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  HeartPulse, 
  Activity, 
  Cross, 
  CheckCircle2, 
  ExternalLink,
  Info,
  HeartHandshake
} from 'lucide-react';
import { ONPTLogo, TogoCoatOfArms, TogoFlag } from './TogoEmblems';

export interface PartnerItem {
  id: string;
  name: string;
  shortName: string;
  category: 'ORDRE' | 'MINISTERE' | 'CENTRALE' | 'GROSSISTE' | 'ASSURANCE' | 'URGENCE';
  categoryLabel: string;
  role: string;
  officialUrl?: string;
  badge: string;
}

export const PARTNERS_LIST: PartnerItem[] = [
  {
    id: 'onpt',
    name: 'Ordre National des Pharmaciens du Togo',
    shortName: 'ONPT',
    category: 'ORDRE',
    categoryLabel: 'Référentiel Ordinal',
    role: 'Régulation déontologique & Tableaux officiels',
    badge: 'Référentiel',
    officialUrl: 'https://onpt.tg'
  },
  {
    id: 'mshp',
    name: 'Ministère de la Santé et de l\'Hygiène Publique',
    shortName: 'MSHP Togo',
    category: 'MINISTERE',
    categoryLabel: 'Tutelle Sanitaire',
    role: 'Politique nationale de santé publique',
    badge: 'Tutelle',
    officialUrl: 'https://sante.gouv.tg'
  },
  {
    id: 'cameg',
    name: 'Centrale d\'Achat des Médicaments Essentiels (CAMEG-TOGO)',
    shortName: 'CAMEG Togo',
    category: 'CENTRALE',
    categoryLabel: 'Centrale Nationale',
    role: 'Approvisionnement & Sécurité des stocks essentiels',
    badge: 'Approvisionnement'
  },
  {
    id: 'ubipharm',
    name: 'UBIPHARM Togo',
    shortName: 'UBIPHARM',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Distribution pharmaceutique agréée sur tout le Togo',
    badge: 'Distributeur Agréé'
  },
  {
    id: 'copharma',
    name: 'Compagnie Pharmaceutique du Togo (COPHARMA)',
    shortName: 'COPHARMA',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Logistique et approvisionnement des officines',
    badge: 'Distributeur Agréé'
  },
  {
    id: 'tedis',
    name: 'TEDIS Pharma Togo',
    shortName: 'TEDIS Pharma',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Réseau de distribution pharmaceutique hospitalier & officinal',
    badge: 'Distributeur Agréé'
  },
  {
    id: 'uniphart',
    name: 'Union Pharmacie Togo (UNIPHART)',
    shortName: 'UNIPHART',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Fourniture & partenariat des officines privées',
    badge: 'Distributeur Agréé'
  },
  {
    id: 'inam-amu',
    name: 'Institut National d\'Assurance Maladie (INAM / AMU)',
    shortName: 'INAM • AMU',
    category: 'ASSURANCE',
    categoryLabel: 'Assurance & Tiers-Payant',
    role: 'Couverture santé universelle & conventions officines',
    badge: 'Tiers-Payant'
  },
  {
    id: 'pompiers',
    name: 'Corps des Sapeurs-Pompiers du Togo (Secours 118)',
    shortName: 'Sapeurs-Pompiers (118)',
    category: 'URGENCE',
    categoryLabel: 'Secours & Urgences',
    role: 'Secours d\'urgence, régulation des gardes et évacuations 24h/24',
    badge: 'Urgences 118'
  }
];

interface PartnerMarqueeProps {
  className?: string;
  theme?: 'light' | 'dark';
  showTitle?: boolean;
}

export const PartnerMarquee: React.FC<PartnerMarqueeProps> = ({ 
  className = '', 
  showTitle = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className={`w-full py-7 overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-slate-50 border-y border-slate-200/90 text-slate-900 ${className}`}>
      
      {showTitle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Réseau National de Santé
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Partenaires & Acteurs de Santé au Togo
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Plateforme citoyenne conçue en alignement avec les instances ordinales, ministérielles, centrales d'achat, grossistes répartiteurs et services de secours.
              </p>
            </div>
            
            <div className="text-[11px] font-bold hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Défilement continu • Survolez pour figer</span>
            </div>
          </div>
        </div>
      )}

      {/* Marquee Track Container */}
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right gradient fades for sleek visual boundary */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-100/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-100/90 to-transparent z-10 pointer-events-none" />

        {/* Double-track for infinite smooth loop */}
        <div 
          className={`flex gap-4 w-max items-center py-2 ${isHovered ? 'animation-paused' : 'animate-marquee'}`}
          style={{ animationDuration: '38s' }}
        >
          {/* Loop array twice to ensure seamless continuous scrolling */}
          {[...PARTNERS_LIST, ...PARTNERS_LIST].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all duration-200 group cursor-default"
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  {/* Partner Icon / Emblem / Custom Logo Placeholder */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center shrink-0 shadow-2xs transition-colors overflow-hidden p-1">
                    {partner.id === 'onpt' ? (
                      <ONPTLogo className="w-full h-full object-contain" />
                    ) : partner.category === 'MINISTERE' ? (
                      <TogoCoatOfArms className="w-7 h-7 object-contain" />
                    ) : partner.category === 'GROSSISTE' ? (
                      <Truck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    ) : partner.category === 'CENTRALE' ? (
                      <Building2 className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
                    ) : partner.category === 'ASSURANCE' ? (
                      <ShieldCheck className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    ) : (
                      <HeartPulse className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-xs leading-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {partner.shortName}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500 block leading-tight mt-0.5">
                      {partner.categoryLabel}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {partner.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                {partner.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
