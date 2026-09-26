import React, { useState } from 'react';
import { 
  Info,
  Terminal,
  Database
} from 'lucide-react';
import { 
  ONPTLogo, 
  CamegTogoLogo, 
  UbipharmLogo, 
  InamLogo, 
  AmuLogo,
  TedisPharmaLogo, 
  CopharmaLogo, 
  UniphartLogo, 
  SapeursPompiersTogoLogo, 
  MshpTogoLogo 
} from './TogoEmblems';

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

export interface TechItem {
  id: string;
  name: string;
  category: string;
  role: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

export const PARTNERS_LIST: PartnerItem[] = [
  {
    id: 'onpt',
    name: 'Ordre National des Pharmaciens du Togo',
    shortName: 'ONPT',
    category: 'ORDRE',
    categoryLabel: 'Ordre Professionnel',
    role: 'Tableau officiel des pharmaciens et calendrier des gardes',
    badge: 'Référentiel',
    officialUrl: 'https://onpt.tg'
  },
  {
    id: 'mshp',
    name: 'Ministère de la Santé et de l\'Hygiène Publique',
    shortName: 'MSHP Togo',
    category: 'MINISTERE',
    categoryLabel: 'Ministère de la Santé',
    role: 'Tarification nationale et homologation des médicaments',
    badge: 'Tutelle',
    officialUrl: 'https://sante.gouv.tg'
  },
  {
    id: 'cameg',
    name: 'Centrale d\'Achat des Médicaments Essentiels (CAMEG-TOGO)',
    shortName: 'CAMEG TOGO',
    category: 'CENTRALE',
    categoryLabel: 'Centrale d\'Achat',
    role: 'Approvisionnement et disponibilité des médicaments essentiels',
    badge: 'Approvisionnement'
  },
  {
    id: 'ubipharm',
    name: 'UBIPHARM Togo',
    shortName: 'UbiPharm',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Livraison et approvisionnement des pharmacies d\'officine',
    badge: 'Grossiste'
  },
  {
    id: 'inam',
    name: 'Institut National d\'Assurance Maladie',
    shortName: 'INAM Togo',
    category: 'ASSURANCE',
    categoryLabel: 'Assurance Maladie',
    role: 'Prise en charge tiers-payant : se soigner n\'est plus un souci',
    badge: 'Tiers-Payant'
  },
  {
    id: 'amu',
    name: 'Assurance Maladie Universelle (AMU Togo)',
    shortName: 'AMU',
    category: 'ASSURANCE',
    categoryLabel: 'Couverture Santé',
    role: 'Régime d\'accès universel aux soins et aux médicaments',
    badge: 'Couverture'
  },
  {
    id: 'tedis',
    name: 'TEDIS Pharma Togo',
    shortName: 'TEDIS Pharma TG',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Distribution et livraison de produits pharmaceutiques',
    badge: 'Grossiste'
  },
  {
    id: 'pompiers',
    name: 'Brigade des Sapeurs-Pompiers du Togo (Secours 118)',
    shortName: 'BSPT (118 Togo)',
    category: 'URGENCE',
    categoryLabel: 'Secours d\'Urgence',
    role: 'Courage et Dévouement • Urgences médicales 24h/24',
    badge: 'Secours 118'
  },
  {
    id: 'copharma',
    name: 'Compagnie Pharmaceutique du Togo (COPHARMA)',
    shortName: 'COPHARMA',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Distribution des produits pharmaceutiques aux pharmacies',
    badge: 'Grossiste'
  },
  {
    id: 'uniphart',
    name: 'Union Pharmacie Togo (UNIPHART)',
    shortName: 'UNIPHART',
    category: 'GROSSISTE',
    categoryLabel: 'Grossiste Répartiteur',
    role: 'Fourniture de médicaments aux officines',
    badge: 'Grossiste'
  }
];

export const TECH_STACK_LIST: TechItem[] = [
  {
    id: 'php',
    name: 'PHP',
    category: 'Langage Backend',
    role: 'Connexion avec les logiciels de caisse des pharmacies',
    badge: 'PHP',
    color: '#777BB4',
    bgColor: 'bg-indigo-50/80',
    borderColor: 'border-indigo-200',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4.7 13.5l1.2-5.7h2.2c1.3 0 2 .6 1.7 2-.3 1.5-1.5 2.2-2.8 2.2H8.8l-.5 2.5h-2zm6.2 0l1.2-5.7h2.2c1.3 0 2 .6 1.7 2-.3 1.5-1.5 2.2-2.8 2.2h-1.8l-.5 2.5h-2zm-3.6-4.5h.7c.6 0 1-.3 1.1-.9.1-.6-.2-.9-.8-.9h-.7l-.3 1.8zm6.2 0h.7c.6 0 1-.3 1.1-.9.1-.6-.2-.9-.8-.9h-.7l-.3 1.8z" />
      </svg>
    )
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Traitement de Données',
    role: 'Importation et mise à jour de la liste des médicaments',
    badge: 'Python',
    color: '#3776AB',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-200',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.914 0C5.834 0 6.2 2.64 6.2 2.64l.006 2.735h5.81v.827H3.92S0 5.756 0 11.876c0 6.12 3.42 5.904 3.42 5.904h2.04v-2.868s-.11-3.42 3.364-3.42h5.787s3.256.05 3.256-3.15V3.15S18.36 0 11.914 0zm-3.15 1.823c.574 0 1.04.466 1.04 1.04 0 .575-.466 1.04-1.04 1.04-.575 0-1.04-.465-1.04-1.04 0-.574.465-1.04 1.04-1.04zM12.086 24c6.08 0 5.714-2.64 5.714-2.64l-.006-2.735h-5.81v-.827h8.096S24 18.244 24 12.124c0-6.12-3.42-5.904-3.42-5.904h-2.04v2.868s.11 3.42-3.364 3.42H9.39s-3.256-.05-3.256 3.15v5.19s-.494 3.15 5.952 3.15zm3.15-1.823c-.574 0-1.04-.466-1.04-1.04 0-.575.466-1.04 1.04-1.04.575 0 1.04.465 1.04 1.04 0 .574-.465 1.04-1.04 1.04z" />
      </svg>
    )
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Code Sécurisé',
    role: 'Développement de l\'application avec vérification des erreurs',
    badge: 'TypeScript',
    color: '#3178C6',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-200',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM12 7.5h6v2.25h-1.875V19.5H13.875V9.75H12V7.5zm-5.625 2.25H9v2.25H6.375V14.25H9v2.25H4.125v-4.5H6.375V9.75z" />
      </svg>
    )
  },
  {
    id: 'react',
    name: 'React',
    category: 'Interface Web',
    role: 'Recherche rapide et affichage interactif des pharmacies de garde',
    badge: 'React',
    color: '#00D8FE',
    bgColor: 'bg-cyan-50/80',
    borderColor: 'border-cyan-200',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Affichage Mobile',
    role: 'Mise en page lisible et adaptée aux écrans de smartphones',
    badge: 'CSS',
    color: '#06B6D4',
    bgColor: 'bg-teal-50/80',
    borderColor: 'border-teal-200',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6c-4.4 0-6.6 2.2-6.6 6.6 1.6-2.2 3.6-2.8 6-1.7 1.4.6 2.4 1.7 3.5 2.8C16.7 15.6 19.1 18 24 18c4.4 0 6.6-2.2 6.6-6.6-1.6 2.2-3.6 2.8-6 1.7-1.4-.6-2.4-1.7-3.5-2.8C19.3 8.4 16.9 6 12 6zM0 12c4.4 0 6.6 2.2 6.6 6.6 1.6-2.2 3.6-2.8 6-1.7 1.4.6 2.4 1.7 3.5 2.8C17.9 21.6 20.3 24 25.2 24c4.4 0 6.6-2.2 6.6-6.6-1.6 2.2-3.6 2.8-6 1.7-1.4-.6-2.4-1.7-3.5-2.8C20.5 14.4 18.1 12 13.2 12c-4.4 0-6.6 2.2-6.6 6.6-1.6-2.2-3.6-2.8-6-1.7-1.4.6-2.4 1.7-3.5 2.8C3.7 21.6 1.3 24 0 24V12z" />
      </svg>
    )
  },
  {
    id: 'rest-api',
    name: 'API REST',
    category: 'Partage de Données',
    role: 'Accès aux horaires de garde et aux prix officiels en direct',
    badge: 'API JSON',
    color: '#00A878',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-200',
    icon: ({ className }) => (
      <Terminal className={className} />
    )
  },
  {
    id: 'postgres',
    name: 'Base SQL',
    category: 'Stockage Données',
    role: 'Classement des pharmacies par quartier, ville et région du Togo',
    badge: 'SQL',
    color: '#336791',
    bgColor: 'bg-slate-50/80',
    borderColor: 'border-slate-200',
    icon: ({ className }) => (
      <Database className={className} />
    )
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
  const [isHoveredPartners, setIsHoveredPartners] = useState(false);
  const [isHoveredTech, setIsHoveredTech] = useState(false);

  return (
    <section className={`w-full py-7 overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-slate-50 border-y border-slate-200/90 text-slate-900 ${className}`}>
      
      {showTitle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Réseau & Technologies
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Acteurs de Santé & Technologies
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Informations sur les pharmacies du Togo et outils techniques utilisés pour l'application.
              </p>
            </div>
            
            <div className="text-[11px] font-bold hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Survolez pour mettre en pause</span>
            </div>
          </div>
        </div>
      )}

      {/* TRACK 1: PARTNERS (Scroll Left - Normal Direction) */}
      <div className="space-y-4">
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHoveredPartners(true)}
          onMouseLeave={() => setIsHoveredPartners(false)}
        >
          {/* Left & Right gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-100/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-100/90 to-transparent z-10 pointer-events-none" />

          {/* Double-track for infinite smooth loop */}
          <div 
            className={`flex gap-4 w-max items-center py-1 ${isHoveredPartners ? 'animation-paused' : 'animate-marquee'}`}
            style={{ animationDuration: '40s' }}
          >
            {[...PARTNERS_LIST, ...PARTNERS_LIST].map((partner, index) => (
              <div
                key={`partner-${partner.id}-${index}`}
                className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all duration-200 group cursor-default"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center shrink-0 shadow-2xs transition-colors overflow-hidden p-0.5">
                      {partner.id === 'onpt' ? (
                        <ONPTLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'mshp' ? (
                        <MshpTogoLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'cameg' ? (
                        <CamegTogoLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'ubipharm' ? (
                        <UbipharmLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'inam' ? (
                        <InamLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'amu' ? (
                        <AmuLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'tedis' ? (
                        <TedisPharmaLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'pompiers' ? (
                        <SapeursPompiersTogoLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'copharma' ? (
                        <CopharmaLogo className="w-full h-full object-contain" />
                      ) : partner.id === 'uniphart' ? (
                        <UniphartLogo className="w-full h-full object-contain" />
                      ) : (
                        <ONPTLogo className="w-full h-full object-contain" />
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

        {/* TRACK 2: TECH STACK & DEV LANGUAGES (Scroll Right - Reverse Direction) */}
        <div className="pt-1">
          <div 
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHoveredTech(true)}
            onMouseLeave={() => setIsHoveredTech(false)}
          >
            {/* Left & Right gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-100/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-100/90 to-transparent z-10 pointer-events-none" />

            {/* Double-track for infinite smooth reverse loop */}
            <div 
              className={`flex gap-4 w-max items-center py-1 ${isHoveredTech ? 'animation-paused' : 'animate-marquee-reverse'}`}
              style={{ animationDuration: '42s' }}
            >
              {[...TECH_STACK_LIST, ...TECH_STACK_LIST].map((tech, index) => (
                <div
                  key={`tech-${tech.id}-${index}`}
                  className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-500/50 hover:bg-blue-50/20 transition-all duration-200 group cursor-default"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className={`w-9 h-9 rounded-xl ${tech.bgColor} ${tech.borderColor} border flex items-center justify-center shrink-0 shadow-2xs p-1.5 transition-transform group-hover:scale-110`}
                        style={{ color: tech.color }}
                      >
                        <tech.icon className="w-5 h-5" />
                      </div>

                      <div>
                        <h4 className="font-black text-xs leading-tight text-slate-900 group-hover:text-blue-800 transition-colors">
                          {tech.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-500 block leading-tight mt-0.5">
                          {tech.category}
                        </span>
                      </div>
                    </div>

                    <span 
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0"
                      style={{ 
                        backgroundColor: `${tech.color}15`, 
                        color: tech.color,
                        borderColor: `${tech.color}35`
                      }}
                    >
                      {tech.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {tech.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
