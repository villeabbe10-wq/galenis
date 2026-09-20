import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, ShieldCheck } from 'lucide-react';
import { LionIcon } from '../LionIcon';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Do not render if the app is already running as standalone installed app
  if (isInstalled) {
    return null;
  }

  // If on Chrome/Android/Desktop Edge and prompt is ready
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className={`bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between shadow-inner ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center p-1 border border-emerald-500/30">
              <LionIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Installer Galenis Togo sur votre écran</p>
              <p className="text-[10px] text-emerald-200">Accès instantané même hors-ligne aux pharmacies de garde</p>
            </div>
          </div>
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        id="btn-pwa-install"
        title="Installer l'application Galenis Togo"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all border border-emerald-500/30 active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-amber-300" />
        <span className="hidden sm:inline">Installer l'App</span>
        <span className="sm:hidden">Installer</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit doesn't trigger beforeinstallprompt)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="btn-pwa-ios-guide"
          title="Installer sur iPhone/iPad"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium hover:bg-emerald-100 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Installer sur iOS</span>
          <span className="sm:hidden">Sur iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm p-1.5">
                    <LionIcon className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Installer sur iPhone / iPad</h3>
                    <p className="text-[11px] text-slate-500">Galenis Togo en application native</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <p>
                    Touchez le bouton de <strong>Partage</strong> (<Share className="w-3.5 h-3.5 inline text-blue-500" />) dans la barre de navigation Safari en bas de votre écran.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <p>
                    Faites défiler le menu puis sélectionnez <strong className="text-emerald-700 dark:text-emerald-400">Sur l'écran d'accueil</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" />).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <p>
                    Touchez <strong>Ajouter</strong> en haut à droite. L'icône officielle Galenis apparaîtra sur votre écran d'accueil avec toutes les fonctionnalités hors-ligne.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
