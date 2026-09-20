import React, { useState } from 'react';
import { Pharmacy, ReportCategory } from '../../types';
import { addCommunityReport } from '../../services/pharmacyStorage';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Phone, 
  User, 
  FileText,
  ShieldAlert,
  Send
} from 'lucide-react';

interface NewReportModalProps {
  pharmacies: Pharmacy[];
  preselectedPharmacy?: Pharmacy | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({
  pharmacies,
  preselectedPharmacy,
  onClose,
  onSuccess
}) => {
  const [selectedPharmaId, setSelectedPharmaId] = useState<string>(preselectedPharmacy?.id || '');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [category, setCategory] = useState<ReportCategory>('GARDE_NON_RESPECTEE');
  const [urgency, setUrgency] = useState<'FAIBLE' | 'MOYENNE' | 'HAUTE' | 'URGENTE'>('HAUTE');
  const [city, setCity] = useState(preselectedPharmacy?.city || 'Lomé');
  const [region, setRegion] = useState(preselectedPharmacy?.region || 'Maritime');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPharma = pharmacies.find(p => p.id === selectedPharmaId) || preselectedPharmacy;

  const handlePharmacyChange = (id: string) => {
    setSelectedPharmaId(id);
    const p = pharmacies.find(item => item.id === id);
    if (p) {
      setCity(p.city);
      setRegion(p.region);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) return;

    addCommunityReport({
      pharmacyId: selectedPharma?.id,
      pharmacyName: selectedPharma?.name,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim() || undefined,
      category,
      description: description.trim(),
      city: city || 'Lomé',
      region: region || 'Maritime',
      urgency
    });

    setIsSubmitted(true);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Nouveau Signalement Citoyen</h3>
              <p className="text-xs text-slate-400">Rapporter une anomalie de garde, horaire ou produit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Signalement transmis avec succès !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Votre alerte a été enregistrée dans la file prioritaire de Galenis Togo. Nos équipes de modération et les pharmaciens référents sont prévenus pour vérification immédiate.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Retour aux signalements
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Pharmacy selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pharmacie concernée (Optionnel)</span>
              </label>
              <select
                value={selectedPharmaId}
                onChange={e => handlePharmacyChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Signalement général (Sans officine ciblée) --</option>
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.city} ({p.quarter})
                  </option>
                ))}
              </select>
            </div>

            {/* Category and Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif de l'anomalie</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ReportCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="GARDE_NON_RESPECTEE">Garde non assurée / Officine fermée</option>
                  <option value="HORAIRES_INCORRECTS">Horaires d'ouverture inexacts</option>
                  <option value="TELEPHONE_INJOIGNABLE">Numéro injoignable ou hors service</option>
                  <option value="LOCALISATION_GPS">Erreur d'adresse ou GPS</option>
                  <option value="RUPTURE_MEDICAMENT">Rupture de stock critique</option>
                  <option value="SUSPICION_CONTREFACON">Suspicion contrefaçon / Marché rue</option>
                  <option value="PRIX_ANORMAL">Divergence de tarif légal</option>
                  <option value="AUTRE">Autre motif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Niveau d'urgence</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="URGENTE">🚨 Urgence immédiate (Nuit / Garde)</option>
                  <option value="HAUTE">Haute (Impact patients)</option>
                  <option value="MOYENNE">Moyenne (Correction utile)</option>
                  <option value="FAIBLE">Faible (Mise à jour mineure)</option>
                </select>
              </div>
            </div>

            {/* City & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ville / Localité</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Ex: Lomé, Kara..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Région</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium"
                >
                  <option value="Maritime">Maritime</option>
                  <option value="Plateaux">Plateaux</option>
                  <option value="Centrale">Centrale</option>
                  <option value="Kara">Kara</option>
                  <option value="Savanes">Savanes</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Détails précis de l'incident</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Décrivez précisément ce qui a été constaté (date, heure, médicament concerné, réponse reçue...)"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Reporter information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Votre Nom ou Initiale</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="Ex: Koffi M."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone (Optionnel pour rappel)</label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  placeholder="+228 90 00 00 00"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Les signalements sont traités sous engagement de discrétion. Les informations diffamatoires ou non fondées sont rejetées après vérification téléphonique.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le signalement</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
