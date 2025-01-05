import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { walletStore } from '@/stores';
import { AppLayout } from '@/components/layout/AppLayout';
import { withWalletGuard } from '@/components/hoc/withWalletGuard';
import { useWalletInit } from '@/hooks/useWalletInit';
import { LoadingSpinner } from '@/components/ui/primitives/LoadingSpinner';
import CampaignList from './pages/CampaignList';
import CampaignDetails from './pages/CampaignDetails';
import WelcomeScreen from './pages/WelcomeScreen';

const ProtectedCampaignList = withWalletGuard(CampaignList);
const ProtectedCampaignDetails = withWalletGuard(CampaignDetails);

const Router: React.FC = observer(() => {
  const location = useLocation();
  const isInitialized = useWalletInit();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              walletStore.address ? (
                <Navigate to="/campaigns" replace />
              ) : (
                <WelcomeScreen />
              )
            }
          />
          <Route path="/campaigns" element={<ProtectedCampaignList />} />
          <Route path="/campaigns/:id" element={<ProtectedCampaignDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
});

export default Router; 