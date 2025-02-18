import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-dark-900">
    <div
      className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 ${className}`}
    />
  </div>
);
