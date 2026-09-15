import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium text-sm transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer",
  {
    variants: {
      variant: {
        // Primary Warm Cream (Prompt styling)
        default:
          "bg-[#DEDBC8] text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-lg",
        // Liquid Glass Pill (Prompt styling)
        liquid:
          "liquid-glass text-[#E1E0CC] hover:scale-[1.03] active:scale-[0.98]",
        // Charcoal Surface Button
        secondary:
          "bg-[#212121] text-[#E1E0CC] border border-white/[0.08] hover:bg-[#2a2a2a] hover:border-white/[0.16] hover:text-white",
        // Ghost Button
        ghost:
          "text-gray-400 hover:text-[#E1E0CC] hover:bg-[#101010]",
        // Outline Button
        outline:
          "border border-[#DEDBC8]/40 text-[#DEDBC8] hover:bg-[#DEDBC8]/10 hover:border-[#DEDBC8]",
        // Destructive
        destructive:
          "bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/40 hover:text-red-300",
        // Link
        link:
          "text-[#DEDBC8] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
