import { useEffect } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

export const useWalletEvents = () => {
  useEffect(() => {
    const handleAccountsChanged = () => {
      window.location.reload();
    };

    const provider = window.ethereum as MetaMaskInpageProvider;
    provider?.on('accountsChanged', handleAccountsChanged);

    return () => {
      provider?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);
}; 