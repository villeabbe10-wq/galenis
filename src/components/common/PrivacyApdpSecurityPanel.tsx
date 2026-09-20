import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Download, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  Clock, 
  Award,
  RefreshCw,
  Database
} from 'lucide-react';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';
import { purgeCitizenHealthHistory, exportCitizenPersonalData } from '../../services/clientSecurity';
import { getStockAuditLogs, getGuardCertificates } from '../../services/pharmacyStorage';
import { StockAuditLog, GuardCertificateRecord } from '../../types';
import { CriticalAction2faModal } from './CriticalAction2faModal';

interface PrivacyApdpSecurityPanelProps {
  userRole?: 'CITOYEN' | 'PHARMACIEN' | 'DEVELOPPEUR' | 'ADMIN';
  userName?: string;
  userEmail?: string;
}

export const PrivacyApdpSecurityPanel: React.FC<PrivacyApdpSecurityPanelProps> = ({
  userRole = 'CITOYEN',
  userName = 'Utilisateur Galenis',
  userEmail = 'patient@sante.tg'
}) => {
  const [purgedMessage, setPurgedMessage] = useState<string | null>(null);
  const [stockAudits, setStockAudits] = useState<StockAuditLog[]>([]);
  const [guardCerts, setGuardCerts] = useState<GuardCertificateRecord[]>([]);
  const [isPrivateMode, setIsPrivateMode] = useState<boolean>(() => {
    return localStorage.getItem('galenis_private_browsing') === 'true';
  });

  // 2FA modal trigger
  const [is2faOpen, setIs2faOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const reloadAudits = () => {
    setStockAudits(getStockAuditLogs().slice(0, 10));
    setGuardCerts(getGuardCertificates().slice(0, 5));
  };

  useEffect(() => {
    reloadAudits();
  }, []);

  const handlePurgeHistory = () => {
    setPendingAction({
      title: 'Purger vos données de santé locales',
      description: 'Cette opération effacera irréversiblement votre historique de recherche de médicaments, ordonnances scannées et caches de tiers payant sur cet appareil (Loi APDP Togo 2019).',
      onConfirm: () => {
        const result = purgeCitizenHealthHistory();
        setPurgedMessage(`Purge effectuée avec succès (${result.clearedItemsCount} éléments confidentiels nettoyés).`);
        setTimeout(() => setPurgedMessage(null), 4000);
      }
    });
    setIs2faOpen(true);
  };

  const handleExportData = () => {
    exportCitizenPersonalData(userName, userEmail);
    setPurgedMessage('Export de vos données personnelles généré (Format JSON APDP).');
    setTimeout(() => setPurgedMessage(null), 4000);
  };

  const togglePrivateMode = () => {
    const next = !isPrivateMode;
    setIsPrivateMode(next);
    localStorage.setItem('galenis_private_browsing', String(next));
    if (next) {
      purgeCitizenHealthHistory();
      setPurgedMessage('Mode de santé confidentiel activé : aucun historique ne sera sauvegardé.');
      setTimeout(() => setPurgedMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* APDP Togo Compliance Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#03231A] to-slate-900 rounded-3xl p-6 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <ShieldCheck className="w-56 h-56 text-emerald-400" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <TogoFlag className="w-5 h-3.5 rounded-xs" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              Conformité Loi N°2019-014 • APDP Togo
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            Protection des Données Personnelles & Bouclier Sanitaire
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Galenis respecte scrupuleusement la réglementation de l'Autorité de Protection des Données à Caractère Personnel (APDP) de la République Togolaise. Vos données médicales et recherches de médicaments restent sous votre contrôle souverain.
          </p>
        </div>
      </div>

      {purgedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{purgedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Droit à l'oubli & Portabilité */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Droit à l'Oubli & Purge Sanitaire</h3>
              <p className="text-[11px] text-slate-500">Effacez instantanément vos traces locales</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Conformément au droit à l'effacement, vous pouvez réinitialiser en un clic les recherches de molécules, fiches d'ordonnances temporaires et favoris stockés dans votre navigateur.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handlePurgeHistory}
              className="flex-1 py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purger mes données locales</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter (JSON APDP)</span>
            </button>
          </div>
        </div>

        {/* Module 2: Mode Navigation Confidentielle */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isPrivateMode 
                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {isPrivateMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Navigation Médicale Confidentielle</h3>
              <p className="text-[11px] text-slate-500">Zéro mise en mémoire locale</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Idéal si vous consultez l'application depuis un appareil partagé ou un cybercafé. Aucune recherche de molécule ni pharmacie consultée ne sera enregistrée.
          </p>

          <div className="pt-2">
            <button
              onClick={togglePrivateMode}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPrivateMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isPrivateMode ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mode Confidentiel Actif</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Activer la Navigation Confidentielle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Module 3: Traçabilité Immuable des Stocks & Certifications ONPT (Pour Pharmaciens & Régulateurs) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Registre d'Audit Immuable des Mouvements de Stock</h3>
              <p className="text-[11px] text-slate-500">Historique non répudiable certifié pour l'Ordre National des Pharmaciens</p>
            </div>
          </div>

          <button
            onClick={reloadAudits}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Actualiser les registres"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {stockAudits.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="font-semibold">Aucun mouvement de stock récent enregistré dans le registre d'audit.</p>
            <p className="text-[11px] text-slate-400 mt-1">Chaque mise à jour de disponibilité de molécule génère une entrée scellée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date / Heure</th>
                  <th className="py-2.5 px-3">Médicament</th>
                  <th className="py-2.5 px-3">Pharmacie</th>
                  <th className="py-2.5 px-3">Transition</th>
                  <th className="py-2.5 px-3">Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockAudits.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString('fr-TG', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{log.drugName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{log.pharmacyName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.newStatus === 'AVAILABLE' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.previousStatus} → {log.newStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{log.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Action 2FA Modal */}
      {pendingAction && (
        <CriticalAction2faModal
          isOpen={is2faOpen}
          onClose={() => {
            setIs2faOpen(false);
            setPendingAction(null);
          }}
          onConfirm={pendingAction.onConfirm}
          title={pendingAction.title}
          description={pendingAction.description}
          actionButtonLabel="Confirmer avec mon code 2FA"
          severity="danger"
        />
      )}
    </div>
  );
};
