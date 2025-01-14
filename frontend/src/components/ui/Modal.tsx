import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Glass from './Glass';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 transition-opacity duration-300',
        'backdrop-blur-md bg-black/40',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={cn(
          'fixed bottom-0 sm:bottom-auto sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
          'w-full h-[80vh] sm:h-auto sm:max-w-lg',
          'transition-all duration-300 ease-out',
          isAnimating 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-[100%] sm:translate-y-[60%] opacity-0'
        )}
      >
        <Glass intensity="medium" className="h-full overflow-hidden">
          <div className="relative p-8 h-full">
            <div className="relative flex items-center mb-8">
              <button
                onClick={onClose}
                className={cn(
                  'absolute left-0',
                  'text-gray-400 hover:text-white',
                  'transition-colors duration-200'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-medium w-full text-center text-white/90">
                {title}
              </h2>
            </div>
            <div className="text-white/80">
              {children}
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};

export default Modal; 