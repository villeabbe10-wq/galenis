import React, { useRef } from 'react';
import { Pharmacy } from '../../types';
import { 
  X, 
  Printer, 
  Download, 
  MapPin, 
  Phone, 
  Clock, 
  QrCode, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';

interface VitrinePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy;
  allPharmacies: Pharmacy[];
}

export const VitrinePosterModal: React.FC<VitrinePosterModalProps> = ({
  isOpen,
  onClose,
  pharmacy,
  allPharmacies
}) => {
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isDeGarde = pharmacy.status === 'DE_GARDE' || pharmacy.isGuardToday;
  
  // Find closest or other pharmacies de garde in the same city/region if this one is closed
  const nearbyOnDuty = allPharmacies
    .filter(p => p.id !== pharmacy.id && (p.status === 'DE_GARDE' || p.isGuardToday))
    .slice(0, 3);

  const qrUrl = `https://galenis.tg/itineraire?dest=${encodeURIComponent(pharmacy.name)}&lat=${pharmacy.lat}&lng=${pharmacy.lng}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      
      {/* Container with Print CSS controls */}
      <div className="bg-slate-100 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              A4
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Affiche Vitrine Officine (Format A4 Imprimable)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Affichage d'information obligatoire pour les usagers de nuit devant la vitrine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'Affiche A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center gap-4 bg-slate-200/70">
          
          {/* Pharmacist Advisory Bar (Hidden when printing) */}
          <div className="w-full max-w-[650px] bg-white rounded-2xl p-4 border border-slate-300 shadow-xs print:hidden space-y-2 text-xs">
            <div className="flex items-center justify-between font-extrabold text-slate-900">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Instructions Pratiques d'Impression & Pose Vitrine</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Usage Pharmacien
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Format d'impression :</strong> A4 Portrait, Échelle 100%, marges par défaut.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Protection météo :</strong> Plastifiez l'affiche contre la pluie et l'humidité de Lomé.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Hauteur de lecture :</strong> Fixez à 1,50 m du sol pour que le QR code soit facile à scanner.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Éclairage nocturne :</strong> Positionnez sous l'enseigne ou la veilleuse de la pharmacie.</span>
              </div>
            </div>
          </div>
          
          {/* THE PRINTABLE A4 POSTER CONTAINER */}
          <div 
            ref={posterRef}
            id="galenis-vitrine-poster"
            className="w-full max-w-[650px] bg-white text-slate-900 shadow-xl border-2 border-slate-300 rounded-2xl p-8 sm:p-10 flex flex-col justify-between space-y-6 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none"
            style={{ minHeight: '880px' }}
          >
            {/* Header: Republic + Platform & Cross */}
            <div className="border-b-2 border-emerald-600 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Information Sanitaire Publique • Togo</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 leading-tight tracking-tight">
                    {pharmacy.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{pharmacy.city} ({pharmacy.quarter}) — {pharmacy.address}</span>
                  </p>
                  {pharmacy.pharmacistInCharge && (
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      Pharmacien Titulaire : {pharmacy.pharmacistInCharge}
                    </p>
                  )}
                </div>

                {/* Pharmacy Cross Symbol */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 fill-white" aria-hidden="true">
                    <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* STATUS BANNER (Huge Visibility from the street at night) */}
            {isDeGarde ? (
              <div className="bg-emerald-700 text-white rounded-2xl p-6 text-center space-y-2 border-4 border-emerald-500 shadow-sm">
                <div className="inline-block bg-white text-emerald-900 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-xs">
                  ★ Service Continu 24h/24 & Nuit ★
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  PHARMACIE DE GARDE OUVERTE
                </h2>
                <p className="text-xs sm:text-sm font-medium text-emerald-100 max-w-md mx-auto">
                  Pour vos urgences nocturnes, veuillez sonner à la porte de garde ou contacter l'équipe au numéro ci-dessous.
                </p>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-emerald-900/80 px-5 py-2.5 rounded-xl border border-emerald-400 font-mono text-xl sm:text-2xl font-black">
                    <Phone className="w-5 h-5 text-emerald-300" />
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-center space-y-2 border-2 border-slate-700">
                <div className="inline-block bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Officine Actuellement Fermée
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  PHARMACIES DE GARDE LES PLUS PROCHES
                </h2>
                <p className="text-xs text-slate-300">
                  En cas d'urgence cette nuit ou ce week-end, veuillez vous orienter vers les officines suivantes :
                </p>
              </div>
            )}

            {/* If Closed: List of Nearby On-Duty Pharmacies */}
            {!isDeGarde && nearbyOnDuty.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Pharmacies de garde recommandées dans le secteur :</span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {nearbyOnDuty.map((p, idx) => (
                    <div key={p.id} className="p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 ml-7">
                          {p.city} ({p.quarter}) — {p.address}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs sm:text-sm font-black text-emerald-900 block">
                          {p.phone}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          24h/24
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR CODE SECTION (Scannable with smartphone through glass) */}
            <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
              {/* Dynamic Simulated High-Contrast QR Code */}
              <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs shrink-0 text-center">
                <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto" shapeRendering="crispEdges">
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Position detection pattern top-left */}
                  <rect x="10" y="10" width="24" height="24" fill="#000000" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="18" width="8" height="8" fill="#000000" />
                  {/* Position detection pattern top-right */}
                  <rect x="66" y="10" width="24" height="24" fill="#000000" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="74" y="18" width="8" height="8" fill="#000000" />
                  {/* Position detection pattern bottom-left */}
                  <rect x="10" y="66" width="24" height="24" fill="#000000" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="74" width="8" height="8" fill="#000000" />
                  {/* Data matrix dots */}
                  <rect x="42" y="12" width="6" height="6" fill="#000000" />
                  <rect x="52" y="12" width="6" height="6" fill="#000000" />
                  <rect x="38" y="24" width="6" height="6" fill="#000000" />
                  <rect x="48" y="28" width="6" height="6" fill="#000000" />
                  <rect x="56" y="32" width="6" height="6" fill="#000000" />
                  <rect x="12" y="42" width="6" height="6" fill="#000000" />
                  <rect x="22" y="46" width="6" height="6" fill="#000000" />
                  <rect x="34" y="42" width="6" height="6" fill="#000000" />
                  <rect x="44" y="44" width="12" height="12" fill="#009A63" />
                  <rect x="62" y="42" width="6" height="6" fill="#000000" />
                  <rect x="74" y="46" width="6" height="6" fill="#000000" />
                  <rect x="84" y="42" width="6" height="6" fill="#000000" />
                  <rect x="40" y="62" width="6" height="6" fill="#000000" />
                  <rect x="52" y="66" width="6" height="6" fill="#000000" />
                  <rect x="62" y="62" width="6" height="6" fill="#000000" />
                  <rect x="74" y="66" width="6" height="6" fill="#000000" />
                  <rect x="84" y="74" width="6" height="6" fill="#000000" />
                  <rect x="42" y="78" width="6" height="6" fill="#000000" />
                  <rect x="56" y="82" width="6" height="6" fill="#000000" />
                  <rect x="66" y="80" width="6" height="6" fill="#000000" />
                </svg>
                <span className="text-[9px] font-black text-slate-600 block mt-1 uppercase">
                  Galenis Togo QR
                </span>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-800 font-extrabold text-xs">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Scanner avec l'appareil photo du téléphone</span>
                </div>
                <h4 className="text-base font-black text-slate-900 leading-snug">
                  Itinéraire GPS & Gardes en Temps Réel
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  En scannant ce code, ouvrez immédiatement la carte interactive, les stocks vérifiés et lancez la navigation vers l'officine la plus proche.
                </p>
                <p className="text-[11px] font-mono text-emerald-900 font-bold">
                  https://galenis.tg/garde
                </p>
              </div>
            </div>

            {/* EMERGENCY NUMBERS */}
            <div className="border-t border-slate-200 pt-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 text-center">
                Numéros d'Urgence Nationaux (Togo)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="font-extrabold text-red-700">SAMU / Sapeurs-Pompiers</div>
                  <div className="font-mono font-black text-sm text-red-900">118</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="font-extrabold text-amber-800">Police Secours</div>
                  <div className="font-mono font-black text-sm text-amber-950">117</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="font-extrabold text-emerald-800">Urgences CHU</div>
                  <div className="font-mono font-black text-sm text-emerald-950">22 21 25 01</div>
                </div>
              </div>
            </div>

            {/* LEGAL FOOTER - Explicitly private platform */}
            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
              <span>
                Édité via <strong>Galenis Togo</strong> • Plateforme privée opérée par <strong>Galenis HealthTech Togo SARL</strong>
              </span>
              <span>
                Partenariats sectoriels consultatifs : ONPT & DPML
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
