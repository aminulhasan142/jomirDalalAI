"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn, getRiskLabel } from "@/lib/utils";

interface RiskBadgeProps {
  level: "GREEN" | "YELLOW" | "RED" | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ level, className, size = "md" }: RiskBadgeProps) {
  const norm = (level || "").toUpperCase();
  const label = getRiskLabel(norm);

  const isGreen = norm === "GREEN" || norm === "SAFE" || norm === "LOW";
  const isYellow = norm === "YELLOW" || norm === "WARNING" || norm === "MEDIUM";

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2 font-bold",
    lg: "px-5 py-2.5 text-base sm:text-lg gap-2.5 font-extrabold shadow-sm",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const colorStyles = isGreen
    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
    : isYellow
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : "bg-rose-50 text-rose-800 border-rose-200";

  const iconColors = isGreen
    ? "text-emerald-700"
    : isYellow
    ? "text-amber-700"
    : "text-rose-700";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border transition-all select-none",
        colorStyles,
        sizeClasses[size],
        className
      )}
    >
      {isGreen ? (
        <ShieldCheck className={cn(iconSizes[size], iconColors)} />
      ) : isYellow ? (
        <AlertTriangle className={cn(iconSizes[size], iconColors)} />
      ) : (
        <AlertOctagon className={cn(iconSizes[size], iconColors)} />
      )}
      <span>{label}</span>
    </div>
  );
}
