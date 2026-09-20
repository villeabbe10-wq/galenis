import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Building2, 
  Clock, 
  XCircle, 
  ArrowRight,
  RefreshCw,
  Eye,
  Info,
  Layers
} from 'lucide-react';
import { LionIcon } from '../LionIcon';
import { StockImportItem, StockMergeResult, mergeDrugStocks } from '../../services/pharmacyStorage';
import { Pharmacy } from '../../types';

interface StockImportModalProps {
  pharmacy: Pharmacy;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: StockMergeResult) => void;
}

export const StockImportModal: React.FC<StockImportModalProps> = ({
  pharmacy,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeSource, setActiveSource] = useState<'IMAGE' | 'FILE' | 'PASTE'>('IMAGE');
  const [wholesaler, setWholesaler] = useState<string>('CAMEG Togo');
  
  // File & Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Review & Edit state
  const [extractedItems, setExtractedItems] = useState<StockImportItem[]>([]);
  const [step, setStep] = useState<'INPUT' | 'REVIEW' | 'SUCCESS'>('INPUT');
  const [mergeReport, setMergeReport] = useState<StockMergeResult | null>(null);
  const [docSummary, setDocSummary] = useState<string>('');

  if (!isOpen) return null;

  // Handle image or document selection
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setAnalysisError(null);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Launch AI / Document Analysis
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      let imageBase64: string | undefined = undefined;
      let textContent: string | undefined = undefined;
      let mimeType: string = 'image/jpeg';

      if (activeSource === 'IMAGE' && selectedFile) {
        mimeType = selectedFile.type || 'image/jpeg';
        // Read base64
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      } else if (activeSource === 'FILE' && selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
          mimeType = selectedFile.type;
          imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
        } else {
          // Read text
          textContent = await selectedFile.text();
        }
      } else if (activeSource === 'PASTE') {
        if (!pastedText.trim()) {
          setAnalysisError('Veuillez coller la liste de médicaments ou le tableau de stock.');
          setIsAnalyzing(false);
          return;
        }
        textContent = pastedText.trim();
      }

      const response = await fetch('/api/v1/pharmacy/import-stock-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          textContent,
          wholesalerHint: wholesaler,
          pharmacyId: pharmacy.id
        })
      });

      const json = await response.json();

      if (!response.ok || !json.data || !json.data.items) {
        throw new Error(json.error || 'Erreur lors du traitement du document');
      }

      setExtractedItems(json.data.items);
      setDocSummary(json.data.summary || `${json.data.items.length} médicaments identifiés`);
      setStep('REVIEW');
    } catch (err: any) {
      console.error('Import stock analysis error:', err);
      // Fallback: parse text locally or generate default items
      if (activeSource === 'PASTE' && pastedText) {
        const localItems = parseRawText(pastedText);
        setExtractedItems(localItems);
        setDocSummary(`${localItems.length} médicaments extraits du texte`);
        setStep('REVIEW');
      } else {
        setAnalysisError(err.message || 'Impossible d\'analyser le fichier. Vous pouvez utiliser le mode Copier-Coller ou vérifier le format.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Local helper parser for raw text lines
  const parseRawText = (raw: string): StockImportItem[] => {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const result: StockImportItem[] = [];

    for (const line of lines) {
      const parts = line.split(/[,;\t|]+/).map(p => p.trim());
      if (parts.length >= 1) {
        const name = parts[0];
        if (/nom|produit|d[eé]signation/i.test(name)) continue;
        const dci = parts[1] || name;
        const price = parseInt(parts[2]?.replace(/[^0-9]/g, '')) || 1500;
        result.push({
          name,
          dci,
          category: 'Général',
          priceFcfa: price,
          quantity: 20,
          status: 'AVAILABLE'
        });
      }
    }
    return result;
  };

  // Final Commit to Storage (Non-Destructive Merge)
  const handleConfirmMerge = () => {
    if (extractedItems.length === 0) return;

    const result = mergeDrugStocks(pharmacy.id, extractedItems);
    setMergeReport(result);
    setStep('SUCCESS');
    onSuccess(result);
  };

  // Editable table helpers
  const handleUpdateItem = (index: number, field: keyof StockImportItem, value: any) => {
    const updated = [...extractedItems];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setExtractedItems(extractedItems.filter((_, idx) => idx !== index));
  };

  const handleAddBlankItem = () => {
    setExtractedItems([
      ...extractedItems,
      {
        name: '',
        dci: '',
        category: 'Général',
        priceFcfa: 1500,
        quantity: 10,
        status: 'AVAILABLE'
      }
    ]);
  };

  // Sample CSV Download
  const downloadSampleCsv = () => {
    const csvContent = `data:text/csv;charset=utf-8,Nom_Medicament;DCI_Molecule;Categorie;Prix_FCFA;Statut;Quantite
Doliprane 1000mg Comprimés;Paracétamol;Antalgique / Anti-inflammatoire;1500;AVAILABLE;50
Coartem 20/120mg;Artéméther + Luméfantrine;Antipaludéen;2800;AVAILABLE;30
Amoxicilline 500mg Gélules;Amoxicilline;Antibiotique;2200;AVAILABLE;40
Amlodipine 5mg Comprimés;Amlodipine;Antihypertenseur / Cardio;3500;AVAILABLE;20
Insuline Rapide 100 UI/ml;Insuline humaine;Diabète / Insuline;6500;AVAILABLE;15
Efferalgan Vitamine C;Paracétamol + Vit C;Antalgique / Anti-inflammatoire;1800;OUT_OF_STOCK;0`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `modele_import_stock_galenis_${pharmacy.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <LionIcon className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  IA & OCR Officinal Togo
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  {pharmacy.name} ({pharmacy.city})
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Mise à jour Automatique des Stocks
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NON-DESTRUCTIVE MERGE GUARANTEE BANNER */}
        <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 sm:px-6 py-3 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.25]" />
          <div className="font-medium leading-tight">
            <strong className="font-black text-emerald-950">Principe de Fusion Non-Destructive Garanti : </strong>
            Cet import ajoute les nouveaux médicaments et actualise vos prix et disponibilités 
            <span className="font-bold underline decoration-emerald-500 underline-offset-2 ml-1">
              sans jamais supprimer ni écraser les médicaments déjà enregistrés
            </span>.
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: INPUT SOURCE SELECTION */}
          {step === 'INPUT' && (
            <div className="space-y-6">
              
              {/* Wholesaler Context Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Grossiste Répartiteur / Origine du document :</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {['CAMEG Togo', 'Ubipharm Togo', 'Laborex Togo', 'Tedis Pharma', 'COPHARTO', 'Inventaire Interne'].map((ws) => (
                    <button
                      key={ws}
                      type="button"
                      onClick={() => setWholesaler(ws)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        wholesaler === ws
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {ws}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setActiveSource('IMAGE'); setSelectedFile(null); }}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                    activeSource === 'IMAGE'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1. Photo / Facture Grossiste</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveSource('FILE'); setSelectedFile(null); }}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                    activeSource === 'FILE'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>2. Document CSV / Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSource('PASTE')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                    activeSource === 'PASTE'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>3. Copier-Coller Texte</span>
                </button>
              </div>

              {/* SOURCE 1: IMAGE / PHOTO */}
              {activeSource === 'IMAGE' && (
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
                      selectedFile
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative inline-block max-h-56 overflow-hidden rounded-2xl border border-slate-300 shadow-sm">
                          <img
                            src={imagePreview}
                            alt="Aperçu bordereau"
                            className="max-h-56 object-contain mx-auto"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs font-bold text-slate-700">
                            {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} Ko)
                          </span>
                          <button
                            type="button"
                            onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                            className="text-xs text-rose-600 font-bold hover:underline"
                          >
                            Changer d'image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-slate-800">
                            Prenez une photo ou déposez votre bordereau de livraison
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Bordereaux CAMEG, Ubipharm, Laborex, Tedis, COPHARTO ou facture scannée (PNG, JPG, WEBP)
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Sélectionner une photo</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Prendre en photo (Caméra)</span>
                          </button>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        />
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SOURCE 2: FILE CSV / EXCEL */}
              {activeSource === 'FILE' && (
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
                      selectedFile
                        ? 'border-teal-500 bg-teal-50/40'
                        : 'border-slate-300 hover:border-teal-500 bg-slate-50/50'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="space-y-3 py-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div className="font-extrabold text-sm text-slate-800">
                          {selectedFile.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Taille : {Math.round(selectedFile.size / 1024)} Ko • Prêt pour l'extraction
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-xs text-rose-600 font-bold hover:underline"
                        >
                          Sélectionner un autre fichier
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 py-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                          <FileSpreadsheet className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-slate-800">
                            Déposez votre fichier d'inventaire ou bordereau
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Formats acceptés : .CSV, .TXT, .XLSX (séparateur virgule, point-virgule ou tabulation)
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Parcourir mes fichiers</span>
                          </button>

                          <button
                            type="button"
                            onClick={downloadSampleCsv}
                            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-teal-600" />
                            <span>Télécharger modèle CSV</span>
                          </button>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv, .txt, .xlsx, .xls, image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SOURCE 3: PASTE TEXT */}
              {activeSource === 'PASTE' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">
                      Collez vos lignes de produits (Export de logiciel de caisse ou liste de garde) :
                    </label>
                    <button
                      type="button"
                      onClick={() => setPastedText(
`Doliprane 1000mg Comprimés; Paracétamol; 1500; AVAILABLE; 40
Coartem 20/120mg; Artéméther + Luméfantrine; 2800; AVAILABLE; 25
Amoxicilline 1g Comprimés; Amoxicilline; 2500; AVAILABLE; 30
Insuline Rapide 100 UI; Insuline; 6500; AVAILABLE; 10
Paracétamol Sirop 120mg; Paracétamol; 1200; AVAILABLE; 20`
                      )}
                      className="text-emerald-600 font-extrabold hover:underline"
                    >
                      Insérer exemple type Togo
                    </button>
                  </div>
                  <textarea
                    rows={7}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Exemple :&#10;Doliprane 1000mg ; Paracétamol ; 1500 FCFA ; Disponible&#10;Coartem 20/120mg ; Artéméther + Luméfantrine ; 2800 FCFA ; Disponible&#10;Amoxicilline 500mg ; Antibiotique ; 2200 FCFA"
                    className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Error Message */}
              {analysisError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Bottom Action */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  disabled={isAnalyzing || (activeSource !== 'PASTE' && !selectedFile) || (activeSource === 'PASTE' && !pastedText.trim())}
                  onClick={handleAnalyze}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    isAnalyzing || (activeSource !== 'PASTE' && !selectedFile) || (activeSource === 'PASTE' && !pastedText.trim())
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Analyse IA & Extraction en cours...</span>
                    </>
                  ) : (
                    <>
                      <LionIcon className="w-4 h-4 text-emerald-200" />
                      <span>Lancer l'Extraction Officinale</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW & EDIT EXTRACTED ITEMS */}
          {step === 'REVIEW' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wide">
                      Résultat de l'extraction
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {extractedItems.length} Médicaments prêts
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {docSummary || `Produits détectés sur le document ${wholesaler}`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vérifiez ou ajustez les prix et statuts avant d'ajouter ces références au stock de l'officine.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBlankItem}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Ajouter une ligne</span>
                </button>
              </div>

              {/* Interactive Editable Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold sticky top-0 border-b border-slate-200 z-10">
                      <tr>
                        <th className="p-3">Médicament (Nom Commercial)</th>
                        <th className="p-3">DCI / Molécule</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3 w-28">Prix FCFA</th>
                        <th className="p-3 w-36">Statut</th>
                        <th className="p-3 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {extractedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                              placeholder="Nom du médicament..."
                              className="w-full p-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs bg-slate-50/50 focus:bg-white"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={item.dci || ''}
                              onChange={(e) => handleUpdateItem(idx, 'dci', e.target.value)}
                              placeholder="DCI..."
                              className="w-full p-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs bg-slate-50/50 focus:bg-white"
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={item.category || 'Général'}
                              onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                              className="w-full p-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs bg-slate-50/50"
                            >
                              <option value="Antalgique / Anti-inflammatoire">Antalgique</option>
                              <option value="Antibiotique">Antibiotique</option>
                              <option value="Antipaludéen">Antipaludéen</option>
                              <option value="Antihypertenseur / Cardio">Cardio / Tension</option>
                              <option value="Diabète / Insuline">Diabète</option>
                              <option value="Vitamines / Compléments">Vitamines</option>
                              <option value="Général">Général</option>
                            </select>
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={item.priceFcfa || 1000}
                              onChange={(e) => handleUpdateItem(idx, 'priceFcfa', parseInt(e.target.value) || 0)}
                              className="w-24 p-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs text-right bg-slate-50/50 focus:bg-white"
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={item.status || 'AVAILABLE'}
                              onChange={(e) => handleUpdateItem(idx, 'status', e.target.value)}
                              className={`w-full p-1.5 rounded-lg font-bold text-xs border ${
                                item.status === 'AVAILABLE'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : item.status === 'OUT_OF_STOCK'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="AVAILABLE">✓ En Stock</option>
                              <option value="OUT_OF_STOCK">✕ En Rupture</option>
                              <option value="ORDER_POSSIBLE">⏳ Sur Commande</option>
                            </select>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              title="Supprimer cette ligne"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('INPUT')}
                  className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                >
                  ← Recommencer / Charger un autre document
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmMerge}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider & Fusionner dans le Stock ({extractedItems.length})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & MERGE REPORT */}
          {step === 'SUCCESS' && mergeReport && (
            <div className="py-4 space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Stock Mis à Jour avec Succès !
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Les données issues de votre document ont été fusionnées dans l'inventaire officiel de <strong>{pharmacy.name}</strong> sans aucune suppression d'anciennes références.
                </p>
              </div>

              {/* Report Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nouveaux Ajouts</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-900">
                    +{mergeReport.addedCount}
                  </div>
                  <div className="text-[10px] text-emerald-700">Créés au catalogue</div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                    <span>Actualisés</span>
                  </div>
                  <div className="text-2xl font-black text-teal-900">
                    {mergeReport.updatedCount}
                  </div>
                  <div className="text-[10px] text-teal-700">Prix & Statuts mis à jour</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Anciens Préservés</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {mergeReport.unchangedCount}
                  </div>
                  <div className="text-[10px] text-slate-500">100% conservés intacts</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto flex items-center justify-between">
                <span className="font-bold">Total des médicaments enregistrés pour votre officine :</span>
                <span className="font-black text-emerald-700 text-sm">{mergeReport.totalStocksCount} références</span>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all active:scale-98"
                >
                  Fermer & Voir le Stock Officine
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
