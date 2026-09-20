import React, { useState } from 'react';
import { Pharmacy } from '../../types';
import { TOGO_CITIES } from '../../data/mockPharmacies';
import { TogoFlag, TogoCoatOfArms } from '../TogoEmblems';
import { 
  X, 
  Printer, 
  Share2, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Download,
  FileDown,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface GuardScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacies: Pharmacy[];
}

export const GuardScheduleModal: React.FC<GuardScheduleModalProps> = ({
  isOpen,
  onClose,
  pharmacies
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Lomé');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const guardPharmacies = pharmacies.filter(
    p => (p.status === 'DE_GARDE' || p.isGuardToday) &&
         (selectedCity === 'TOUTES' || p.city.toLowerCase() === selectedCity.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header Banner - Official Togolese Colors
      doc.setFillColor(0, 106, 78); // Emerald Green
      doc.rect(0, 0, 210, 24, 'F');

      // Title Text in Header
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('RÉPUBLIQUE TOGOLAISE', 105, 10, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Travail - Liberté - Patrie  •  Ministère de la Santé  •  Ordre des Pharmaciens', 105, 17, { align: 'center' });

      // Document Title
      doc.setTextColor(23, 50, 77); // Brand dark slate
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`TABLEAU OFFICIEL DES PHARMACIES DE GARDE — ${selectedCity.toUpperCase()}`, 105, 34, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const currentDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.text(`Édition du ${currentDate} • Service d'Urgence Sanitaire 24h/24 & Nuit`, 105, 40, { align: 'center' });

      // Table Data
      const tableRows = guardPharmacies.map((p, index) => [
        (index + 1).toString(),
        p.name.toUpperCase(),
        `${p.city} (${p.quarter})`,
        p.address || 'Quartier principal',
        p.phone,
        '24H/24 DE GARDE'
      ]);

      autoTable(doc, {
        startY: 46,
        head: [['N°', 'Établissement / Pharmacie', 'Ville (Quartier)', 'Adresse & Repère', 'Téléphone Urgence', 'Statut']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 106, 78],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 50, fontStyle: 'bold' },
          2: { cellWidth: 40 },
          3: { cellWidth: 45 },
          4: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
          5: { cellWidth: 25, halign: 'center', textColor: [180, 83, 9] }
        },
        margin: { left: 10, right: 10 }
      });

      // Footer
      const finalY = (doc as any).lastAutoTable?.finalY || 200;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Document officiel généré par Galenis Togo — Infrastructure numérique des données pharmaceutiques.',
        105,
        Math.min(finalY + 12, 285),
        { align: 'center' }
      );

      doc.save(`Planning_Gardes_${selectedCity}_${Date.now()}.pdf`);
    } catch (e) {
      console.error('PDF Generation error:', e);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*PHARMACIES DE GARDE - ${selectedCity.toUpperCase()} (TOGO)*\n` +
      guardPharmacies.map(p => `• *${p.name}* (${p.quarter}): Tel ${p.phone}`).join('\n') +
      `\n\nSource: Galenis Togo (Référentiel des Pharmacies)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Planning Officiel des Pharmacies de Garde</h3>
              <p className="text-xs text-slate-500">Ordre National des Pharmaciens du Togo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Actions bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Ville :</span>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            >
              <option value="TOUTES">Toutes les villes du Togo</option>
              {TOGO_CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name} ({c.region})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf || guardPharmacies.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger en PDF'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Printable Guard Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans print:p-0">
          <div className="text-center border-b pb-4 flex flex-col items-center justify-center">
            <TogoCoatOfArms className="w-14 h-14 mb-2" />
            <div className="flex items-center gap-2">
              <TogoFlag className="w-5 h-3.5" />
              <div className="text-xs font-black uppercase tracking-widest text-emerald-800">RÉPUBLIQUE TOGOLAISE</div>
              <TogoFlag className="w-5 h-3.5" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Travail - Liberté - Patrie • Ministère de la Santé</div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              LISTE OFFICIELLE DES PHARMACIES DE GARDE — {selectedCity.toUpperCase()}
            </h2>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-center gap-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Service continu 24h/24 & Nuit — Ordre National des Pharmaciens du Togo</span>
            </div>
          </div>

          {guardPharmacies.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Aucune pharmacie de garde répertoriée pour cette ville aujourd'hui.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-center text-xs shadow-sm">
                Pharmacies de garde "{selectedCity}" • Semaine en cours 24h/24
              </div>

              <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl border border-slate-200 space-y-2">
                {guardPharmacies.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-500/50 transition-colors">
                    <div className="font-mono font-bold text-sm text-amber-600">
                      {p.name.toUpperCase()} - {p.address || p.quarter} - {p.phone}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-sans text-xs">
                      <a
                        href={`tel:${p.phone.replace(/\s+/g, '')}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                      <a
                        href={`https://wa.me/${p.whatsapp.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t text-center text-[10px] text-slate-400">
            Émis par Galenis Togo — Infrastructure numérique des données pharmaceutiques du Togo.
          </div>
        </div>

      </div>
    </div>
  );
};
