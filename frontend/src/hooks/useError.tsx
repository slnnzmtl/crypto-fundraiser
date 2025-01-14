import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { ErrorType, ErrorConfig } from '../types/error';
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
    title: 'Network Connection Error',
    description: 'Please make sure you are:\n1. Connected to the Sepolia test network in MetaMask\n2. Have a stable internet connection',
    action: {
      label: 'Switch to Sepolia',
      onClick: () => {
        if (window.ethereum) {
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          }).catch(() => window.location.reload());
        } else {
          window.location.reload();
        }
      }
    }
  },
  [ErrorType.NETWORK_ERROR]: {
    title: 'Network Connection Error',
    description: 'Unable to connect to the network. Please check your internet connection and try again.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.CONTRACT_ERROR]: {
    title: 'Smart Contract Error',
    description: 'There was an error interacting with the smart contract. Please try again later.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.PROVIDER_ERROR]: {
    title: 'Provider Connection Error',
    description: 'Unable to connect to the Ethereum network provider. Please check your wallet connection.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.INSUFFICIENT_FUNDS]: {
    title: 'Insufficient Funds',
    description: 'You don\'t have enough ETH in your wallet to complete this transaction. You need ETH for:\n1. The donation amount\n2. Gas fees',
    action: {
      label: 'Get Sepolia ETH',
      href: 'https://sepoliafaucet.com/'
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
  },
  [ErrorType.METAMASK_PENDING]: {
    title: 'MetaMask Request Pending',
    description: 'Please check MetaMask for a pending connection request. Click the MetaMask icon in your browser extensions to view the request.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.GET_CAMPAIGNS_FAILED]: {
    title: 'Failed to Load Campaigns',
    description: 'Unable to load campaigns from the blockchain. This could be due to network issues or contract problems.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.CREATE_CAMPAIGN_FAILED]: {
    title: 'Failed to Create Campaign',
    description: 'Unable to create the campaign. Please check your inputs and try again.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.NOT_CONNECTED]: {
    title: 'Wallet Not Connected',
    description: 'Please connect your wallet to create a campaign.',
    action: {
      label: 'Connect Wallet',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.WALLET_ERROR]: {
    title: 'Wallet Connection Error',
    description: 'Unable to connect to the Ethereum network provider. Please check your wallet connection.',
    action: {
      label: 'Try Again',
      onClick: () => window.location.reload()
    }
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'An unknown error occurred',
    description: 'Please try again',
    action: {
      label: 'Retry',
      onClick: () => window.location.reload()
    }
  }
};

const ERROR_ICONS: Record<ErrorType, ReactNode> = {
  [ErrorType.METAMASK]: <MetaMaskLogo className="w-6 h-6" />,
  [ErrorType.NETWORK]: <div className="w-6 h-6 text-red-500">🌐</div>,
  [ErrorType.NETWORK_ERROR]: <div className="w-6 h-6 text-red-500">🌐</div>,
  [ErrorType.CONTRACT_ERROR]: <div className="w-6 h-6 text-red-500">⚠️</div>,
  [ErrorType.PROVIDER_ERROR]: <div className="w-6 h-6 text-red-500">🔌</div>,
  [ErrorType.UNAUTHORIZED]: <div className="w-6 h-6 text-red-500">🔒</div>,
  [ErrorType.USER_REJECTED]: <div className="w-6 h-6 text-yellow-500">❌</div>,
  [ErrorType.METAMASK_PENDING]: <MetaMaskLogo className="w-6 h-6" />,
  [ErrorType.INSUFFICIENT_FUNDS]: <div className="w-6 h-6 text-red-500">💰</div>,
  [ErrorType.GET_CAMPAIGNS_FAILED]: <div className="w-6 h-6 text-red-500">⚠️</div>,
  [ErrorType.CREATE_CAMPAIGN_FAILED]: <div className="w-6 h-6 text-red-500">⚠️</div>,
  [ErrorType.NOT_CONNECTED]: <div className="w-6 h-6 text-red-500">🔌</div>,
  [ErrorType.WALLET_ERROR]: <div className="w-6 h-6 text-red-500">🔌</div>,
  [ErrorType.UNKNOWN_ERROR]: <div className="w-6 h-6 text-red-500">⚠️</div>
};

const ErrorNotification: React.FC<{ error: ErrorConfig; onClose: () => void }> = ({ error, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-dark-800 rounded-lg shadow-lg p-4 border border-dark-700 animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {ERROR_ICONS[error.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white">{error.title}</h3>
          <p className="mt-1 text-sm text-gray-400">{error.description}</p>
          {error.action && (
            <div className="mt-3">
              {error.action.href ? (
                <a
                  href={error.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  {error.action.label}
                </a>
              ) : (
                <button
                  onClick={error.action.onClick}
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  {error.action.label}
                </button>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-300"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<ErrorConfig | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    error,
    setError,
    clearError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      {error && <ErrorNotification error={error} onClose={clearError} />}
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