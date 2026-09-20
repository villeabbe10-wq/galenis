import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Search, 
  ChevronDown, 
  Building2, 
  Code2, 
  Shield, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  BookOpen,
  PhoneCall,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';

export type FaqAudience = 'PHARMACY' | 'DEVELOPER' | 'ADMIN' | 'CITIZEN';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keyPoints?: string[];
  actionLabel?: string;
  actionId?: string;
}

const FAQ_DATA: Record<FaqAudience, {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  items: FaqItem[];
}> = {
  PHARMACY: {
    title: "Guide & FAQ Officine • Pharmaciens Titulaires ONPT",
    subtitle: "Principes de fonctionnement, déclarations de tour de garde et gestion quotidienne de vos stocks",
    icon: Building2,
    badge: "Espace Professionnel Officine",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    items: [
      {
        id: "p1",
        category: "Tours de Garde",
        question: "Comment déclarer mon officine « De Garde » ou ouverte la nuit ?",
        answer: "Dans votre Tableau de Bord Pharmacie, activez l'interrupteur 'Pharmacie de Garde (24h/24)' d'un simple clic. Le statut est immédiatement synchronisé sur la base de données Cloud Firebase Firestore et affiché en vert avec priorité de recherche pour tous les citoyens du Togo.",
        keyPoints: [
          "Bascule instantanée en 1 clic sans délai d'attente",
          "Mise à jour en temps réel sur la carte interactive nationale",
          "Traçabilité certifiée pour l'Ordre National des Pharmaciens du Togo (ONPT)"
        ]
      },
      {
        id: "p2",
        category: "Gestion des Stocks & Tarifs",
        question: "Comment mettre à jour les stocks de médicaments d'urgence et les prix ?",
        answer: "Dans l'onglet 'Stocks & Médicaments', vous disposez d'un catalogue complet des molécules référencées au Togo. Vous pouvez modifier le statut en 'Disponible', 'Rupture temporaire' ou 'Commande possible', et ajuster le tarif officiel en Francs CFA (FCFA).",
        keyPoints: [
          "Indication transparente des tarifs en FCFA pour éviter toute surfacturation",
          "Possibilité d'ajouter de nouvelles spécialités pharmaceutiques",
          "Notification automatique aux patients lors de la consultation de votre fiche"
        ]
      },
      {
        id: "p3",
        category: "Réservations Patients",
        question: "Comment traiter les demandes de réservation reçues des citoyens ?",
        answer: "L'onglet 'Réservations Patients' liste toutes les commandes reçues avec le nom du patient, son numéro de téléphone togolais, le médicament souhaité et l'heure estimée de passage. Vous pouvez passer la commande à 'Confirmée', 'Prête au comptoir' ou 'Annulée' et appeler le patient en un clic.",
        keyPoints: [
          "Bouton d'appel direct et lien WhatsApp pré-rempli vers le patient",
          "Aucune carte bancaire requise : le règlement se fait au comptoir ou via T-Money / Flooz",
          "Conservation automatique de l'historique pendant 30 jours"
        ]
      },
      {
        id: "p4",
        category: "Affiche Officielle de Vitrine",
        question: "Comment générer et imprimer l'affiche A4 avec QR Code pour ma vitrine ?",
        answer: "Cliquez sur 'Imprimer Affiche Vitrine' en haut de votre tableau de bord. Un document A4 aux normes officielles togolaises est généré avec vos horaires, vos contacts d'urgence et un QR Code dynamique que les patients nocturnes peuvent scanner pour consulter vos gardes.",
        keyPoints: [
          "Format A4 haute résolution prêt pour l'impression",
          "Conforme aux recommandations de l'Ordre des Pharmaciens",
          "QR Code permanent scannable avec tout smartphone (Android & iPhone)"
        ]
      },
      {
        id: "p5",
        category: "Import Logiciel Officinal",
        question: "Comment importer mes stocks en masse depuis mon logiciel de gestion ?",
        answer: "Utilisez le bouton 'Importer un Fichier Stock (CSV / Excel)'. Le système effectue une fusion intelligente avec votre inventaire existant en préservant vos prix et en mettant à jour les quantités instantanément.",
        keyPoints: [
          "Compatible avec les exports standards de logiciels de pharmacie",
          "Rapport de fusion détaillé avant application finale",
          "Zéro risque d'écrasement accidentel de vos fiches"
        ]
      }
    ]
  },
  DEVELOPER: {
    title: "Guide & FAQ Développeurs • Intégration API & Webhooks",
    subtitle: "Architecture REST, authentification par tokens, quotas et monétisation FedaPay",
    icon: Code2,
    badge: "Portail Développeur & API Publique",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    items: [
      {
        id: "d1",
        category: "Authentification API",
        question: "Comment générer et sécuriser ma clé API Galenis Togo ?",
        answer: "Connectez-vous avec votre compte développeur sur le Portail API. Dans l'onglet 'Mes Clés API', générez une clé sandbox (tg_test_...) ou production (tg_live_...). Transmettez cette clé dans le header HTTP : Authorization: Bearer <votre_cle> ou X-API-Key.",
        keyPoints: [
          "Génération et révocation instantanée en un clic",
          "Environnements Sandbox de test et Production étanches",
          "Respect des normes OWASP et chiffrement de bout en bout"
        ]
      },
      {
        id: "d2",
        category: "Quotas & Performance",
        question: "Quels sont les quotas de requêtes et la latence moyenne ?",
        answer: "Le plan Développeur gratuit inclut 1 000 requêtes/jour avec un débit de 10 req/seconde. Les plans Pro et Enterprise offrent jusqu'à 500 000 requêtes/jour avec une latence moyenne inférieure à 45 ms grâce au cache Edge déployé pour la sous-région ouest-africaine.",
        keyPoints: [
          "Headers de réponse inclus : X-RateLimit-Limit et X-RateLimit-Remaining",
          "Cache intelligent des officines de garde mis à jour toutes les 60 secondes",
          "Support SLA 99.9% disponible pour les intégrateurs hospitaliers et d'assurance"
        ]
      },
      {
        id: "d3",
        category: "Webhooks & Temps Réel",
        question: "Comment recevoir les alertes de changement de garde par Webhook ?",
        answer: "Dans la section 'Webhooks', enregistrez l'URL HTTPS de votre serveur. Vous recevrez des payloads JSON signés avec HMAC SHA-256 à chaque bascule d'officine de garde ou lors de la publication d'une alerte sanitaire officielle.",
        keyPoints: [
          "Événements : pharmacy.guard_changed, stock.depleted, alert.sanitary_broadcast",
          "Signature cryptographique pour vérifier l'authenticité de l'expéditeur",
          "Tentatives de réémission automatiques avec backoff exponentiel en cas d'erreur"
        ]
      },
      {
        id: "d4",
        category: "Facturation Mobile Money",
        question: "Comment payer son abonnement API via T-Money ou Flooz (FedaPay) ?",
        answer: "Le système intègre la passerelle FedaPay certifiée au Togo. Sélectionnez votre forfait en FCFA, saisissez votre numéro T-Money (+228 90/91/92/93) ou Moov Flooz (+228 96/97/98/99), validez sur votre téléphone et vos quotas sont activés immédiatement.",
        keyPoints: [
          "Facturation en Francs CFA (XOF) sans frais de change bancaire",
          "Téléchargement immédiat de la facture PDF acquittée",
          "Activation sans délai de vos clés de production"
        ]
      }
    ]
  },
  ADMIN: {
    title: "Guide & FAQ Administration • Régulation & Santé Publique",
    subtitle: "Supervision du maillage national, homologation des officines et alertes sanitaires DPMED",
    icon: Shield,
    badge: "Supervision Centrale & Ordre National",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    items: [
      {
        id: "a1",
        category: "Homologation",
        question: "Comment valider et certifier une nouvelle pharmacie inscrite ?",
        answer: "Dans l'Espace Administration > Gestion des Officines, examinez les demandes en attente. Vérifiez le matricule de l'Ordre National des Pharmaciens du Togo (ONPT) et les coordonnées du pharmacien titulaire, puis cliquez sur 'Valider l'officine' pour lui attribuer le badge officiel.",
        keyPoints: [
          "Contrôle rigoureux contre les officines clandestines et dépôts illégaux",
          "Attribution automatique d'un identifiant national unique (TG-PHA-XXX)",
          "Publication immédiate dans l'annuaire certifié"
        ]
      },
      {
        id: "a2",
        category: "Alertes Sanitaires",
        question: "Comment diffuser une alerte sanitaire d'urgence à l'échelle du pays ?",
        answer: "Ouvrez le module 'Alertes Sanitaires Nationales'. Rédigez le message officiel émis par la DPMED (ex: lot de faux médicaments détecté, rappel de produit). Dès publication, l'alerte apparaît en bandeau d'urgence sur l'application citoyenne et dans les tableaux de bord officines.",
        keyPoints: [
          "Diffusion simultanée sur l'application citoyenne et les API partenaires",
          "Enregistrement indélébile dans le registre de vigilance",
          "Notification prioritaire aux officines du Grand Lomé et des régions"
        ]
      },
      {
        id: "a3",
        category: "Audit & Données",
        question: "Comment exporter les statistiques officielles pour le Ministère de la Santé ?",
        answer: "Dans l'onglet 'Données & Exports', vous pouvez télécharger l'ensemble du registre en formats JSON, CSV ou rapport PDF officiel, incluant les taux de couverture par préfecture et les volumes de réservations.",
        keyPoints: [
          "Données 100% anonymisées pour protéger la vie privée des patients",
          "Conformité avec les standards de l'ANAS Togo et de l'OMS",
          "Sauvegardes chiffrées automatiques"
        ]
      }
    ]
  },
  CITIZEN: {
    title: "Guide & FAQ Citoyenne • Urgences, Gardes & Réservations",
    subtitle: "Trouver une pharmacie ouverte la nuit, vérifier la disponibilité d'un médicament et réserver",
    icon: User,
    badge: "Guide d'Utilisation Citoyen",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    items: [
      {
        id: "c1",
        category: "Urgences de Nuit",
        question: "Comment trouver la pharmacie de garde la plus proche de chez moi la nuit ?",
        answer: "Autorisez la géolocalisation dans votre navigateur ou application mobile, puis activez le filtre 'De Garde'. La liste trie immédiatement les officines ouvertes 24h/24 de la plus proche à la plus éloignée avec la distance exacte en kilomètres.",
        keyPoints: [
          "Bouton d'appel téléphonique direct pour joindre le pharmacien de garde",
          "Itinéraire GPS en un clic vers Google Maps ou Waze",
          "Partage facile de la fiche par WhatsApp à un proche"
        ]
      },
      {
        id: "c2",
        category: "Mode Hors-Ligne",
        question: "L'application fonctionne-t-elle si je n'ai plus de forfait Internet ?",
        answer: "Oui ! En installant l'application sur votre écran d'accueil (mode PWA), la liste complète des pharmacies et leurs numéros de téléphone d'urgence restent consultables même sans aucune connexion Internet.",
        keyPoints: [
          "Fonctionnement hors-ligne garanti grâce au cache sécurisé",
          "Bouton 'Installer l'App' disponible en haut de l'écran",
          "Consommation minimale de données lors des mises à jour"
        ]
      },
      {
        id: "c3",
        category: "Réservation Médicaments",
        question: "Comment réserver un médicament avant de me déplacer à la pharmacie ?",
        answer: "Sur la fiche de la pharmacie, cliquez sur 'Réserver un médicament', indiquez le nom du produit, la quantité et votre numéro de téléphone. La pharmacie reçoit votre demande et prépare votre commande pour votre passage.",
        keyPoints: [
          "Évite les déplacements inutiles en cas de rupture de stock",
          "Paiement sécurisé sur place au comptoir",
          "Confirmation rapide par téléphone ou message"
        ]
      },
      {
        id: "c4",
        category: "Vigilance Sanitaire",
        question: "Comment signaler une pharmacie fermée pendant sa garde ou un prix anormal ?",
        answer: "Ouvrez l'onglet 'Vigilance Citoyenne' ou cliquez sur 'Signaler une anomalie' sur la fiche de l'officine. Votre retour est transmis aux inspecteurs de l'Ordre National des Pharmaciens pour vérification.",
        keyPoints: [
          "Signalement citoyen anonyme et bienveillant",
          "Contribue à l'amélioration de la santé publique au Togo",
          "Suivi transparent des résolutions d'incidents"
        ]
      }
    ]
  }
};

interface DashboardFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAudience?: FaqAudience;
  onNavigateToTab?: (tab: any) => void;
}

export const DashboardFaqModal: React.FC<DashboardFaqModalProps> = ({
  isOpen,
  onClose,
  initialAudience = 'CITIZEN',
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Strict audience lock: an authorized user only sees their own space FAQ
  const currentFaq = FAQ_DATA[initialAudience] || FAQ_DATA.CITIZEN;
  const IconComponent = currentFaq.icon;

  // Filter items by search query
  const filteredItems = currentFaq.items.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keyPoints?.some(kp => kp.toLowerCase().includes(q))
    );
  });

  const toggleAccordion = (id: string) => {
    setExpandedItemId(prev => (prev === id ? null : id));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Lion Icon of Togo */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <TogoLionIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TogoFlag className="w-4 h-2.5 rounded shadow-xs" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Guide Officiel • République Togolaise
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {currentFaq.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Banner */}
        <div className="p-4 sm:p-6 pb-3 border-b border-slate-100 shrink-0 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${currentFaq.badgeColor}`}>
                  {currentFaq.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredItems.length} fiche{filteredItems.length > 1 ? 's' : ''} pratique{filteredItems.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {currentFaq.subtitle}
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans ce guide..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Questions & Answers */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <TogoLionIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700">Aucun résultat trouvé</div>
              <div className="text-xs text-slate-500 mt-1">
                Essayez un autre mot-clé ou effacez la recherche pour voir tous les guides.
              </div>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'bg-slate-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-4 sm:p-5 flex items-start justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.question}
                      </h4>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-200/60 mt-1">
                      <p className="font-medium text-slate-800">
                        {item.answer}
                      </p>

                      {item.keyPoints && item.keyPoints.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/60 bg-white p-3.5 rounded-xl border border-slate-200/80">
                          <div className="text-[11px] font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                            <TogoLionIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Points Clés à Retenir :</span>
                          </div>
                          <ul className="space-y-1.5">
                            {item.keyPoints.map((kp, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Documentation conforme aux directives de l'Ordre National des Pharmaciens du Togo (ONPT).</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Compris, fermer le guide
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
