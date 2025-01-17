import React from "react";
import { Glass } from "@/components/ui";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  type?: "glass" | "material";
}

export const Card: React.FC<CardProps> = ({
  children,
  type = "glass",
  className = "",
  ...props
}) => {
  if (type === "material") {
    return (
      <div
        className={`bg-dark-800 rounded-xl overflow-hidden p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <Glass className={`rounded-xl overflow-hidden p-6 ${className}`} {...props}>
      {children}
    </Glass>
  );
};
