import React, { useState } from 'react';
import { Pharmacy } from '../types';
import { TOGO_CITIES } from '../data/mockPharmacies';
import { TogoFlag, TogoMapOutline } from './TogoEmblems';
import { 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Activity, 
  Globe2, 
  Radio, 
  ShieldCheck, 
  Search,
  Users,
  Compass,
  Zap,
  PhoneCall
} from 'lucide-react';

interface CoverageViewProps {
  pharmacies: Pharmacy[];
}

export const CoverageView: React.FC<CoverageViewProps> = ({ pharmacies }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('TOUS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const regions = [
    { name: 'Maritime', capital: 'Lomé', cities: ['Lomé', 'Tsévié', 'Aného', 'Tabligbo'], color: 'bg-emerald-500' },
    { name: 'Plateaux', capital: 'Atakpamé', cities: ['Atakpamé', 'Kpalimé', 'Notsé', 'Badou'], color: 'bg-blue-500' },
    { name: 'Centrale', capital: 'Sokodé', cities: ['Sokodé', 'Tchamba', 'Tchamba', 'Sotouboua'], color: 'bg-amber-500' },
    { name: 'Kara', capital: 'Kara', cities: ['Kara', 'Bassar', 'Niamtougou', 'Kpagouda'], color: 'bg-indigo-500' },
    { name: 'Savanes', capital: 'Dapaong', cities: ['Dapaong', 'Mango', 'Mandouri'], color: 'bg-rose-500' }
  ];

  const totalPharmacies = pharmacies.length;
  const totalGuardToday = pharmacies.filter(p => p.status === 'DE_GARDE' || p.isGuardToday).length;

  const filteredPharmacies = pharmacies.filter(p => {
    const matchesRegion = selectedRegion === 'TOUS' || p.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.quarter.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A878]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-[#00A878]/40">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#00A878]" />
            <span>COUVERTURE NATIONALE SATELLITE & CELLULAIRE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-3">
            <span>Couverture Sanitaire Régionale</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Galenis Togo cartographie les 5 régions administratives de la République Togolaise.
            Chaque officine est référencée dans l'infrastructure pour faciliter la géolocalisation et les gardes 24h/24.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 bg-emerald-50 border-emerald-200/70 px-3.5 py-2 rounded-xl border border-emerald-200">
              <Building2 className="w-4 h-4 text-[#00A878]" />
              <span>5 Régions Sanitaires</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border-emerald-200/70 px-3.5 py-2 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#00A878]" />
              <span>100% Officines Certifiées ONPT</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border-emerald-200/70 px-3.5 py-2 rounded-xl border border-emerald-200">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Disponibilité Serveur 99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Officines Référencées</div>
          <div className="text-2xl font-black text-slate-900 flex items-center justify-between">
            <span>{totalPharmacies}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">100% Actives</span>
          </div>
          <p className="text-[11px] text-slate-500">Mises à jour quotidiennement par l'ONPT</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pharmacies de Garde (Aujourd'hui)</div>
          <div className="text-2xl font-black text-amber-600 flex items-center justify-between">
            <span>{totalGuardToday}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">Ouvertes 24h/24</span>
          </div>
          <p className="text-[11px] text-slate-500">Rotation validée par l'Ordre des Pharmaciens</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Villes & Agglomérations</div>
          <div className="text-2xl font-black text-slate-900 flex items-center justify-between">
            <span>{TOGO_CITIES.length}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">du Sud au Nord</span>
          </div>
          <p className="text-[11px] text-slate-500">Lomé, Tsévié, Atakpamé, Sokodé, Kara, Dapaong...</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Temps de Réponse GPS</div>
          <div className="text-2xl font-black text-emerald-600 flex items-center justify-between">
            <span>&lt; 1,2s</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">Temps Réel</span>
          </div>
          <p className="text-[11px] text-slate-500">Compatible réseaux Togocom & Moov Africa</p>
        </div>
      </div>

      {/* Regional Selector & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              <span>Exploration des 5 Régions du Togo</span>
            </h2>
            <p className="text-xs text-slate-500">Sélectionnez une région sanitaire pour filtrer la couverture des officines</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Chercher ville, quartier, pharmacie..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Region Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion('TOUS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedRegion === 'TOUS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Toutes les Régions ({totalPharmacies})
          </button>

          {regions.map((reg) => {
            const count = pharmacies.filter(p => p.region.toLowerCase() === reg.name.toLowerCase()).length;
            const isSelected = selectedRegion.toLowerCase() === reg.name.toLowerCase();
            return (
              <button
                key={reg.name}
                onClick={() => setSelectedRegion(reg.name)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${reg.color}`} />
                <span>Région {reg.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Pharmacy Grid for Selected Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredPharmacies.length > 0 ? (
            filteredPharmacies.map((p) => {
              const isGuard = p.status === 'DE_GARDE' || p.isGuardToday;
              return (
                <div
                  key={p.id}
                  className="bg-slate-50 border border-slate-200 hover:border-emerald-500 p-4 rounded-2xl space-y-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{p.name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{p.city} ({p.quarter}) • Région {p.region}</span>
                      </p>
                    </div>
                    {isGuard ? (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs shrink-0">
                        DE GARDE
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded shrink-0">
                        STANDARD
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Pharmacien :</span>
                      <span className="font-bold text-slate-800">{p.pharmacistInCharge}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Téléphone :</span>
                      <a href={`tel:${p.phone}`} className="font-bold text-emerald-700 hover:underline">
                        {p.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Paiement Mobile :</span>
                      <span className="font-semibold text-slate-700">{p.mobilePayments.join(', ')}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Aucune pharmacie trouvée pour ce filtre.</p>
              <button
                onClick={() => {
                  setSelectedRegion('TOUS');
                  setSearchTerm('');
                }}
                className="mt-3 text-xs font-bold text-emerald-600 underline cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
