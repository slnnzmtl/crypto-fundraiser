import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Badge } from './primitives/Badge';
import { EthereumMethod } from '@/types/ethereum';

interface NetworkInfo {
  name: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

const getNetworkInfo = (chainId: string | null): NetworkInfo => {
  switch (chainId) {
    case '0x1':
      return { name: 'Mainnet', variant: 'success' };
    case '0xaa36a7':
      return { name: 'Sepolia', variant: 'info' };
    case '0x5':
      return { name: 'Goerli', variant: 'warning' };
    case '0x89':
      return { name: 'Polygon', variant: 'info' };
    default:
      return { name: 'Unknown Network', variant: 'error' };
  }
};

export const NetworkIndicator: React.FC = observer(() => {
  const [chainId, setChainId] = useState<string | null>(null);

  const updateChainId = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const id = await window.ethereum.request({ 
          method: 'eth_chainId' as EthereumMethod 
        });
        if (typeof id === 'string') {
          setChainId(id);
        }
      } catch (error) {
        console.error('Failed to get chain ID:', error);
      }
    }
  }, []);

  useEffect(() => {
    updateChainId();
    const interval = setInterval(updateChainId, 1000);
    return () => clearInterval(interval);
  }, [updateChainId]);

  const networkInfo = getNetworkInfo(chainId);

  return (
    <Badge variant={networkInfo.variant} className="hidden sm:inline-flex">
      {networkInfo.name}
    </Badge>
  );
}); 