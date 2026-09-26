import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { LionIcon } from './LionIcon';
import { LogoSymbol } from './GalenisLogo';

interface GalenisBrandIdentProps {
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  variant?: 'card' | 'compact' | 'hero' | 'minimal';
  customLogoSrc?: string;
}

export const GalenisBrandIdent: React.FC<GalenisBrandIdentProps> = ({
  className = "",
  autoPlay = true,
  loop = false,
  customLogoSrc
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [animProgress, setAnimProgress] = useState(autoPlay ? 0 : 5);
  const startTimeRef = useRef<number>(Date.now());
  const [hasCustomImg, setHasCustomImg] = useState<boolean>(false);

  useEffect(() => {
    if (customLogoSrc) {
      const img = new Image();
      img.src = customLogoSrc;
      img.onload = () => setHasCustomImg(true);
      img.onerror = () => setHasCustomImg(false);
    }
  }, [customLogoSrc]);

  const restartAnimation = () => {
    setIsPlaying(true);
    setAnimProgress(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setAnimProgress(elapsed);

      if (elapsed >= 5.0) {
        if (loop) {
          startTimeRef.current = Date.now();
          setAnimProgress(0);
        } else {
          setIsPlaying(false);
          setAnimProgress(5);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, loop]);

  return (
    <div className={`relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-4 sm:p-5 transition-all ${className}`}>
      {/* Header Info Band */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-xs">
            <LionIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Identité de Marque Officielle Galenis Togo (Tête du Lion)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {animProgress.toFixed(1)}s
            </span>
          )}
          <button
            type="button"
            onClick={restartAnimation}
            className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/60"
            title="Rejouer l'animation de marque"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Rejouer Ident</span>
          </button>
        </div>
      </div>

      {/* Main Animated Canvas Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
        {/* Lion Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
          {hasCustomImg && customLogoSrc ? (
            <img 
              src={customLogoSrc} 
              alt="Galenis Logo Officiel" 
              className="w-full h-full object-contain"
            />
          ) : (
            <motion.div
              className="w-full h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: animProgress >= 0.5 ? 1 : 0.8,
                opacity: animProgress >= 0.3 ? 1 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LogoSymbol animated={isPlaying} />
            </motion.div>
          )}
        </div>

        {/* Typography & Wordmark & Tagline */}
        <div className="flex flex-col justify-center text-left max-w-lg min-w-0">
          <div className="relative overflow-hidden">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-1 select-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: animProgress >= 1.2 ? 1 : 0,
                x: animProgress >= 1.2 ? 0 : -20
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span>Galenis</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ml-0.5" />
            </motion.h1>
          </div>

          {/* Tricolor Underline Bar drawing left-to-right */}
          <motion.div
            className="h-1.5 rounded-full flex overflow-hidden my-2 shadow-2xs w-full max-w-[220px]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: animProgress >= 1.8 ? '100%' : '0%',
              opacity: animProgress >= 1.8 ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="w-1/3 bg-[#00A859] h-full" />
            <div className="w-1/3 bg-[#FFCC00] h-full" />
            <div className="w-1/3 bg-[#ED1C24] h-full" />
          </motion.div>

          {/* Tagline fade-in */}
          <motion.p
            className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed"
            initial={{ opacity: 0, y: 4 }}
            animate={{ 
              opacity: animProgress >= 2.2 ? 1 : 0,
              y: animProgress >= 2.2 ? 0 : 4
            }}
            transition={{ duration: 0.5 }}
          >
            L'infrastructure numérique des données pharmaceutiques du <strong className="font-extrabold text-[#17324D]">Togo.</strong>
          </motion.p>
        </div>
      </div>

      {/* Footer subtle brand trust badge */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Emblème Officiel • Tête du Lion & Données de Santé Sécurisées</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Galenis HealthTech Togo
        </span>
      </div>
    </div>
  );
};
