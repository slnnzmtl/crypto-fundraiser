import { useEffect, useState } from 'react';
import { walletStore } from '@/stores';

export const useWalletInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await walletStore.checkConnection();
      setIsInitialized(true);
    };

    init();
  }, []);

  return isInitialized;
}; 