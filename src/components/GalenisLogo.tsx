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
  // Primary colors matching official logo
  const pharmaTextColor = textColor || (lightMode ? "text-slate-900" : "text-slate-900");
  const sloganTextColor = lightMode ? "text-slate-600" : "text-slate-200";

  if (variant === 'full' || showText) {
    return (
      <div className="inline-flex items-center gap-3 sm:gap-4 shrink-0 select-none group">
        {/* Logo Symbol Icon */}
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

// SVG Vector for the official Galenis Togo "P" Icon with Smooth Keyframe Animations
const LogoSymbol: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full filter drop-shadow-md overflow-visible"
    >
      <defs>
        {/* Main P Gradient */}
        <linearGradient id="pGradient" x1="20%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A859" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0B192C" />
        </linearGradient>

        <linearGradient id="ribbonGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00A859" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="glowLinear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
        </linearGradient>

        <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>

        <filter id="crossGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {animated && (
          <style>{`
            @keyframes pulseHeartbeat {
              0%, 100% { transform: scale(1); opacity: 1; }
              14% { transform: scale(1.12); opacity: 0.95; }
              28% { transform: scale(1); opacity: 1; }
              42% { transform: scale(1.08); opacity: 0.95; }
              70% { transform: scale(1); opacity: 1; }
            }
            @keyframes pulseNode {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.22); opacity: 1; filter: drop-shadow(0 0 4px #00A859); }
            }
            @keyframes pulseGoldNode {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 5px #FFCC00); }
            }
            @keyframes linePulse {
              0%, 100% { stroke-opacity: 0.7; stroke-width: 4px; }
              50% { stroke-opacity: 1; stroke-width: 5.5px; }
            }
            @keyframes starTwinkle {
              0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
              50% { transform: scale(1.15) rotate(15deg); opacity: 0.85; }
            }
            @keyframes ribbonSheen {
              0% { opacity: 0.3; transform: translateX(-30px); }
              50% { opacity: 0.8; }
              100% { opacity: 0.3; transform: translateX(30px); }
            }
            @keyframes galenisShine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .logo-cross-animated {
              transform-origin: 108px 90px;
              animation: pulseHeartbeat 3.2s ease-in-out infinite;
            }
            .node-1-animated { transform-origin: 18px 70px; animation: pulseNode 3s ease-in-out infinite 0.2s; }
            .node-2-animated { transform-origin: 48px 88px; animation: pulseGoldNode 2.6s ease-in-out infinite 0.6s; }
            .node-3-animated { transform-origin: 28px 115px; animation: pulseNode 3.4s ease-in-out infinite 1s; }
            .node-4-animated { transform-origin: 12px 165px; animation: pulseNode 3s ease-in-out infinite 1.4s; }
            .line-pulse-animated { animation: linePulse 2.8s ease-in-out infinite; }
            .star-twinkle-animated { transform-origin: 50px 163px; animation: starTwinkle 4s ease-in-out infinite; }
          `}</style>
        )}
      </defs>

      {/* Main Stylized Letter 'P' Outer Path */}
      <path
        d="M 65 25 
           C 115 25, 175 40, 175 90 
           C 175 135, 125 155, 80 155
           L 65 155
           L 65 180
           C 65 188, 55 190, 50 185
           L 45 178
           L 45 45
           C 45 32, 53 25, 65 25 Z"
        fill="url(#pGradient)"
      />

      {/* Inner Loop Cutout of P */}
      <path
        d="M 72 52 
           L 105 52 
           C 135 52, 148 68, 148 90 
           C 148 112, 132 128, 102 128 
           L 72 128 Z"
        fill="#FFFFFF"
      />

      {/* Medical Cross Symbol inside top loop - with heartbeat breathing animation */}
      <g 
        fill="#00A859" 
        className={animated ? "logo-cross-animated" : ""}
        filter="url(#crossGlow)"
      >
        <rect x="100" y="74" width="16" height="32" rx="3" />
        <rect x="92" y="82" width="32" height="16" rx="3" />
      </g>

      {/* Left Network Constellation Graph (4 nodes + connecting lines with pulse) */}
      <g filter="url(#shadowFilter)">
        {/* Connecting Lines with pulsating stroke */}
        <line x1="18" y1="70" x2="48" y2="88" stroke="#00A859" strokeWidth="4.5" strokeLinecap="round" className={animated ? "line-pulse-animated" : ""} />
        <line x1="28" y1="115" x2="48" y2="88" stroke="#00A859" strokeWidth="4.5" strokeLinecap="round" className={animated ? "line-pulse-animated" : ""} />
        <line x1="12" y1="165" x2="28" y2="115" stroke="#00A859" strokeWidth="4.5" strokeLinecap="round" className={animated ? "line-pulse-animated" : ""} />
        <line x1="48" y1="88" x2="65" y2="88" stroke="#FFCC00" strokeWidth="3.5" strokeLinecap="round" className={animated ? "line-pulse-animated" : ""} />

        {/* Node Circles with pulsating waves */}
        <circle cx="18" cy="70" r="10" fill="#00A859" className={animated ? "node-1-animated" : ""} />
        <circle cx="48" cy="88" r="8" fill="#FFCC00" stroke="#00A859" strokeWidth="2" className={animated ? "node-2-animated" : ""} />
        <circle cx="28" cy="115" r="9" fill="#00A859" className={animated ? "node-3-animated" : ""} />
        <circle cx="12" cy="165" r="10" fill="#00A859" className={animated ? "node-4-animated" : ""} />
      </g>

      {/* Bottom Togo Flag Ribbon curving on lower edge of P */}
      <g filter="url(#shadowFilter)">
        {/* Curved ribbon background */}
        <path
          d="M 45 150
             C 65 150, 115 155, 145 125
             C 152 118, 160 128, 150 138
             C 115 178, 60 178, 38 158 Z"
          fill="#006A4E"
        />

        {/* Togo Canton Red square with White Star */}
        <path
          d="M 38 152
             C 42 148, 55 148, 65 152
             L 60 174
             C 48 172, 40 166, 38 152 Z"
          fill="#D21034"
        />
        {/* White Star with subtle twinkle */}
        <polygon 
          points="50,154 53,161 60,161 55,165 57,172 50,168 43,172 45,165 40,161 47,161" 
          fill="#FFFFFF" 
          className={animated ? "star-twinkle-animated" : ""}
        />

        {/* Yellow Stripe */}
        <path
          d="M 65 152
             C 95 152, 125 148, 148 130
             L 145 135
             C 122 153, 92 158, 63 158 Z"
          fill="#FFCE00"
        />

        {/* Green Stripe */}
        <path
          d="M 63 158
             C 92 158, 122 153, 145 135
             L 142 140
             C 118 162, 88 168, 58 166 Z"
          fill="#006A4E"
        />
      </g>
    </svg>
  );
};

