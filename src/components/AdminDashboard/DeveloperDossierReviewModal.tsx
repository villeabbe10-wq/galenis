import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  X, 
  FileCheck, 
  Lock, 
  Mail, 
  Phone, 
  Terminal, 
  Cpu, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TogoLionIcon } from '../TogoEmblems';
import { DeveloperAccreditationDossier } from '../../types';
import { reviewDeveloperDossier } from '../../services/pharmacyStorage';

interface DeveloperDossierReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DeveloperAccreditationDossier | null;
  onReviewCompleted: (updatedDossier: DeveloperAccreditationDossier) => void;
  adminName?: string;
}

export const DeveloperDossierReviewModal: React.FC<DeveloperDossierReviewModalProps> = ({
  isOpen,
  onClose,
  dossier,
  onReviewCompleted,
  adminName = 'Super Administrateur Central (DPML/ONPT)'
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !dossier) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = reviewDeveloperDossier(dossier.id, 'APPROVED', adminName);
      setIsProcessing(false);
      if (updated) {
        onReviewCompleted(updated);
      }
      onClose();
    }, 500);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Veuillez indiquer le motif du refus ou de la non-conformité pour guider le développeur.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const updated = reviewDeveloperDossier(dossier.id, 'REJECTED', adminName, rejectReason);
      setIsProcessing(false);
      if (updated) {
        onReviewCompleted(updated);
      }
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <TogoLionIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Comité d'Agrément Technique DPML / ONPT
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ref: {dossier.ref}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Examen de Conformité : {dossier.organization}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-900">
          
          {/* Status banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statut du Dossier</div>
              <div className="flex items-center gap-2 mt-0.5">
                {dossier.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    AGRÉÉ PRODUCTION (100k req/j)
                  </span>
                ) : dossier.status === 'PENDING_REVIEW' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    EN ATTENTE D'EXAMEN ADMIN
                  </span>
                ) : dossier.status === 'REJECTED' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 font-extrabold text-xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    DOSSIER NON CONFORME / REJETÉ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-extrabold text-xs">
                    SANDBOX (TEST SEULEMENT)
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  • Soumis le {dossier.submittedAt ? new Date(dossier.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Récemment'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quota Actuel</div>
              <div className="text-sm font-black text-slate-900 font-mono">
                {dossier.dailyLimit.toLocaleString()} req/jour
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Colonne 1: Identité & Contact */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Identification Légale</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Raison Sociale :</span>
                  <div className="font-extrabold text-slate-900 text-sm">{dossier.organization}</div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Responsable Technique :</span>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {dossier.name}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Coordonnées directes :</span>
                  <div className="font-medium text-slate-800 flex flex-col gap-1 mt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {dossier.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {dossier.phone || '+228 90 22 44 88'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Immatriculation Fiscale :</span>
                  <div className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-1">
                    {dossier.documents.rccmNif || 'TG-LOM-2023-B-4819 | NIF 1001847192'}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2: Projet & Architecture */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Cas d'Usage & Spécifications</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Type d'Intégration :</span>
                  <div className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-0.5">
                    {dossier.projectType}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Description du cas d'usage :</span>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed mt-1 text-[11px]">
                    {dossier.useCaseDescription || "Interfaçage des stocks d'officines et consultation des gardes 24h/24."}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Clés API associées :</span>
                  <div className="space-y-1 font-mono text-[10px] mt-1">
                    <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 font-bold">Sandbox :</span>
                      <span className="text-blue-700 font-bold">{dossier.sandboxApiKey.slice(0, 16)}...</span>
                    </div>
                    {dossier.liveApiKey && (
                      <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                        <span className="text-slate-500 font-bold">Production :</span>
                        <span className="text-emerald-700 font-bold">{dossier.liveApiKey.slice(0, 18)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification des pièces justificatives (Checklist Admin) */}
          <div className="space-y-3">
            <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Contrôle de Conformité des Pièces Justificatives</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Document 1 */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800">Registre Commerce</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs font-bold text-slate-900">RCCM / NIF Vérifié</div>
                <div className="text-[10px] text-slate-600 font-mono truncate">{dossier.documents.rccmNif || 'Conforme'}</div>
                <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Extrait vérifié OTR
                </span>
              </div>

              {/* Document 2 */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800">Identité Responsable</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs font-bold text-slate-900">Pièce d'Identité CNI</div>
                <div className="text-[10px] text-slate-600 font-mono truncate">{dossier.documents.idCardName || 'CNI_Directeur.pdf'}</div>
                <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Identité certifiée
                </span>
              </div>

              {/* Document 3 */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-800">Sécurité Données</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xs font-bold text-slate-900">Architecture & Charte</div>
                <div className="text-[10px] text-slate-600 font-mono truncate">{dossier.documents.specsDocName || 'Cahier_Charges.pdf'}</div>
                <span className="inline-block text-[9px] font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded">
                  Engagement DPML signé
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire de Rejet si activé */}
          {showRejectForm && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="text-xs font-black text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Indiquer le motif du rejet / non-conformité :</span>
              </div>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Le numéro RCCM ne correspond pas à la raison sociale déclarée. Veuillez fournir une attestation OTR à jour."
                className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Confirmer le Refus & Notifier
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Fermer la vue
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!showRejectForm && dossier.status !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Refuser / Non Conforme</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing || dossier.status === 'APPROVED'}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Traitement de l'agrément...</span>
                  </>
                ) : (
                  <>
                    <TogoLionIcon className="w-4 h-4 text-white" />
                    <span>
                      {dossier.status === 'APPROVED' 
                        ? "Agrément Déjà Actif (100k req/j)" 
                        : "Valider les Pièces & Activer la Production"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
