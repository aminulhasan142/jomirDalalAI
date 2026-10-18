import React from "react";
import { formatBanglaNumber } from "@/lib/utils";

interface BanglaNumberProps {
  value: number | string | undefined | null;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function BanglaNumber({
  value,
  className,
  prefix = "",
  suffix = "",
}: BanglaNumberProps) {
  const formatted = formatBanglaNumber(value);
  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
