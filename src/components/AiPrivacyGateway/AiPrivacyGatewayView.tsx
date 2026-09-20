import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  BrainCircuit, 
  RefreshCw, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Key, 
  ExternalLink,
  Pill,
  Thermometer,
  HeartPulse,
  Info,
  Bot,
  Heart
} from 'lucide-react';
import { TogoLionIcon } from '../TogoEmblems';
import galenisMascotImg from '../../assets/images/galenis_assistant_mascot.jpg';

interface PresetOption {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'malaria',
    title: 'Paludisme & Fièvre Aiguë (Lomé)',
    category: 'Fièvre & Paludisme',
    icon: <Thermometer className="w-4 h-4 text-amber-500" />,
    content: `Patient : M. Koffi Mensah (42 ans)
Contact : +228 90 23 45 67
Email : koffi.mensah.tg@email.com
N° Assuré INAM : TG-987452-A
Prescripteur : Dr. Améganvi (Clinique des Cocotiers, Lomé)

Prescription Médicale :
1. Coartem (Artéméther 20mg / Luméfantrine 120mg) : 4 comprimés en 1 prise, renouvelé à H8, puis matin et soir pendant 2 jours (Total 6 prises, avec aliment gras).
2. Paracétamol 1000mg : 1 comprimé toutes les 6 à 8 heures si fièvre > 38.5°C (max 3g/24h).
3. SRO (Sels de Réhydratation Orale) : 1 sachet dans 1L d'eau minérale à boire sur la journée.

Diagnostic : Accès palustre non compliqué à Plasmodium falciparum.`
  },
  {
    id: 'interaction',
    title: 'Interaction Médicamenteuse (Anti-inflammatoire)',
    category: 'Vérification & Sécurité',
    icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    content: `Patient : M. Kodjo Agbeko (66 ans)
Téléphone : +228 91 44 55 66
N° INAM : TG-445891-B
Prescripteur : Dr. Kponton

Antécédents : Fibrillation auriculaire appareillée, Arthrose du genou.
Traitement au long cours : Sintrom 4mg (Acénocoumarol) 1/2 comprimé le soir (INR cible 2.5).

Nouvelle Prescription (pour douleur lombaire aiguë) :
1. Bi-Prophénid 150mg (Kétoprofène) : 1 comprimé matin et soir pendant 5 jours.
2. Tramadol 50mg : 1 gélule si douleur persistante.`
  },
  {
    id: 'chronic',
    title: 'Tension & Diabète (Traitement Quotidien)',
    category: 'Maladies Chroniques',
    icon: <HeartPulse className="w-4 h-4 text-blue-500" />,
    content: `Patiente : Mme Akouvi Dosseh (58 ans)
Contact : +228 92 88 77 66
Email : akouvi.dosseh@togo-sante.tg
Prescripteur : Dr. Lawson (CHU Sylvanus Olympio, Lomé)

Prescription Trimestrielle :
1. Amlodipine 5mg : 1 comprimé chaque matin au réveil.
2. Metformine 850mg : 1 comprimé au milieu des 2 principaux repas (midi et soir).
3. Glimepiride 2mg : 1 comprimé au petit-déjeuner.
4. Atorvastatine 20mg : 1 comprimé au coucher.`
  },
  {
    id: 'pediatric',
    title: 'Ordonnance Toux & Rhume (Enfant)',
    category: 'Pédiatrie & Famille',
    icon: <Pill className="w-4 h-4 text-emerald-500" />,
    content: `Patient : Enfant Mawena (3 ans, Poids : 14 kg)
Contact Parent : +228 99 11 22 33
Email : parent.mawena@gmail.com
Prescripteur : Pr. Sossou (Pédiatrie CHU Campus Lomé)

Prescription :
1. Amoxicilline + Acide Clavulanique 100mg/12.5mg par ml (suspension buvable) : 1 dose-poids (14kg) 3 fois par jour au cours des repas pendant 7 jours.
2. Paracétamol Sirop 2.4% : 1 dose-poids toutes les 6 heures si température > 38.2°C.
3. Sérum physiologique unidoses : Désobstruction rhinopharyngée avant chaque repas.`
  }
];

export function AiPrivacyGatewayView() {
  const [inputText, setInputText] = useState<string>(PRESETS[0].content);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'COMPARISON' | 'PRIVACY_LOGS'>('ANALYSIS');

  const handleSelectPreset = (preset: PresetOption) => {
    setInputText(preset.content);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/ai/analyze-medical-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'pdt_live_free_9876543210'
        },
        body: JSON.stringify({ text: inputText })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Erreur lors de l\'analyse');
      }

      setResult(data.data);
      setActiveTab('ANALYSIS');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion à l\'assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-2 sm:px-4">
      {/* Friendly Welcoming Mascot Header */}
      <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl">
            {/* Mascot Avatar with friendly glow */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/95 p-1 shadow-lg border-2 border-emerald-400/50 flex items-center justify-center overflow-hidden">
                <img 
                  src={galenisMascotImg} 
                  alt="Galenis - Votre assistant santé intelligent" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to public path if needed
                    (e.target as HTMLImageElement).src = '/galenis-assistant-mascot.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-950 flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-extrabold text-emerald-300">
                <TogoLionIcon className="w-3.5 h-3.5 text-emerald-300" />
                <span>Galenis • Votre Assistant Santé Personnel</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Comprenez facilement vos ordonnances
              </h1>
              
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Collez le texte de votre ordonnance pour obtenir des explications simples sur vos médicaments, leurs horaires de prise et les précautions à observer. <strong className="text-emerald-300 font-bold">Vos nom, numéro et identité sont 100% effacés et protégés.</strong>
              </p>
            </div>
          </div>

          {/* Highlights Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-2.5 shrink-0 md:w-64">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Assistant Santé</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Disponible 24h/24
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <span className="text-slate-300">Vie Privée</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> 100% Anonyme
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Adapté au Togo</span>
              <span className="text-white font-bold">Climat & Conseils</span>
            </div>
          </div>
        </div>
      </header>

      {/* Preset Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <TogoLionIcon className="w-4 h-4 text-emerald-600" />
            <span>Exemples prêts à tester :</span>
          </label>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Cliquez sur un exemple pour le charger
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                inputText === preset.content
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                  {preset.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">{preset.category}</div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">{preset.title}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Text */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Votre ordonnance ou vos médicaments</h3>
                <p className="text-[11px] text-slate-500">Collez ou écrivez les noms des médicaments</p>
              </div>
            </div>

            <button
              onClick={() => setInputText('')}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
            >
              Effacer
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-4">
            <div className="relative flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez ou collez ici la liste de vos médicaments ou le texte de l'ordonnance..."
                rows={11}
                className="w-full h-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#00A859] hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>L'assistant prépare vos explications...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Analyser mes médicaments</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Vos données personnelles sont effacées avant toute analyse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Tabs when Result is Available */}
          {result && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveTab('ANALYSIS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ANALYSIS'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Explications & Conseils
                </button>
                <button
                  onClick={() => setActiveTab('COMPARISON')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'COMPARISON'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vérifier l'anonymisation
                </button>
                <button
                  onClick={() => setActiveTab('PRIVACY_LOGS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'PRIVACY_LOGS'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Données masquées ({result.pii_masked_count || 0})
                </button>
              </div>

              <button
                onClick={() => handleCopy(result.llm_analysis, 'ALL')}
                className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                {copiedSection === 'ALL' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier les explications</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty / Initial State */}
          {!isLoading && !result && !error && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 h-full min-h-[380px] flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 p-2 flex items-center justify-center mb-4 border border-emerald-100">
                <img 
                  src={galenisMascotImg} 
                  alt="Galenis" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/galenis-assistant-mascot.jpg';
                  }}
                />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Votre assistant santé vous attend</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
                Sélectionnez un exemple ci-dessus ou collez votre ordonnance à gauche. L'assistant Galenis vous expliquera chaque médicament de façon claire et sans jargon.
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {isLoading && (
            <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[380px]">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 animate-ping opacity-50 absolute inset-0" />
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center relative shadow-lg">
                  <Lock className="w-6 h-6 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-sm font-black text-slate-900">Protection & Analyse en cours</h3>
                <p className="text-xs text-emerald-700 font-medium">1. Effacement automatique de vos données personnelles...</p>
                <p className="text-xs text-slate-600">2. Préparation des explications claires de vos médicaments...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-black text-sm">
                <Activity className="w-5 h-5 text-rose-600" />
                <span>Information</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Active Result Presentation */}
          {result && !isLoading && (
            <AnimatePresence mode="wait">
              {activeTab === 'ANALYSIS' && (
                <motion.div
                  key="tab-analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Security Notice */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{result.pii_masked_count || 0} donnée(s) personnelle(s) masquée(s) pour votre sécurité</span>
                    </div>
                    <span className="text-[11px] bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                      100% Confidentiel
                    </span>
                  </div>

                  {/* Main AI Report */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 p-1 flex items-center justify-center border border-emerald-200">
                          <img 
                            src={galenisMascotImg} 
                            alt="Galenis" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/galenis-assistant-mascot.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">Conseils de l'Assistant Galenis</h4>
                          <p className="text-[11px] text-slate-500">Explications simples de votre traitement</p>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-sans bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-100">
                      {result.llm_analysis}
                    </div>

                    {/* Disclaimer Banner */}
                    <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed text-[11px]">
                        <strong>Rappel santé :</strong> Cet assistant vous aide à mieux comprendre vos médicaments. Ne modifiez jamais votre traitement sans l'accord de votre médecin ou de votre pharmacien d'officine.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'COMPARISON' && (
                <motion.div
                  key="tab-comparison"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Raw Text with Warning */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Texte que vous avez saisi</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">Reste sur votre appareil</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap max-h-80 overflow-y-auto">
                        {inputText}
                      </div>
                    </div>

                    {/* Masked Text */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">Texte après masquage de sécurité</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">100% Anonyme</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 whitespace-pre-wrap max-h-80 overflow-y-auto">
                        {result.anonymized_text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'PRIVACY_LOGS' && (
                <motion.div
                  key="tab-privacy-logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4"
                >
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Détail des informations masquées pour protéger votre identité</span>
                  </h4>

                  {result.pii_detections && result.pii_detections.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {result.pii_detections.map((item: any, idx: number) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{item.type}</span>
                          </div>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                            {item.masked}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Aucune information personnelle (nom, téléphone, identifiant) détectée dans ce texte.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </div>
    </div>
  );
}

