import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  variant?: 'icon' | 'full';
  lightMode?: boolean;
  animated?: boolean;
}

export const GalenisLogo: React.FC<LogoProps> = ({ 
  className = "w-12 h-12", 
  showText = false,
  textColor,
  variant = 'icon',
  lightMode = false,
  animated = true
}) => {
  const pharmaTextColor = textColor || (lightMode ? "text-slate-900" : "text-slate-900");
  const sloganTextColor = lightMode ? "text-slate-600" : "text-slate-200";

  if (variant === 'full' || showText) {
    return (
      <div className="inline-flex items-center gap-3 sm:gap-4 shrink-0 select-none group">
        {/* Official Brand Symbol Icon */}
        <motion.div 
          className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
          whileHover={{ scale: 1.06, rotate: [0, -1, 1, 0] }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <LogoSymbol animated={animated} />
        </motion.div>

        {/* Text Portion */}
        <div className="flex flex-col justify-center">
          {/* Main Title: Galenis */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className={`font-black text-lg sm:text-xl md:text-[26px] tracking-tight leading-none ${pharmaTextColor} transition-colors group-hover:text-[#008760]`}>
              Galenis
            </span>
          </div>

          {/* Tricolor Underline Bar (Green, Yellow, Red) with animated sheen */}
          <div className="relative h-1 w-full max-w-[100px] sm:max-w-[150px] rounded-full flex overflow-hidden my-1 shadow-2xs">
            <div className="w-1/3 bg-[#00A859] h-full" />
            <div className="w-1/3 bg-[#FFCC00] h-full" />
            <div className="w-1/3 bg-[#ED1C24] h-full" />
            {animated && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[galenisShine_3s_ease-in-out_infinite]"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            )}
          </div>

          {/* Slogan */}
          <span className={`hidden md:block text-[11px] sm:text-xs font-semibold leading-tight whitespace-nowrap ${sloganTextColor}`}>
            L'infrastructure numérique des données pharmaceutiques du <strong className="font-extrabold text-[#17324D]">Togo.</strong>
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
    >
      <LogoSymbol animated={animated} />
    </motion.div>
  );
};

// SVG Vector for the official Galenis / DataPharma Togo Logo matching the original emblem
export const LogoSymbol: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full filter drop-shadow-md overflow-visible"
    >
      <defs>
        {/* Outer Loop Green to Cyan Gradient */}
        <linearGradient id="outerLoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A859" />
          <stop offset="35%" stopColor="#00C48C" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Center Blue Circle Gradient */}
        <linearGradient id="centerCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="60%" stopColor="#003B73" />
          <stop offset="100%" stopColor="#072042" />
        </linearGradient>

        {/* Glow & Shadow */}
        <filter id="logoGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00A859" floodOpacity="0.25" />
        </filter>

        <filter id="crossGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.5" />
        </filter>

        {animated && (
          <style>{`
            @keyframes pulseHeartbeat {
              0%, 100% { transform: scale(1); opacity: 1; }
              14% { transform: scale(1.08); opacity: 0.95; }
              28% { transform: scale(1); opacity: 1; }
              42% { transform: scale(1.05); opacity: 0.95; }
              70% { transform: scale(1); opacity: 1; }
            }
            @keyframes galenisShine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .medical-cross-pulse {
              transform-origin: 92px 96px;
              animation: pulseHeartbeat 3.2s ease-in-out infinite;
            }
          `}</style>
        )}
      </defs>

      {/* Main Stylized Letter 'D' / Loop with Green-Cyan Gradient */}
      <path
        d="M 28 24
           C 28 14, 40 10, 52 10
           L 115 10
           C 165 10, 190 42, 190 95
           C 190 148, 160 185, 115 185
           L 55 185
           C 35 185, 28 175, 28 160
           Z"
        fill="url(#outerLoopGrad)"
        filter="url(#logoGlow)"
      />

      {/* Inner White Cutout Framing the Blue Center */}
      <path
        d="M 52 38
           L 105 38
           C 142 38, 162 62, 162 95
           C 162 128, 140 155, 105 155
           L 52 155
           Z"
        fill="#FFFFFF"
      />

      {/* Center Deep Blue Medical Circle */}
      <circle
        cx="92"
        cy="96"
        r="44"
        fill="url(#centerCircleGrad)"
      />

      {/* Bold White Medical Cross inside Blue Circle */}
      <g 
        fill="#FFFFFF" 
        className={animated ? "medical-cross-pulse" : ""}
        filter="url(#crossGlow)"
      >
        {/* Vertical Cross Bar */}
        <rect x="83.5" y="70" width="17" height="52" rx="4.5" />
        {/* Horizontal Cross Bar */}
        <rect x="66" y="87.5" width="52" height="17" rx="4.5" />
      </g>

      {/* Flowing Yellow National Ribbon along bottom curve */}
      <path
        d="M 28 148
           C 50 148, 105 152, 150 120
           C 155 116, 162 124, 156 132
           C 125 168, 65 168, 28 158
           Z"
        fill="#FFCC00"
      />

      {/* Lower Green Ribbon */}
      <path
        d="M 28 158
           C 65 168, 125 168, 156 132
           C 160 138, 154 148, 146 155
           C 118 180, 58 184, 28 172
           Z"
        fill="#006A4E"
      />

      {/* Red Canton Accent on Bottom Left (Togo Flag Element) */}
      <path
        d="M 28 144
           L 38 144
           L 38 168
           L 28 168
           Z"
        fill="#ED1C24"
      />

      {/* Small White Star in Red Canton */}
      <polygon
        points="33,151 34.2,154.5 38,154.5 35,156.8 36.2,160.2 33,158 29.8,160.2 31,156.8 28,154.5 31.8,154.5"
        fill="#FFFFFF"
      />
    </svg>
  );
};
