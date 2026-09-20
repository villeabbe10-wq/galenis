import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  Building2, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X, 
  FileCheck, 
  Lock, 
  FileSpreadsheet, 
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { TogoLionIcon } from '../TogoEmblems';
import { DeveloperAccreditationDossier } from '../../types';
import { submitDeveloperDossier } from '../../services/pharmacyStorage';

interface DeveloperKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDossier?: DeveloperAccreditationDossier | null;
  onDossierSubmitted?: (dossier: DeveloperAccreditationDossier) => void;
}

export const DeveloperKycModal: React.FC<DeveloperKycModalProps> = ({
  isOpen,
  onClose,
  currentDossier,
  onDossierSubmitted
}) => {
  const [name, setName] = useState(currentDossier?.name || 'SADPlus Solutions Santé');
  const [organization, setOrganization] = useState(currentDossier?.organization || 'SADPlus Togo SARL');
  const [email, setEmail] = useState(currentDossier?.email || 'contact@sadplus.tg');
  const [phone, setPhone] = useState(currentDossier?.phone || '+228 90 22 44 88');
  const [projectType, setProjectType] = useState(currentDossier?.projectType || 'ERP / Logiciel Clinique & Caisse');
  const [useCaseDescription, setUseCaseDescription] = useState(
    currentDossier?.useCaseDescription || 
    "Interfaçage des stocks officinaux et synchronisation des gardes 24h/24 pour le réseau des officines partenaires à Lomé."
  );

  const [rccmNif, setRccmNif] = useState(currentDossier?.documents?.rccmNif || 'TG-LOM-2023-B-4819 | NIF 1001847192');
  const [idCardFile, setIdCardFile] = useState<string>(currentDossier?.documents?.idCardName || 'CNI_Directeur_Technique.pdf');
  const [specsDocFile, setSpecsDocFile] = useState<string>(currentDossier?.documents?.specsDocName || 'Architecture_API_SADPlus.pdf');
  const [complianceSigned, setComplianceSigned] = useState<boolean>(currentDossier?.documents?.complianceSigned ?? true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentStatus = currentDossier?.status || 'SANDBOX';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceSigned) {
      alert("Veuillez accepter l'engagement de conformité RGPD et secret médical.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = submitDeveloperDossier({
        name,
        organization,
        email,
        phone,
        projectType,
        useCaseDescription,
        documents: {
          rccmNif,
          idCardName: idCardFile,
          specsDocName: specsDocFile,
          complianceSigned: true,
          submittedFilesCount: 3
        }
      });

      setIsSubmitting(false);
      setSuccessMsg("Votre dossier d'agrément technique a été soumis avec succès ! L'administrateur a reçu l'alerte pour vérification de conformité.");
      if (onDossierSubmitted) {
        onDossierSubmitted(updated);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <TogoLionIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Agrément Officiel DPML / ONPT
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ref: {currentDossier?.ref || 'acc_2209219218'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Dossier d'Agrément Développeur & Clés Production
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Status Alert Banner */}
          {currentStatus === 'APPROVED' ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-black text-emerald-900">
                  Compte Développeur Validé & Agréé pour la Production
                </div>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Votre dossier a été validé par l'Administrateur Central ({currentDossier?.reviewedBy || 'DPML / ONPT'}). Vos quotas sont étendus à <strong>100 000 requêtes / jour</strong> et vos clés API de production sont actives.
                </p>
              </div>
            </div>
          ) : currentStatus === 'PENDING_REVIEW' ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
              <div>
                <div className="text-sm font-black text-amber-900">
                  Dossier en Cours d'Examen par l'Administrateur
                </div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Vos pièces justificatives (RCCM/NIF, CNI, Cahier des charges) ont bien été transmises au Comité Administrateur Galenis Togo. Votre compte reste en mode <strong>Sandbox (Test)</strong> pendant la vérification de conformité.
                </p>
              </div>
            </div>
          ) : currentStatus === 'REJECTED' ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-black text-rose-900">
                  Dossier Refusé ou Non Conforme
                </div>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  <strong>Motif indiqué par l'admin :</strong> {currentDossier?.rejectionReason || "Pièces justificatives incomplètes ou schéma d'intégration non sécurisé."}
                </p>
                <div className="mt-2 text-[11px] text-rose-700 font-bold">
                  Veuillez corriger les informations ci-dessous et re-soumettre votre dossier.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-black text-blue-900">
                  Mode Sandbox / Test Actif (1 000 req/jour)
                </div>
                <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                  Pour obtenir une clé de production (100k req/j) et synchroniser en direct les logiciels de caisse des officines togolaises, vous devez fournir les documents légaux ci-dessous pour vérification préalable par l'Administrateur.
                </p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Section 1: Entreprise & Responsable */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>1. Identification de l'Éditeur / Startup Tech</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom du Responsable Technique
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sylvain Mensah"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Raison Sociale / Nom de l'Entreprise
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="SADPlus Togo SARL"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Professionnel Développeur
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@sadplus.tg"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone / Contact WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+228 90 22 44 88"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Cas d'usage et architecture */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>2. Projet API & Intégration Caisse</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Type d'Application ou Logiciel
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                >
                  <option value="ERP / Logiciel Clinique & Caisse">ERP / Logiciel Clinique & Caisse (LGO WinPharma, LGPI, etc.)</option>
                  <option value="Application Mobile Santé Citoyens">Application Mobile Santé Citoyens</option>
                  <option value="Passerelle Assurances & Tiers-Payant">Passerelle Assurances & Tiers-Payant (INAM/CNSS)</option>
                  <option value="Recherche Académique / IA Santé">Recherche Académique / IA Santé</option>
                  <option value="Autre intégration technique">Autre intégration technique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description du Cas d'Usage & Volumétrie
                </label>
                <textarea
                  rows={2}
                  required
                  value={useCaseDescription}
                  onChange={(e) => setUseCaseDescription(e.target.value)}
                  placeholder="Expliquez comment votre application interagit avec les données d'officine et les requêtes prévues..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Section 3: Documents Justificatifs (KYC) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>3. Documents & Pièces Justificatives (KYC)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Immatriculation RCCM & Numéro NIF
                </label>
                <input
                  type="text"
                  required
                  value={rccmNif}
                  onChange={(e) => setRccmNif(e.target.value)}
                  placeholder="Ex: TG-LOM-2023-B-4819 | NIF 1001847192"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Document 1: CNI */}
                <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-slate-900 truncate">CNI / Passeport Responsable</div>
                      <div className="text-[10px] text-emerald-700 font-mono truncate">{idCardFile}</div>
                    </div>
                  </div>
                  <label className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Changer
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setIdCardFile(e.target.files[0].name);
                        }
                      }} 
                    />
                  </label>
                </div>

                {/* Document 2: Cahier des charges */}
                <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-slate-900 truncate">Cahier des charges & Sécurité</div>
                      <div className="text-[10px] text-indigo-700 font-mono truncate">{specsDocFile}</div>
                    </div>
                  </div>
                  <label className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Changer
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSpecsDocFile(e.target.files[0].name);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Engagement de conformité */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complianceSigned}
                  onChange={(e) => setComplianceSigned(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  Je certifie sur l'honneur l'exactitude des pièces fournies et m'engage à respecter la confidentialité des ordonnances, le secret médical et les directives du <strong>Ministère de la Santé du Togo (DPML/ONPT)</strong>.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Transmission au Comité Admin...</span>
                  </>
                ) : (
                  <>
                    <TogoLionIcon className="w-4 h-4 text-white" />
                    <span>
                      {currentStatus === 'PENDING_REVIEW' 
                        ? "Mettre à jour les pièces justificatives" 
                        : "Soumettre pour Vérification & Passage en Production"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
