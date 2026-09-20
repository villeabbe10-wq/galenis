import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-xs border border-amber-400/30 animate-in fade-in slide-in-from-bottom-2"
    >
      <div className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-100" />
      <span>Mode Hors-Ligne — Données des pharmacies de garde chargées depuis le cache local</span>
    </div>
  );
};
