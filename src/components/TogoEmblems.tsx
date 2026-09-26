import React from 'react';

export const TogoFlag: React.FC<{ className?: string }> = ({ className = "w-6 h-4" }) => {
  return (
    <svg
      viewBox="0 0 500 309"
      className={`inline-block rounded-sm shadow-sm overflow-hidden shrink-0 ${className}`}
      aria-label="Drapeau du Togo"
    >
      {/* 5 Stripes (Green and Yellow) */}
      <rect width="500" height="61.8" y="0" fill="#006a4e" />
      <rect width="500" height="61.8" y="61.8" fill="#ffce00" />
      <rect width="500" height="61.8" y="123.6" fill="#006a4e" />
      <rect width="500" height="61.8" y="185.4" fill="#ffce00" />
      <rect width="500" height="61.8" y="247.2" fill="#006a4e" />
      
      {/* Red Canton */}
      <rect width="185.4" height="185.4" x="0" y="0" fill="#d21034" />
      
      {/* White Star */}
      <polygon
        points="92.7,28 112.5,89 176.6,89 124.8,126.7 144.6,187.7 92.7,150 40.8,187.7 60.6,126.7 8.8,89 72.9,89"
        fill="#ffffff"
      />
    </svg>
  );
};

export const TogoCoatOfArms: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-sm">
        {/* Outer Oval Border Green */}
        <ellipse cx="100" cy="120" rx="92" ry="112" fill="#ffffff" stroke="#006a4e" strokeWidth="5" />
        
        {/* Motto Banner at top */}
        <path d="M 42,42 Q 100,12 158,42 L 152,55 Q 100,28 48,55 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
        <text x="56" y="38" fill="#000000" fontSize="8" fontWeight="800" fontFamily="sans-serif">Travail</text>
        <text x="100" y="28" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="sans-serif">Liberté</text>
        <text x="144" y="38" textAnchor="end" fill="#000000" fontSize="8" fontWeight="800" fontFamily="sans-serif">Patrie</text>

        {/* Two Togolese Flags on Flagpoles */}
        {/* Left Flagpole & Flag */}
        <line x1="100" y1="120" x2="60" y2="52" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <g transform="translate(48,52) rotate(-22) scale(0.12)">
          <rect width="300" height="185" fill="#006a4e" />
          <rect width="300" height="37" y="37" fill="#ffce00" />
          <rect width="300" height="37" y="111" fill="#ffce00" />
          <rect width="111" height="111" fill="#d21034" />
          <polygon points="55.5,18 67,52 103,52 74,73 85,108 55.5,86 26,108 37,73 8,52 44,52" fill="#ffffff" />
        </g>

        {/* Right Flagpole & Flag */}
        <line x1="100" y1="120" x2="140" y2="52" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <g transform="translate(116,36) rotate(22) scale(0.12)">
          <rect width="300" height="185" fill="#006a4e" />
          <rect width="300" height="37" y="37" fill="#ffce00" />
          <rect width="300" height="37" y="111" fill="#ffce00" />
          <rect width="111" height="111" fill="#d21034" />
          <polygon points="55.5,18 67,52 103,52 74,73 85,108 55.5,86 26,108 37,73 8,52 44,52" fill="#ffffff" />
        </g>

        {/* Central Sun Disk with Scalloped Rays */}
        <g transform="translate(100, 120)">
          {/* Sun Rays */}
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M 0,-26 L 4,-20 L -4,-20 Z"
              fill="#ffce00"
              transform={`rotate(${i * 22.5})`}
            />
          ))}
          <circle cx="0" cy="0" r="21" fill="#ffce00" stroke="#d97706" strokeWidth="1" />
          <text x="0" y="7" textAnchor="middle" fill="#000000" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            RT
          </text>
        </g>

        {/* Left Red Lion with Bow */}
        <g transform="translate(40,115)">
          {/* Stylized Red Lion Body */}
          <path d="M 32,20 Q 24,15 18,25 Q 12,35 15,50 Q 22,65 30,70 L 32,72 L 20,72 L 22,55 L 8,55 L 6,45 Q 12,42 16,35 Q 12,28 20,20 Z" fill="#d21034" />
          <circle cx="26" cy="18" r="7" fill="#d21034" />
          {/* Tail */}
          <path d="M 30,62 Q 40,55 35,40" stroke="#d21034" strokeWidth="2.5" fill="none" />
          {/* Bow & Arrow */}
          <path d="M 6,15 Q 0,35 6,55" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="15" x2="6" y2="55" stroke="#1e293b" strokeWidth="1" />
          <line x1="2" y1="35" x2="22" y2="25" stroke="#1e293b" strokeWidth="1.5" />
        </g>

        {/* Right Red Lion with Bow */}
        <g transform="translate(122,115) scale(-1, 1) translate(-38, 0)">
          {/* Stylized Red Lion Body */}
          <path d="M 32,20 Q 24,15 18,25 Q 12,35 15,50 Q 22,65 30,70 L 32,72 L 20,72 L 22,55 L 8,55 L 6,45 Q 12,42 16,35 Q 12,28 20,20 Z" fill="#d21034" />
          <circle cx="26" cy="18" r="7" fill="#d21034" />
          {/* Tail */}
          <path d="M 30,62 Q 40,55 35,40" stroke="#d21034" strokeWidth="2.5" fill="none" />
          {/* Bow & Arrow */}
          <path d="M 6,15 Q 0,35 6,55" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="15" x2="6" y2="55" stroke="#1e293b" strokeWidth="1" />
          <line x1="2" y1="35" x2="22" y2="25" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

export const ONPTLogo: React.FC<{ className?: string; href?: string }> = ({ 
  className = "w-16 h-20",
  href
}) => {
  const googleSearchLink = "https://www.google.com/search?q=ordre+national+des+pharmaciens+du+togo";
  const targetLink = href || googleSearchLink;

  const content = (
    <div className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}>
      <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-md transition-transform group-hover:scale-105" aria-label="Ordre National des Pharmaciens du Togo">
        {/* Outer Green Oval Border */}
        <ellipse cx="80" cy="100" rx="76" ry="96" fill="#ffffff" stroke="#006a4e" strokeWidth="7" />
        <ellipse cx="80" cy="100" rx="70" ry="90" fill="none" stroke="#006a4e" strokeWidth="1.5" />
        
        {/* Curvaceous Text Path for Ordre National des Pharmaciens du Togo */}
        <path id="onpt-text-arc" d="M 20,100 A 60,80 0 1,1 140,100 A 60,80 0 1,1 20,100" fill="none" />
        
        <text fill="#006a4e" fontSize="10.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
          <textPath href="#onpt-text-arc" startOffset="50%" textAnchor="middle">
            Ordre National des Pharmaciens du Togo
          </textPath>
        </text>

        {/* Center Caduceus / Bowl of Hygieia */}
        <g transform="translate(80, 108) scale(1)">
          {/* Bowl */}
          <path d="M -28,-14 Q -22,12 0,15 Q 22,12 28,-14 Z" fill="#006a4e" />
          <ellipse cx="0" cy="-14" rx="28" ry="5" fill="#008864" />
          
          {/* Stem */}
          <rect x="-4" y="15" width="8" height="26" fill="#006a4e" rx="2" />
          
          {/* Base */}
          <ellipse cx="0" cy="41" rx="20" ry="5" fill="#006a4e" />

          {/* Snake wrapping around stem & drinking from cup */}
          <path
            d="M -2,38 C -12,30 -10,20 -2,16 C 8,12 12,0 -4,-18 C -18,-35 8,-46 18,-28 C 22,-18 12,-16 5,-16"
            fill="none"
            stroke="#006a4e"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Snake Head */}
          <circle cx="2" cy="-16" r="4" fill="#006a4e" />
          <circle cx="0" cy="-17" r="1" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );

  if (targetLink) {
    return (
      <a 
        href={targetLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        title="Ordre National des Pharmaciens du Togo (Lien Officiel)"
        className="inline-block hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
};

export const TogoMapOutline: React.FC<{ className?: string }> = ({ className = "w-16 h-24" }) => {
  return (
    <svg viewBox="0 0 100 220" className={`inline-block ${className}`} aria-label="Carte du Togo">
      {/* Togo geographic silhouette vector */}
      <path
        d="M 25,10 L 70,12 L 68,35 L 58,55 L 62,80 L 52,110 L 58,135 L 45,170 L 55,200 L 15,208 L 22,175 L 30,140 L 25,105 L 32,75 L 20,40 Z"
        fill="#006a4e"
        stroke="#ffce00"
        strokeWidth="2"
      />
      {/* Red Star in Maritime Region */}
      <circle cx="35" cy="190" r="6" fill="#d21034" />
      <polygon points="35,186 37,189 40,189 38,191 39,194 35,192 31,194 32,191 30,189 33,189" fill="#ffffff" />
    </svg>
  );
};

export const TogoHealthEmblem: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-5 h-5",
  color = "#006a4e"
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={`inline-block shrink-0 ${className}`}
      aria-label="Emblème Santé Togo"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#006a4e" />
      {/* Medical Cross */}
      <path d="M12 6V18M6 12H18" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
      {/* Small Central Star */}
      <circle cx="12" cy="12" r="2" fill="#ffce00" />
    </svg>
  );
};

import { LionIcon } from './LionIcon';
export { LionIcon, TogoLionIcon, TogoLionSolidIcon } from './LionIcon';

export const CamegTogoLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 160 110" className={`inline-block ${className}`} aria-label="Logo CAMEG TOGO">
      <rect width="160" height="110" rx="12" fill="#ffffff" />
      {/* Light green chalice / coupe d'Hygie */}
      <path
        d="M 18 42 Q 80 50 142 42 L 146 47 Q 80 62 86 78 L 74 78 Q 80 62 14 47 Z"
        fill="#7ac47a"
      />
      {/* Chalice stem and base */}
      <rect x="76" y="65" width="8" height="35" rx="3" fill="#7ac47a" />
      <ellipse cx="80" cy="98" rx="30" ry="7" fill="#7ac47a" />

      {/* Dark green large S-shaped snake winding around coupe */}
      {/* Snake lower coils */}
      <path
        d="M 58 92 C 50 82 72 74 96 82 C 112 88 108 98 84 98 C 65 98 56 88 78 76 C 96 66 102 52 86 42"
        fill="none"
        stroke="#0c541c"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Snake upper head S-curve */}
      <path
        d="M 86 44 C 70 34 58 20 68 10 C 80 -1 100 2 92 24 L 84 28"
        fill="none"
        stroke="#0c541c"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Snake arrow head */}
      <polygon points="86,18 96,28 76,28" fill="#0c541c" transform="rotate(-35 86 24)" />

      {/* Text CAMEG on left */}
      <text x="24" y="38" fill="#0c541c" fontSize="19" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        CAMEG
      </text>

      {/* Text TOGO on right */}
      <text x="104" y="38" fill="#0c541c" fontSize="19" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        TOGO
      </text>
    </svg>
  );
};

export const UbipharmLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 140 120" className={`inline-block ${className}`} aria-label="Logo UbiPharm">
      {/* Solid Dark Navy Background */}
      <rect width="140" height="120" rx="14" fill="#001833" />
      
      {/* White Stylized 'UP' Cross Symbol */}
      <g transform="translate(48, 12)">
        {/* Top-left cross bar */}
        <rect x="0" y="8" width="16" height="12" fill="#ffffff" />
        <rect x="8" y="0" width="12" height="16" fill="#ffffff" />
        
        {/* Main P / U Loop */}
        <path
          d="M 20 8 C 34 8 44 16 44 28 C 44 40 34 46 20 46 L 20 28 L 30 28 C 34 28 36 26 36 24 C 36 20 32 18 28 18 L 16 18 L 16 38 C 16 50 4 50 0 44 L 0 32 C 4 36 8 36 8 30 L 8 8 Z"
          fill="#ffffff"
        />
      </g>

      {/* Brand Typography: UbiPharm */}
      <text x="70" y="96" textAnchor="middle" fill="#ffffff" fontSize="21" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.3">
        UbiPharm
      </text>
    </svg>
  );
};

export const InamLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 120 135" className={`inline-block ${className}`} aria-label="Logo INAM Togo">
      <rect width="120" height="135" rx="12" fill="#f8fafc" />
      
      {/* Top INAM Tall Green Typography */}
      <g transform="translate(18, 6)">
        {/* I */}
        <rect x="6" y="2" width="11" height="42" fill="#006a38" />
        {/* N */}
        <path d="M 23 2 L 34 2 L 48 34 L 48 2 L 57 2 L 57 44 L 46 44 L 32 12 L 32 44 L 23 44 Z" fill="#006a38" />
        {/* A */}
        <path d="M 64 44 L 74 2 L 84 2 L 94 44 L 84 44 L 81 32 L 69 32 L 66 44 Z M 71 24 L 79 24 L 75 9 Z" fill="#006a38" transform="translate(-5, 0)" />
        {/* M */}
        <path d="M 84 44 L 84 2 L 95 2 L 102 24 L 109 2 L 120 2 L 120 44 L 111 44 L 111 14 L 104 34 L 100 34 L 93 14 L 93 44 Z" fill="#006a38" transform="translate(-16, 0)" />
      </g>

      {/* Arch Outline */}
      <path d="M 22 56 Q 60 28 98 56" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* Center 3 Family Silhouette Figures */}
      <g transform="translate(30, 42)">
        {/* Left Green Figure (Parent 1) */}
        <circle cx="16" cy="18" r="8" fill="#008751" />
        <rect x="8" y="27" width="16" height="34" rx="8" fill="#008751" />

        {/* Right Red Figure (Parent 2) */}
        <circle cx="44" cy="18" r="8" fill="#d32f2f" />
        <rect x="36" y="27" width="16" height="34" rx="8" fill="#d32f2f" />

        {/* Center Yellow Figure (Child) */}
        <circle cx="30" cy="27" r="7" fill="#ffd100" />
        <rect x="23" y="34" width="14" height="28" rx="7" fill="#ffd100" />

        {/* Text TOGO across chest */}
        <text x="30" y="47" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900" fontFamily="sans-serif">
          TOGO
        </text>
      </g>

      {/* Slogan curved: se soigner n'est plus un souci */}
      <path id="inam-slogan-arc" d="M 14 68 A 48 48 0 0 0 106 68" fill="none" />
      <text fill="#006a38" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">
        <textPath href="#inam-slogan-arc" startOffset="50%" textAnchor="middle">
          se soigner n'est plus un souci
        </textPath>
      </text>
    </svg>
  );
};

export const AmuLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 160 110" className={`inline-block ${className}`} aria-label="Logo AMU Togo">
      {/* Light Yellow/Cream Oval Background */}
      <ellipse cx="80" cy="55" rx="76" ry="50" fill="#feeaa5" stroke="#fcd34d" strokeWidth="1.5" />
      
      {/* Large Navy Bold AMU */}
      <text x="80" y="66" textAnchor="middle" fill="#094080" fontSize="48" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-1">
        AMU
      </text>

      {/* Subtitle: Assurance Maladie Universelle */}
      <text x="80" y="86" textAnchor="middle" fill="#094080" fontSize="7.8" fontWeight="700" fontFamily="sans-serif">
        Assurance Maladie Universelle
      </text>
    </svg>
  );
};

export const TedisPharmaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 180 115" className={`inline-block ${className}`} aria-label="Logo TEDIS Pharma TG">
      {/* Light Gray Metallic Background */}
      <rect width="180" height="115" rx="12" fill="#e5e7eb" />
      
      <g transform="translate(18, 20)">
        {/* T */}
        <path d="M 0 35 L 0 0 L 26 0 L 26 10 L 16 10 L 16 35 Z" fill="none" stroke="#374151" strokeWidth="2.5" />
        
        {/* E */}
        <path d="M 28 35 L 28 0 L 50 0 L 50 9 L 38 9 L 38 14 L 47 14 L 47 21 L 38 21 L 38 26 L 50 26 L 50 35 Z" fill="none" stroke="#374151" strokeWidth="2.5" />
        
        {/* D with Arrow shape inside */}
        <path d="M 52 35 L 52 0 C 72 0 80 10 80 18 C 80 27 72 35 52 35 Z M 62 9 L 62 26 L 70 18 Z" fill="none" stroke="#374151" strokeWidth="2.5" />
        
        {/* I with Red Dot */}
        <circle cx="89" cy="-7" r="5.5" fill="#dc2626" />
        <rect x="84" y="0" width="10" height="35" rx="2" fill="none" stroke="#374151" strokeWidth="2.5" />
        
        {/* S */}
        <path d="M 120 8 C 117 2 107 0 102 3 C 97 6 97 12 101 15 L 115 19 C 122 21 123 29 119 33 C 114 37 101 37 97 31" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

        {/* Connecting Baseline & PHARMA TG */}
        <path d="M 0 35 L 0 48 L 74 48" fill="none" stroke="#374151" strokeWidth="2.2" />
        <text x="78" y="52" fill="#374151" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
          PHARMA TG
        </text>
      </g>
    </svg>
  );
};

export const SapeursPompiersTogoLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 130 145" className={`inline-block ${className}`} aria-label="Logo BSPT Sapeurs-Pompiers Togo 118">
      {/* Crossed Fire Axes (Handles & Blades) */}
      {/* Left Axe */}
      <line x1="40" y1="12" x2="88" y2="132" stroke="#b08968" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 36 20 L 14 22 L 14 14 L 38 12 L 40 26 Z" fill="#1e293b" />
      
      {/* Right Axe */}
      <line x1="90" y1="12" x2="42" y2="132" stroke="#b08968" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 94 20 L 116 22 L 116 14 L 92 12 L 90 26 Z" fill="#1e293b" />

      {/* Main Shield Outline (Brown Border with Courage & Devouement) */}
      <path
        d="M 18 36 L 112 36 L 110 82 C 108 106 65 128 65 128 C 65 128 22 106 20 82 Z"
        fill="#3e2316"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Top Banner BSPT */}
      <rect x="18" y="10" width="94" height="24" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <text x="65" y="28" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
        BSPT
      </text>

      {/* Inner Shield (Togo Stripes) */}
      <g transform="translate(4, 3)">
        <path
          d="M 22 36 L 100 36 L 98 78 C 96 98 61 116 61 116 C 61 116 26 98 24 78 Z"
          fill="#008751"
        />
        {/* Yellow Stripe */}
        <rect x="24" y="52" width="74" height="16" fill="#ffd100" />
      </g>

      {/* Brown Border Text: COURAGE ET DEVOUEMENT */}
      <path id="bspt-left-arc" d="M 24 46 L 24 82 C 24 94 40 108 52 118" fill="none" />
      <text fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
        <textPath href="#bspt-left-arc" startOffset="10%">
          COURAGE
        </textPath>
      </text>
      
      <path id="bspt-right-arc" d="M 106 46 L 106 82 C 106 94 90 108 78 118" fill="none" />
      <text fill="#ffffff" fontSize="6.2" fontWeight="900" fontFamily="sans-serif">
        <textPath href="#bspt-right-arc" startOffset="10%">
          DEVOUEMENT
        </textPath>
      </text>

      {/* Center Flame (Red jagged) */}
      <path
        d="M 65 38 L 76 46 L 86 42 L 88 56 L 98 58 L 90 74 L 65 96 L 40 74 L 32 58 L 42 56 L 44 42 L 54 46 Z"
        fill="#dc2626"
      />

      {/* White Phone & 118 Center Badge */}
      <g transform="translate(42, 50)">
        {/* Phone Handset */}
        <path d="M 8 3 C 2 3 0 9 2 15 C 4 21 10 23 14 23 C 12 19 10 18 7 19 C 5 17 5 14 6 12 C 9 13 11 11 11 7 C 11 3 9 3 8 3 Z" fill="#ffffff" />
        {/* 118 */}
        <text x="26" y="19" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
          118
        </text>
      </g>

      {/* Black Box with TOGO */}
      <rect x="42" y="80" width="46" height="15" rx="3" fill="#000000" />
      <text x="65" y="91" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
        TOGO
      </text>
    </svg>
  );
};

export const CopharmaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block ${className}`} aria-label="Logo COPHARMA Togo">
      <rect width="94" height="94" x="3" y="3" rx="20" fill="#064e3b" />
      <circle cx="50" cy="44" r="28" fill="#ffffff" />
      <circle cx="50" cy="44" r="24" fill="none" stroke="#006a4e" strokeWidth="2" />
      <path d="M 40 40 Q 50 48 60 40 Z" fill="#006a4e" />
      <rect x="48" y="40" width="4" height="18" fill="#006a4e" />
      <ellipse cx="50" cy="58" rx="8" ry="2" fill="#006a4e" />
      <circle cx="50" cy="30" r="4" fill="#d21034" />
      <polygon points="50,22 52,26 56,26 53,28 54,32 50,30 46,32 47,28 44,26 48,26" fill="#ffce00" />
      <text x="50" y="86" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        COPHARMA
      </text>
    </svg>
  );
};

export const UniphartLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block ${className}`} aria-label="Logo UNIPHART Togo">
      <rect width="94" height="94" x="3" y="3" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <path
        d="M 30 20 L 42 20 L 42 46 C 42 54 58 54 58 46 L 58 20 L 70 20 L 70 48 C 70 66 30 66 30 48 Z"
        fill="#047857"
      />
      <rect x="45" y="30" width="10" height="24" rx="2" fill="#10b981" />
      <rect x="38" y="37" width="24" height="10" rx="2" fill="#10b981" />
      <text x="50" y="86" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
        UNIPHART
      </text>
    </svg>
  );
};

export const MshpTogoLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block ${className}`} aria-label="Ministère de la Santé Togo">
      <rect width="94" height="94" x="3" y="3" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <g transform="translate(18, 12) scale(0.64)">
        <circle cx="50" cy="50" r="46" fill="#006a4e" />
        <circle cx="50" cy="50" r="38" fill="#ffffff" />
        <path d="M 35 48 Q 50 56 65 48 Z" fill="#006a4e" />
        <rect x="48" y="38" width="4" height="30" fill="#006a4e" />
        <ellipse cx="50" cy="68" rx="14" ry="4" fill="#006a4e" />
        <circle cx="50" cy="28" r="8" fill="#d21034" />
        <polygon points="50,22 52,26 56,26 53,28 54,32 50,30 46,32 47,28 44,26 48,26" fill="#ffffff" />
      </g>
      <text x="50" y="86" textAnchor="middle" fill="#006a4e" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        MSHP TOGO
      </text>
    </svg>
  );
};


