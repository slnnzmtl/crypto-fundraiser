import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-dark-800 rounded-md overflow-hidden p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}; 