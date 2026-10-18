import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = "md",
  text,
  label,
}: LoadingSpinnerProps) {
  const displayText = text ?? label;

  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-4">
      <div
        className={cn(
          "animate-spin rounded-full border-gray-200 border-t-emerald-700",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={displayText || "Loading"}
      />
      {displayText && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {displayText}
        </p>
      )}
    </div>
  );
}
