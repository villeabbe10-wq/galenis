import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pharmacy } from '../../types';
import { LionIcon } from '../LionIcon';
import { ShareModal } from './ShareModal';
import { GlassBadge } from '../ui/GlassBadge';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  Info,
  Globe,
  CreditCard,
  Truck,
  Activity,
  Smartphone,
  Share2,
  Navigation,
  Copy,
  Check,
  Car,
  Calculator
} from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  userLat?: number;
  userLng?: number;
  distanceKm?: number;
  onSelect: (p: Pharmacy) => void;
  onReportError: (p: Pharmacy) => void;
  onEstimatePrice?: (p: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  distanceKm,
  onSelect,
  onReportError,
  onEstimatePrice
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const isDeGarde = pharmacy.status === 'DE_GARDE' || pharmacy.isGuardToday;
  const isOpen = pharmacy.status === 'OPEN' || isDeGarde;

  const whatsappMessage = encodeURIComponent(
    `Bonjour ${pharmacy.name}, je repère votre établissement via le Référentiel Galenis Togo. Pouvez-vous me confirmer vos horaires et la disponibilité de médicaments ?`
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
  const gozemUrl = `https://gozem.co/`; // Gozem transport app

  const handleCopyDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${pharmacy.name}\n${pharmacy.city} (${pharmacy.quarter}) - ${pharmacy.address}\nTél: ${pharmacy.phone}\nCoordonnées GPS: ${pharmacy.lat}, ${pharmacy.lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`group relative overflow-hidden rounded-[26px] p-5 sm:p-5.5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
        isDeGarde 
          ? 'bg-gradient-to-b from-amber-50/70 via-white to-white border-2 border-amber-400/90 shadow-[0_10px_30px_-5px_rgba(217,119,6,0.15)] ring-4 ring-amber-400/10' 
          : 'bg-white/90 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-10px_rgba(0,168,120,0.1)] hover:border-emerald-500/40'
      }`}
    >
      {/* Subtle top inner light highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      {/* Top badges & status */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {isDeGarde ? (
              <GlassBadge variant="amber" dot pulse className="shadow-xs">
                <LionIcon className="w-3.5 h-3.5 text-amber-900" />
                <span>DE GARDE 24H/24</span>
              </GlassBadge>
            ) : isOpen ? (
              <GlassBadge variant="emerald" dot>
                <span>Ouverte actuellement</span>
              </GlassBadge>
            ) : (
              <GlassBadge variant="slate" dot>
                <span>Fermée</span>
              </GlassBadge>
            )}

            {pharmacy.is24h && (
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-cyan-50/90 text-cyan-900 border border-cyan-300/70 shadow-2xs">
                Service 24h/24
              </span>
            )}

            {distanceKm !== undefined && (
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100/90 text-slate-800 border border-slate-200/80 flex items-center gap-1 shadow-2xs">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{distanceKm} km</span>
              </span>
            )}
          </div>

          {/* Reliability Level tag */}
          <span className="text-[10.5px] font-extrabold text-emerald-900 bg-emerald-50/90 px-2.5 py-0.5 rounded-full border border-emerald-300/70 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.25]" />
            <span>Vérifié {pharmacy.verificationSource}</span>
          </span>
        </div>

        {/* Pharmacy Name & Location */}
        <h3 
          onClick={() => onSelect(pharmacy)}
          className="text-lg font-black text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors leading-snug flex items-center gap-1.5 font-display"
        >
          {pharmacy.name}
        </h3>

        <p className="text-xs text-slate-600 mt-1 flex items-start gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-900 font-bold">{pharmacy.city}</strong> ({pharmacy.quarter}) — {pharmacy.address}
          </span>
        </p>

        {/* Hours & Pharmacist */}
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate"><strong>Horaires :</strong> {pharmacy.hours.weekday}</span>
          </div>

          {pharmacy.pharmacistInCharge && (
            <div className="text-[11px] text-slate-500 italic">
              Titulaire : {pharmacy.pharmacistInCharge}
            </div>
          )}
        </div>

        {/* Data Quality Verification Bento Box */}
        <div className="mt-3 bg-slate-50/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 text-[11px] text-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 text-[11px] pb-1 border-b border-slate-200/60 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Vérifiée aujourd'hui ({pharmacy.lastVerified.split(' ')[0] || 'Aujourd\'hui'})</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10.5px] font-semibold">
            <div className="flex items-center gap-1 text-slate-800">
              <span className="text-emerald-600 font-black text-xs">✓</span>
              <span>Téléphone</span>
            </div>
            <div className="flex items-center gap-1 text-slate-800">
              <span className="text-emerald-600 font-black text-xs">✓</span>
              <span>Adresse</span>
            </div>
            <div className="flex items-center gap-1 text-slate-800">
              <span className="text-emerald-600 font-black text-xs">✓</span>
              <span>Garde</span>
            </div>
            <div className="flex items-center gap-1 text-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>Disponibilité : Déclarée</span>
            </div>
          </div>
        </div>

        {/* Services & Payment Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pharmacy.website && (
            <a
              href={pharmacy.website.startsWith('http') ? pharmacy.website : `https://${pharmacy.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10.5px] font-bold bg-cyan-50/90 text-cyan-900 border border-cyan-300/70 px-2.5 py-1 rounded-xl flex items-center gap-1.5 hover:bg-cyan-100 transition-colors shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-200 text-cyan-800 flex items-center justify-center shrink-0">
                <Globe className="w-2 h-2" />
              </div>
              <span>Site Web</span>
            </a>
          )}

          {pharmacy.mobilePayments.map((pm) => (
            <span key={pm} className="text-[10.5px] font-bold bg-emerald-50/90 text-emerald-900 border border-emerald-300/70 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                {pm === 'Carte Bancaire' ? <CreditCard className="w-2 h-2" /> : <Smartphone className="w-2 h-2" />}
              </div>
              <span>{pm}</span>
            </span>
          ))}

          {pharmacy.services.includes('LIVRAISON') && (
            <span className="text-[10.5px] font-bold bg-slate-100/90 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Truck className="w-2 h-2" />
              </div>
              <span>Livraison</span>
            </span>
          )}

          {pharmacy.services.includes('TEST_RAPIDE_PALU') && (
            <span className="text-[10.5px] font-bold bg-purple-50/90 text-purple-900 border border-purple-300/70 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <div className="w-3.5 h-3.5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
                <Activity className="w-2 h-2" />
              </div>
              <span>Test Palu</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons with Micro-interactions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Direct Phone Call */}
          <a
            href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
            className="bg-emerald-50/90 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-300/80 hover:border-emerald-600 font-extrabold py-2 px-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs transform-gpu hover:-translate-y-0.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appeler</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${pharmacy.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs transform-gpu hover:-translate-y-0.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Share via Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="bg-teal-50/90 hover:bg-teal-100 text-teal-900 border border-teal-200/90 font-extrabold py-2 px-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 shadow-2xs transform-gpu hover:-translate-y-0.5"
            title="Partager les coordonnées de la pharmacie"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Partager</span>
          </button>
        </div>

        {/* Share Modal Dialog */}
        <ShareModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          pharmacy={pharmacy}
        />

        <div className="flex flex-wrap items-center justify-between text-xs pt-1 gap-2">
          <button
            onClick={() => onSelect(pharmacy)}
            className="text-emerald-800 hover:text-emerald-900 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fiche complète</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
              title="Ouvrir l'itinéraire Google Maps"
            >
              <Navigation className="w-3 h-3 text-emerald-600" />
              <span>Itinéraire GPS</span>
            </a>

            <a
              href={gozemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
              title="Commander une course Gozem vers cette pharmacie"
            >
              <Car className="w-3 h-3 text-amber-600" />
              <span>Gozem</span>
            </a>

            <button
              onClick={handleCopyDetails}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
              title="Copier les coordonnées"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copié' : 'Copier'}</span>
            </button>
          </div>

          <button
            onClick={() => onReportError(pharmacy)}
            className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer"
          >
            Signaler
          </button>
        </div>
      </div>
    </motion.div>
  );
};

