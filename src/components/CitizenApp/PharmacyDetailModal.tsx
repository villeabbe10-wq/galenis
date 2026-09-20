import React, { useState } from 'react';
import { Pharmacy, PharmacyDrugStock, Drug } from '../../types';
import { getPharmacyReviews } from '../../services/pharmacyStorage';
import { ShareModal } from './ShareModal';
import { TogoLionIcon } from '../TogoEmblems';
import { 
  X, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  Star, 
  AlertCircle, 
  Truck, 
  CreditCard, 
  User, 
  Heart, 
  Globe, 
  Smartphone, 
  UserCheck, 
  Activity, 
  Ticket, 
  MessageSquareHeart, 
  ThumbsUp,
  Share2,
  Navigation,
  Copy,
  Check,
  Car,
  Calculator,
  Pill
} from 'lucide-react';

interface PharmacyDetailModalProps {
  pharmacy: Pharmacy | null;
  stocks: PharmacyDrugStock[];
  drugs: Drug[];
  onClose: () => void;
  onReportError: (p: Pharmacy) => void;
  onOpenPriceEstimator?: (p: Pharmacy) => void;
}

export const PharmacyDetailModal: React.FC<PharmacyDetailModalProps> = ({
  pharmacy,
  stocks,
  drugs,
  onClose,
  onReportError,
  onOpenPriceEstimator
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!pharmacy) return null;

  const isDeGarde = pharmacy.status === 'DE_GARDE' || pharmacy.isGuardToday;
  const isOpen = pharmacy.status === 'OPEN' || isDeGarde;
  const pharmacyStocks = stocks.filter(s => s.pharmacyId === pharmacy.id);

  const whatsappMessage = encodeURIComponent(
    `Bonjour ${pharmacy.name}, je consulte votre fiche sur Galenis Togo. Pouvez-vous me confirmer vos disponibilités actuelles ?`
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
  const gozemUrl = `https://gozem.co/`;

  const handleShareWhatsApp = () => {
    const shareText = `🏥 *${pharmacy.name.toUpperCase()}*\n` +
      `📍 ${pharmacy.city} (${pharmacy.quarter}) — ${pharmacy.address}\n` +
      `🕒 *Statut:* ${isDeGarde ? '🟢 DE GARDE 24H/24' : isOpen ? '🟢 Ouverte' : '🔴 Fermée'}\n` +
      `📞 *Téléphone:* ${pharmacy.phone}\n` +
      `🗺️ *Itinéraire GPS:* ${googleMapsUrl}\n\n` +
      `_Partagé depuis Galenis Togo_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyDetails = () => {
    const text = `${pharmacy.name}\n${pharmacy.city} (${pharmacy.quarter}) - ${pharmacy.address}\nTél: ${pharmacy.phone}\nCoordonnées: ${pharmacy.lat}, ${pharmacy.lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Image & Close Button */}
        <div className="relative h-48 bg-slate-900 overflow-hidden">
          <img
            src={pharmacy.photos[0] || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80'}
            alt={pharmacy.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badges */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {isDeGarde ? (
                <span className="bg-amber-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1.5 w-fit">
                  <TogoLionIcon className="w-3.5 h-3.5 text-slate-950" />
                  <span>DE GARDE</span>
                </span>
              ) : isOpen ? (
                <span className="bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
                  ● Ouverte
                </span>
              ) : (
                <span className="bg-slate-500 text-slate-900 font-bold px-2.5 py-0.5 rounded-full text-xs">
                  Fermée
                </span>
              )}

              <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vérifié {pharmacy.verificationSource}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">{pharmacy.name}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {pharmacy.city} ({pharmacy.quarter}) — {pharmacy.address}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Direct CTA Buttons Bar */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {/* Prominent Price & Quote Estimator Button */}
            {onOpenPriceEstimator && (
              <button
                type="button"
                onClick={() => onOpenPriceEstimator(pharmacy)}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs transform-gpu hover:-translate-y-0.5"
              >
                <Calculator className="w-4 h-4 text-emerald-100" />
                <span>Estimer le prix de mon ordonnance avant déplacement</span>
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
                className="bg-emerald-50 hover:bg-emerald-600 text-emerald-950 hover:text-white border border-emerald-300 hover:border-emerald-600 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs text-xs"
              >
                <Phone className="w-4 h-4 text-emerald-700 group-hover:text-white" />
                <span>Appeler</span>
              </a>

              <a
                href={`https://wa.me/${pharmacy.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => setShowShareModal(true)}
                className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                title="Partager par WhatsApp ou SMS"
              >
                <Share2 className="w-4 h-4 text-teal-600" />
                <span>Partager</span>
              </button>

              <button
                onClick={handleCopyDetails}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Transport & GPS Links */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Itinéraire Google Maps</span>
                </a>

                <a
                  href={gozemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Course Gozem (Lomé)</span>
                </a>
              </div>

              <button
                onClick={() => onReportError(pharmacy)}
                className="text-rose-600 hover:text-rose-700 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Signaler une erreur
              </button>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hours & Contact */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Horaires d'ouverture</span>
                </h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Du Lundi au Vendredi:</span>
                    <span className="font-semibold text-slate-900">{pharmacy.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Samedi:</span>
                    <span className="font-semibold text-slate-900">{pharmacy.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimanche & Jours fériés:</span>
                    <span className="font-semibold text-slate-900">{pharmacy.hours.sunday}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Informations & Titulaire</span>
                </h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                  <div><strong>Pharmacien responsable :</strong> {pharmacy.pharmacistInCharge}</div>
                  <div><strong>Téléphone :</strong> {pharmacy.phone} {pharmacy.phoneSecondary && `| ${pharmacy.phoneSecondary}`}</div>
                  <div><strong>Email :</strong> {pharmacy.email}</div>
                  <div><strong>Dernière mise à jour :</strong> {pharmacy.lastVerified}</div>
                </div>
              </div>
            </div>

            {/* Services & Mobile Payments */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <span>Moyens de paiement acceptés</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.mobilePayments.map(mp => (
                    <div key={mp} className="bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs text-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        {mp === 'Carte Bancaire' ? <CreditCard className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      </div>
                      <span>{mp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span>Services proposés</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.services.map(srv => {
                    let IconComp = CheckCircle2;
                    let iconBg = "bg-slate-200 text-slate-700";
                    let pillBg = "bg-slate-50 border-slate-200 text-slate-800";
                    let srvLabel = srv.replace(/_/g, ' ');

                    if (srv === 'GARDE_24H') {
                      IconComp = Clock;
                      iconBg = "bg-amber-100 text-amber-700";
                      pillBg = "bg-amber-50/80 border-amber-200 text-amber-900 font-bold";
                      srvLabel = "Garde 24h/24";
                    } else if (srv === 'PAIEMENT_MOBILE') {
                      IconComp = Smartphone;
                      iconBg = "bg-emerald-100 text-emerald-700";
                      pillBg = "bg-emerald-50 border-emerald-200 text-emerald-900";
                      srvLabel = "Paiement Mobile";
                    } else if (srv === 'LIVRAISON') {
                      IconComp = Truck;
                      iconBg = "bg-blue-100 text-blue-700";
                      pillBg = "bg-blue-50 border-blue-200 text-blue-900";
                      srvLabel = "Livraison à domicile";
                    } else if (srv === 'TEST_RAPIDE_PALU') {
                      IconComp = Activity;
                      iconBg = "bg-purple-100 text-purple-700";
                      pillBg = "bg-purple-50 border-purple-200 text-purple-900";
                      srvLabel = "Test rapide Paludisme";
                    } else if (srv === 'PRISE_TENSION') {
                      IconComp = Heart;
                      iconBg = "bg-rose-100 text-rose-700";
                      pillBg = "bg-rose-50 border-rose-200 text-rose-900";
                      srvLabel = "Prise de tension";
                    } else if (srv === 'TEST_GLYCEMIE') {
                      IconComp = Activity;
                      iconBg = "bg-emerald-100 text-emerald-700";
                      pillBg = "bg-emerald-50 border-emerald-200 text-emerald-900";
                      srvLabel = "Test de glycémie (sucre)";
                    } else if (srv === 'CONSEIL_ORAL') {
                      IconComp = UserCheck;
                      iconBg = "bg-indigo-100 text-indigo-700";
                      pillBg = "bg-indigo-50 border-indigo-200 text-indigo-900";
                      srvLabel = "Conseils personnalisés";
                    }

                    return (
                      <div key={srv} className={`border px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 shadow-xs ${pillBg}`}>
                        <div className={`w-5 h-5 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-3 h-3" />
                        </div>
                        <span className="font-semibold">{srvLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guard Schedule Calendar */}
              {pharmacy.guardSchedule && pharmacy.guardSchedule.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Calendrier des gardes</span>
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                    {pharmacy.guardSchedule.map((gs, idx) => (
                      <div key={idx} className="flex justify-between items-center text-amber-900">
                        <span className="font-semibold">{gs.date}</span>
                        <span className="font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">{gs.type} — {gs.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Essential Molecules Availability & Price List */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Médicaments & Prix officiels dans cette pharmacie</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prix unitaires homologués en FCFA avant application de votre assurance santé.
                </p>
              </div>

              {onOpenPriceEstimator && (
                <button
                  type="button"
                  onClick={() => onOpenPriceEstimator(pharmacy)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors shadow-2xs"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Calculer mon devis complet</span>
                </button>
              )}
            </div>

            {pharmacyStocks.length === 0 ? (
              <p className="text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                La liste des médicaments n'est pas encore renseignée en ligne. Vous pouvez appeler la pharmacie ou lui écrire sur WhatsApp.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pharmacyStocks.map((st) => {
                  const drug = drugs.find(d => d.id === st.drugId);
                  const isAvailable = st.status === 'AVAILABLE';
                  const inamCopayEstimate = Math.round(st.priceFcfa * 0.2);

                  return (
                    <div 
                      key={st.drugId} 
                      onClick={() => onOpenPriceEstimator && onOpenPriceEstimator(pharmacy)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isAvailable 
                          ? 'bg-slate-50 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300' 
                          : 'bg-rose-50/30 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-black text-slate-900 text-xs sm:text-sm">
                            {drug ? drug.name : 'Médicament'}
                          </div>
                          <div className="text-[10.5px] text-slate-500">
                            DCI : {drug?.dci}
                          </div>
                        </div>

                        <div>
                          {isAvailable ? (
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>EN STOCK</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>RUPTURE</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing row */}
                      {isAvailable && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 text-[11px]">Prix :</span>
                            <span className="font-mono font-black text-slate-900">
                              {st.priceFcfa.toLocaleString()} FCFA
                            </span>
                          </div>

                          <div className="text-[10.5px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                            INAM (80%) : reste ~{inamCopayEstimate.toLocaleString()} F
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Community Reviews Section */}
          <div className="pt-2 border-t border-slate-200">
            {(() => {
              const reviews = getPharmacyReviews().filter(r => r.pharmacyId === pharmacy.id);
              const avgRating = reviews.length > 0
                ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
                : '5.0';

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        Avis & Retours d'Expérience ({reviews.length})
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-black text-amber-900">{avgRating} / 5</span>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 text-center">
                      Aucun avis pour le moment. Soyez le premier à partager votre retour sur cette pharmacie !
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {reviews.map(rev => (
                        <div key={rev.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{rev.authorName}</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map(st => (
                                <Star
                                  key={st}
                                  className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-700 leading-snug">« {rev.comment} »</p>
                          {rev.tags && rev.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {rev.tags.map((t, idx) => (
                                <span key={idx} className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          {rev.pharmacyResponse && (
                            <div className="bg-emerald-50/80 border-l-2 border-emerald-600 p-2 rounded-r-lg text-[11px] text-slate-800 mt-1">
                              <strong>Réponse du titulaire :</strong> « {rev.pharmacyResponse.comment} »
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Footer note & Report Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onReportError(pharmacy);
              }}
              className="text-slate-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 underline cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Signaler une erreur sur cette fiche
            </button>

            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        pharmacy={pharmacy}
      />
    </div>
  );
};
