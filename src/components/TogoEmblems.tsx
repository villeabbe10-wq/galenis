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

export const TogoLionIcon: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-5 h-5",
  color = "currentColor"
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`inline-block shrink-0 ${className}`}
      aria-label="Lion Emblème du Togo"
    >
      {/* Royal Mane Contour */}
      <path 
        d="M12 2.5C8.8 2.5 5 4.5 4.5 8.8C4 12.2 5.5 15.5 7 17.5C8.2 19.2 9.5 21 12 21.8C14.5 21 15.8 19.2 17 17.5C18.5 15.5 20 12.2 19.5 8.8C19 4.5 15.2 2.5 12 2.5Z" 
        fill={color} 
        fillOpacity="0.18" 
      />
      {/* Mane Radiating Strands */}
      <path d="M12 2.5V4.8M8.2 3.8L9.6 5.8M15.8 3.8L14.4 5.8M4.5 8.8L7 9.8M19.5 8.8L17 9.8M4.8 13.5L7.2 13.5M19.2 13.5L16.8 13.5M7 17.5L9 16.5M17 17.5L15 16.5" />
      {/* Ears */}
      <path d="M6.8 6C5.8 5 4.5 5.5 4.5 7C4.5 8.2 5.5 8.8 6.5 8.8" />
      <path d="M17.2 6C18.2 5 19.5 5.5 19.5 7C19.5 8.2 18.5 8.8 17.5 8.8" />
      {/* Forehead & Eyebrows */}
      <path d="M9.5 10C10.5 10.8 13.5 10.8 14.5 10" />
      {/* Eyes */}
      <circle cx="9.5" cy="9" r="0.8" fill={color} />
      <circle cx="14.5" cy="9" r="0.8" fill={color} />
      {/* Snout and Nose */}
      <path d="M12 11.8L10.2 14H13.8L12 11.8Z" fill={color} />
      <path d="M12 14V15.5M12 15.5C10.8 15.5 9.8 16.2 9.2 17.2M12 15.5C13.2 15.5 14.2 16.2 14.8 17.2" />
      {/* Whisker Tufts */}
      <path d="M8 15L5.5 14.5M8 16L5.5 16.5M16 15L18.5 14.5M16 16L18.5 16.5" />
    </svg>
  );
};

export const TogoLionSolidIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Lion du Togo"
    >
      {/* Togolese Lion Royal Emblem Head */}
      <g>
        {/* Crown of Mane */}
        <path d="M50,8 C32,8 18,18 14,35 C10,48 15,62 22,72 C28,80 38,90 50,94 C62,90 72,80 78,72 C85,62 90,48 86,35 C82,18 68,8 50,8 Z" opacity="0.25" />
        
        {/* Mane Tuft spikes */}
        <path d="M50,5 L54,16 L50,14 L46,16 Z M33,12 L41,20 L37,21 L30,17 Z M67,12 L70,17 L63,21 L59,20 Z M19,25 L28,31 L24,34 L17,29 Z M81,25 L83,29 L76,34 L72,31 Z M12,42 L22,44 L19,48 L11,46 Z M88,42 L89,46 L81,48 L78,44 Z M13,60 L23,59 L21,63 L14,64 Z M87,60 L86,64 L79,63 L77,59 Z M22,76 L31,71 L30,76 L24,80 Z M78,76 L76,80 L70,76 L69,71 Z" />
        
        {/* Ears */}
        <path d="M25,24 C20,20 15,26 17,32 C19,38 25,38 27,34 Z M75,24 C73,34 79,38 81,32 C83,26 78,20 73,24 Z" />
        
        {/* Head Base */}
        <path d="M50,22 C37,22 28,32 28,47 C28,62 38,76 50,82 C62,76 72,62 72,47 C72,32 63,22 50,22 Z" />
        
        {/* Eyes (Cutout / contrast) */}
        <ellipse cx="40" cy="44" rx="4" ry="2.5" fill="#FFFFFF" />
        <circle cx="40" cy="44" r="1.5" fill="#000000" />
        <ellipse cx="60" cy="44" rx="4" ry="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="44" r="1.5" fill="#000000" />
        
        {/* Forehead furrow */}
        <path d="M46,32 L50,38 L54,32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Nose and Muzzle */}
        <polygon points="50,52 42,60 58,60" fill="#FFFFFF" />
        <path d="M50,60 L50,67 M50,67 C44,67 40,71 38,75 M50,67 C56,67 60,71 62,75" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        
        {/* Whiskers */}
        <line x1="34" y1="64" x2="22" y2="61" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="34" y1="68" x2="20" y2="69" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="66" y1="64" x2="78" y2="61" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="66" y1="68" x2="80" y2="69" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};


