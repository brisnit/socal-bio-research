"use client";

import { forwardRef, useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: string;
  required?: boolean;
};

/**
 * shadcn Checkbox (bundle new-customer chunk `Z`, built on Radix Checkbox). Replicated
 * natively for the controlled boolean case: a role="checkbox" button with the same
 * data-state / aria attributes, the indicator span rendered only while checked, and,
 * when inside a <form>, Radix's hidden "bubble" checkbox input sized to the button.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, value = "on", disabled, required, onKeyDown, onClick, ...props }, ref) => {
    const [control, setControl] = useState<HTMLButtonElement | null>(null);
    const [size, setSize] = useState<{ width: number; height: number } | undefined>(undefined);
    const isFormControl = control ? !!control.closest("form") : true;
    const state = checked ? "checked" : "unchecked";
    const bubbleRef = useRef<HTMLInputElement>(null);
    const initialChecked = useRef(checked);

    useEffect(() => {
      if (bubbleRef.current) bubbleRef.current.checked = checked;
    }, [checked]);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        setControl(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      if (!control) return;
      setSize({ width: control.offsetWidth, height: control.offsetHeight });
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const box = entry.borderBoxSize?.[0];
        setSize(
          box
            ? { width: box.inlineSize, height: box.blockSize }
            : { width: control.offsetWidth, height: control.offsetHeight },
        );
      });
      ro.observe(control, { box: "border-box" });
      return () => ro.disconnect();
    }, [control]);

    return (
      <>
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-required={required}
          data-state={state}
          data-disabled={disabled ? "" : undefined}
          disabled={disabled}
          value={value}
          {...props}
          ref={setRefs}
          className={cn(
            "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className,
          )}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "Enter") event.preventDefault();
          }}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            onCheckedChange?.(!checked);
            if (isFormControl && !event.isPropagationStopped()) event.stopPropagation();
          }}
        >
          {checked && (
            <span
              data-state={state}
              data-disabled={disabled ? "" : undefined}
              className={cn("grid place-content-center text-current")}
              style={{ pointerEvents: "none" }}
            >
              <Check className="h-4 w-4" />
            </span>
          )}
        </button>
        {isFormControl && (
          <input
            type="checkbox"
            aria-hidden
            ref={bubbleRef}
            defaultChecked={initialChecked.current}
            required={required}
            disabled={disabled}
            value={value}
            tabIndex={-1}
            style={{
              ...size,
              position: "absolute",
              pointerEvents: "none",
              opacity: 0,
              margin: 0,
              transform: "translateX(-100%)",
            }}
          />
        )}
      </>
    );
  },
);
Checkbox.displayName = "Checkbox";
