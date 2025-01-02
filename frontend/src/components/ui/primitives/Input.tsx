import React, { forwardRef } from 'react';
import { Label } from './Label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputClasses = `
      w-full
      px-4
      h-12
      rounded-lg
      bg-dark-700
      border
      border-dark-500
      text-white
      placeholder-gray-400
      focus:outline-none
      focus:border-blue-500
      focus:ring-1
      focus:ring-blue-500
      transition-colors
      disabled:opacity-50
      disabled:cursor-not-allowed
    `;

    return (
      <div className="w-full space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <input
          ref={ref}
          className={`${inputClasses} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
); 