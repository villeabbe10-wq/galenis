import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface BentoCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "dark" | "flat" | "accent";
  glow?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  variant = "glass",
  glow = false,
  ...props
}) => {
  const variantStyles = {
    glass:
      "bg-white/85 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_-10px_rgba(0,168,120,0.09),0_1px_3px_0_rgba(0,0,0,0.05)] hover:border-emerald-500/40",
    dark:
      "bg-gradient-to-br from-slate-900 via-[#03231a] to-slate-900 text-white border border-emerald-500/25 shadow-xl hover:border-emerald-400/50",
    flat:
      "bg-white border border-slate-200/80 shadow-xs hover:border-slate-300",
    accent:
      "bg-gradient-to-br from-emerald-50/90 via-white to-cyan-50/60 border border-emerald-200/80 shadow-xs hover:border-emerald-300",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "group relative overflow-hidden rounded-[26px] p-5 sm:p-6 transition-all duration-300",
        variantStyles[variant],
        glow && "luminous-border",
        className
      )}
      {...props}
    >
      {/* Subtle top inner light highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70" />

      {/* Subtle ambient hover spotlight */}
      <div className="pointer-events-none absolute -inset-px rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
