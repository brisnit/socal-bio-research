"use client";

import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn Label (bundle client chunk `pr`). Radix Label replicated natively: it is a plain
 * <label> whose onMouseDown prevents text selection on double-click unless the press is
 * on a form control.
 */
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, onMouseDown, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
      onMouseDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("button, input, select, textarea")) return;
        onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }}
    />
  ),
);
Label.displayName = "Label";
