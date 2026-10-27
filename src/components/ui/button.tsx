import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

// shadcn/ui Button (bundle `t` in products._slug-h3Hh6hlK.js). The cva config
// is reproduced as plain maps; class order matches cva output (base, variant, size, className).
const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const VARIANTS = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const SIZES = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
} as const;

export function buttonVariants({
  variant,
  size,
  className,
}: {
  variant?: keyof typeof VARIANTS | null;
  size?: keyof typeof SIZES | null;
  className?: string;
} = {}) {
  return [BASE, VARIANTS[variant ?? "default"], SIZES[size ?? "default"], className].filter(Boolean).join(" ");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS | null;
  size?: keyof typeof SIZES | null;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild && isValidElement(children)) {
      // Minimal Radix Slot: merge props/className onto the single child.
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        ...props,
        ...child.props,
        className: [classes, child.props.className].filter(Boolean).join(" "),
      } as { className?: string });
    }
    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
