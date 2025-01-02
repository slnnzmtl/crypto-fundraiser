import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { ErrorType, ErrorConfig } from '../types/error';
import ErrorPage from '../components/ErrorPage';
import MetaMaskLogo from '../components/icons/MetaMaskLogo';

interface ErrorContextType {
  error: ErrorConfig | null;
  setError: (error: ErrorConfig | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const DEFAULT_ERRORS: Record<ErrorType, Omit<ErrorConfig, 'type'>> = {
  [ErrorType.METAMASK]: {
    title: 'MetaMask Required',
    description: 'To use this application, you need to have MetaMask installed in your browser.',
    action: {
      label: 'Download MetaMask',
      href: 'https://metamask.io/download/'
    }
  },
  [ErrorType.NETWORK]: {
    title: 'Network Error',
    description: 'Unable to connect to the network. Please check your internet connection.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    action: {
      label: 'Go Home',
      onClick: () => window.location.href = '/'
    }
  },
  [ErrorType.UNAUTHORIZED]: {
    title: 'Unauthorized',
    description: 'You do not have permission to access this resource.',
    action: {
      label: 'Go Home',
      onClick: () => window.location.href = '/'
    }
  },
  [ErrorType.USER_REJECTED]: {
    title: 'Transaction Rejected',
    description: 'You have rejected the transaction. Please try again if you want to proceed.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  }
};

const ERROR_ICONS: Record<ErrorType, ReactNode> = {
  [ErrorType.METAMASK]: <MetaMaskLogo className="w-full h-full" />,
  [ErrorType.NETWORK]: <div className="w-full h-full text-red-500">🌐</div>,
  [ErrorType.NOT_FOUND]: <div className="w-full h-full text-yellow-500">🔍</div>,
  [ErrorType.UNAUTHORIZED]: <div className="w-full h-full text-red-500">🔒</div>,
  [ErrorType.USER_REJECTED]: <div className="w-full h-full text-yellow-500">❌</div>
};

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<ErrorConfig | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    error,
    setError,
    clearError
  };

  if (error) {
    return (
      <ErrorPage
        icon={ERROR_ICONS[error.type]}
        title={error.title}
        description={error.description}
        action={error.action}
      />
    );
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  const showError = useCallback((type: ErrorType, customConfig?: Partial<Omit<ErrorConfig, 'type'>>) => {
    const defaultConfig = DEFAULT_ERRORS[type];
    context.setError({
      type,
      ...defaultConfig,
      ...customConfig
    });
  }, [context]);

  return {
    ...context,
    showError
  };
}; 