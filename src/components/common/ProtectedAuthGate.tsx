import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  KeyRound, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { UserRole, UserSession } from '../../types';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';

interface ProtectedAuthGateProps {
  requiredRoles: UserRole[];
  spaceName: string;
  spaceDescription: string;
  currentUser: UserSession | null;
  onLoginAsPreset?: (session: UserSession) => void;
  onNavigateToLogin: (suggestedRole?: UserRole) => void;
  onCancel: () => void;
}

export const ProtectedAuthGate: React.FC<ProtectedAuthGateProps> = ({
  requiredRoles,
  spaceName,
  spaceDescription,
  currentUser,
  onLoginAsPreset,
  onNavigateToLogin,
  onCancel
}) => {
  const isWrongRole = !!currentUser && !requiredRoles.includes(currentUser.role);

  // Recommended preset based on required roles
  const primaryRole = requiredRoles[0] || 'PHARMACIEN';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <TogoFlag className="w-5 h-3.5 rounded shadow-xs" />
            <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
              Contrôle d'Accès Réglementé • République Togolaise
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Route Protégée</span>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {/* Status Message */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-4 shadow-sm">
              {isWrongRole ? (
                <ShieldAlert className="w-8 h-8 text-amber-600" />
              ) : (
                <Lock className="w-8 h-8 text-emerald-600" />
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isWrongRole ? "Privilèges Insuffisants" : "Accès Réservé — Authentification Requise"}
            </h1>

            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              L'accès à l'espace <strong>{spaceName}</strong> nécessite une authentification préalable ({requiredRoles.length === 5 ? (
                <span className="font-bold text-slate-900">Citoyens, Professionnels de Santé & Administrateurs</span>
              ) : (
                requiredRoles.map((r, i) => (
                  <span key={r} className="font-bold text-slate-900">
                    {i > 0 ? ', ' : ''}
                    {r === 'PHARMACIEN' && 'Pharmaciens Titulaires ONPT'}
                    {r === 'SUPER_ADMIN' && 'Super Administrateurs Centraux'}
                    {r === 'DATA_ADMIN' && 'Gestionnaires Régionaux'}
                    {r === 'DEVELOPPEUR' && 'Développeurs Partenaires API'}
                    {r === 'CITOYEN' && 'Citoyens & Assurés'}
                  </span>
                ))
              )}).
            </p>

            {isWrongRole && currentUser && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Vous êtes actuellement connecté en tant que <strong>{currentUser.name}</strong> ({currentUser.title}). 
                  Votre profil <strong>{currentUser.role}</strong> n'a pas accès à cet espace.
                </span>
              </div>
            )}
          </div>

          {/* Secure Access Information Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
              <TogoLionIcon className="w-7 h-7 text-emerald-700" />
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
              Plateforme Nationale Sécurisée ONPT
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Veuillez vous authentifier avec vos identifiants professionnels délivrés par l'Ordre National des Pharmaciens du Togo ou la Direction Centrale.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil citoyen</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToLogin(primaryRole)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-white" />
              <span>Se connecter à mon compte officiel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
