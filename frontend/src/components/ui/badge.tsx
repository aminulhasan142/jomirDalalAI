import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-700 text-white",
        secondary:
          "bg-gray-100 text-gray-700 border border-gray-200",
        destructive:
          "bg-red-100 text-red-700 border border-red-200",
        outline:
          "border border-gray-300 text-gray-600",
        green:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        yellow:
          "bg-amber-50 text-amber-700 border border-amber-200",
        red:
          "bg-red-50 text-red-700 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
