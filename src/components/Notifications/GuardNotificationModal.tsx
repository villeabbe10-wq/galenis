import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Volume2, 
  VolumeX, 
  MapPin, 
  CheckCircle2, 
  X, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Phone, 
  SlidersHorizontal,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { 
  GuardNotificationItem, 
  GuardPushNotificationPreference, 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  getNotificationHistory, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  clearNotificationHistory, 
  requestNotificationPermission, 
  triggerTestGuardPush 
} from '../../services/notificationService';
import { TOGO_CITIES } from '../../data/mockPharmacies';
import { Pharmacy } from '../../types';
import { getPharmacyById } from '../../services/pharmacyStorage';

interface GuardNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
}

export const GuardNotificationModal: React.FC<GuardNotificationModalProps> = ({
  isOpen,
  onClose,
  onSelectPharmacy
}) => {
  const [prefs, setPrefs] = useState<GuardPushNotificationPreference>(getNotificationPreferences());
  const [history, setHistory] = useState<GuardNotificationItem[]>(getNotificationHistory());
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [activeTab, setActiveTab] = useState<'HISTORY' | 'SETTINGS'>('HISTORY');
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    const handleHistoryUpdate = (e: any) => {
      setHistory(e.detail || getNotificationHistory());
    };
    const handlePrefsUpdate = (e: any) => {
      setPrefs(e.detail || getNotificationPreferences());
    };

    window.addEventListener('galenis_push_history_updated', handleHistoryUpdate);
    window.addEventListener('galenis_push_prefs_updated', handlePrefsUpdate);
    return () => {
      window.removeEventListener('galenis_push_history_updated', handleHistoryUpdate);
      window.removeEventListener('galenis_push_prefs_updated', handlePrefsUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setBrowserPermission(res);
  };

  const handleToggleEnabled = () => {
    const updated = saveNotificationPreferences({ enabled: !prefs.enabled });
    setPrefs(updated);
  };

  const handleToggleSound = () => {
    const updated = saveNotificationPreferences({ sound: !prefs.sound });
    setPrefs(updated);
  };

  const handleCityChange = (city: string) => {
    const updated = saveNotificationPreferences({ city });
    setPrefs(updated);
  };

  const handleTestNotification = () => {
    const notif = triggerTestGuardPush(prefs.city === 'TOUTES' ? 'Lomé' : prefs.city);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleOpenPharmacyDetails = (pharmacyId: string) => {
    const pharma = getPharmacyById(pharmacyId);
    if (pharma && onSelectPharmacy) {
      onSelectPharmacy(pharma);
      onClose();
    }
  };

  const unreadCount = history.filter(h => !h.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-900 border border-amber-500/30 flex items-center justify-center font-black">
              <BellRing className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Alertes Push de Garde en Temps Réel</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                    {unreadCount} nouv.
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Système local de notification citoyenne pour le Togo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Prompt Banner (if not granted) */}
        {browserPermission !== 'granted' && (
          <div className="bg-amber-50 border-b border-amber-200/80 p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="text-xs text-amber-950 font-medium">
                Autorisez les notifications dans votre navigateur pour recevoir les alertes même application fermée.
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
            >
              Autoriser Push
            </button>
          </div>
        )}

        {/* Tabs Bar & Quick Actions */}
        <div className="px-5 sm:px-6 pt-3 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`pb-3 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Historique des Alertes ({history.length})
            </button>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`pb-3 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'SETTINGS'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Préférences & Zone
            </button>
          </div>

          {activeTab === 'HISTORY' && history.length > 0 && (
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Tout lire
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={clearNotificationHistory}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Effacer</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: HISTORY */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <BellOff className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">Aucune alerte de garde récente</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Dès qu'une pharmacie passera en garde ou qu'une rotation aura lieu, vous recevrez une notification instantanée.
                    </p>
                  </div>
                  <button
                    onClick={handleTestNotification}
                    disabled={testSent}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{testSent ? '✓ Alerte Push Envoyée !' : 'Tester une notification push en direct'}</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                    <span>Dernières déclarations et passages de garde</span>
                    <button
                      onClick={handleTestNotification}
                      disabled={testSent}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{testSent ? 'Envoyé !' : 'Simuler une alerte'}</span>
                    </button>
                  </div>

                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.read 
                          ? 'bg-white border-slate-200' 
                          : 'bg-gradient-to-r from-amber-50/80 to-white border-amber-300/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                            item.read ? 'bg-slate-100 text-slate-600' : 'bg-amber-500 text-slate-950 font-black'
                          }`}>
                            ⚡
                          </span>
                          
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {item.pharmacyName}
                              </span>
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                GARDE 24H
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {item.message}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-600" />
                                <span>{item.quarter}, {item.city}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPharmacyDetails(item.pharmacyId);
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Consulter
                          </button>
                          
                          {item.phone && (
                            <a
                              href={`tel:${item.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center border border-emerald-200"
                              title="Appeler l'officine"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4">
              
              {/* Push Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900">Activer les Notifications Push de Garde</h4>
                  <p className="text-[11px] text-slate-500">Recevoir une alerte lors de tout passage en service de garde</p>
                </div>
                <button
                  onClick={handleToggleEnabled}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    prefs.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    prefs.enabled ? 'left-6.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Sound Chime Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {prefs.sound ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Carillon Sonore de Notification</h4>
                    <p className="text-[11px] text-slate-500">Son harmonieux lors d'un changement de garde</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    prefs.sound ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    prefs.sound ? 'left-6.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* City Selection Filter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900">Zone de Surveillance Prioritaire</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Choisissez la ville togolaise pour laquelle vous souhaitez recevoir les alertes prioritaires de garde.
                </p>

                <select
                  value={prefs.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:border-emerald-600"
                >
                  <option value="TOUTES">Toutes les villes du Togo (National)</option>
                  {TOGO_CITIES.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.region}) — {c.pharmacyCount} officines
                    </option>
                  ))}
                </select>
              </div>

              {/* Instant Test Button */}
              <div className="pt-2">
                <button
                  onClick={handleTestNotification}
                  disabled={testSent}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{testSent ? '✓ Notification Push Déclenchée !' : 'Tester le Système Push de Garde en Direct'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conforme aux normes de santé publique & respect de la vie privée APDP</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
