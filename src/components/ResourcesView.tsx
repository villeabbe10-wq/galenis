import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  Code2, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  FileCode2,
  Scale,
  Users,
  Key,
  Layers
} from 'lucide-react';
import { GovernanceAndRolesDocs } from './ApiPortal/GovernanceAndRolesDocs';
import { LionIcon } from './LionIcon';

interface ResourcesViewProps {
  onNavigateToApiPortal?: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigateToApiPortal }) => {
  const [activeSection, setActiveSection] = useState<'GOVERNANCE' | 'DOCS'>('GOVERNANCE');

  const documents = [
    {
      title: "Charte d'Usage & Non-Divulgation des Données Patient",
      authority: "Ministère de la Santé / DSI & ONPT",
      category: "Accréditation Développeurs",
      description: "Document contractuel obligatoire pour les éditeurs de logiciels et développeurs demandant une clé de production Live.",
      format: "PDF",
      size: "820 Ko",
      date: "2026",
      isKeyDoc: true
    },
    {
      title: "Charte de Déontologie Numérique Pharmaceutique",
      authority: "Ordre National des Pharmaciens du Togo (ONPT)",
      category: "Réglementation",
      description: "Règles d'éthique et de responsabilité applicables à la publication des horaires de garde et des stocks en ligne.",
      format: "PDF",
      size: "1.4 Mo",
      date: "2026",
      isKeyDoc: false
    },
    {
      title: "Grille Tarifaire Homologuée des Médicaments Essentiels (PMVP)",
      authority: "Ministère de la Santé du Togo",
      category: "Tarification",
      description: "Référentiel officiel des Prix Maximaux de Vente au Public pour les spécialités et génériques au Togo.",
      format: "PDF",
      size: "3.2 Mo",
      date: "2026",
      isKeyDoc: false
    },
    {
      title: "Guide d'Utilisation du Portail Officine pour Pharmaciens",
      authority: "Équipe Technique Galenis Togo",
      category: "Guide Métier",
      description: "Tutoriel pas à pas pour déclarer la garde, gérer les remplacements et synchroniser les disponibilités.",
      format: "PDF",
      size: "2.1 Mo",
      date: "2026",
      isKeyDoc: false
    },
    {
      title: "Spécification Technique des API REST & Webhooks (v1.0)",
      authority: "Direction des Systèmes d'Information Sanitaires",
      category: "Développeurs & Intégrateurs",
      description: "Contrat OpenAPI 3.0.3 pour les éditeurs de logiciels de caisse (Sage, Pharmagest) et dossiers patients hospitaliers.",
      format: "JSON / OpenAPI",
      size: "850 Ko",
      date: "2026",
      isKeyDoc: true
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner - Clean Light Design */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>CENTRE DE RESSOURCES & GOUVERNANCE NATIONALE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <span>Ressources, Gouvernance & Documentation</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-medium">
            Cadre officiel d'accréditation des développeurs, matrice des rôles et permissions, textes réglementaires du Ministère de la Santé du Togo et guides d'intégration.
          </p>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveSection('GOVERNANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'GOVERNANCE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Gouvernance & Matrice des Rôles (Accréditation Dev)</span>
        </button>

        <button
          onClick={() => setActiveSection('DOCS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'DOCS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Documents & Textes Officiels à Télécharger</span>
        </button>
      </div>

      {/* SECTION 1: GOVERNANCE & ROLES RECAP */}
      {activeSection === 'GOVERNANCE' && (
        <GovernanceAndRolesDocs
          onOpenOnboarding={onNavigateToApiPortal}
          onOpenKeys={onNavigateToApiPortal}
        />
      )}

      {/* SECTION 2: OFFICIAL DOWNLOADS SECTION */}
      {activeSection === 'DOCS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Documents Officiels & Textes Réglementaires du Togo</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Téléchargez les formulaires d'accréditation et guides certifiés par les autorités sanitaires.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Édition 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-3xl border transition-all space-y-4 flex flex-col justify-between shadow-xs ${
                  doc.isKeyDoc ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      doc.isKeyDoc ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium font-mono">
                      {doc.format} • {doc.size}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {doc.description}
                  </p>

                  <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Émis par : {doc.authority}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Validation {doc.date}</span>
                  <button
                    type="button"
                    onClick={() => {
                      // Generate and download mock text document or spec
                      const content = `GALENIS TOGO - RÉFÉRENTIEL OFFICIEL SANTE\n\nDocument: ${doc.title}\nAutorité: ${doc.authority}\nCatégorie: ${doc.category}\nDate: ${doc.date}\n\nCe document atteste des normes de conformité, gouvernance et protection des données pour la plateforme nationale Galenis Togo.`;
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
