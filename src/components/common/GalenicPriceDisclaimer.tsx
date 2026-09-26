import React from 'react';
import { Info, FlaskConical, Package, Scale, Pill } from 'lucide-react';
import { DrugPriceStats } from '../../utils/drugPriceHelper';

interface GalenicPriceDisclaimerProps {
  stats?: DrugPriceStats;
  compact?: boolean;
  className?: string;
  showRangeBadge?: boolean;
}

export const GalenicPriceDisclaimer: React.FC<GalenicPriceDisclaimerProps> = ({
  stats,
  compact = false,
  className = '',
  showRangeBadge = true
}) => {
  if (compact) {
    return (
      <div className={`bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2 ${className}`}>
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Fourchette de prix indicative :</span> Le tarif peut varier d'une officine à une autre selon la <strong className="font-semibold text-amber-950">forme galénique</strong> (comprimés, sirop, gélules, injectable), le <strong className="font-semibold text-amber-950">fabricant</strong> (générique ou princeps) et le dosage.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 shadow-2xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/70">
        <div className="flex items-center gap-2 font-black text-amber-900 text-xs uppercase tracking-wide">
          <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span>Fourchette de prix & Formes galéniques</span>
        </div>

        {showRangeBadge && stats && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-amber-300 font-extrabold text-amber-900 shadow-2xs self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-amber-700">Fourchette constatée :</span>
            <span className="text-xs text-slate-900 font-black">{stats.formattedRange}</span>
          </div>
        )}
      </div>

      <p className="text-slate-700 leading-relaxed font-medium">
        <strong className="text-amber-950 font-bold">Pourquoi les prix diffèrent-ils selon les officines ?</strong> Les tarifs saisis par les pharmaciens peuvent varier légitimement en fonction :
      </p>

      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
        <li className="bg-white/80 border border-amber-200/70 rounded-xl p-2.5 flex items-start gap-2">
          <Pill className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Forme galénique</span>
            <span>Comprimés, sirop pédiatrique, gélules ou solution injectable.</span>
          </div>
        </li>
        <li className="bg-white/80 border border-amber-200/70 rounded-xl p-2.5 flex items-start gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Laboratoire & Marque</span>
            <span>Générique CAMEG/DPML ou spécialité de référence (princeps).</span>
          </div>
        </li>
        <li className="bg-white/80 border border-amber-200/70 rounded-xl p-2.5 flex items-start gap-2">
          <Package className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Conditionnement</span>
            <span>Dosage spécifique et nombre d'unités par boîte ou flacon.</span>
          </div>
        </li>
      </ul>

      <div className="mt-2.5 text-[10px] text-amber-800 font-semibold flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 text-amber-700" />
        <span>Le conseil pharmaceutique et le prix appliqué au comptoir en officine font foi lors de la dispensation.</span>
      </div>
    </div>
  );
};
