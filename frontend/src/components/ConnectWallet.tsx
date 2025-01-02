import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '../stores/CampaignStore';
import { Button } from './ui/primitives';

const ConnectWallet: React.FC = observer(() => {
  const handleConnect = async () => {
    try {
      await campaignStore.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Button onClick={handleConnect}>
      {campaignStore.address
        ? formatAddress(campaignStore.address)
        : 'Connect Wallet'}
    </Button>
  );
});

export default ConnectWallet; 