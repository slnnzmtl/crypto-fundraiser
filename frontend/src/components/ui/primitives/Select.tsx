import React, { forwardRef } from 'react';
import { Label } from './Label';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const selectClasses = "h-9 mt-1 block w-full rounded-md bg-dark-700 border-dark-500 text-white focus:border-blue-500 focus:ring-blue-500";

    return (
      <div className="w-full">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <select
          ref={ref}
          className={`${selectClasses} ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
); 