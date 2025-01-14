import React from 'react';
import { observer } from 'mobx-react-lite';
import { walletStore } from '@stores/WalletStore';

const ConnectWallet: React.FC = observer(() => {
  return (
    <>
      {walletStore.address
        ? 'Account'
        : 'Connect Wallet'}
    </>
  );
});

export default ConnectWallet;
