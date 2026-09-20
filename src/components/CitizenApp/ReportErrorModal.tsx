import React, { useState } from 'react';
import { Pharmacy, ErrorReport } from '../../types';
import { addErrorReport } from '../../services/pharmacyStorage';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportErrorModalProps {
  pharmacy: Pharmacy | null;
  onClose: () => void;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  pharmacy,
  onClose
}) => {
  const [reportedBy, setReportedBy] = useState('');
  const [phone, setPhone] = useState('');
  const [issueType, setIssueType] = useState<ErrorReport['issueType']>('HORAIRES_INCORRECTS');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!pharmacy) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedBy || !details) return;

    addErrorReport({
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      reportedBy,
      phone,
      issueType,
      details
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Merci pour votre contribution citoyenne !</h3>
            <p className="text-xs text-slate-600">
              Votre signalement sur la pharmacie <strong>{pharmacy.name}</strong> a été enregistré. Notre équipe appellera la pharmacie pour vérifier l'information.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b pb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Signaler une erreur / mise à jour</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700">
              <strong>Pharmacie concernée :</strong> {pharmacy.name} ({pharmacy.city})
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nature de la correction</label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value as ErrorReport['issueType'])}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium"
              >
                <option value="HORAIRES_INCORRECTS">Horaires de garde ou d'ouverture incorrects</option>
                <option value="TELEPHONE_INJOIGNABLE">Numéro de téléphone hors service ou injoignable</option>
                <option value="LOCATION_EXACTE">Emplacement GPS ou adresse inexact</option>
                <option value="GARDE_NON_SPECTEE">Pharmacie fermée pendant son tour de garde</option>
                <option value="AUTRE">Autre précision</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Explication détaillée</label>
              <textarea
                required
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Ex: La pharmacie a fermé à 20h00 au lieu de 22h00..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Votre Nom</label>
                <input
                  type="text"
                  required
                  value={reportedBy}
                  onChange={e => setReportedBy(e.target.value)}
                  placeholder="Koffi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone (facultatif)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+228..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-colors cursor-pointer"
            >
              Envoyer la correction
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
