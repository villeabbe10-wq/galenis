import React, { useState } from 'react';
import { LionIcon } from './LionIcon';
import { 
  Check, 
  Code2, 
  Key, 
  Play, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  ChevronRight, 
  Send, 
  Eye, 
  EyeOff, 
  Sparkles,
  Terminal,
  Users,
  Pill,
  Building2,
  FlaskConical,
  Activity
} from 'lucide-react';
import { TogoFlag } from './TogoEmblems';
import { PaymentModal } from './PaymentModal';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface DeveloperOnboardingWizardProps {
  initialTier?: 'FREE_CITIZEN' | 'FREE_OFFICINE' | 'DEV_API' | 'INSTITUTIONAL';
  onCompleteToApiPortal?: () => void;
}

export const DeveloperOnboardingWizard: React.FC<DeveloperOnboardingWizardProps> = ({
  initialTier = 'DEV_API',
  onCompleteToApiPortal
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  
  // Step 1: Offer Tier
  const [selectedTier, setSelectedTier] = useState<'FREE_CITIZEN' | 'FREE_OFFICINE' | 'DEV_API' | 'INSTITUTIONAL'>(initialTier);
  
  // Step 2: Integration Details
  const [projectName, setProjectName] = useState<string>('LomeHealth-MobileApp');
  const [organization, setOrganization] = useState<string>('MedTech Togo');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['pharmacies:read', 'gardes:read', 'medications:read']);
  
  // Step 3: Environment
  const [environment, setEnvironment] = useState<'sandbox' | 'live'>('sandbox');
  const [corsDomain, setCorsDomain] = useState<string>('https://app.medtech.tg');

  // Step 4: Key Generation
  const [generatedKey, setGeneratedKey] = useState<string>('pdt_test_9a8b7c6d5e4f3a2b1c0d');
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);
  
  // Step 5: Tester State
  const [testerEndpoint, setTesterEndpoint] = useState<string>('/api/v1/pharmacies/garde?city=Lome');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);

  // Step 6: Code Generation
  const [codeLanguage, setCodeLanguage] = useState<'js' | 'python' | 'curl' | 'flutter' | 'php'>('js');

  // Utility copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  // AI Assistant Chat State
  const [aiCustomQuestion, setAiCustomQuestion] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'AI' | 'DEV'; text: string; time: string }>>([
    {
      sender: 'AI',
      text: "Bonjour ! Je suis Galenis AI Developer. Je vous accompagne pas-à-pas à travers chaque étape de votre intégration API. À quelle étape souhaitez-vous des conseils ?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const stepsList: Array<{ id: OnboardingStep; title: string; label: string }> = [
    { id: 1, title: '1. Tarifs', label: 'Offre' },
    { id: 2, title: '2. Intégration', label: 'Projet' },
    { id: 3, title: '3. Environnement', label: 'Env' },
    { id: 4, title: '4. Clé API', label: 'Clé' },
    { id: 5, title: '5. Tester API', label: 'Test' },
    { id: 6, title: '6. Code', label: 'Générateur' },
    { id: 7, title: '7. Production', label: 'Live' },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleGenerateKey = () => {
    const prefix = environment === 'sandbox' ? 'pdt_test_' : 'pdt_live_';
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const key = prefix + randomHex;
    setGeneratedKey(key);
  };

  const handleRunApiTest = () => {
    setIsTesting(true);
    setTestResponse(null);
    setTestLatency(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestLatency(28);
      setTestResponse({
        status: "success",
        timestamp: new Date().toISOString(),
        environment: environment,
        region: "Maritime",
        total_pharmacies_garde: 12,
        data: [
          {
            id: "pharma-01",
            name: "Pharmacie Tokoin Sante",
            city: "Lomé",
            quarter: "Tokoin Nifidji",
            phone: "+228 90 12 34 56",
            status: "DE_GARDE",
            reliability_level: "VERIFIED_TODAY",
            guard_hours: "24h/24",
            lat: 6.1372,
            lng: 1.2125
          },
          {
            id: "pharma-02",
            name: "Pharmacie Agoe Nyive",
            city: "Lomé",
            quarter: "Agoè Assiyéyé",
            phone: "+228 91 98 76 54",
            status: "DE_GARDE",
            reliability_level: "VERIFIED_TODAY",
            guard_hours: "24h/24",
            lat: 6.2051,
            lng: 1.2004
          }
        ],
        rate_limit: {
          limit_per_month: selectedTier === 'INSTITUTIONAL' ? 500000 : 10000,
          remaining: selectedTier === 'INSTITUTIONAL' ? 499982 : 9982,
          reset_in_seconds: 2592000
        }
      });
    }, 600);
  };

  const getCodeSnippet = () => {
    const baseUrl = environment === 'sandbox' ? 'https://sandbox.api.galenis.tg' : 'https://api.galenis.tg';
    
    switch (codeLanguage) {
      case 'js':
        return `// Installation: npm install axios
import axios from 'axios';

const GALENIS_API_KEY = '${generatedKey}';

async function getPharmaciesDeGarde() {
  try {
    const response = await axios.get('${baseUrl}${testerEndpoint}', {
      headers: {
        'X-API-Key': GALENIS_API_KEY,
        'Accept': 'application/json'
      }
    });

    console.log("Pharmacies de garde à Lomé:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur API Galenis:", error.response?.data || error.message);
  }
}

getPharmaciesDeGarde();`;

      case 'python':
        return `# Installation: pip install requests
import requests

API_KEY = "${generatedKey}"
URL = "${baseUrl}${testerEndpoint}"

headers = {
    "X-API-Key": API_KEY,
    "Accept": "application/json"
}

response = requests.get(URL, headers=headers)

if response.status_code == 200:
    data = response.json()
    print("Pharmacies trouvées:", len(data.get("data", [])))
    for p in data.get("data", []):
        print(f"• {p['name']} ({p['quarter']}) - Tel: {p['phone']}")
else:
    print("Erreur:", response.status_code, response.text)`;

      case 'curl':
        return `curl -X GET "${baseUrl}${testerEndpoint}" \\
  -H "X-API-Key: ${generatedKey}" \\
  -H "Accept: application/json"`;

      case 'flutter':
        return `import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> fetchPharmaciesGarde() async {
  final url = Uri.parse('${baseUrl}${testerEndpoint}');
  
  final response = await http.get(
    url,
    headers: {
      'X-API-Key': '${generatedKey}',
      'Accept': 'application/json',
    },
  );

  if (response.statusCode == 200) {
    final body = json.decode(response.body);
    print('Pharmacies chargées: \${body["data"].length}');
  } else {
    throw Exception('Échec de la requête: \${response.statusCode}');
  }
}`;

      case 'php':
        return `<?php
$apiKey = "${generatedKey}";
$url = "${baseUrl}${testerEndpoint}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: " . $apiKey,
    "Accept: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    print_r($data['data']);
} else {
    echo "Erreur HTTP " . $httpCode;
}`;
    }
  };

  const handleSendAiQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiCustomQuestion.trim()) return;

    const userText = aiCustomQuestion;
    setAiCustomQuestion('');

    const newMsgs = [
      ...aiChatMessages,
      { sender: 'DEV' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setAiChatMessages(newMsgs);

    setTimeout(() => {
      let aiReply = "Avez-vous besoin d'aide pour générer la clé ou pour intégrer les en-têtes HTTP X-API-Key ?";
      const lower = userText.toLowerCase();

      if (lower.includes('cle') || lower.includes('clé') || lower.includes('key')) {
        aiReply = `Pour l'environnement ${environment.toUpperCase()}, la clé courante est ${generatedKey}. Elle doit être fournie dans le header HTTP 'X-API-Key'.`;
      } else if (lower.includes('prix') || lower.includes('tarif') || lower.includes('gratuit')) {
        aiReply = "L'API Galenis Togo propose un quota gratuit de 10 000 requêtes/mois pour tous les développeurs et startups locales, sans carte bancaire requise !";
      } else if (lower.includes('garde') || lower.includes('pharmacie')) {
        aiReply = "L'endpoint GET /api/v1/pharmacies/garde filtre directement les pharmacies de garde par ville (ex: Lomé, Kara, Sokodé) avec un niveau de fiabilité certifié (verified).";
      } else if (lower.includes('flutter') || lower.includes('react') || lower.includes('python')) {
        aiReply = "Vous pouvez basculer à l'Étape 6 (Code) pour copier le code source prêt à l'emploi dans votre langage favori.";
      }

      setAiChatMessages(prev => [
        ...prev,
        { sender: 'AI', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 400);
  };

  const renderAiContextualAdvice = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Si vous êtes développeur indépendant, étudiant ou startup togolaise, l'offre <strong>Développeur & Startup API</strong> (10 000 req/mois gratuites) est idéale pour concevoir et tester votre prototype.</span>
          </>
        );
      case 2:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Pour le projet <strong>{projectName}</strong>, les 3 scopes par défaut (<code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">pharmacies:read</code>, <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">gardes:read</code>, <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">medications:read</code>) couvrent 95% des besoins.</span>
          </>
        );
      case 3:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Démarrez toujours en <strong>Sandbox (Test)</strong>. Les données y sont identiques au format de production mais vous n'impactez pas vos métriques en direct.</span>
          </>
        );
      case 4:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Votre clé <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px] font-mono">{generatedKey}</code> est générée. Stockez-la dans votre fichier <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px] font-mono">.env</code> sous la variable <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px] font-mono">GALENIS_API_KEY</code>.</span>
          </>
        );
      case 5:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Cliquez sur "Exécuter la requête". L'API répond en moins de 30ms avec les pharmacies de garde géolocalisées et leur statut certifié.</span>
          </>
        );
      case 6:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Le code généré inclut automatiquement votre clé <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px] font-mono">{generatedKey}</code> et gère l'en-tête <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px] font-mono">X-API-Key</code>.</span>
          </>
        );
      case 7:
        return (
          <>
            <span className="inline-flex items-center gap-1 font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px] mr-1.5 border border-indigo-200">
              <LionIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conseil Galenis AI</span>
            </span>
            <span>Bravo ! Votre chaîne d'intégration est complète. Votre application <strong>{projectName}</strong> peut basculer en production en toute sécurité.</span>
          </>
        );
    }
  };

  return (
    <div className="bg-[#F7F9FC] text-slate-900 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Pipeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-[#DDF7EE] text-emerald-800 border border-[#00A878]/30 mb-2">
            <Zap className="w-3.5 h-3.5 text-[#00A878]" />
            <span>PARCOURS DÉVELOPPEUR & INTÉGRATION PAS-À-PAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#17324D] flex items-center gap-2">
            <span>De l'Offre Tarifaire à la Mise en Production</span>
          </h2>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1 font-medium">
            Choisissez votre offre, configurez votre environnement, testez l'API et générez votre code avec l'accompagnement permanent de <strong className="text-emerald-800">Galenis AI Developer</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white border border-[#00A878]/30 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <Bot className="w-5 h-5 text-[#00A878]" />
            <div className="text-[11px]">
              <div className="font-extrabold text-[#17324D]">Galenis AI</div>
              <div className="text-[#00A878] font-mono text-[10px] font-bold">Co-Pilot Actif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicators Bar */}
      <div className="relative z-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center min-w-max gap-1 sm:gap-2">
          {stepsList.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setCurrentStep(st.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00A878] text-white font-black shadow-md scale-102 ring-2 ring-[#00A878]/40'
                      : isCompleted
                      ? 'bg-[#DDF7EE] text-emerald-800 border border-[#00A878]/30 hover:bg-[#DDF7EE]/80'
                      : 'bg-white text-[#64748B] border border-slate-200 hover:text-[#17324D] hover:border-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isActive
                      ? 'bg-white text-[#00A878] font-extrabold'
                      : isCompleted
                      ? 'bg-[#00A878] text-white font-extrabold'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3 text-slate-900 stroke-[3]" /> : st.id}
                  </span>
                  <span>{st.title}</span>
                </button>

                {st.id < 7 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Step Content + AI Assistant Co-Pilot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* Left Column (8 cols): Active Step Wizard Panel */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: TARIFS & CHOIX DE L'OFFRE */}
          {currentStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 1 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Sélectionner votre Offre & Niveau d'Accès</h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Accès instantané sans CB
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Option 1: Citizen */}
                <div 
                  onClick={() => setSelectedTier('FREE_CITIZEN')}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    selectedTier === 'FREE_CITIZEN'
                      ? 'bg-emerald-50/80 border-2 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600 stroke-[2.25]" />
                      <span>Citoyen & Public</span>
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">0 FCFA</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Consultation directe web des pharmacies de garde, cartes GPS et numéros d'urgence.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    • Sans création de compte obligatoire
                  </div>
                </div>

                {/* Option 2: Officine */}
                <div 
                  onClick={() => setSelectedTier('FREE_OFFICINE')}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    selectedTier === 'FREE_OFFICINE'
                      ? 'bg-emerald-50/80 border-2 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-600 stroke-[2.25]" />
                      <span>Officine</span>
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">0 FCFA / Pro 5k</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Référencement national gratuit, déclaration des gardes, avec option Galenis Pro à 5 000 FCFA/mois.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    • Inscription réservée aux pharmaciens
                  </div>
                </div>

                {/* Option 3: Developer API (Recommended) */}
                <div 
                  onClick={() => setSelectedTier('DEV_API')}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                    selectedTier === 'DEV_API'
                      ? 'bg-emerald-50/90 border-2 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    Recommandé Devs
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 stroke-[2.25]" />
                      <span>Developer API Production</span>
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      5 000 FCFA/mois
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    10 000 req/mois en Production. Sandbox de test gratuit (1 000 req/mois) pour prototyper.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-bold font-mono">
                    • Clé API Live + Assistant AI (500/mois)
                  </div>
                </div>

                {/* Option 4: Institutional */}
                <div 
                  onClick={() => setSelectedTier('INSTITUTIONAL')}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    selectedTier === 'INSTITUTIONAL'
                      ? 'bg-purple-50/80 border-2 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-600 stroke-[2.25]" />
                      <span>Institutionnel & Santé</span>
                    </span>
                    <span className="text-xs font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                      300 000 FCFA/an
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Interconnexion logicielle pour hôpitaux & assureurs. 500 000 req/mois, SLA 99,9% & support VIP.
                  </p>
                  <div className="text-[10px] text-purple-800 font-bold font-mono">
                    • 500 000 requêtes / mois + Support VIP
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (selectedTier === 'DEV_API' || selectedTier === 'INSTITUTIONAL') {
                      setShowPaymentModal(true);
                    } else {
                      setCurrentStep(2);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Valider l'offre & Passer à l'intégration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INTÉGRATION DU PROJET */}
          {currentStep === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 2 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Configurer l'Application & les Scopes API</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Offre choisie : <strong className="text-emerald-700">{selectedTier}</strong></span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-700">Nom de votre Projet / Application *</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="ex: LomeHealth-App"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-700">Organisation / Entreprise *</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="ex: MedTech Togo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="font-extrabold text-slate-700">Permissions & Scopes d'Accès Demandés :</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'pharmacies:read', label: 'Pharmacies & GPS', desc: 'Lecture de la liste et localisation' },
                      { id: 'gardes:read', label: 'Planning des Gardes', desc: 'Accès aux gardes 24h/24 nationales' },
                      { id: 'medications:read', label: 'Tarifs Médicaments', desc: 'Prix homologués du Ministère' },
                    ].map((sc) => {
                      const isChecked = selectedScopes.includes(sc.id);
                      return (
                        <div 
                          key={sc.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedScopes(selectedScopes.filter(s => s !== sc.id));
                            } else {
                              setSelectedScopes([...selectedScopes, sc.id]);
                            }
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                            isChecked 
                              ? 'bg-emerald-50/90 border-emerald-500 text-slate-900' 
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between font-extrabold text-xs">
                            <span className={isChecked ? 'text-emerald-900' : 'text-slate-700'}>{sc.label}</span>
                            {isChecked && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">{sc.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Créer l'environnement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENVIRONNEMENT */}
          {currentStep === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 3 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Choisir l'Environnement d'Exécution</h3>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold">Projet : {projectName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Sandbox */}
                <div
                  onClick={() => setEnvironment('sandbox')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    environment === 'sandbox'
                      ? 'bg-amber-50/90 border-2 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-amber-600 stroke-[2.25]" />
                      <span>Sandbox (Test)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-bold">
                      Recommandé pour démarrer
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Données de test complètes (221 pharmacies togolaises simulées). Idéal pour développer et valider sans consommer votre quota de production.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl font-mono text-[10px] text-amber-800 border border-amber-200 font-bold">
                    https://sandbox.api.galenis.tg/v1
                  </div>
                </div>

                {/* Production */}
                <div
                  onClick={() => setEnvironment('live')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    environment === 'live'
                      ? 'bg-emerald-50/90 border-2 border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 text-sm flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600 stroke-[2.25]" />
                      <span>Production (Live)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      Données officielles
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Flux national en direct synchronisé avec les déclarations officielles des officines de garde sur l'ensemble du territoire national.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl font-mono text-[10px] text-emerald-800 border border-emerald-200 font-bold">
                    https://api.galenis.tg/v1
                  </div>
                  <div className="text-[10px] text-emerald-800 bg-emerald-100/70 p-2 rounded-lg border border-emerald-200 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dossier de fiabilité (RCCM/NIF, Charte données) requis pour l'activation Live</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-extrabold text-slate-700">Domaine autorisé pour requêtes CORS (Optionnel)</label>
                <input
                  type="text"
                  value={corsDomain}
                  onChange={(e) => setCorsDomain(e.target.value)}
                  placeholder="ex: https://monapplication.tg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => {
                    handleGenerateKey();
                    setCurrentStep(4);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Générer ma clé API</span>
                  <Key className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: OBTENIR LA CLÉ */}
          {currentStep === 4 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 4 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Clé API Générée & Prête</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Environnement: {environment.toUpperCase()}
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-emerald-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">Votre Clé d'Accès Sécurisée (<code className="font-mono text-emerald-800">X-API-Key</code>)</span>
                  <button
                    onClick={handleGenerateKey}
                    className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regénérer</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm text-emerald-900 font-bold flex items-center justify-between shadow-xs">
                    <span>
                      {isKeyVisible ? generatedKey : `${generatedKey.slice(0, 8)}${'•'.repeat(20)}`}
                    </span>
                    <button
                      onClick={() => setIsKeyVisible(!isKeyVisible)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-2"
                      title={isKeyVisible ? "Masquer la clé" : "Afficher la clé"}
                    >
                      {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(generatedKey, 'key')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                  >
                    {copiedText === 'key' ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span className="text-xs">Copiée !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 pt-1 font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Conseil de sécurité de Galenis AI :</span>
                  </div>
                  <p>Incorporez cette clé dans l'en-tête HTTP : <code className="bg-emerald-100 text-emerald-900 font-mono px-1.5 py-0.5 rounded font-bold">X-API-Key: {generatedKey}</code></p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => {
                    handleRunApiTest();
                    setCurrentStep(5);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Tester la clé en direct</span>
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TESTER L'API */}
          {currentStep === 5 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 5 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Tester un Endpoint REST en Direct</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Sandbox REST Active
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-2.5 rounded-xl font-mono font-extrabold flex items-center shrink-0">
                    GET
                  </span>
                  <input
                    type="text"
                    value={testerEndpoint}
                    onChange={(e) => setTesterEndpoint(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-emerald-900 font-bold focus:border-emerald-500 outline-none"
                  />
                  <button
                    onClick={handleRunApiTest}
                    disabled={isTesting}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    {isTesting ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        <span>Exécution...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Exécuter</span>
                      </>
                    )}
                  </button>
                </div>

                {/* API Response Output Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="font-bold text-slate-900">Résultat HTTP</span>
                      {testLatency && <span className="text-emerald-400 text-[10px]">({testLatency} ms)</span>}
                    </div>
                    {testResponse && (
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                        200 OK
                      </span>
                    )}
                  </div>

                  <pre className="text-[11px] text-emerald-300 overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-800">
                    {testResponse 
                      ? JSON.stringify(testResponse, null, 2)
                      : "// Cliquez sur 'Exécuter' pour tester l'appel d'API avec votre clé d'accès."}
                  </pre>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Générer le Code Source</span>
                  <Code2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: GÉNÉRER DU CODE */}
          {currentStep === 6 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 6 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Générateur de Code Source Prêt à l'Emploi</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">Clé pré-injectée</span>
              </div>

              {/* Language Selection Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                {[
                  { id: 'js', name: 'Node.js / JS' },
                  { id: 'python', name: 'Python' },
                  { id: 'flutter', name: 'Flutter / Dart' },
                  { id: 'curl', name: 'cURL' },
                  { id: 'php', name: 'PHP' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setCodeLanguage(lang.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      codeLanguage === lang.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* Code Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-800/80">
                  <span>Snippet auto-configuré avec votre clé `{generatedKey.slice(0, 10)}...`</span>
                  <button
                    onClick={() => handleCopy(getCodeSnippet(), 'code')}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'code' ? 'Copié !' : 'Copier le code'}</span>
                  </button>
                </div>

                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2 leading-relaxed">
                  {getCodeSnippet()}
                </pre>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Valider le passage en Production</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: PASSER EN PRODUCTION */}
          {currentStep === 7 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Étape 7 / 7</span>
                  <h3 className="text-lg font-extrabold text-slate-900">Intégration Terminée & Prête pour la Production !</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs px-3 py-1 rounded-full border border-emerald-300 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Statut : LIVE READY
                </span>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-300 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Félicitations, votre projet est prêt !</h4>
                    <p className="text-xs text-slate-600 font-medium">
                      L'application <strong className="text-emerald-900">{projectName}</strong> de <strong className="text-emerald-900">{organization}</strong> est configurée avec succès sur le réseau Galenis Togo.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 font-bold">Environnement</div>
                    <div className="font-extrabold text-emerald-800 uppercase">{environment}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 font-bold">Quota Mensuel</div>
                    <div className="font-extrabold text-slate-900">10 000 requêtes / mois</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 font-bold">Support Co-Pilot</div>
                    <div className="font-extrabold text-emerald-800">Galenis AI</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                >
                  Recommencer le parcours
                </button>

                {onCompleteToApiPortal && (
                  <button
                    onClick={onCompleteToApiPortal}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md w-full sm:w-auto"
                  >
                    <span>Ouvrir le Portail API Complet & Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Permanent Galenis AI Developer Assistant Co-Pilot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between h-full min-h-[480px]">
            
            {/* Header */}
            <div className="space-y-3 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900">Galenis AI Developer</div>
                    <div className="text-[10px] text-emerald-700 font-mono font-extrabold">Assistant Co-Pilot Intégration</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Dynamic Step Contextual Advice Box (NO RAW ASTERISKS) */}
              <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed font-sans shadow-xs">
                {renderAiContextualAdvice()}
              </div>
            </div>

            {/* AI Assistant Conversation Stream */}
            <div className="space-y-3 my-2 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-200 pr-1 text-xs">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl space-y-1 ${
                    msg.sender === 'AI'
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-emerald-100/90 border border-emerald-300 text-emerald-950 ml-4 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      {msg.sender === 'AI' ? (
                        <>
                          <Bot className="w-3 h-3 text-indigo-600 stroke-[2.25]" />
                          <span>Galenis AI</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-3 h-3 text-slate-600 stroke-[2.25]" />
                          <span>Vous</span>
                        </>
                      )}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-normal font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-mono text-slate-500 font-bold">Questions fréquentes AI :</div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {[
                  "Comment stocker ma clé ?",
                  "Prix de l'API ?",
                  "Exemple Flutter ?"
                ].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAiCustomQuestion(chip);
                    }}
                    className="bg-slate-50 hover:bg-slate-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer font-mono font-extrabold"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Custom Question Form */}
              <form onSubmit={handleSendAiQuestion} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={aiCustomQuestion}
                  onChange={(e) => setAiCustomQuestion(e.target.value)}
                  placeholder="Posez une question à l'IA..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  title="Envoyer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
      
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          setCurrentStep(2);
        }}
        planName={selectedTier === 'DEV_API' ? 'Developer API Production' : 'Institutionnel & Santé'}
        amountFcfa={selectedTier === 'DEV_API' ? 5000 : 300000}
      />
    </div>
  );
};
