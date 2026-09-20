import React from 'react';
import { 
  Factory, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Truck, 
  Building2, 
  Shield,
  Activity,
  Award
} from 'lucide-react';

interface TraceabilityContextBandProps {
  className?: string;
}

export const TraceabilityContextBand: React.FC<TraceabilityContextBandProps> = ({ 
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden bg-[#031C15] text-white border-t border-b border-[#064E3B] shadow-2xs ${className}`}>
      
      {/* Crisp Pharmaceutical Line-Art positioned to the right (Dark Theme Wireframes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-end opacity-50 sm:opacity-80">
        <svg 
          className="h-full w-auto max-w-[700px] object-right" 
          viewBox="0 0 650 180" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Technical Alignment Grid */}
          <pattern id="traceGridDark" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#064E3B" strokeWidth="0.5" strokeDasharray="2 3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#traceGridDark)" />

          {/* 1. Pharmaceutical Medicine Box 3D Isometric View */}
          <g transform="translate(40, 25)" stroke="#059669" strokeWidth="1.2">
            <rect x="0" y="20" width="75" height="85" rx="4" fill="#042F22" fillOpacity="0.4" />
            <polygon points="0,20 22,7 97,7 75,20" fill="#064E3B" fillOpacity="0.4" />
            <polygon points="75,20 97,7 97,92 75,105" fill="#021C15" fillOpacity="0.4" />
            
            {/* Security Seal */}
            <rect x="0" y="42" width="75" height="12" fill="#059669" fillOpacity="0.1" />
            <line x1="6" y1="48" x2="45" y2="48" stroke="#10B981" strokeWidth="1.3" />
            <circle cx="60" cy="48" r="2.5" fill="#10B981" />
            
            {/* DataMatrix representation */}
            <rect x="8" y="64" width="18" height="18" rx="2" fill="#059669" fillOpacity="0.2" />
            <rect x="11" y="67" width="5" height="5" fill="#10B981" />
            <rect x="19" y="67" width="4" height="4" fill="#10B981" />
            <rect x="11" y="75" width="4" height="4" fill="#10B981" />

            {/* Dosage lines */}
            <line x1="32" y1="67" x2="65" y2="67" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="32" y1="74" x2="60" y2="74" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* 2. Galenic Dropper & Syrup Vials */}
          <g transform="translate(170, 30)" stroke="#059669" strokeWidth="1.2">
            <path d="M14 12 L14 6 C14 4 16 2 18 2 L26 2 C28 2 30 4 30 6 L30 12 C38 16 42 22 42 32 L42 78 C42 83 38 86 34 86 L10 86 C6 86 2 83 2 78 L2 32 C2 22 6 16 14 12 Z" fill="#042F22" fillOpacity="0.4" />
            <rect x="16" y="0" width="12" height="4" rx="2" fill="#10B981" />
            <line x1="8" y1="38" x2="36" y2="38" strokeDasharray="2 2" />
            <line x1="8" y1="50" x2="36" y2="50" strokeDasharray="2 2" />
            <line x1="8" y1="62" x2="36" y2="62" strokeDasharray="2 2" />

            {/* Dropper Pipette */}
            <g transform="translate(48, 8)">
              <path d="M12 16 L12 8 L18 8 L18 16 C24 20 28 26 28 34 L28 64 C28 68 24 72 20 72 L10 72 C6 72 2 68 2 64 L2 34 C2 26 6 20 12 16 Z" fill="#064E3B" fillOpacity="0.4" />
              <path d="M15 0 C13 0 13 6 15 7 C17 6 17 0 15 0 Z" fill="#10B981" />
            </g>
          </g>

          {/* 3. Molecular Lattice Chain */}
          <g transform="translate(290, 26)" stroke="#059669" strokeWidth="1.2">
            <polygon points="40,12 65,26 65,56 40,70 15,56 15,26" fill="#042F22" fillOpacity="0.4" />
            <circle cx="40" cy="12" r="3.5" fill="#10B981" />
            <circle cx="65" cy="26" r="3.5" fill="#10B981" />
            <circle cx="65" cy="56" r="3.5" fill="#10B981" />
            <circle cx="40" cy="70" r="3.5" fill="#10B981" />
            <circle cx="15" cy="56" r="3.5" fill="#10B981" />
            <circle cx="15" cy="26" r="3.5" fill="#10B981" />
            <circle cx="40" cy="41" r="14" strokeDasharray="2 2" strokeWidth="0.9" />

            <line x1="65" y1="41" x2="98" y2="41" strokeWidth="1.8" stroke="#10B981" />

            <polygon points="122,12 147,26 147,56 122,70 97,56 97,26" fill="#064E3B" fillOpacity="0.4" />
            <circle cx="122" cy="12" r="3.5" fill="#10B981" />
            <circle cx="147" cy="26" r="3.5" fill="#10B981" />
            <circle cx="147" cy="56" r="3.5" fill="#10B981" />
            <circle cx="122" cy="70" r="3.5" fill="#10B981" />
          </g>

          {/* 4. Blister Pack & Quality Stamp */}
          <g transform="translate(480, 26)" stroke="#059669" strokeWidth="1.2">
            <rect x="0" y="6" width="90" height="58" rx="6" fill="#042F22" fillOpacity="0.4" />
            <rect x="8" y="13" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="29" y="13" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="50" y="13" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="71" y="13" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="8" y="37" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="29" y="37" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="50" y="37" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />
            <rect x="71" y="37" width="13" height="18" rx="5" fill="#059669" fillOpacity="0.2" />

            <circle cx="122" cy="40" r="20" fill="#064E3B" fillOpacity="0.3" strokeDasharray="3 2" />
            <path d="M122 26 L122 54 M117 32 C122 30 127 35 122 39 C117 43 127 48 122 51" strokeWidth="1.2" />
          </g>
        </svg>
      </div>

      {/* Main Header Zone with High Contrast Text */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Headline & Description */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064E3B]/80 text-[#34D399] border border-[#059669]/60 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                <Shield className="w-3.5 h-3.5" />
                Chaîne Nationale de Distribution
              </span>
              <span className="text-xs font-semibold text-emerald-100/90 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                Normes Ordinales & Bonnes Pratiques Pharmaceutiques Togo
              </span>
            </div>
            
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
              Traçabilité & Sécurité des Produits de Santé au Togo
            </h2>
            
            <p className="text-xs sm:text-sm text-emerald-50/80 leading-relaxed font-medium max-w-2xl">
              Du laboratoire certifié aux officines de garde et centres hospitaliers : un circuit national maîtrisé garantissant l'intégrité thérapeutique des médicaments, le respect strict de la chaîne du froid et la conformité déontologique.
            </p>
          </div>

          {/* Metric Badge */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 bg-[#022C22]/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#064E3B] shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#064E3B] border border-[#059669]/50 flex items-center justify-center text-[#34D399]">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Circuit Officiel</div>
              <div className="text-xs font-extrabold text-white">100% Agréé Togo</div>
            </div>
          </div>

        </div>
      </div>

      {/* Unified 5-Step Distribution Chain */}
      <div className="relative z-10 bg-[#021812]/90 border-t border-[#064E3B]/60 py-3 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          
          {/* Step 1: Production & Labos */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#062F22] border border-[#064E3B] hover:border-[#059669] hover:bg-[#063E2D] transition-all text-emerald-50 shadow-2xs">
            <span className="w-7 h-7 rounded-lg bg-[#042016] border border-[#064E3B] flex items-center justify-center text-[#34D399] shrink-0">
              <Factory className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs whitespace-nowrap">Production & Labos</span>
          </div>

          {/* Step 2: Contrôle & ONPT */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#062F22] border border-[#064E3B] hover:border-[#059669] hover:bg-[#063E2D] transition-all text-emerald-50 shadow-2xs">
            <span className="w-7 h-7 rounded-lg bg-[#042016] border border-[#064E3B] flex items-center justify-center text-[#34D399] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs whitespace-nowrap">Contrôle & ONPT</span>
          </div>

          {/* Step 3: Chaîne du Froid */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#062F22] border border-[#064E3B] hover:border-[#059669] hover:bg-[#063E2D] transition-all text-emerald-50 shadow-2xs">
            <span className="w-7 h-7 rounded-lg bg-[#042016] border border-[#064E3B] flex items-center justify-center text-[#34D399] shrink-0">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs whitespace-nowrap">Chaîne du Froid (2-8°C)</span>
          </div>

          {/* Step 4: Grossistes Répartiteurs */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#062F22] border border-[#064E3B] hover:border-[#059669] hover:bg-[#063E2D] transition-all text-emerald-50 shadow-2xs">
            <span className="w-7 h-7 rounded-lg bg-[#042016] border border-[#064E3B] flex items-center justify-center text-[#34D399] shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs whitespace-nowrap">Grossistes Répartiteurs</span>
          </div>

          {/* Step 5: Officines & Hôpitaux */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#062F22] border border-[#064E3B] hover:border-[#059669] hover:bg-[#063E2D] transition-all text-emerald-50 shadow-2xs">
            <span className="w-7 h-7 rounded-lg bg-[#042016] border border-[#064E3B] flex items-center justify-center text-[#34D399] shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs whitespace-nowrap">Officines & Hôpitaux</span>
          </div>

        </div>
      </div>
    </div>
  );
};


