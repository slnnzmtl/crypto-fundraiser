import React, { useState } from "react";
import { cn } from "../../../utils/cn";
import { Glass } from "@/components/ui";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  intensity?: "low" | "medium" | "high";
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, intensity = "medium", className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative">
        <Glass
          intensity={intensity}
          className={cn(
            "relative rounded-lg overflow-hidden",
            error
              ? "border-red-500"
              : isFocused
                ? "dark:bg-dark-900/70 border-primary"
                : "border-white/20",
          )}
        >
          <input
            {...props}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "block w-full h-[58px] px-3 pt-[25px] pb-[9px]",
              "bg-transparent border-none",
              "text-white leading-6 focus:outline-none",
              "transition-colors placeholder-transparent",
              "placeholder-shown:pt-[16px]",
              className,
            )}
            placeholder={label}
          />
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              "text-gray-400 leading-[18px]",
              isFocused || hasValue
                ? "text-xs top-[10px]"
                : "text-base top-[16px]",
              isFocused && "text-primary",
            )}
          >
            {label}
          </label>
        </Glass>
        {error && (
          <span className="text-red-500 text-sm mt-1 block">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
