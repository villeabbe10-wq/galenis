import React, { useState } from 'react';
import { TogoFlag, TogoCoatOfArms, ONPTLogo, TogoLionIcon } from './TogoEmblems';
import { PartnerMarquee } from './PartnerMarquee';
import { ActiveTab } from '../types';
import footerBgImage from '../assets/images/pharmacy_header_bg_1786197240812.jpg';
import { 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Cookie, 
  Lock, 
  Scale, 
  Truck,
  MessageSquareHeart,
  HeartHandshake
} from 'lucide-react';

interface FooterProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenFeedback?: (initialTab?: 'FORM' | 'LIST' | 'ROADMAP') => void;
  onOpenLegal?: (section: 'TERMS' | 'PRIVACY' | 'COOKIES') => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab, onOpenFeedback, onOpenLegal }) => {
  const [activeModal, setActiveModal] = useState<'PRIVACY' | 'TERMS' | 'COOKIES' | null>(null);

  const googleSearchLogoLink = "https://www.google.com/search?sca_esv=55b15aa6069cd068&sxsrf=APpeQnudg8-64AIXdi4k4eR0CIJ1skOtfw:1786125419624&udm=2&fbs=ABfTbFUDadgeu2mn4mYJ8iEZ1GUDDuwRa4um-2LNhBFWIpqZc7ZL_t3iAe0lB1D4hb_Ohp7Hkn8yWBpuZ8SrFmWun9dg8NU65Njndt8IIZVQ0EZEKIlgyddFclCTt781vHsEspvKN33wU-jOcNCbWnWrpwU58-ya_xF_vfbUxzOUAYnH_EPsFckZm-RIY-dVTUwA1NShhJ77&q=ordre+national+des+pharmaciens+du+togo&sa=X&sqi=2&ved=2ahUKEwjBuKTZi4-WAxVjA9sEHTXuKncQtKgLegQIFBAB&biw=1360&bih=679&dpr=1#sv=CAMSURoyKhBlLXJSMFlzWnQwbzktTUJNMg5yUjBZc1p0MG85LU1CTToOOE15TmRReVVUbTAtUU0gBCoXCgFzEhBlLXJSMFlzWnQwbzktTUJNGAEwARgHIO2HgIYJSggQARgBIAEoAQ";

  return (
    <footer className="relative bg-slate-50 text-slate-700 border-t border-slate-200 text-xs mt-16 overflow-hidden">
      {/* Dynamic Partner Marquee Carousel */}
      <PartnerMarquee />

      {/* Background Contextual Image with light overlay for maximum text contrast */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${footerBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-10 pb-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          {/* Column 1: Ordre National des Pharmaciens du Togo & Reference */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ONPTLogo href={googleSearchLogoLink} className="w-14 h-18 shrink-0 cursor-pointer" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                  Ordre National des Pharmaciens du Togo
                </h3>
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                  <HeartHandshake className="w-3 h-3 text-emerald-600" />
                  <span>Référentiel Ordinal Associé</span>
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-normal bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80">
              <strong className="text-emerald-900 font-bold block mb-0.5">Initiative Citoyenne & Publique</strong>
              Galenis Togo est une plateforme technologique indépendante d'intérêt général, conçue en alignement avec les référentiels de santé publique et de déontologie de l'ONPT.
            </p>

            <div className="space-y-2 text-[11px] text-slate-600 font-medium pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00A878] shrink-0 mt-0.5" />
                <span>188 Boulevard du Haho – Hédzranawoé, BP 3109, Lomé, Togo.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00A878] shrink-0" />
                <a 
                  href="tel:+22896373730" 
                  className="text-slate-900 hover:text-emerald-700 font-bold transition-colors"
                >
                  +228 96 37 37 30
                </a>
              </div>
            </div>

            <a 
              href={googleSearchLogoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors pt-1"
            >
              <span>Consulter l'Agrément & Registre ONPT</span>
              <ExternalLink className="w-3 h-3 text-[#00A878]" />
            </a>
          </div>

          {/* Column 2: Grossistes Répartiteurs Partenaires */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Truck className="w-4 h-4 text-[#00A878]" />
              <span>Réseau de Distribution & Grossistes</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Distribution et approvisionnement certifiés des officines sur toute l'étendue du territoire togolais.
            </p>

            <div className="space-y-2 pt-1">
              <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-2.5 flex items-center justify-between hover:border-[#00A878] transition-all">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs tracking-wider">UBIPHARM TOGO</div>
                  <div className="text-[10px] text-slate-500 font-medium">Grossiste Répartiteur Pharmaceutique</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-200">
                  Agréé
                </span>
              </div>

              <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-2.5 flex items-center justify-between hover:border-[#00A878] transition-all">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs tracking-wider">COPHARMA TOGO</div>
                  <div className="text-[10px] text-slate-500 font-medium">Compagnie Pharmaceutique du Togo</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-200">
                  Agréé
                </span>
              </div>

              <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-2.5 flex items-center justify-between hover:border-[#00A878] transition-all">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs tracking-wider">TEDIS PHARMA TOGO</div>
                  <div className="text-[10px] text-slate-500 font-medium">Distribution Pharmaceutique & Hospitalière</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-200">
                  Agréé
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation & Services */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Accès & Portails Nationaux</span>
            </div>
            <ul className="space-y-2 text-[11px] font-bold text-slate-900">
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('CITIZEN'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'CITIZEN' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Portail Citoyen & Gardes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('COMMUNITY_VIGILANCE'); }} 
                  className={`hover:text-rose-300 transition-colors flex items-center gap-1.5 ${activeTab === 'COMMUNITY_VIGILANCE' ? 'text-rose-300 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-rose-400 font-black">•</span> Signalements, Alertes & Avis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('PHARMACY_DASHBOARD'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'PHARMACY_DASHBOARD' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Inscription & Espace Officine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('COVERAGE'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'COVERAGE' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Couverture Sanitaire Régionale
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('PRICING'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'PRICING' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Tarifs & Modèles d'Adhésion
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('API_PORTAL'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'API_PORTAL' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Intégrations & API REST
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('RESOURCES'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'RESOURCES' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Centre de Ressources & Guides
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('CONTACTS'); }} 
                  className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${activeTab === 'CONTACTS' ? 'text-emerald-600 font-extrabold' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  <span className="text-emerald-600 font-black">•</span> Contacts & Assistance
                </button>
              </li>
              {onOpenFeedback && (
                <li>
                  <button 
                    onClick={() => onOpenFeedback('FORM')} 
                    className="hover:text-emerald-700 text-[#00A878] font-black transition-colors flex items-center gap-1.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 mt-1"
                    title="Donner votre avis ou proposer une idée (Lion du Togo)"
                  >
                    <TogoLionIcon className="w-3.5 h-3.5 text-[#00A878]" />
                    <span>Donner mon avis sur l'application</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Mentions Légales & Conformité */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mentions Légales & Conformité</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Plateforme certifiée conforme aux directives de protection des données de santé publique de la République Togolaise.
            </p>

            <div className="flex flex-col gap-2 pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLegal) {
                    onOpenLegal('PRIVACY');
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('LEGAL_TERMS');
                  }
                }}
                className="text-left font-bold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Politique de confidentialité</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenLegal) {
                    onOpenLegal('TERMS');
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('LEGAL_TERMS');
                  }
                }}
                className="text-left font-bold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Conditions d'utilisation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenLegal) {
                    onOpenLegal('COOKIES');
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('LEGAL_TERMS');
                  }
                }}
                className="text-left font-bold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Cookie className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gestion des Témoins de Connexion (Cookies)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-600 text-[11px]">
          <div className="flex items-center gap-3">
            <TogoCoatOfArms className="w-8 h-8 shrink-0" />
            <div>
              <div className="font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>RÉPUBLIQUE TOGOLAISE</span>
                <TogoFlag className="w-3.5 h-2.5" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                En conformité avec les directives du Ministère de la Santé & de l'Ordre National des Pharmaciens du Togo
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-0.5">
            <div className="font-bold text-slate-900">
              Travail - Liberté - Patrie
            </div>
            <div className="text-slate-500 font-medium text-[10px]">
              © 2026 Galenis Togo — Initiative citoyenne de santé publique.
            </div>
          </div>
        </div>

      </div>

      {/* LEGAL MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'PRIVACY' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Politique de Confidentialité & Protection des Données</h3>
                    <p className="text-[11px] text-slate-400">Conforme aux lois sur la protection des données de santé au Togo</p>
                  </div>
                </div>

                <p>
                  La présente politique décrit la manière dont Galenis Togo recueille et protège les données publiques des officines et les demandes d'information sanitaires.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">1. Collecte des Données Officinales</h4>
                <p>
                  Seules les informations officielles transmises et certifiées par l'Ordre National des Pharmaciens du Togo et les titulaires d'officines (nom de l'établissement, garde, numéros de téléphone officiels, coordonnées géographiques) sont publiées pour l'intérêt général de la population.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">2. Respect de l'Anonymat des Citoyens</h4>
                <p>
                  La consultation de la carte des pharmacies de garde, la recherche de prix et de disponibilité des médicaments ne requièrent aucune création de compte pour le citoyen et ne conservent aucun identifiant personnel.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">3. Sécurité des Accès Officines</h4>
                <p>
                  Les données transmises lors de l'enregistrement d'une officine font l'objet d'un chiffrement renforcé et ne sont partagées qu'avec les organismes officiels agréés (Ministère de la Santé, Sapeurs-Pompiers 118).
                </p>
              </div>
            )}

            {activeModal === 'TERMS' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Conditions Générales d'Utilisation</h3>
                    <p className="text-[11px] text-slate-400">Règles d'utilisation du portail public Galenis Togo</p>
                  </div>
                </div>

                <p>
                  En accédant à Galenis Togo, vous acceptez les présentes conditions régissant l'utilisation des services de localisation pharmaceutique et de garde.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">1. Exactitude des Informations de Garde</h4>
                <p>
                  Les pharmaciens titulaires sont responsables de la mise à jour en temps réel de leur statut de garde. Les citoyens sont invités à vérifier la garde par appel téléphonique direct en cas d'urgence de nuit.
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">2. Usage pour les Partenaires & Développeurs</h4>
                <p>
                  L'utilisation des interfaces de données pour les hôpitaux, assurances et développeurs est soumise au respect des quotas d'accès et au maintien d'une identification authentifiée.
                </p>
              </div>
            )}

            {activeModal === 'COOKIES' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Politique de Gestion des Témoins de Connexion</h3>
                    <p className="text-[11px] text-slate-400">Utilisation minimale pour le bon fonctionnement technique et hors-ligne</p>
                  </div>
                </div>

                <p>
                  Galenis Togo utilise exclusivement des témoins de connexion et données locales strictement nécessaires au fonctionnement technique de l'application (sauvegarde de la région choisie, mode hors-ligne et session sécurisée).
                </p>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Aucun témoin publicitaire ou de traçage tiers</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Nous ne revendons ni ne suivons votre navigation à des fins commerciales.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={() => {
                    const sec = activeModal;
                    setActiveModal(null);
                    onOpenLegal(sec);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TogoLionIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ouvrir la page officielle détaillée</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
