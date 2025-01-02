import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'block w-full h-[58px] px-3 pt-[25px] pb-[9px] bg-dark-800 border border-dark-700',
            'rounded-lg text-white leading-6 focus:outline-none focus:ring-1',
            'transition-colors placeholder-transparent',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'focus:border-blue-500 focus:ring-blue-500',
            className
          )}
          placeholder={label}
        />
        <label
          className={cn(
            'absolute left-3 transition-all duration-200 pointer-events-none',
            'text-gray-400 leading-[18px]',
            isFocused || hasValue
              ? 'text-xs top-[10px]'
              : 'text-base top-[16px]'
          )}
        >
          {label}
        </label>
        {error && (
          <span className="text-red-500 text-sm mt-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 