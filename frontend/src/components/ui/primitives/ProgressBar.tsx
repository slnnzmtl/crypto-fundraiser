import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = clampedProgress === 100;

  return (
    <div className={`h-0.5 w-full bg-dark-700 overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}; 