import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
  label?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              'peer block w-full rounded-md border bg-dark-800 px-3',
              'min-h-[120px] pt-[25px] pb-[9px]',
              'text-base leading-6 placeholder:text-transparent',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2',
              'resize-none',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-dark-700 hover:border-dark-600 focus:border-blue-500 focus:ring-blue-500/20',
              className
            )}
            ref={ref}
            placeholder={label || ' '}
            {...props}
          />
          {label && (
            <label
              htmlFor={textareaId}
              className={cn(
                'absolute left-3 top-[19px] text-[15px] leading-4 text-gray-400',
                'pointer-events-none transition-all duration-200',
                'origin-[0]',
                'peer-focus:-translate-y-2.5 peer-focus:scale-[0.8] peer-focus:text-blue-500',
                'peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.8]',
                error && 'peer-focus:text-red-500'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea; 