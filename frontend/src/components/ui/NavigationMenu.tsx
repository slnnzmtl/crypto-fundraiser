import React from 'react';
import { observer } from 'mobx-react-lite';
import { useModal } from '../../hooks/useModal';
import { Button } from './primitives';
import ConnectWallet from '../ConnectWallet';

const NavigationMenu: React.FC = observer(() => {
  const { openModal } = useModal();

  return (
    <header className="bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex h-20 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">CryptoFundraiser</h1>
            <Button variant="flat" onClick={() => openModal('createCampaign')} className="ml-8">
              Create Campaign
            </Button>
          </div>
          <ConnectWallet />
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="h-16 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">CryptoFundraiser</h1>
            <ConnectWallet />
          </div>
          <div className="h-12 -mx-4 px-4 flex items-center border-t border-dark-700">
            <Button variant="flat" onClick={() => openModal('createCampaign')} className="text-sm">
              Create Campaign
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});

export default NavigationMenu; 