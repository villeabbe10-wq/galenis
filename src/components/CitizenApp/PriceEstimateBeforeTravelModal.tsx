import React, { useState, useMemo } from 'react';
import { Pharmacy, Drug, PharmacyDrugStock } from '../../types';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';
import { GalenicPriceDisclaimer } from '../common/GalenicPriceDisclaimer';
import { 
  X, 
  Calculator, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Car, 
  Navigation, 
  CreditCard, 
  Smartphone, 
  Share2, 
  Send, 
  AlertCircle,
  Pill,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PriceEstimateBeforeTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy | null;
  drugs?: Drug[];
  stocks?: PharmacyDrugStock[];
  distanceKm?: number;
  onSelectAnotherPharmacy?: () => void;
  userInsuranceScheme?: string;
  userInsuranceRate?: number;
}

interface SelectedEstimateItem {
  drugId: string;
  drugName: string;
  dci: string;
  unitPriceFcfa: number;
  quantity: number;
  isAvailable: boolean;
}

export const PriceEstimateBeforeTravelModal: React.FC<PriceEstimateBeforeTravelModalProps> = ({
  isOpen,
  onClose,
  pharmacy,
  drugs = [],
  stocks = [],
  distanceKm,
  onSelectAnotherPharmacy,
  userInsuranceScheme,
  userInsuranceRate
}) => {
  // Insurance selection
  const [insuranceScheme, setInsuranceScheme] = useState<'NONE' | 'INAM' | 'AMU' | 'CNSS' | 'PRIVATE'>('INAM');
  const [isAld, setIsAld] = useState(false); // Affection Longue Durée (100% INAM)
  const [privateRate, setPrivateRate] = useState<number>(85); // 85% by default
  const [includeTransportEstimate, setIncludeTransportEstimate] = useState(true);

  // Available stocks for this pharmacy
  const pharmacyStocks = useMemo(() => {
    if (!pharmacy) return [];
    return stocks.filter(s => s.pharmacyId === pharmacy.id);
  }, [pharmacy, stocks]);

  // Initial items list: first 2 available drugs in this pharmacy or default
  const [estimateItems, setEstimateItems] = useState<SelectedEstimateItem[]>(() => {
    if (!pharmacy) return [];
    const available = stocks.filter(s => s.pharmacyId === pharmacy.id && s.status === 'AVAILABLE');
    if (available.length > 0) {
      return available.slice(0, 2).map(st => {
        const d = drugs.find(item => item.id === st.drugId);
        return {
          drugId: st.drugId,
          drugName: d?.name || 'Médicament',
          dci: d?.dci || '',
          unitPriceFcfa: st.priceFcfa,
          quantity: 1,
          isAvailable: true
        };
      });
    }
    return [];
  });

  // Keep items updated when pharmacy changes
  React.useEffect(() => {
    if (pharmacy) {
      const available = stocks.filter(s => s.pharmacyId === pharmacy.id && s.status === 'AVAILABLE');
      if (available.length > 0) {
        setEstimateItems(available.slice(0, 2).map(st => {
          const d = drugs.find(item => item.id === st.drugId);
          return {
            drugId: st.drugId,
            drugName: d?.name || 'Médicament',
            dci: d?.dci || '',
            unitPriceFcfa: st.priceFcfa,
            quantity: 1,
            isAvailable: true
          };
        }));
      } else {
        // Fallback with first drug if none found
        const firstDrug = drugs[0];
        setEstimateItems([
          {
            drugId: firstDrug?.id || 'd1',
            drugName: firstDrug?.name || 'Paracétamol 1g',
            dci: firstDrug?.dci || 'Paracétamol',
            unitPriceFcfa: 1200,
            quantity: 1,
            isAvailable: true
          }
        ]);
      }
    }
  }, [pharmacy?.id]);

  if (!isOpen || !pharmacy) return null;

  const isDeGarde = pharmacy.status === 'DE_GARDE' || pharmacy.isGuardToday;
  const isOpenNow = pharmacy.status === 'OPEN' || isDeGarde;

  // Calculate coverage rate
  let coveragePercent = 0;
  if (insuranceScheme === 'NONE') coveragePercent = 0;
  else if (insuranceScheme === 'INAM') coveragePercent = isAld ? 100 : 80;
  else if (insuranceScheme === 'AMU') coveragePercent = 80;
  else if (insuranceScheme === 'CNSS') coveragePercent = 70;
  else if (insuranceScheme === 'PRIVATE') coveragePercent = privateRate;

  // Total medicines price
  const totalDrugsPrice = estimateItems.reduce((acc, item) => acc + (item.unitPriceFcfa * item.quantity), 0);
  const insuranceCoverageAmount = Math.round(totalDrugsPrice * (coveragePercent / 100));
  const patientDrugsShare = totalDrugsPrice - insuranceCoverageAmount;

  // Estimated round-trip transport cost in Togo (Zémidjan / Taxi / Gozem estimate)
  // Base ~ 500 FCFA for <2km, ~800 FCFA for 2-5km, ~1500 FCFA for 5-10km, ~2500 FCFA >10km
  const dist = distanceKm || 3.2;
  const transportCostEstimate = dist < 2 ? 600 : dist < 5 ? 1000 : dist < 10 ? 1800 : 2800;

  const grandTotalWithTransport = patientDrugsShare + (includeTransportEstimate ? transportCostEstimate : 0);

  const handleUpdateQuantity = (drugId: string, delta: number) => {
    setEstimateItems(prev => prev.map(item => {
      if (item.drugId === drugId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (drugId: string) => {
    setEstimateItems(prev => prev.filter(i => i.drugId !== drugId));
  };

  const handleAddDrugToEstimate = (drugId: string) => {
    if (estimateItems.some(i => i.drugId === drugId)) return;
    const d = drugs.find(item => item.id === drugId);
    if (!d) return;

    const stockEntry = pharmacyStocks.find(s => s.drugId === drugId);
    const price = stockEntry ? stockEntry.priceFcfa : (d.category === 'ANTIPALUDIQUE' ? 2800 : 1200);

    setEstimateItems(prev => [
      ...prev,
      {
        drugId: d.id,
        drugName: d.name,
        dci: d.dci,
        unitPriceFcfa: price,
        quantity: 1,
        isAvailable: stockEntry ? stockEntry.status === 'AVAILABLE' : true
      }
    ]);
  };

  // Pre-formatted WhatsApp quotation message to confirm with the active pharmacy before leaving home
  const whatsappQuotationMessage = encodeURIComponent(
    `🏥 *DEMANDE DE CONFIRMATION DE PRIX & DISPONIBILITÉ*\n` +
    `_Bonjour Pharmacie ${pharmacy.name}, je prépare mon déplacement vers votre officine._\n\n` +
    `📋 *Mon ordonnance / Médicaments souhaités :*\n` +
    estimateItems.map(i => `• ${i.drugName} (Qté: ${i.quantity}) ~ ${(i.unitPriceFcfa * i.quantity).toLocaleString()} FCFA`).join('\n') +
    `\n\n💰 *Total estimé médicaments :* ${totalDrugsPrice.toLocaleString()} FCFA\n` +
    (insuranceScheme !== 'NONE' ? `🛡️ *Régime Assurance :* ${insuranceScheme} (${coveragePercent}%)\n💳 *Reste à charge estimé :* ${patientDrugsShare.toLocaleString()} FCFA\n` : `💳 *Paiement au comptoir (sans assurance) :* ${totalDrugsPrice.toLocaleString()} FCFA\n`) +
    `\n_Pouvez-vous me confirmer que ces articles sont bien prêts au comptoir ? Merci !_\n` +
    `_Généré via Galenis Togo_`
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
  const gozemUrl = `https://gozem.co/`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-300" />
              <span>Devis & Prix Avant Déplacement</span>
            </span>
            {isDeGarde && (
              <span className="bg-amber-400 text-amber-950 font-black text-[10.5px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TogoLionIcon className="w-3 h-3 text-amber-950" />
                DE GARDE 24H/24
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {pharmacy.name}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-200 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <strong>{pharmacy.city}</strong> ({pharmacy.quarter}) — {pharmacy.address}
            </span>
            {distanceKm !== undefined && (
              <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                ~{distanceKm} km de vous
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          
          {/* Section 1: Insurance Scheme Selector */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Votre Régime d'Assurance / Tiers-Payant</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Prise en charge: {coveragePercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setInsuranceScheme('INAM')}
                className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                  insuranceScheme === 'INAM'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                INAM (80%)
              </button>

              <button
                type="button"
                onClick={() => setInsuranceScheme('AMU')}
                className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                  insuranceScheme === 'AMU'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                AMU (80%)
              </button>

              <button
                type="button"
                onClick={() => setInsuranceScheme('CNSS')}
                className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                  insuranceScheme === 'CNSS'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                CNSS (70%)
              </button>

              <button
                type="button"
                onClick={() => setInsuranceScheme('PRIVATE')}
                className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                  insuranceScheme === 'PRIVATE'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Privée (85%)
              </button>

              <button
                type="button"
                onClick={() => setInsuranceScheme('NONE')}
                className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  insuranceScheme === 'NONE'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Sans assurance
              </button>
            </div>

            {insuranceScheme === 'INAM' && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAld}
                  onChange={(e) => setIsAld(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Bénéficiaire ALD (Affection Longue Durée - Exonération 100%)</span>
              </label>
            )}
          </div>

          {/* Section 2: Prescription / Medication Basket in this Pharmacy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Médicaments dans mon devis ({estimateItems.length})</span>
              </h3>

              {pharmacyStocks.length > 0 && (
                <span className="text-[11px] text-slate-500 font-medium">
                  {pharmacyStocks.filter(s => s.status === 'AVAILABLE').length} produits en stock dans cette officine
                </span>
              )}
            </div>

            <GalenicPriceDisclaimer compact />

            {estimateItems.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500">
                <p className="font-medium">Aucun médicament ajouté à votre devis.</p>
                <p className="text-[11px] mt-1">Sélectionnez un médicament ci-dessous pour calculer son tarif.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {estimateItems.map((item) => (
                  <div 
                    key={item.drugId}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs sm:text-sm">{item.drugName}</span>
                        {item.isAvailable ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            En stock
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            À vérifier
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        DCI : {item.dci} • Prix officiel : <strong className="text-slate-900">{item.unitPriceFcfa.toLocaleString()} FCFA</strong> / boîte
                      </div>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.drugId, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 flex items-center justify-center font-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-black text-slate-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.drugId, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="font-black text-slate-900 text-sm">
                          {(item.unitPriceFcfa * item.quantity).toLocaleString()} FCFA
                        </div>
                        {insuranceScheme !== 'NONE' && (
                          <div className="text-[10px] text-emerald-700 font-bold">
                            Reste: {Math.round((item.unitPriceFcfa * item.quantity) * (1 - coveragePercent / 100)).toLocaleString()} F
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.drugId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Retirer du devis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Add other drugs available in this pharmacy */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                + Ajouter d'autres molécules du répertoire :
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {drugs.slice(0, 10).map(d => {
                  const alreadyIn = estimateItems.some(i => i.drugId === d.id);
                  if (alreadyIn) return null;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleAddDrugToEstimate(d.id)}
                      className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-emerald-600" />
                      <span>{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Summary Bento Calculation Box */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
                Synthèse Financière Avant Départ
              </span>
              <span className="text-xs font-mono bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded">
                Officine : {pharmacy.name}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Prix Officiel Médicaments :</span>
                <span className="font-bold text-white font-mono">{totalDrugsPrice.toLocaleString()} FCFA</span>
              </div>

              {insuranceScheme !== 'NONE' && (
                <div className="flex justify-between items-center text-emerald-300">
                  <span>Prise en charge {insuranceScheme} ({coveragePercent}%) :</span>
                  <span className="font-bold font-mono">- {insuranceCoverageAmount.toLocaleString()} FCFA</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-300">
                <span>Reste net à payer en caisse pharmacie :</span>
                <span className="font-black text-amber-300 font-mono text-sm">{patientDrugsShare.toLocaleString()} FCFA</span>
              </div>

              {/* Transport estimation toggle */}
              <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={includeTransportEstimate}
                    onChange={(e) => setIncludeTransportEstimate(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Inclure estimation transport (A/R ~{dist} km)</span>
                </label>
                {includeTransportEstimate && (
                  <span className="font-mono text-slate-300 font-semibold text-[11px]">
                    + ~{transportCostEstimate.toLocaleString()} FCFA
                  </span>
                )}
              </div>
            </div>

            {/* Grand Total Highlight */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] text-emerald-200 font-bold uppercase">
                  Budget Total Prévu Pour Ce Déplacement
                </div>
                <div className="text-[11px] text-slate-300">
                  {includeTransportEstimate ? 'Médicaments + Transport (Zémidjan / Gozem)' : 'Médicaments au comptoir'}
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {grandTotalWithTransport.toLocaleString()} <span className="text-sm font-sans font-bold text-emerald-300">FCFA</span>
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Pre-confirmation CTAs */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Actions recommandées avant de vous déplacer :
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Quotation Confirmation */}
              <a
                href={`https://wa.me/${pharmacy.whatsapp}?text=${whatsappQuotationMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold p-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirmer devis par WhatsApp</span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold p-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs cursor-pointer active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler la pharmacie ({pharmacy.phone})</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Itinéraire Google Maps</span>
              </a>

              <a
                href={gozemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>Commander Gozem</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prix homologués par la Direction de la Pharmacie du Togo.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
