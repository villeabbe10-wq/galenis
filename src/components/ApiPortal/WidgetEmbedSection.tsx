import React, { useState } from 'react';
import { Pharmacy } from '../../types';
import { 
  Code2, 
  Copy, 
  Check, 
  Eye, 
  Sliders, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Phone, 
  Navigation, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Globe,
  Radio
} from 'lucide-react';

interface WidgetEmbedSectionProps {
  pharmacies: Pharmacy[];
}

export const WidgetEmbedSection: React.FC<WidgetEmbedSectionProps> = ({ pharmacies }) => {
  const [selectedCity, setSelectedCity] = useState<'lome' | 'kara' | 'sokode' | 'kpalime' | 'all'>('lome');
  const [theme, setTheme] = useState<'light' | 'dark' | 'emerald'>('light');
  const [maxCount, setMaxCount] = useState<number>(3);
  const [showMapBtn, setShowMapBtn] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Filter pharmacies according to selected city
  const filteredPharmacies = pharmacies
    .filter(p => {
      const isDuty = p.status === 'DE_GARDE' || p.isGuardToday;
      if (!isDuty) return false;
      if (selectedCity === 'all') return true;
      if (selectedCity === 'lome') return p.city.toLowerCase().includes('lomé') || p.city.toLowerCase().includes('lome');
      if (selectedCity === 'kara') return p.city.toLowerCase().includes('kara');
      if (selectedCity === 'sokode') return p.city.toLowerCase().includes('sokodé') || p.city.toLowerCase().includes('sokode');
      if (selectedCity === 'kpalime') return p.city.toLowerCase().includes('kpalimé') || p.city.toLowerCase().includes('kpalime');
      return true;
    })
    .slice(0, maxCount);

  const embedUrl = `https://galenis.tg/embed/garde?city=${selectedCity}&theme=${theme}&limit=${maxCount}&gps=${showMapBtn ? '1' : '0'}`;

  const iframeSnippet = `<!-- Widget Pharmacies de Garde Togo par Galenis -->
<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="${maxCount * 95 + 110}" 
  frameborder="0" 
  style="border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);"
  title="Pharmacies de Garde Togo - Galenis"
  loading="lazy"
></iframe>`;

  const scriptSnippet = `<!-- Intégration Dynamique JavaScript Galenis -->
<div 
  id="galenis-garde-widget" 
  data-city="${selectedCity}" 
  data-theme="${theme}" 
  data-limit="${maxCount}">
</div>
<script src="https://cdn.galenis.tg/widget/v1/garde.min.js" async></script>`;

  const reactSnippet = `import { GalenisGuardWidget } from '@galenis/react-widget';

export default function Page() {
  return (
    <GalenisGuardWidget 
      city="${selectedCity}" 
      theme="${theme}" 
      limit={${maxCount}} 
      apiKey="pk_live_your_key_here" 
    />
  );
}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Nouveau • Widget Web Embarquable (Embed)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Affichez les Pharmacies de Garde sur Votre Site Web
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Idéal pour les portails d'information togolais (médias en ligne, radios, blogs), les sites de cliniques, d'hôtels et d'institutions. Vos lecteurs accèdent en permanence aux officines de garde officielles sans quitter votre page.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5">✓ Données synchronisées en temps réel</span>
            <span className="flex items-center gap-1.5">✓ 100% Responsive Mobile</span>
            <span className="flex items-center gap-1.5">✓ Sans maintenance requise</span>
          </div>
        </div>
      </div>

      {/* Grid: Customizer on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-sm uppercase tracking-wide">
              Configuration du Widget
            </h3>
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              Zone géographique / Ville :
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'lome', label: 'Grand Lomé' },
                { id: 'kara', label: 'Kara' },
                { id: 'sokode', label: 'Sokodé' },
                { id: 'kpalime', label: 'Kpalimé' },
                { id: 'all', label: 'Tout le Togo' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCity(c.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    selectedCity === c.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              Thème graphique :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Clair', bg: 'bg-white', text: 'text-slate-800' },
                { id: 'dark', label: 'Sombre', bg: 'bg-slate-900', text: 'text-white' },
                { id: 'emerald', label: 'Médical', bg: 'bg-emerald-800', text: 'text-white' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                    theme === t.id
                      ? 'ring-2 ring-emerald-600 border-emerald-600 font-black'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="block">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Max Items */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black text-slate-700">
              <span>Nombre d'officines affichées :</span>
              <span className="text-emerald-700 font-mono">{maxCount}</span>
            </div>
            <div className="flex items-center gap-3">
              {[2, 3, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxCount(n)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    maxCount === n
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {n} pharmacies
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Map Button */}
          <div className="pt-2">
            <label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showMapBtn}
                onChange={(e) => setShowMapBtn(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Inclure le bouton d'itinéraire GPS Google Maps</span>
            </label>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mentions légales automatiques</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Le widget intègre discrètement la mention d'attribution légale de santé publique Galenis Togo (HealthTech privée).
            </p>
          </div>
        </div>

        {/* RIGHT: Live Interactive Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  Aperçu Interactif en Direct
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                Rendu Réel
              </span>
            </div>

            {/* SIMULATED EMBEDDED WIDGET CONTAINER */}
            <div 
              className={`rounded-2xl border transition-all p-4 sm:p-5 shadow-md ${
                theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white' 
                  : theme === 'emerald'
                  ? 'bg-emerald-900 border-emerald-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Widget Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                    +
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-tight">
                      Pharmacies de Garde • {selectedCity === 'all' ? 'Togo' : selectedCity.toUpperCase()}
                    </h4>
                    <span className="text-[10px] opacity-70 block font-medium">
                      Disponibilité certifiée 24h/24
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EN DIRECT
                </span>
              </div>

              {/* Pharmacies List */}
              <div className="space-y-2.5">
                {filteredPharmacies.length > 0 ? (
                  filteredPharmacies.map((p, idx) => (
                    <div 
                      key={p.id} 
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        theme === 'dark'
                          ? 'bg-slate-900/90 border-slate-800'
                          : theme === 'emerald'
                          ? 'bg-emerald-950/60 border-emerald-700/60'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black">{p.name}</span>
                        </div>
                        <p className="text-[11px] opacity-75 ml-5">
                          {p.city} ({p.quarter}) — {p.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, '')}`}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{p.phone}</span>
                        </a>

                        {showMapBtn && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded-lg border text-[11px] font-medium flex items-center ${
                              theme === 'dark' || theme === 'emerald'
                                ? 'border-white/20 text-white hover:bg-white/10'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                            title="Itinéraire GPS"
                          >
                            <Navigation className="w-3 h-3 text-emerald-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs opacity-70">
                    Aucune officine de garde enregistrée sur cette sélection.
                  </div>
                )}
              </div>

              {/* Widget Footer Attributon */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] opacity-60">
                <span>Fourni par Galenis Togo (HealthTech privée)</span>
                <a 
                  href="https://galenis.tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold underline hover:opacity-100"
                >
                  Voir toutes les gardes
                </a>
              </div>
            </div>
          </div>

          {/* CODE SNIPPETS EXPORT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Codes d'Intégration Prêts à Copier</span>
            </h3>

            {/* Option 1: Iframe HTML (Universal) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>1. Balise IFRAME HTML (Recommandé pour tout site / CMS) :</span>
                <button
                  type="button"
                  onClick={() => handleCopy(iframeSnippet, 'iframe')}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'iframe' ? 'Copié !' : 'Copier le code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {iframeSnippet}
              </pre>
            </div>

            {/* Option 2: Script JS */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>2. Balise SCRIPT JavaScript (Chargement Asynchrone) :</span>
                <button
                  type="button"
                  onClick={() => handleCopy(scriptSnippet, 'script')}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedType === 'script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'script' ? 'Copié !' : 'Copier le script'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {scriptSnippet}
              </pre>
            </div>

            {/* Option 3: React */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>3. Composant React / Next.js :</span>
                <button
                  type="button"
                  onClick={() => handleCopy(reactSnippet, 'react')}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedType === 'react' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'react' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {reactSnippet}
              </pre>
            </div>

          </div>

        </div>

      </div>

      {/* Guide Complet pour les Médias, Webmasters & Portails Partenaires */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Guide Partenaires Médias, Développeurs & Webmasters</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Tout savoir sur l'intégration du Widget « Pharmacies de Garde Togo »
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Offrez un service d'utilité publique indispensable à vos lecteurs togolais en moins de 2 minutes de configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Item 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              1
            </div>
            <h4 className="font-extrabold text-slate-900">
              Forte Audience & Utilité Citoyenne
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Plus de 15 000 recherches de pharmacies sont effectuées chaque weekend au Togo. Intégrer ce widget sur votre portail d'information fidélise vos visiteurs en leur apportant une réponse immédiate.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
              2
            </div>
            <h4 className="font-extrabold text-slate-900">
              Compatible Tous CMS (WordPress, Joomla, etc.)
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Que votre site tourne sous WordPress, Drupal, Webflow ou du HTML pur, le bloc iframe s'insère en un simple copier-coller dans votre barre latérale (sidebar), votre pied de page ou un article dédié.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              3
            </div>
            <h4 className="font-extrabold text-slate-900">
              Zéro Maintenance Manuelle
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Les données sont synchronisées en direct avec l'annuaire certifié par l'Ordre des Pharmaciens (ONPT). Les tours de garde basculent automatiquement chaque semaine sans que vous n'ayez à toucher au code.
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              4
            </div>
            <h4 className="font-extrabold text-slate-900">
              Léger, Rapide & Sans Impact SEO
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Le widget charge de façon asynchrone depuis un CDN haute performance d'Afrique de l'Ouest (moins de 18 Ko). Il ne ralentit pas l'affichage de votre page et préserve votre score Google Core Web Vitals.
            </p>
          </div>
        </div>

        {/* Use cases callout */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-emerald-950 font-medium">
              <strong>Cas d'usage recommandés :</strong> Sites de presse togolaise, portails de communes, intranets de cliniques privées, sites d'hôtels pour les touristes et résidents étrangers.
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
            Gratuit pour les médias partenaires
          </span>
        </div>
      </div>

    </div>
  );
};
