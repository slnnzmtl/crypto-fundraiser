import React from "react";
import { cn } from "@/lib/utils";

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
  children: React.ReactNode;
}

const Glass: React.FC<GlassProps> = ({
  intensity = "medium",
  className,
  children,
  ...props
}) => {
  const glassStyles = {
    low: "bg-opacity-30 backdrop-blur-sm",
    medium: "bg-opacity-20 backdrop-blur-md",
    high: "bg-opacity-10 backdrop-blur-lg",
  };

  return (
    <div
      className={cn(
        "bg-dark-900/50 dark:bg-dark-900/60",
        glassStyles[intensity],
        "border border-white/20 dark:border-white/10",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
        "backdrop-saturate-[180%]",
        "transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Glass;
