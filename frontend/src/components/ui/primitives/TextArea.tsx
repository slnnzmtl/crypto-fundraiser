import React, { forwardRef } from "react";
import { cn } from "../../../utils/cn";
import { Glass } from "@/components/ui";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
  label?: string;
  intensity?: "low" | "medium" | "high";
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, id, intensity = "medium", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        <Glass
          intensity={intensity}
          className={cn(
            "relative rounded-lg overflow-hidden bg-dark-900/50 dark:bg-dark-900/60",
            error
              ? "border-red-500"
              : isFocused
                ? "dark:bg-dark-900/70 border-primary"
                : "border-white/20",
          )}
        >
          <textarea
            id={textareaId}
            className={cn(
              "peer block w-full px-3",
              "min-h-[120px] pt-[25px] pb-[9px]",
              "text-base leading-6 placeholder:text-transparent",
              "transition-colors duration-200",
              "focus:outline-none",
              "resize-none",
              "bg-transparent border-none",
              className,
            )}
            ref={ref}
            placeholder={label || " "}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {label && (
            <label
              htmlFor={textareaId}
              className={cn(
                "absolute left-3 top-[19px] text-[15px] leading-4 text-gray-400",
                "pointer-events-none transition-all duration-200",
                "origin-[0]",
                "peer-focus:-translate-y-2.5 peer-focus:scale-[0.8]",
                "peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.8]",
                isFocused && "text-primary",
                error && "text-red-500",
              )}
            >
              {label}
            </label>
          )}
        </Glass>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
