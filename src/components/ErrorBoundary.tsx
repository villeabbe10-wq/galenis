import React, { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const isBenignError = (msg?: string) => {
      if (!msg) return false;
      const lower = msg.toLowerCase();
      return (
        lower.includes('websocket') ||
        lower.includes('ws://') ||
        lower.includes('wss://') ||
        lower.includes('vite') ||
        lower.includes('resizeobserver') ||
        lower.includes('failed to fetch')
      );
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || event.error?.message || '';
      if (isBenignError(msg)) return;
      console.error("Global error caught:", event.error);
      setHasError(true);
      setErrorMessage(msg || 'Erreur d\'exécution du composant');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason?.message || String(event.reason || '');
      if (isBenignError(msg)) return;
      console.error("Unhandled promise rejection:", event.reason);
      setHasError(true);
      setErrorMessage(msg || 'Erreur de promesse asynchrone');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold">Un incident technique est survenu</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Le système Galenis Togo a rencontré une anomalie inattendue. Vos données locales restent sécurisées en cache.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-28">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                window.location.reload();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recharger la page</span>
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
