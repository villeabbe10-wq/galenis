import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Key, 
  Users, 
  Building2, 
  ArrowRight, 
  Check, 
  X, 
  Clock, 
  Scale, 
  Eye, 
  ExternalLink,
  ShieldAlert,
  Server,
  FileCode2,
  Sparkles,
  Download
} from 'lucide-react';
import { LionIcon } from '../LionIcon';

type RoleAccessStatus = boolean | 'PENDING';

interface PermissionEntry {
  allowed: RoleAccessStatus;
  detail: string;
}

interface PermissionRow {
  feature: string;
  description: string;
  citizen: PermissionEntry;
  dev: PermissionEntry;
  pharma: PermissionEntry;
  category: string;
}

interface GovernanceAndRolesDocsProps {
  onOpenOnboarding?: () => void;
  onOpenKeys?: () => void;
}

export const GovernanceAndRolesDocs: React.FC<GovernanceAndRolesDocsProps> = ({
  onOpenOnboarding,
  onOpenKeys
}) => {
  const [activeFilterRole, setActiveFilterRole] = useState<'ALL' | 'CITIZEN' | 'DEV' | 'PHARMA'>('ALL');

  const permissionsMatrix: PermissionRow[] = [
    {
      feature: "Recherche Pharmacies & Gardes 24h/24",
      description: "Accès aux officines ouvertes et tours de garde officiels",
      citizen: { allowed: true, detail: "Accès libre et gratuit" },
      dev: { allowed: true, detail: "Lecture API REST & Sandbox" },
      pharma: { allowed: true, detail: "Accès direct & visibilité" },
      category: "Données Publiques"
    },
    {
      feature: "Catalogue Médicaments & Prix Homologués (PMVP)",
      description: "Prix maximaux fixés par le Ministère de la Santé du Togo",
      citizen: { allowed: true, detail: "Consultation & simulation assurance" },
      dev: { allowed: true, detail: "Lecture API /v1/disponibilites" },
      pharma: { allowed: true, detail: "Consultation & téléversement" },
      category: "Données Publiques"
    },
    {
      feature: "Signalements Citoyens & Pharmacovigilance",
      description: "Avis, retours d'expérience et anomalies constatées",
      citizen: { allowed: true, detail: "Dépôt d'avis & signalements" },
      dev: { allowed: true, detail: "Lecture / Émission via API (POST /reports)" },
      pharma: { allowed: true, detail: "Droit de réponse officiel" },
      category: "Vigilance & Qualité"
    },
    {
      feature: "Gestion Officine (Garde, Horaires, Stocks)",
      description: "Modification des données opérationnelles de la pharmacie",
      citizen: { allowed: false, detail: "Interdit" },
      dev: { allowed: false, detail: "Interdit (sauf délégation API certifiée)" },
      pharma: { allowed: true, detail: "Son officine uniquement (Titulaire)" },
      category: "Gestion Métier"
    },
    {
      feature: "Clés API Sandbox / Bac à Sable (pdt_test_...)",
      description: "Environnement d'émulation pour prototypage technique",
      citizen: { allowed: false, detail: "Non requis" },
      dev: { allowed: true, detail: "Génération autonome immédiate" },
      pharma: { allowed: false, detail: "Non requis" },
      category: "Intégration API"
    },
    {
      feature: "Clés API Production / Live (pdt_live_...)",
      description: "Accès temps réel aux flux certifiés nationaux",
      citizen: { allowed: false, detail: "Non requis" },
      dev: { allowed: 'PENDING', detail: "Soumission dossier fiabilité requise" },
      pharma: { allowed: false, detail: "Accès portail métier" },
      category: "Intégration API"
    },
    {
      feature: "Abonnement aux Webhooks d'Urgence",
      description: "Notifications instantanées des bascules de garde et ruptures",
      citizen: { allowed: false, detail: "Non requis" },
      dev: { allowed: 'PENDING', detail: "Validation URL SSL & signature HMAC" },
      pharma: { allowed: true, detail: "Alertes SMS / WhatsApp" },
      category: "Intégration API"
    }
  ];

  const renderBadge = (status: boolean | 'PENDING', detail: string) => {
    if (status === true) {
      return (
        <div className="flex items-start gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <span className="leading-tight">{detail}</span>
        </div>
      );
    }
    if (status === 'PENDING') {
      return (
        <div className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
          <span className="leading-tight">{detail}</span>
        </div>
      );
    }
    return (
      <div className="flex items-start gap-1.5 text-xs text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
        <X className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span className="leading-tight">{detail}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cadre de Gouvernance & Sécurité Nationale</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Conformité Ministère de la Santé & ONPT</span>
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Accréditation Développeurs & Matrice des Rôles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed max-w-3xl">
            Pour préserver l'intégrité des flux d'urgence et la fiabilité des données de santé au Togo, l'accès aux API en production est soumis à un processus formel d'enregistrement et de vérification d'identité.
          </p>
        </div>
      </div>

      {/* SECTION 1: ACCRÉDITATION DÉVELOPPEUR & DOCUMENTS DE FIABILITÉ (Option 2) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold border border-teal-200">
              <FileText className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                1. Exigences d'Inscription & Documents de Fiabilité Développeur
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Dossier de conformité requis pour obtenir des clés d'API de Production (Live).
              </p>
            </div>
          </div>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Déposer un dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3 Pillars of Required Documents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Doc 1 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Obligatoire
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Identité Juridique / Déclarant
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Justificatif officiel d'existence légale au Togo ou à l'international :
              </p>
              <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc list-inside pt-1">
                <li>Extrait <strong>RCCM Togo</strong> ou Numéro <strong>NIF</strong> (entreprises, startups, cliniques).</li>
                <li><strong>CNI ou Passeport</strong> du porteur de projet (développeurs indépendants accrédités).</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Garantit la traçabilité des appels</span>
            </div>
          </div>

          {/* Doc 2 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  02
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Obligatoire
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Charte d'Usage & Non-Divulgation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Engagement éthique et conformité à la protection des données de santé :
              </p>
              <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc list-inside pt-1">
                <li>Interdiction de revente ou de dénaturation des tarifs officiels <strong>PMVP</strong>.</li>
                <li>Respect strict de la vie privée des patients et du secret pharmaceutique.</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Signature numérique ou PDF paraphé</span>
            </div>
          </div>

          {/* Doc 3 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  03
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Obligatoire
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Déclaration de Finalité du Projet
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Description claire et vérifiée du cas d'usage technique :
              </p>
              <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc list-inside pt-1">
                <li>Application mobile citoyenne, télémédecine, logiciel de pharmacie, Sapeurs-Pompiers (118) / Urgences.</li>
                <li>Volume prévisionnel de requêtes journalières (SLA & Quotas dimensionnés).</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Validation par le Comité Technique</span>
            </div>
          </div>

        </div>

        {/* 2-Step Access Lifecycle */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
            <LionIcon className="w-4 h-4 text-emerald-700" />
            <span>Processus d'Accréditation en 2 Temps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-900 flex items-center gap-1">
                  <span>🟡 Étape 1 : Sandbox / Bac à Sable</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Instantané</span>
              </div>
              <p className="text-slate-600 font-medium">
                Génération immédiate d'une clé <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-amber-900 font-bold">pdt_test_...</code> pour développer et tester sans attendre la vérification documentaire. Données émulées réalistes.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <span>🟢 Étape 2 : Production / Live</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">Examen sous 24h</span>
              </div>
              <p className="text-slate-600 font-medium">
                Examen des documents de fiabilité par le Super Administrateur Galenis Togo, puis activation de la clé <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-bold">pdt_live_...</code> avec accès temps réel et webhooks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MATRICE OFFICIELLE DES RÔLES & PERMISSIONS (Option 3) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold border border-indigo-200">
              <Users className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                2. Matrice Récapitulative des Rôles & Permissions
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cartographie complète des droits d'accès par profil d'utilisateur.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'Tous les profils' },
              { id: 'CITIZEN', label: 'Citoyen' },
              { id: 'DEV', label: 'Développeur' },
              { id: 'PHARMA', label: 'Pharmacien' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterRole(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilterRole === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Description Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-2xl border transition-all ${
            activeFilterRole === 'CITIZEN' || activeFilterRole === 'ALL' 
              ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs' 
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-extrabold text-xs text-slate-900">1. Citoyen / Patient</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug">
              Accès public direct sans compte : recherche de garde, localisation GPS, disponibilité des médicaments et signalements.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            activeFilterRole === 'DEV' || activeFilterRole === 'ALL' 
              ? 'bg-teal-50/40 border-teal-300 shadow-2xs' 
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="font-extrabold text-xs text-slate-900">2. Développeur / Intégrateur</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug">
              Sandbox immédiat. Accès Production conditionné par la vérification du dossier de fiabilité (RCCM/NIF/Charte).
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            activeFilterRole === 'PHARMA' || activeFilterRole === 'ALL' 
              ? 'bg-blue-50/40 border-blue-300 shadow-2xs' 
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-extrabold text-xs text-slate-900">3. Pharmacien Titulaire</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug">
              Accès certifié à son officine uniquement : déclaration des gardes, mise à jour des coordonnées et des stocks.
            </p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold">
                <th className="p-3.5 pl-4">Fonctionnalité / Ressource</th>
                {(activeFilterRole === 'ALL' || activeFilterRole === 'CITIZEN') && (
                  <th className="p-3.5 min-w-[160px]">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Citoyen</span>
                    </div>
                  </th>
                )}
                {(activeFilterRole === 'ALL' || activeFilterRole === 'DEV') && (
                  <th className="p-3.5 min-w-[200px]">
                    <div className="flex items-center gap-1.5 text-teal-800">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span>Développeur (Inscrit)</span>
                    </div>
                  </th>
                )}
                {(activeFilterRole === 'ALL' || activeFilterRole === 'PHARMA') && (
                  <th className="p-3.5 min-w-[180px]">
                    <div className="flex items-center gap-1.5 text-blue-800">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Pharmacien Titulaire</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-sans">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-4 align-top">
                    <div className="font-extrabold text-slate-900">{row.feature}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{row.description}</div>
                    <span className="inline-block mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                      {row.category}
                    </span>
                  </td>

                  {(activeFilterRole === 'ALL' || activeFilterRole === 'CITIZEN') && (
                    <td className="p-3.5 align-top">
                      {renderBadge(row.citizen.allowed, row.citizen.detail)}
                    </td>
                  )}

                  {(activeFilterRole === 'ALL' || activeFilterRole === 'DEV') && (
                    <td className="p-3.5 align-top">
                      {renderBadge(row.dev.allowed, row.dev.detail)}
                    </td>
                  )}

                  {(activeFilterRole === 'ALL' || activeFilterRole === 'PHARMA') && (
                    <td className="p-3.5 align-top">
                      {renderBadge(row.pharma.allowed, row.pharma.detail)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Summary Alert */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center shrink-0 font-bold">
              <Lock className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">
                Principe du Moindre Privilège & Cloisonnement Strict
              </div>
              <p className="text-slate-600 font-medium text-[11px]">
                Seul l'Administrateur peut altérer la base globale ou attribuer les droits de production. Les pharmaciens sont strictement restreints à leur officine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenKeys && (
              <button
                onClick={onOpenKeys}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gérer mes Clés API</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
