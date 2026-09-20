import React from "react";
import { cn } from "../../lib/utils";

interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "amber" | "cyan" | "rose" | "slate" | "dark";
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  variant = "emerald",
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    emerald: "bg-emerald-50/90 text-emerald-800 border-emerald-300/70 shadow-[0_2px_8px_-2px_rgba(0,168,120,0.2)]",
    amber: "bg-amber-50/90 text-amber-800 border-amber-300/70 shadow-[0_2px_8px_-2px_rgba(217,119,6,0.2)]",
    cyan: "bg-cyan-50/90 text-cyan-800 border-cyan-300/70 shadow-[0_2px_8px_-2px_rgba(14,116,144,0.2)]",
    rose: "bg-rose-50/90 text-rose-800 border-rose-300/70 shadow-[0_2px_8px_-2px_rgba(225,29,72,0.2)]",
    slate: "bg-slate-100/90 text-slate-700 border-slate-200/90 shadow-xs",
    dark: "bg-slate-900/90 text-emerald-300 border-emerald-500/30 shadow-md",
  };

  const dotColors = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    cyan: "bg-cyan-500",
    rose: "bg-rose-500",
    slate: "bg-slate-400",
    dark: "bg-emerald-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border transition-all duration-200 select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              dotColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
};
