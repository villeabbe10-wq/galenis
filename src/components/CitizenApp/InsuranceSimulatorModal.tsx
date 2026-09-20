import React, { useState } from 'react';
import { Drug } from '../../types';
import { TogoFlag } from '../TogoEmblems';
import { 
  X, 
  ShieldCheck, 
  Calculator, 
  Plus, 
  Trash2, 
  Info, 
  CheckCircle2, 
  FileText, 
  Share2, 
  Printer, 
  CreditCard,
  Building2,
  Sparkles,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface InsuranceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugs?: Drug[];
  preselectedDrug?: Drug | null;
}

interface PrescriptionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isCovered: boolean;
}

export const InsuranceSimulatorModal: React.FC<InsuranceSimulatorModalProps> = ({
  isOpen,
  onClose,
  drugs = [],
  preselectedDrug
}) => {
  // Insurance Scheme
  const [scheme, setScheme] = useState<'INAM' | 'CNSS' | 'AMU' | 'PRIVATE' | 'CUSTOM'>('INAM');
  const [isALD, setIsALD] = useState<boolean>(false); // Affection Longue Durée (100% INAM)
  const [privateCompany, setPrivateCompany] = useState<string>('Sunu Assurances');
  const [customCoveragePercent, setCustomCoveragePercent] = useState<number>(80);

  // Prescription Items
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: '1',
      name: preselectedDrug ? preselectedDrug.name : (drugs[0]?.name || 'Coartem 80/480mg (Artéméther/Luméfantrine)'),
      price: 3200,
      quantity: 1,
      isCovered: true
    }
  ]);

  const [selectedDrugToAdd, setSelectedDrugToAdd] = useState<string>(drugs[1]?.id || '');
  const [customDrugName, setCustomDrugName] = useState<string>('');
  const [customDrugPrice, setCustomDrugPrice] = useState<string>('');

  if (!isOpen) return null;

  // Calculate coverage percentage
  let coverageRate = 0.80; // default 80%
  if (scheme === 'INAM') {
    coverageRate = isALD ? 1.00 : 0.80;
  } else if (scheme === 'CNSS') {
    coverageRate = 0.80;
  } else if (scheme === 'AMU') {
    coverageRate = 0.80;
  } else if (scheme === 'PRIVATE' || scheme === 'CUSTOM') {
    coverageRate = customCoveragePercent / 100;
  }

  // Totals
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const coveredBase = items.reduce((acc, item) => item.isCovered ? acc + (item.price * item.quantity) : acc, 0);
  const nonCoveredBase = totalAmount - coveredBase;

  const insuranceShare = Math.round(coveredBase * coverageRate);
  const patientShare = (coveredBase - insuranceShare) + nonCoveredBase;
  const effectiveCoveragePercent = totalAmount > 0 ? Math.round((insuranceShare / totalAmount) * 100) : 0;

  const handleAddItemFromList = () => {
    const d = drugs.find(item => item.id === selectedDrugToAdd);
    if (!d) return;

    // Estimate price based on drug type or default
    const estimatedPrice = d.category === 'ANTIPALUDIQUE' ? 2800 : d.category === 'ANTALGIQUE' ? 800 : d.category === 'ANTIBIOTIQUE' ? 4500 : 3500;

    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: d.name,
        price: estimatedPrice,
        quantity: 1,
        isCovered: true
      }
    ]);
  };

  const handleAddCustomItem = () => {
    if (!customDrugName || !customDrugPrice) return;
    const priceNum = parseInt(customDrugPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) return;

    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: customDrugName,
        price: priceNum,
        quantity: 1,
        isCovered: true
      }
    ]);

    setCustomDrugName('');
    setCustomDrugPrice('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleShareWhatsApp = () => {
    const text = `📋 *SIMULATION REMBOURSEMENT ASSURANCE PHARMACIE (TOGO)*\n` +
      `🏢 *Régime :* ${scheme === 'INAM' ? 'INAM Togo (80%)' : scheme === 'CNSS' ? 'CNSS' : scheme === 'AMU' ? 'AMU' : privateCompany} (Taux: ${Math.round(coverageRate * 100)}%)\n\n` +
      `💊 *Médicaments prescrits :*\n` +
      items.map(i => `• ${i.name} (Qté: ${i.quantity}) : ${(i.price * i.quantity).toLocaleString()} FCFA`).join('\n') +
      `\n\n------------------------\n` +
      `💰 *Total Ordonnance :* ${totalAmount.toLocaleString()} FCFA\n` +
      `🛡️ *Pris en charge Assurance :* ${insuranceShare.toLocaleString()} FCFA (${effectiveCoveragePercent}%)\n` +
      `💳 *Reste à charge Citoyen :* ${patientShare.toLocaleString()} FCFA\n` +
      `\n_Source: Simulateur Galenis Togo (INAM / CNSS / Privé)_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Simulateur de Prise en Charge Assurance
                </h3>
                <TogoFlag className="w-4 h-3 shrink-0 shadow-xs hidden sm:inline-block" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Calcul du tiers-payant et reste à charge (INAM, CNSS, AMU & Assurances Privées au Togo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Step 1: Select Regime */}
          <div className="space-y-3">
            <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Sélectionnez votre organisme ou régime d'assurance :</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setScheme('INAM'); setIsALD(false); }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  scheme === 'INAM'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-xs font-black">INAM Togo</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Agents publics & conventionnés</div>
                <div className="text-[11px] font-extrabold text-emerald-700 mt-1">80% / 100% ALD</div>
              </button>

              <button
                type="button"
                onClick={() => setScheme('CNSS')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  scheme === 'CNSS'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-xs font-black">CNSS Togo</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Salariés du secteur privé</div>
                <div className="text-[11px] font-extrabold text-emerald-700 mt-1">80% Réglementé</div>
              </button>

              <button
                type="button"
                onClick={() => setScheme('AMU')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  scheme === 'AMU'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-xs font-black">Régime AMU</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Assurance Maladie Universelle</div>
                <div className="text-[11px] font-extrabold text-emerald-700 mt-1">80% Solidaire</div>
              </button>

              <button
                type="button"
                onClick={() => setScheme('PRIVATE')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  scheme === 'PRIVATE'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-xs font-black">Assurance Privée</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Sunu, NSIA, Sanlam, Gras Savoye...</div>
                <div className="text-[11px] font-extrabold text-emerald-700 mt-1">{customCoveragePercent}% modulable</div>
              </button>
            </div>

            {/* Scheme specific sub-options */}
            {scheme === 'INAM' && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Affection de Longue Durée (ALD / Pathologie Chronique)</div>
                  <div className="text-[11px] text-slate-500">Ex: Diabète, Hypertension sévère, Drépanocytose (Prise en charge à 100%)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isALD} 
                    onChange={e => setIsALD(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            )}

            {scheme === 'PRIVATE' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">Compagnie / Mutuelle :</label>
                  <select 
                    value={privateCompany} 
                    onChange={e => setPrivateCompany(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
                  >
                    <option value="Sunu Assurances Togo">Sunu Assurances Togo</option>
                    <option value="NSIA Assurances Togo">NSIA Assurances Togo</option>
                    <option value="Sanlam Togo (ex-Saham)">Sanlam Togo (ex-Saham)</option>
                    <option value="GTA Assurances">GTA Assurances</option>
                    <option value="Gras Savoye Togo">Gras Savoye Togo / Willis Towers Watson</option>
                    <option value="Ascoma Togo">Ascoma Togo</option>
                    <option value="Mutuelle d'Entreprise / Autre">Autre Mutuelle / Entreprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                    Taux de couverture du contrat : <strong className="text-emerald-700">{customCoveragePercent}%</strong>
                  </label>
                  <div className="flex items-center gap-1">
                    {[70, 80, 85, 90, 100].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCustomCoveragePercent(pct)}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer border ${
                          customCoveragePercent === pct
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Medication List */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>2. Médicaments de l'ordonnance ({items.length}) :</span>
              </label>

              <span className="text-[11px] text-slate-500">
                Prix officiels réglementés en FCFA
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Prix unitaire: {item.price.toLocaleString()} FCFA</span>
                        <span>•</span>
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.isCovered} 
                            onChange={e => {
                              const checked = e.target.checked;
                              setItems(prev => prev.map(i => i.id === item.id ? { ...i, isCovered: checked } : i));
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>Prise en charge par le régime</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
                          }
                        }}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold text-slate-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                        }}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-extrabold text-slate-900 min-w-[80px] text-right">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add controls */}
            <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-slate-700">Ajouter un autre médicament :</div>
              
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={selectedDrugToAdd}
                  onChange={e => setSelectedDrugToAdd(e.target.value)}
                  className="w-full sm:flex-1 py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-900"
                >
                  <option value="">-- Choisir depuis le catalogue national --</option>
                  {drugs.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddItemFromList}
                  disabled={!selectedDrugToAdd}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Or manual entry */}
              <div className="flex items-center gap-2 pt-1 border-t border-emerald-100 text-[11px]">
                <input
                  type="text"
                  placeholder="Ou saisie libre (ex: Amoxicilline 500mg)"
                  value={customDrugName}
                  onChange={e => setCustomDrugName(e.target.value)}
                  className="flex-1 py-1 px-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="number"
                  placeholder="Prix FCFA"
                  value={customDrugPrice}
                  onChange={e => setCustomDrugPrice(e.target.value)}
                  className="w-24 py-1 px-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  disabled={!customDrugName || !customDrugPrice}
                  className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer"
                >
                  + OK
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Calculation Breakdown Cards - Clean Light Theme */}
          <div className="p-4 sm:p-5 bg-white border-2 border-emerald-200 text-slate-900 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800">
                  Résultat de la Simulation
                </div>
                <div className="text-base font-black text-slate-900">
                  Bilan du Tiers-Payant & Reste à Charge
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-black">
                  Taux appliqué: {Math.round(coverageRate * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Total */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">Montant Total Ordonnance</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{totalAmount.toLocaleString()} FCFA</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">{items.length} médicament(s)</div>
              </div>

              {/* Covered by Insurance */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Prise en charge Assurance</span>
                </div>
                <div className="text-xl font-black text-emerald-900 mt-0.5">{insuranceShare.toLocaleString()} FCFA</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">Économie de {effectiveCoveragePercent}%</div>
              </div>

              {/* Patient Copay */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <div className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reste à payer au comptoir</span>
                </div>
                <div className="text-xl font-black text-amber-900 mt-0.5">{patientShare.toLocaleString()} FCFA</div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">Ticket modérateur citoyen</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="text-[11px] text-slate-500 font-medium">
                Simulation indicative conforme aux barèmes officiels INAM/CNSS Togo.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager sur WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Checklist: Required documents */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Documents obligatoires à présenter au comptoir de la pharmacie :</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Carte d'assuré</strong> en cours de validité (INAM, CNSS ou carte d'assurance privée).</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Ordonnance originale</strong> datant de moins de 3 mois signée par un médecin agréé.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Feuille de soins</strong> dûment remplie par le prescripteur.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bon de prise en charge</strong> (si requis pour votre compagnie d'assurance).</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
