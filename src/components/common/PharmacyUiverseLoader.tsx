import React from 'react';
import { TogoFlag } from '../TogoEmblems';

interface PharmacyUiverseLoaderProps {
  size?: 'sm' | 'md' | 'lg' | number;
  theme?: 'emerald' | 'cyan' | 'blue' | 'amber';
  label?: string;
  subLabel?: string;
  showEmblem?: boolean;
  className?: string;
}

export const PharmacyUiverseLoader: React.FC<PharmacyUiverseLoaderProps> = ({
  size = 'md',
  theme = 'emerald',
  label = 'Chargement de la pharmacie & statut de garde...',
  subLabel = 'Synchronisation du cadastre officiel DPML • Togo',
  showEmblem = true,
  className = ''
}) => {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 48 
      : size === 'lg' 
        ? 80 
        : 64;

  const themeClass = theme === 'blue' 
    ? 'uiverse-blue' 
    : theme === 'cyan' 
      ? 'uiverse-cyan' 
      : theme === 'amber' 
        ? 'uiverse-amber' 
        : '';

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {/* Uiverse Loader Animation */}
      <div className="uiverse-loader relative mb-3">
        <svg 
          className="uiverse-container drop-shadow-xs" 
          width={pixelSize} 
          height={pixelSize} 
          viewBox="0 0 64 64"
        >
          {/* Static background path for card */}
          <rect 
            className="uiverse-track" 
            x="6" 
            y="6" 
            width="52" 
            height="52" 
            rx="10" 
          />
          {/* Animated border moving path */}
          <rect 
            className={`uiverse-car ${themeClass}`} 
            x="6" 
            y="6" 
            width="52" 
            height="52" 
            rx="10" 
            pathLength="100" 
          />
          {/* Animated pharmacy document / prescription lines */}
          <g className={`uiverse-lines ${themeClass}`}>
            <line className="indent" x1="16" y1="20" x2="36" y2="20" />
            <line x1="16" y1="28" x2="48" y2="28" />
            <line x1="16" y1="36" x2="40" y2="36" />
            <line x1="16" y1="44" x2="28" y2="44" />
          </g>
        </svg>

        {/* Small Pharmacy Green Cross accent in the bottom right corner */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black shadow-xs border-2 border-white">
          +
        </div>
      </div>

      {/* Text Labels */}
      {label && (
        <p className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
          {label}
        </p>
      )}

      {subLabel && (
        <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
          {showEmblem && <TogoFlag className="w-3.5 h-2.5 rounded-xs" />}
          <span>{subLabel}</span>
        </div>
      )}
    </div>
  );
};
