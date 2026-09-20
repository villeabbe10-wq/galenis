import React from "react";
import { cn } from "../../lib/utils";

interface AmbientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Background radial ambient glow 1 (Emerald) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-400/10 rounded-full blur-[120px] opacity-70" />
      
      {/* Background radial ambient glow 2 (Cyan/Navy) */}
      <div className="pointer-events-none absolute top-96 -right-20 w-[500px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] opacity-60" />

      {/* Subtle grid pattern with radial fade */}
      <div 
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" 
      />

      {children}
    </div>
  );
};
