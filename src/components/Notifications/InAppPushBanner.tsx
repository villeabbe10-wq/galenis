import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing, 
  Phone, 
  MapPin, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { GuardNotificationItem } from '../../services/notificationService';
import { Pharmacy } from '../../types';

interface InAppPushBannerProps {
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
}

export const InAppPushBanner: React.FC<InAppPushBannerProps> = ({ onSelectPharmacy }) => {
  const [currentAlert, setCurrentAlert] = useState<{
    notification: GuardNotificationItem;
    pharmacy: Pharmacy;
  } | null>(null);

  useEffect(() => {
    const handlePushAlert = (e: any) => {
      if (e?.detail?.notification && e?.detail?.pharmacy) {
        setCurrentAlert({
          notification: e.detail.notification,
          pharmacy: e.detail.pharmacy
        });

        // Auto dismiss after 10 seconds
        const timer = setTimeout(() => {
          setCurrentAlert(null);
        }, 10000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('galenis_in_app_push_alert', handlePushAlert);
    return () => {
      window.removeEventListener('galenis_in_app_push_alert', handlePushAlert);
    };
  }, []);

  if (!currentAlert) return null;

  const { notification, pharmacy } = currentAlert;

  const handleOpenPharmacy = () => {
    if (onSelectPharmacy) {
      onSelectPharmacy(pharmacy);
    }
    setCurrentAlert(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed top-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/40 ring-4 ring-amber-500/10">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <BellRing className="w-3 h-3 text-amber-400" />
                Notification Push Locale • Garde 24h
              </span>
            </div>
            
            <button
              onClick={() => setCurrentAlert(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-1.5 mb-3.5">
            <h4 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
              {pharmacy.name}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold pt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{pharmacy.quarter}, {pharmacy.city}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <button
              onClick={handleOpenPharmacy}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Voir l'Officine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={`tel:${pharmacy.phone}`}
              className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              title="Appeler l'officine de garde"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">Appeler</span>
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
