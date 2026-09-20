import React, { useState, useRef } from 'react';
import { Pharmacy, Drug, PharmacyDrugStock } from '../../types';
import { 
  X, 
  FileText, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Search, 
  MapPin, 
  Phone, 
  Sparkles, 
  ShoppingBag,
  Upload,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { validateClientFile } from '../../services/clientSecurity';

interface PrescriptionScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugs: Drug[];
  pharmacies: Pharmacy[];
  stocks: PharmacyDrugStock[];
  onSelectPharmacy: (p: Pharmacy) => void;
}

export const PrescriptionScanModal: React.FC<PrescriptionScanModalProps> = ({
  isOpen,
  onClose,
  drugs,
  pharmacies,
  stocks,
  onSelectPharmacy
}) => {
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>(['drug-1', 'drug-2']); // Default Paracétamol + Amoxicilline
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileValidationMessage, setFileValidationMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleDrug = (drugId: string) => {
    if (selectedDrugIds.includes(drugId)) {
      setSelectedDrugIds(selectedDrugIds.filter(id => id !== drugId));
    } else {
      setSelectedDrugIds([...selectedDrugIds, drugId]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateClientFile(file);
    if (!validation.isValid) {
      setFileError(validation.error || 'Fichier non conforme.');
      setFileValidationMessage(null);
      return;
    }

    setFileError(null);
    setIsScanning(true);
    setUploadedFileName(validation.safeName);
    setFileValidationMessage(`Fichier sain vérifié (${validation.sizeMb} Mo) • Conforme APDP`);

    setTimeout(() => {
      setSelectedDrugIds(['drug-1', 'drug-2', 'drug-5']); // Auto match Paracetamol + Amoxicilline + Artemether
      setIsScanning(false);
    }, 900);
  };

  const handleSimulateScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Calculate matching pharmacies that have ALL selected drugs available
  const matchingPharmacies = pharmacies.map(p => {
    const pharmaStocks = stocks.filter(s => s.pharmacyId === p.id);
    
    let availableCount = 0;
    selectedDrugIds.forEach(dId => {
      const st = pharmaStocks.find(s => s.drugId === dId);
      if (st && st.status === 'AVAILABLE') {
        availableCount++;
      }
    });

    const isCompleteMatch = selectedDrugIds.length > 0 && availableCount === selectedDrugIds.length;

    return {
      pharmacy: p,
      availableCount,
      totalRequested: selectedDrugIds.length,
      isCompleteMatch
    };
  }).filter(item => item.availableCount > 0);

  matchingPharmacies.sort((a, b) => b.availableCount - a.availableCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assistant Ordonnance Multi-Médicaments</h3>
              <p className="text-xs text-slate-400">Trouvez la pharmacie qui possède TOUS vos médicaments prescrits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Upload / Photo Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Analyse d'ordonnance sécurisée & vérification anti-malware</span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Sélectionnez ou prenez en photo votre ordonnance. Formats sécurisés : JPG, PNG, WEBP, PDF (Max 5 Mo).
              </p>
              {fileValidationMessage && (
                <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold mt-1.5 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-300/60 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{fileValidationMessage} ({uploadedFileName})</span>
                </div>
              )}
            </div>

            <input 
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              <Upload className={`w-4 h-4 ${isScanning ? 'animate-bounce' : ''}`} />
              <span>{isScanning ? 'Analyse & scan viral...' : uploadedFileName ? 'Changer de fichier' : 'Charger Ordonnance'}</span>
            </button>
          </div>

          {fileError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Select medications checkboxes */}
          <div>
            <label className="block font-bold text-slate-800 text-sm mb-2">
              Médicaments figurant sur votre ordonnance ({selectedDrugIds.length} sélectionnés) :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {drugs.map(d => {
                const isSelected = selectedDrugIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDrug(d.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{d.name}</div>
                      <div className="text-[10px] opacity-75">{d.dci}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Result Matches */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Pharmacies avec disponiblité globale ({matchingPharmacies.length}) :</span>
              <span className="text-emerald-700 text-xs font-semibold">Trier par couverture complète</span>
            </h4>

            {matchingPharmacies.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border text-slate-500">
                Aucun médicament sélectionné ou aucune pharmacie trouvée avec ces stocks.
              </div>
            ) : (
              <div className="space-y-2">
                {matchingPharmacies.map(({ pharmacy, availableCount, totalRequested, isCompleteMatch }) => (
                  <div
                    key={pharmacy.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleteMatch
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/50'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{pharmacy.name}</span>
                        {isCompleteMatch ? (
                          <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-slate-900 stroke-[2.5]" />
                            <span>ORDONNANCE 100% DISPONIBLE</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {availableCount} / {totalRequested} produits
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pharmacy.city} ({pharmacy.quarter}) — {pharmacy.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectPharmacy(pharmacy);
                        }}
                        className="bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors"
                      >
                        Voir Fiche & Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
