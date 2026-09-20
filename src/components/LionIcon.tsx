import React from 'react';

export const LionIcon: React.FC<{ className?: string; filled?: boolean }> = ({ 
  className = "w-5 h-5",
  filled = false
}) => (
  <svg 
    viewBox="0 0 32 32" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-label="Tête de Lion Galenis Togo"
  >
    {/* Outer Majestic Mane */}
    <path 
      d="M16 2.5 C13 2.5 10 3.8 8 6 C6 5.5 4 7 3.5 9.5 C3 12 4 14.5 5 16 C3.5 18 3.5 21 5.5 23.5 C7.5 26 10.5 28 13.5 29 C15 29.5 17 29.5 18.5 29 C21.5 28 24.5 26 26.5 23.5 C28.5 21 28.5 18 27 16 C28 14.5 29 12 28.5 9.5 C28 7 26 5.5 24 6 C22 3.8 19 2.5 16 2.5 Z" 
      fill={filled ? "currentColor" : "none"}
      strokeWidth="2"
    />
    {/* Forehead & Brow lines */}
    <path d="M11 9 C13 7.8 19 7.8 21 9" strokeWidth="1.8" />
    <path d="M16 8.5 V13.5" strokeWidth="1.8" />
    {/* Ears */}
    <path d="M7 8 C6 6 8 4.5 10 5.5" strokeWidth="1.8" />
    <path d="M25 8 C26 6 24 4.5 22 5.5" strokeWidth="1.8" />
    {/* Eyes */}
    <path d="M10 13.5 Q12.5 12 13.5 13.5" strokeWidth="2" />
    <circle cx="12" cy="13.2" r="0.8" fill="currentColor" />
    <path d="M22 13.5 Q19.5 12 18.5 13.5" strokeWidth="2" />
    <circle cx="20" cy="13.2" r="0.8" fill="currentColor" />
    {/* Nose & Muzzle */}
    <path d="M14 17.5 L16 19.5 L18 17.5 Z" fill="currentColor" />
    <path d="M16 19.5 V23.5" strokeWidth="1.8" />
    <path d="M13 23.5 C14.5 24.5 17.5 24.5 19 23.5" strokeWidth="1.8" />
    {/* Chin & Whisker details */}
    <path d="M14 26.5 H18" strokeWidth="1.8" />
    <path d="M9 19 H6.5" strokeWidth="1.5" />
    <path d="M23 19 H25.5" strokeWidth="1.5" />
  </svg>
);
