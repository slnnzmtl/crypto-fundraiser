import React from 'react';

interface Props {
  className?: string;
}

const ImagePlaceholder: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center text-gray-600 bg-dark-900 ${className}`}>
      <svg 
        className="w-12 h-12"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  );
};

export default ImagePlaceholder; 