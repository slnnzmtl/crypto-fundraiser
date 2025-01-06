import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletStore } from '@/stores';
import { EthereumMethod } from '@/types/ethereum';

export const useNetworkChange = () => {
  const navigate = useNavigate();
  const currentChainId = useRef<string | null>(null);

  const handleNetworkChange = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const newChainId = await window.ethereum.request({ 
        method: 'eth_chainId' as EthereumMethod 
      });
      
      if (typeof newChainId === 'string' && currentChainId.current && newChainId !== currentChainId.current) {
        // Reset wallet connection
        await walletStore.disconnect();
        
        // Navigate to home page
        navigate('/', { replace: true });
        
        // Reload the page to reset all states
        window.location.reload();
      }
      
      currentChainId.current = newChainId as string;
    } catch (error) {
      console.error('Failed to handle network change:', error);
    }
  }, [navigate]);

  useEffect(() => {
    // Initial check
    handleNetworkChange();

    // Poll for changes
    const interval = setInterval(handleNetworkChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [handleNetworkChange]);
}; 