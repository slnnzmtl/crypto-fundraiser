import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "flat";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      isLoading,
      className = "",
      children,
      disabled,
      whileHover,
      whileTap,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      small: "h-8 px-4 text-sm",
      medium: "h-12 px-6 text-base",
      large: "h-14 px-8 text-lg",
    };

    const loadingIconSizes = {
      small: "h-4 w-4",
      medium: "h-5 w-5",
      large: "h-6 w-6",
    };

    const variantClasses = {
      primary: cn(
        "text-white",
        disabled || isLoading
          ? "bg-blue-500/75 cursor-not-allowed"
          : "bg-primary hover:bg-blue-700 active:bg-blue-800",
      ),
      secondary: cn(
        "text-white",
        disabled || isLoading
          ? "bg-dark-600/75 cursor-not-allowed"
          : "bg-dark-700 hover:bg-dark-600 active:bg-dark-500",
      ),
      flat: cn(
        "text-gray-400",
        disabled || isLoading
          ? "opacity-75 cursor-not-allowed"
          : "hover:text-white active:text-white/90",
      ),
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg font-medium transition-colors",
          "disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
          // Size styles
          sizeClasses[size],
          // Variant styles
          variantClasses[variant],
          // Additional classes
          className,
        )}
        disabled={disabled || isLoading}
        whileHover={whileHover || { scale: 1.02 }}
        whileTap={whileTap || { scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={cn("animate-spin text-white", loadingIconSizes[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);
