import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '@stores/CampaignStore';
import { Button } from '@components/ui';

const ConnectWallet: React.FC = observer(() => {
  const handleConnect = async () => {
    try {
      await campaignStore.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <Button variant="flat" className="w-full sm:w-auto"  onClick={handleConnect}>
      {campaignStore.address
        ? 'Account'
        : 'Connect Wallet'}
    </Button>
  );
});

export default ConnectWallet; 