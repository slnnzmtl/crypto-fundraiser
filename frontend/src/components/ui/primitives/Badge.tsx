import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
};

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'info',
  children,
  className = ''
}) => {
  return (
    <span 
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        border ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}; 