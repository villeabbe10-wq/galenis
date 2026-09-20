import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { LionIcon } from './LionIcon';

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
  variant = 'card',
  customLogoSrc
}) => {
  // 6 Scenes sequence state (0 to 6s)
  // Scene 1: 0 - 1s (Data signal: network nodes & lines)
  // Scene 2: 1 - 2s (Medical symbol: medical cross & gradient flow)
  // Scene 3: 2 - 3s (Formation of the G / P emblem stroke)
  // Scene 4: 3 - 4s (National identity: Togolese ribbon & white star)
  // Scene 5: 4 - 5s (Wordmark reveal: "Galenis" + leaf above 'i')
  // Scene 6: 5 - 6s (Final lockup: tricolor bar + tagline + hold still)
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [animProgress, setAnimProgress] = useState(autoPlay ? 0 : 6);
  const [currentScene, setCurrentScene] = useState<number>(autoPlay ? 1 : 6);
  const animRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [hasCustomImg, setHasCustomImg] = useState<boolean>(false);

  // Check if custom logo exists or provided
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
    setCurrentScene(1);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setAnimProgress(elapsed);

      if (elapsed < 1.0) {
        setCurrentScene(1);
      } else if (elapsed < 2.0) {
        setCurrentScene(2);
      } else if (elapsed < 3.0) {
        setCurrentScene(3);
      } else if (elapsed < 4.0) {
        setCurrentScene(4);
      } else if (elapsed < 5.0) {
        setCurrentScene(5);
      } else if (elapsed < 6.0) {
        setCurrentScene(6);
      } else {
        if (loop) {
          startTimeRef.current = Date.now();
          setAnimProgress(0);
          setCurrentScene(1);
        } else {
          setIsPlaying(false);
          setAnimProgress(6);
          setCurrentScene(6);
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
            Identité de Marque & Animation Officielle Galenis
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Scène {currentScene}/6 • {animProgress.toFixed(1)}s
            </span>
          )}
          <button
            type="button"
            onClick={restartAnimation}
            className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/60"
            title="Rejouer l'animation de marque 5.5s"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Rejouer Ident (5s)</span>
          </button>
        </div>
      </div>

      {/* Main Animated Canvas Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
        
        {/* SVG Animated Emblem (Scenes 1 - 4) */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
          
          {hasCustomImg && customLogoSrc ? (
            <img 
              src={customLogoSrc} 
              alt="Galenis Logo Officiel" 
              className="w-full h-full object-contain"
            />
          ) : (
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-sm overflow-visible"
            >
              <defs>
                {/* Blue-Green Flowing Gradient for Emblem */}
                <linearGradient id="identEmblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00A859" />
                  <stop offset="55%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0B192C" />
                </linearGradient>

                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* SCENE 3: Formation of the main G / P Emblem (2 - 3s) */}
              <motion.path
                d="M 65 25 
                   C 115 25, 175 40, 175 90 
                   C 175 135, 125 155, 80 155
                   L 65 155
                   L 65 180
                   C 65 188, 55 190, 50 185
                   L 45 178
                   L 45 45
                   C 45 32, 53 25, 65 25 Z"
                fill="url(#identEmblemGradient)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: animProgress >= 2.0 ? 1 : Math.max(0, (animProgress - 1.8) / 0.8),
                  opacity: animProgress >= 1.8 ? 1 : 0.05
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* Inner cutout */}
              <motion.path
                d="M 72 52 
                   L 105 52 
                   C 135 52, 148 68, 148 90 
                   C 148 112, 132 128, 102 128 
                   L 72 128 Z"
                fill="#FFFFFF"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: animProgress >= 2.3 ? 1 : 0,
                  scale: animProgress >= 2.3 ? 1 : 0.95
                }}
                transition={{ duration: 0.5 }}
              />

              {/* SCENE 2: Medical Symbol Cross with soft glow (1 - 2s) */}
              <motion.g
                fill="#00A859"
                filter="url(#softGlow)"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: animProgress >= 1.0 ? 1 : 0,
                  scale: animProgress >= 1.0 ? 1 : 0.6
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <rect x="100" y="74" width="16" height="32" rx="3" />
                <rect x="92" y="82" width="32" height="16" rx="3" />
              </motion.g>

              {/* SCENE 1: Data Signal - Sequential Nodes & Connecting Lines (0 - 1s) */}
              <g>
                {/* Connecting Lines */}
                <motion.line
                  x1="18" y1="70" x2="48" y2="88"
                  stroke="#00A859" strokeWidth="4.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: animProgress >= 0.3 ? 1 : 0,
                    opacity: animProgress >= 0.2 ? 1 : 0
                  }}
                  transition={{ duration: 0.35 }}
                />
                <motion.line
                  x1="28" y1="115" x2="48" y2="88"
                  stroke="#00A859" strokeWidth="4.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: animProgress >= 0.5 ? 1 : 0,
                    opacity: animProgress >= 0.4 ? 1 : 0
                  }}
                  transition={{ duration: 0.35 }}
                />
                <motion.line
                  x1="12" y1="165" x2="28" y2="115"
                  stroke="#00A859" strokeWidth="4.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: animProgress >= 0.7 ? 1 : 0,
                    opacity: animProgress >= 0.6 ? 1 : 0
                  }}
                  transition={{ duration: 0.35 }}
                />
                <motion.line
                  x1="48" y1="88" x2="65" y2="88"
                  stroke="#FFCC00" strokeWidth="3.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: animProgress >= 0.85 ? 1 : 0,
                    opacity: animProgress >= 0.75 ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Node 1 (0.1s) */}
                <motion.circle
                  cx="18" cy="70" r="10" fill="#00A859"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: animProgress >= 0.1 ? 1 : 0, opacity: animProgress >= 0.1 ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                {/* Node 2 (0.35s) */}
                <motion.circle
                  cx="48" cy="88" r="8" fill="#FFCC00" stroke="#00A859" strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: animProgress >= 0.35 ? 1 : 0, opacity: animProgress >= 0.35 ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                {/* Node 3 (0.6s) */}
                <motion.circle
                  cx="28" cy="115" r="9" fill="#00A859"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: animProgress >= 0.6 ? 1 : 0, opacity: animProgress >= 0.6 ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                {/* Node 4 (0.8s) */}
                <motion.circle
                  cx="12" cy="165" r="10" fill="#00A859"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: animProgress >= 0.8 ? 1 : 0, opacity: animProgress >= 0.8 ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              </g>

              {/* SCENE 4: National Identity - Togolese Ribbon & White Star (3 - 4s) */}
              <g>
                {/* Curved Ribbon Green Background */}
                <motion.path
                  d="M 45 150
                     C 65 150, 115 155, 145 125
                     C 152 118, 160 128, 150 138
                     C 115 178, 60 178, 38 158 Z"
                  fill="#006A4E"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: animProgress >= 3.0 ? 1 : 0,
                    pathLength: animProgress >= 3.0 ? 1 : 0
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Canton Red */}
                <motion.path
                  d="M 38 152
                     C 42 148, 55 148, 65 152
                     L 60 174
                     C 48 172, 40 166, 38 152 Z"
                  fill="#D21034"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: animProgress >= 3.2 ? 1 : 0,
                    scale: animProgress >= 3.2 ? 1 : 0.8
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* White Star with gentle pulse */}
                <motion.polygon
                  points="50,154 53,161 60,161 55,165 57,172 50,168 43,172 45,165 40,161 47,161"
                  fill="#FFFFFF"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: animProgress >= 3.4 ? 1 : 0,
                    scale: animProgress >= 3.4 ? [0, 1.25, 1] : 0
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* Yellow Stripe */}
                <motion.path
                  d="M 65 152
                     C 95 152, 125 148, 148 130
                     L 145 135
                     C 122 153, 92 158, 63 158 Z"
                  fill="#FFCE00"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animProgress >= 3.3 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Lower Green Stripe */}
                <motion.path
                  d="M 63 158
                     C 92 158, 122 153, 145 135
                     L 142 140
                     C 118 162, 88 168, 58 166 Z"
                  fill="#006A4E"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animProgress >= 3.4 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </g>
            </svg>
          )}
        </div>

        {/* Typography & Wordmark & Tagline (Scenes 5 & 6) */}
        <div className="flex flex-col justify-center text-left max-w-lg min-w-0">
          
          {/* SCENE 5: Wordmark "Galenis" reveal (4 - 5s) */}
          <div className="relative overflow-hidden">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-1 select-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: animProgress >= 4.0 ? 1 : 0,
                x: animProgress >= 4.0 ? 0 : -20
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span>Galenis</span>
              {/* Emerging dot / leaf over 'i' */}
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: animProgress >= 4.6 ? [0, 1.4, 1] : 0,
                  opacity: animProgress >= 4.6 ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.h1>
          </div>

          {/* SCENE 6: Tricolor Underline Bar drawing left-to-right (5 - 6s) */}
          <motion.div
            className="h-1.5 rounded-full flex overflow-hidden my-2 shadow-2xs w-full max-w-[220px]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: animProgress >= 5.0 ? '100%' : '0%',
              opacity: animProgress >= 5.0 ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="w-1/3 bg-[#00A859] h-full" />
            <div className="w-1/3 bg-[#FFCC00] h-full" />
            <div className="w-1/3 bg-[#ED1C24] h-full" />
          </motion.div>

          {/* SCENE 6: Tagline fade-in (5 - 6s) & Hold Still */}
          <motion.p
            className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed"
            initial={{ opacity: 0, y: 4 }}
            animate={{ 
              opacity: animProgress >= 5.2 ? 1 : 0,
              y: animProgress >= 5.2 ? 0 : 4
            }}
            transition={{ duration: 0.6 }}
          >
            L'infrastructure numérique des données pharmaceutiques du <strong className="font-extrabold text-[#17324D]">Togo.</strong>
          </motion.p>
        </div>
      </div>

      {/* Footer subtle brand trust badge */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Plateforme Privée de Technologies de Santé • Norme APDP & Ministérielle</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Galenis HealthTech Togo SARL
        </span>
      </div>
    </div>
  );
};
