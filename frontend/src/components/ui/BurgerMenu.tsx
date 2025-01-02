import React from 'react';

interface BurgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 relative focus:outline-none ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <span 
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
            isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out mt-1 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out mt-1 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
          }`}
        />
      </div>
    </button>
  );
}; 