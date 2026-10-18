import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts English digits (0-9) to Bangla numerals (০-৯)
export function formatBanglaNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "০";
  const banglaDigits: { [key: string]: string } = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
    ".": ".",
    "-": "-",
    "%": "%",
  };

  const str = String(value);
  return str
    .split("")
    .map((char) => banglaDigits[char] || char)
    .join("");
}

// Formats a decimal number into a percentage with Bangla numeral representation
export function formatPercentage(num: number | undefined | null, decimals: number = 2): string {
  if (num === undefined || num === null || isNaN(num)) return "০%";
  const pct = (num * 100).toFixed(decimals);
  return `${formatBanglaNumber(pct)}%`;
}

export type RiskLevel = "GREEN" | "YELLOW" | "RED" | "safe" | "warning" | "high" | "low" | "medium";

// Returns Tailwind color classes based on risk level
export function getRiskColor(level: string | undefined): {
  badge: string;
  text: string;
  border: string;
  bg: string;
  glow: string;
} {
  const norm = (level || "").toUpperCase();
  if (norm === "GREEN" || norm === "SAFE" || norm === "LOW") {
    return {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    };
  }
  if (norm === "YELLOW" || norm === "WARNING" || norm === "MEDIUM") {
    return {
      badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    };
  }
  // Default to RED / High Risk
  return {
    badge: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
  };
}

// Returns Bangla risk label
export function getRiskLabel(level: string | undefined): string {
  const norm = (level || "").toUpperCase();
  if (norm === "GREEN" || norm === "SAFE" || norm === "LOW") {
    return "নিরাপদ (Clear Title)";
  }
  if (norm === "YELLOW" || norm === "WARNING" || norm === "MEDIUM") {
    return "সতর্কতা (Minor Warning)";
  }
  return "উচ্চ ঝুঁকি (High Risk)";
}
