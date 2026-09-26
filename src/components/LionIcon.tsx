import React from 'react';

export interface LionIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * Emblème Officiel Unique : Tête de Lion (Lion du Togo / Galenis)
 * 100% dressé vers le haut (oreilles et couronne en haut, yeux au centre, museau, truffe et menton en bas).
 */
export const LionIcon: React.FC<LionIconProps> = ({ 
  className = "w-5 h-5",
  color,
  style,
  'aria-label': ariaLabel = "Tête de Lion - Emblème Officiel"
}) => {
  const mergedStyle = color ? { color, ...style } : style;

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`inline-block shrink-0 ${className}`}
      aria-label={ariaLabel}
      style={mergedStyle}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Couronne Supérieure & Crinière Royale (Sommet du crâne) */}
      <path d="M8.5 3.5 Q12 1.8 15.5 3.5" />
      
      {/* 2. Oreilles Royales dressées vers le haut */}
      {/* Oreille gauche (haut-gauche) */}
      <path d="M5.5 5.5 C4.2 3.2 6.5 1.8 8.2 3.2 C8.5 4 8.5 4.8 8.5 5.5" />
      {/* Oreille droite (haut-droite) */}
      <path d="M18.5 5.5 C19.8 3.2 17.5 1.8 15.8 3.2 C15.5 4 15.5 4.8 15.5 5.5" />

      {/* 3. Contour Extérieur de la Crinière (du haut vers les épaules) */}
      <path 
        d="M8.5 3.5 C4.5 4.2 2.5 8 2.8 12.2 C3.1 16 5.5 19.2 8.5 21 L10 22.5 L12 21.2 L14 22.5 L15.5 21 C18.5 19.2 20.9 16 21.2 12.2 C21.5 8 19.5 4.2 15.5 3.5" 
      />

      {/* 4. Ondulations et mèches de la Crinière */}
      <path d="M4.5 10 C3.8 11.5 4 13.5 5 15" />
      <path d="M19.5 10 C20.2 11.5 20 13.5 19 15" />
      <path d="M6.5 7.5 C5.8 9.5 6 12 7 14" />
      <path d="M17.5 7.5 C18.2 9.5 18 12 17 14" />

      {/* 5. Arcade Sourcilière et Front */}
      <path d="M8 8 Q9.8 6.8 11.5 8" />
      <path d="M12.5 8 Q14.2 6.8 16 8" />

      {/* 6. Yeux Nobles (remplis et centrés) */}
      <circle cx="9.2" cy="10" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10" r="0.95" fill="currentColor" stroke="none" />

      {/* 7. Arête du Museau & Truffe triangulaire en bas */}
      <path d="M10.8 10.5 L10.8 13.2 L12 14.2 L13.2 13.2 L13.2 10.5" />
      <path d="M10.2 14.2 H13.8 L12 15.8 Z" fill="currentColor" stroke="none" />

      {/* 8. Museau, Bouche et Menton (en bas) */}
      <path d="M12 15.8 V17.2" />
      <path d="M9.5 17.2 Q10.8 18 12 17.2 Q13.2 18 14.5 17.2" />
      <path d="M10.5 19 Q12 20.2 13.5 19" />

      {/* 9. Moustaches Félines */}
      <path d="M6.5 15.2 L9 15.8" />
      <path d="M6.8 17 L9.2 16.8" />
      <path d="M17.5 15.2 L15 15.8" />
      <path d="M17.2 17 L14.8 16.8" />
    </svg>
  );
};

export const TogoLionIcon = LionIcon;
export const TogoLionSolidIcon = LionIcon;
export default LionIcon;
