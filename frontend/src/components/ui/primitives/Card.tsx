import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}; 