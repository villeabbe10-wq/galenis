import React, { useState } from 'react';
import { ShieldAlert, KeyRound, CheckCircle2, X, Lock, AlertTriangle } from 'lucide-react';
import { TogoLionIcon } from '../TogoEmblems';

interface CriticalAction2faModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionButtonLabel?: string;
  severity?: 'warning' | 'danger';
}

export const CriticalAction2faModal: React.FC<CriticalAction2faModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionButtonLabel = 'Confirmer l\'opération',
  severity = 'danger'
}) => {
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [demoCode] = useState('784920');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityCode.trim()) {
      setError('Veuillez saisir le code de sécurité 2FA.');
      return;
    }

    if (securityCode.trim() !== demoCode && securityCode.trim() !== '123456') {
      setError('Code de sécurité incorrect. Code de validation recommandé : ' + demoCode);
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      onConfirm();
      onClose();
      setSecurityCode('');
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`p-6 border-b ${severity === 'danger' ? 'bg-red-50/70 border-red-100' : 'bg-amber-50/70 border-amber-100'} flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${severity === 'danger' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <TogoLionIcon className="w-4 h-4 text-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Validation de Sécurité 2FA</span>
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{description}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Code de confirmation à 6 chiffres (OTP / 2FA)
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={securityCode}
                onChange={(e) => {
                  setSecurityCode(e.target.value);
                  setError('');
                }}
                placeholder="Ex: 784920"
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-black text-slate-900"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Code officiel de test : <strong className="text-emerald-700 font-mono font-bold">{demoCode}</strong></span>
              <span className="text-slate-400">Expire dans 5 min</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className={`flex-1 py-3 px-4 rounded-xl text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                severity === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{actionButtonLabel}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
