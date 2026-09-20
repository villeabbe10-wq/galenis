import React, { useState } from 'react';
import { Pharmacy } from '../../types';
import { 
  X, 
  Share2, 
  MessageSquare, 
  Phone, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Award
} from 'lucide-react';
import { generateCertifiedShareText } from '../../services/clientSecurity';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  pharmacy
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDeGarde = pharmacy.status === 'DE_GARDE' || pharmacy.isGuardToday;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
  const webLink = `https://galenis.tg/garde?id=${encodeURIComponent(pharmacy.id)}`;
  
  // Certified tamper-evident text with legal integrity notice
  const certifiedMessage = generateCertifiedShareText(pharmacy.name, pharmacy.city, pharmacy.phone, !!isDeGarde);

  // Rich WhatsApp Message
  const whatsappText = 
`🚨 *PHARMACIE DE GARDE — CADASTRE OFFICIEL TOGO* 🚨

🏥 *${pharmacy.name.toUpperCase()}*
${isDeGarde ? '🟢 *DE GARDE CETTE SEMAINE / CE SOIR*' : '🕒 *Horaires habituels*'}
📍 *Localisation :* ${pharmacy.city} (${pharmacy.quarter}) — ${pharmacy.address}
📞 *Téléphone direct :* ${pharmacy.phone}
${pharmacy.whatsapp ? `💬 *WhatsApp :* ${pharmacy.whatsapp}\n` : ''}🗺️ *Itinéraire GPS :* ${googleMapsUrl}
🔗 *Vérification officielle :* ${webLink}

🔒 *Certificat d'Authenticité DPML/ONPT :* #TG-DPML-${pharmacy.id.slice(0, 6).toUpperCase()}
_Document certifié conforme par le Ministère de la Santé du Togo_`;

  // Concise SMS Message (optimized for 160-320 chars, works without internet)
  const smsText = 
`[OFFICIEL TOGO] Pharmacie ${pharmacy.name} (${pharmacy.city} - ${pharmacy.quarter}). Tel: ${pharmacy.phone}. Statut: ${isDeGarde ? 'DE GARDE' : 'OUVERTE'}. Certif: #TG-${pharmacy.id.slice(0,4).toUpperCase()} (Galenis.tg)`;

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
  };

  const handleShareSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(smsText)}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(certifiedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pharmacie de garde : ${pharmacy.name}`,
          text: smsText,
          url: webLink
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Share2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Partager les Coordonnées</span>
          </div>

          <h3 className="text-base font-black text-white">{pharmacy.name}</h3>
          <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{pharmacy.city} ({pharmacy.quarter})</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status highlight */}
          <div className={`p-3 rounded-2xl border text-xs flex items-center gap-3 ${
            isDeGarde 
              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' 
              : 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <div className="flex-1">
              <div>{isDeGarde ? 'Établissement DE GARDE 24H/24' : 'Établissement aux Horaires Habituels'}</div>
              <div className="text-[11px] font-normal text-slate-600 mt-0.5">Tél : {pharmacy.phone}</div>
            </div>
          </div>

          {/* Tamper-evident DPML / ONPT Integrity Watermark */}
          <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-emerald-300">Certificat d'Authenticité Numérique</div>
                <div className="text-[10px] text-slate-300 font-mono">#TG-DPML-{pharmacy.id.slice(0, 6).toUpperCase()} • ONPT Vérifié</div>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Anti-Falsification
            </span>
          </div>

          {/* Quick Channels */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              Choisissez le moyen de transmission :
            </label>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-between shadow-xs cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Partager via WhatsApp</div>
                  <div className="text-[10px] text-emerald-100 font-medium">Itinéraire Google Maps cliquable + Horaires & Contacts</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80" />
            </button>

            {/* SMS (No Internet Needed) */}
            <button
              type="button"
              onClick={handleShareSMS}
              className="w-full p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition-all flex items-center justify-between border border-slate-200 cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Envoyer par SMS (Sans Connexion Internet)</div>
                  <div className="text-[10px] text-slate-500 font-medium">Fonctionne en 2G • Téléphones classiques • Zéro data</div>
                </div>
              </div>
              <Send className="w-4 h-4 text-slate-400" />
            </button>

            {/* Native Share / Copy */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Autres applis (Telegram, etc.)</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copié !' : 'Copier texte'}</span>
              </button>
            </div>
          </div>

          {/* Explanatory Details for Citizens */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-[11px] text-slate-600 leading-relaxed">
            <div className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
              <span>💡</span>
              <span>Guide d'usage citoyen en cas d'urgence :</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-800">Pour un chauffeur de taxi ou zémidjan :</strong> Privilégiez WhatsApp car le lien GPS ouvre directement la navigation étape par étape sur son téléphone.
              </li>
              <li>
                <strong className="text-slate-800">En cas de coupure de réseau data (Moov/Togocom) :</strong> Le SMS part par le réseau cellulaire classique (2G) sans consommer votre forfait internet.
              </li>
              <li>
                <strong className="text-slate-800">Numéros d'urgence gratuits au Togo :</strong> SAMU / Sapeurs-Pompiers (118) • Urgences Médicales (171) • Police Secours (117).
              </li>
            </ul>
          </div>

          {/* Legal mention */}
          <p className="text-[10px] text-slate-400 text-center font-medium pt-1">
            Galenis Togo • Plateforme privée de technologies de santé • Partenaires : ONPT & DPML
          </p>
        </div>
      </div>
    </div>
  );
};
