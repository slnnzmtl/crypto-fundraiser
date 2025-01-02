import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'flat';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, className = '', children, disabled, ...props }, ref) => {
    const baseClasses = `
      h-12
      px-6
      rounded-lg
      font-medium
      transition-colors
      disabled:cursor-not-allowed
      flex
      items-center
      justify-center
      gap-2
    `;
    
    const variantClasses = {
      primary: `
        text-white
        ${disabled || isLoading 
          ? 'bg-blue-500/75 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `,
      secondary: `
        text-white
        ${disabled || isLoading 
          ? 'bg-dark-600/75 cursor-not-allowed' 
          : 'bg-dark-700 hover:bg-dark-600 active:bg-dark-500'
        }
      `,
      flat: `
        text-gray-400
        ${disabled || isLoading 
          ? 'opacity-75 cursor-not-allowed' 
          : 'hover:text-white active:text-white/90'
        }
      `
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin h-5 w-5 text-white" 
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
        ) : children}
      </button>
    );
  }
); 