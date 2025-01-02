import React, { forwardRef } from 'react';
import { Label } from './Label';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const textAreaClasses = `
      w-full
      px-4
      py-3
      min-h-[120px]
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
      resize-none
    `;

    return (
      <div className="w-full space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <textarea
          ref={ref}
          className={`${textAreaClasses} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
); 