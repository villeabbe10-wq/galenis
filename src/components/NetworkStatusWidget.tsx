import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getLastSyncTime } from '../services/pharmacyStorage';

interface NetworkStatusWidgetProps {
  onDataReload?: () => void;
}

export const NetworkStatusWidget: React.FC<NetworkStatusWidgetProps> = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [syncTime, setSyncTime] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        const timer = setTimeout(() => {
          setShowReconnected(false);
          setWasOffline(false);
        }, 3500);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
      setSyncTime(getLastSyncTime());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setWasOffline(true);
      setSyncTime(getLastSyncTime());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const formatSyncTime = (isoDate: string | null) => {
    if (!isoDate) return null;
    try {
      const d = new Date(isoDate);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  // Option 1 : Invisible en temps normal lorsque la connexion fonctionne
  if (isOnline && !showReconnected) {
    return null;
  }

  const formattedTime = formatSyncTime(syncTime);

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 z-40 animate-fade-in pointer-events-none">
      <div className="pointer-events-auto">
        {showReconnected ? (
          <div className="px-3.5 py-2 rounded-full border border-emerald-300 bg-emerald-900/95 text-white text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Wifi className="w-3.5 h-3.5 text-emerald-300" />
            <span>Connexion rétablie · Données à jour</span>
          </div>
        ) : (
          <div
            className="px-3.5 py-2 rounded-2xl border border-amber-300/80 bg-amber-950/95 text-white text-xs font-medium flex items-center gap-2.5 shadow-xl backdrop-blur-md"
            role="alert"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="flex flex-col text-[11px] leading-tight">
              <span className="font-bold text-amber-200">Mode hors-ligne</span>
              <span className="text-slate-300">
                {formattedTime ? `Pharmacies en cache (${formattedTime})` : 'Données chargées depuis le cache local'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
