import React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { walletStore } from '@/stores';

export const withWalletGuard = (Component: React.ComponentType<any>) => {
  return observer((props: any) => {
    if (!walletStore.address) {
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  });
}; 