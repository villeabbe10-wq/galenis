import React, { useState } from 'react';
import { Pharmacy } from '../../types';
import { addPharmacyReview } from '../../services/pharmacyStorage';
import { 
  X, 
  Star, 
  CheckCircle2, 
  MessageSquareHeart, 
  Building2, 
  ShieldCheck, 
  Send,
  ThumbsUp,
  CreditCard,
  HeartHandshake
} from 'lucide-react';

interface NewReviewModalProps {
  pharmacies: Pharmacy[];
  preselectedPharmacy?: Pharmacy | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewReviewModal: React.FC<NewReviewModalProps> = ({
  pharmacies,
  preselectedPharmacy,
  onClose,
  onSuccess
}) => {
  const [selectedPharmaId, setSelectedPharmaId] = useState<string>(preselectedPharmacy?.id || pharmacies[0]?.id || '');
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState(preselectedPharmacy?.city || 'Lomé');
  const [overallRating, setOverallRating] = useState<number>(5);
  
  // Detailed criteria ratings (1-5)
  const [accueil, setAccueil] = useState<number>(5);
  const [attente, setAttente] = useState<number>(4);
  const [stock, setStock] = useState<number>(5);
  const [tarifs, setTarifs] = useState<number>(5);

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [acceptsInam, setAcceptsInam] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('T-Money');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Service nuit rapide', 'Conseil attentionné']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPharma = pharmacies.find(p => p.id === selectedPharmaId) || preselectedPharmacy || pharmacies[0];

  const availableTags = [
    'Service nuit rapide',
    'Prise en charge INAM',
    'Flooz & T-Money ok',
    'Conseil attentionné',
    'Stock complet',
    'Réservation WhatsApp',
    'Test Palu rapide',
    'Accès PMR / Facile'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !comment.trim()) return;

    addPharmacyReview({
      pharmacyId: selectedPharma.id,
      pharmacyName: selectedPharma.name,
      authorName: authorName.trim(),
      city: city || selectedPharma.city,
      rating: overallRating,
      criteria: {
        accueil,
        delaiAttente: attente,
        disponibiliteStock: stock,
        respectPrix: tarifs
      },
      title: title.trim(),
      comment: comment.trim(),
      tags: selectedTags,
      acceptsInam,
      paymentMethodUsed: paymentMethod
    });

    setIsSubmitted(true);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-slate-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-300 border border-white/20 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Partager un retour d'expérience</h3>
              <p className="text-xs text-emerald-200">Avis d'usager & évaluation de service officinal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-900 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Merci pour votre retour d'expérience !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Votre avis valorise le travail des équipes soignantes et aide les citoyens togolais à s'orienter vers les officines les plus adaptées à leurs besoins.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Voir les avis publiés
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Pharmacy Target */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pharmacie évaluée</span>
              </label>
              <select
                value={selectedPharmaId}
                onChange={e => {
                  setSelectedPharmaId(e.target.value);
                  const p = pharmacies.find(item => item.id === e.target.value);
                  if (p) setCity(p.city);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.city} ({p.quarter})
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Rating Selection */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
              <span className="block font-bold text-slate-800 text-sm">Note Globale d'expérience</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1.5 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= overallRating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                {overallRating === 5 && '🌟 Exceptionnel (Recommandé sans réserve)'}
                {overallRating === 4 && '👍 Très bon service'}
                {overallRating === 3 && '👌 Service convenable'}
                {overallRating === 2 && '⚠️ Décevant / Attente excessive'}
                {overallRating === 1 && '❌ Insatisfaisant'}
              </span>
            </div>

            {/* Criteria mini sliders */}
            <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-slate-200 rounded-xl">
              <div>
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Accueil & Écoute :</span>
                  <span className="text-emerald-700">{accueil}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={accueil}
                  onChange={e => setAccueil(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Temps d'attente :</span>
                  <span className="text-emerald-700">{attente}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={attente}
                  onChange={e => setAttente(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Disponibilité Stock :</span>
                  <span className="text-emerald-700">{stock}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Respect Tarifs :</span>
                  <span className="text-emerald-700">{tarifs}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={tarifs}
                  onChange={e => setTarifs(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick tags */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Points forts constatés</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Comment */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Titre de votre avis</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Passage de nuit rapide et efficace pour mon ordonnance"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Commentaire détaillé</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Racontez votre expérience (accueil, conseils reçus, fluidité, paiement...)"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* User Details & Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Votre Nom ou Prénom</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="Ex: Akouvi K."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Moyen de paiement utilisé</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium"
                >
                  <option value="T-Money">T-Money</option>
                  <option value="Flooz">Flooz</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Carte Bancaire">Carte Bancaire</option>
                  <option value="Assurance INAM / Tiers-Payant">Assurance INAM / Tiers-Payant</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="acceptsInamCheck"
                checked={acceptsInam}
                onChange={e => setAcceptsInam(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="acceptsInamCheck" className="text-[11px] font-semibold text-slate-700 cursor-pointer">
                Prise en charge assurance INAM ou privée acceptée lors de ma visite
              </label>
            </div>

            {/* Buttons */}
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publier mon avis</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
