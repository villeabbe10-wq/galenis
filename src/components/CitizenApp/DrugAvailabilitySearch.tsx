import React, { useState, useMemo } from 'react';
import { Drug, Pharmacy, PharmacyDrugStock } from '../../types';
import { getDrugPriceStats } from '../../utils/drugPriceHelper';
import { GalenicPriceDisclaimer } from '../common/GalenicPriceDisclaimer';
import { 
  Search, 
  Pill, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Share2,
  Calculator,
  Navigation,
  Scale,
  Sparkles
} from 'lucide-react';

interface DrugAvailabilitySearchProps {
  drugs?: Drug[];
  pharmacies?: Pharmacy[];
  stocks?: PharmacyDrugStock[];
  onSelectPharmacy: (p: Pharmacy) => void;
  onOpenInsuranceSimulator?: (drug?: Drug) => void;
}

export const DrugAvailabilitySearch: React.FC<DrugAvailabilitySearchProps> = ({
  drugs = [],
  pharmacies = [],
  stocks = [],
  onSelectPharmacy,
  onOpenInsuranceSimulator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(drugs[0] || null);

  const filteredDrugs = (drugs || []).filter(d => 
    (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.genericName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.dci || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDrug = selectedDrug || drugs[0];

  const drugStockEntries = useMemo(() => {
    return (stocks || []).filter(s => s.drugId === activeDrug?.id);
  }, [stocks, activeDrug]);

  const priceStats = useMemo(() => {
    return activeDrug ? getDrugPriceStats(activeDrug.id, stocks) : null;
  }, [activeDrug, stocks]);

  const handleShareDrugAvailability = (pharma: Pharmacy, stock: PharmacyDrugStock) => {
    const text = `💊 *DISPONIBILITÉ MÉDICAMENT AU TOGO*\n` +
      `• *Médicament :* ${activeDrug.name} (DCI: ${activeDrug.dci})\n` +
      `• *Pharmacie :* ${pharma.name} (${pharma.city} - ${pharma.quarter})\n` +
      `• *Prix indicatif officine :* ${stock.priceFcfa.toLocaleString()} FCFA (variable selon forme & laboratoire)\n` +
      `• *Téléphone :* ${pharma.phone}\n` +
      `• *Prise en charge estimée INAM (80%) :* ${Math.round(stock.priceFcfa * 0.8).toLocaleString()} FCFA (Reste à charge: ${Math.round(stock.priceFcfa * 0.2).toLocaleString()} FCFA)\n\n` +
      `_Vérifié sur Galenis Togo_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Médicaments & Fourchettes de prix</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Disponibilité & Fourchettes des médicaments
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Consultez les disponibilités en officine et les fourchettes de prix indicatives selon les formes galéniques.
          </p>
        </div>

        {/* Action & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {onOpenInsuranceSimulator && (
            <button
              onClick={() => onOpenInsuranceSimulator(activeDrug)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Calculer remboursement assurance</span>
            </button>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher: Paracétamol, Coartem, Ventoline..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-900 bg-slate-50 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Drug Selector pills */}
      <div className="py-4 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {filteredDrugs.map((drug) => {
          const isSelected = activeDrug?.id === drug.id;
          return (
            <button
              key={drug.id}
              onClick={() => setSelectedDrug(drug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {drug.name}
            </button>
          );
        })}
      </div>

      {/* Selected Drug Info Banner */}
      {activeDrug && (
        <div className="space-y-3 my-2">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-sm">{activeDrug.name}</h3>
                <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                  DCI: {activeDrug.dci}
                </span>
                {priceStats && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black px-2.5 py-0.5 rounded-lg text-[11px] shadow-2xs">
                    Fourchette constatée : {priceStats.formattedRange}
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{activeDrug.description}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="bg-white/90 border border-emerald-200 rounded-xl p-2 px-3 text-[11px] font-medium text-slate-700">
                Catégorie : <strong>{activeDrug.category}</strong>
              </div>

              {onOpenInsuranceSimulator && (
                <button
                  onClick={() => onOpenInsuranceSimulator(activeDrug)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 px-3 rounded-xl text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculer ma part à payer</span>
                </button>
              )}
            </div>
          </div>

          {/* Galenic & Price Variation Pedagogical Notice */}
          <GalenicPriceDisclaimer stats={priceStats || undefined} />
        </div>
      )}

      {/* Availability Statuses Grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pharmacies proposant ce produit ({drugStockEntries.length} établissements répertoriés)
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Tarifs déclarés par les officines
          </span>
        </div>

        {drugStockEntries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
            <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            Disponibilité non renseignée pour ce produit. Contactez directement les pharmacies par téléphone.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drugStockEntries.map((stock) => {
              const pharma = pharmacies.find(p => p.id === stock.pharmacyId);
              if (!pharma) return null;

              const isAvailable = stock.status === 'AVAILABLE';
              const isOutOfStock = stock.status === 'OUT_OF_STOCK';

              return (
                <div 
                  key={stock.pharmacyId}
                  className={`p-4 rounded-xl border transition-all ${
                    isAvailable 
                      ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400' 
                      : isOutOfStock 
                      ? 'bg-rose-50/20 border-rose-200' 
                      : 'bg-amber-50/20 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 
                        onClick={() => onSelectPharmacy(pharma)}
                        className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer text-sm flex items-center gap-1.5"
                      >
                        {pharma.name}
                      </h5>
                      <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{pharma.city} ({pharma.quarter})</span>
                      </div>
                    </div>

                    {/* Stock status & Price */}
                    <div className="text-right shrink-0">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full text-[11px] shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          DISPONIBLE
                        </span>
                      ) : isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          RUPTURE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          SUR COMMANDE
                        </span>
                      )}

                      {isAvailable && (
                        <div className="mt-1">
                          <div className="text-sm font-black text-slate-900">
                            {stock.priceFcfa.toLocaleString()} FCFA
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">
                            selon forme en stock
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="text-[10px] text-slate-400">
                      Màj: {stock.lastUpdated}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareDrugAvailability(pharma, stock)}
                        className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                        title="Partager cette disponibilité"
                      >
                        <Share2 className="w-3 h-3 text-teal-600" />
                        <span>Partager</span>
                      </button>

                      <a
                        href={`tel:${pharma.phone.replace(/\s+/g, '')}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <Phone className="w-3 h-3 text-slate-600" />
                        Appeler
                      </a>

                      {isAvailable && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pharma.lat},${pharma.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
                          title="Itinéraire GPS vers cette officine"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Itinéraire</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

