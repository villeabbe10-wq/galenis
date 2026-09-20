import React from 'react';
import { SanitaryAlert } from '../../types';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Building2, 
  Share2,
  FileCheck2,
  ExternalLink,
  Info
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: SanitaryAlert | null;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose
}) => {
  if (!alert) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `[Alerte Santé Togo] ${alert.title}`,
        text: `${alert.summary} - Via Galenis Togo`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`[Alerte Santé Togo] ${alert.title}\n${alert.summary}`);
      window.alert('Avis copié dans le presse-papiers !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Banner based on severity */}
        <div className={`p-6 text-slate-900 relative ${
          alert.severity === 'CRITIQUE'
            ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900'
            : alert.severity === 'VIGILANCE'
            ? 'bg-gradient-to-r from-amber-800 via-amber-700 to-slate-900'
            : 'bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm ${
              alert.severity === 'CRITIQUE'
                ? 'bg-rose-500 text-white'
                : alert.severity === 'VIGILANCE'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-blue-500 text-slate-900'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{alert.severity === 'CRITIQUE' ? 'ALERTE CRITIQUE / RETRAIT' : alert.severity === 'VIGILANCE' ? 'VIGILANCE SANITAIRE' : 'COMMUNIQUÉ INFORMATIF'}</span>
            </span>

            <span className="bg-white/20 backdrop-blur-md text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {alert.publishedAt}
            </span>

            <span className="bg-white/20 backdrop-blur-md text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {alert.region === 'Toutes' ? 'Échelle Nationale (Togo)' : `Région : ${alert.region}`}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-snug">{alert.title}</h2>
          <p className="text-xs text-slate-200 mt-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Émis par : <strong>{alert.source}</strong></span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Summary Quote */}
          <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-slate-800 text-sm font-medium leading-relaxed">
            {alert.summary}
          </div>

          {/* Full content */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Détails & Justificatif Officiel</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3.5 border border-slate-200 rounded-xl">
              {alert.content}
            </p>
          </div>

          {/* Affected lots or products */}
          {alert.affectedProducts && alert.affectedProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Lots & Produits Sous Notification</span>
              </h4>
              <div className="space-y-1.5">
                {alert.affectedProducts.map((prod, idx) => (
                  <div key={idx} className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 font-mono text-rose-900 font-bold text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    <span>{prod}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Recommendations */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consignes et Recommandations aux Praticiens & Citoyens</span>
            </h4>
            <div className="space-y-2">
              {alert.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleShare}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>Diffuser l'alerte</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Fermer la notification
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
