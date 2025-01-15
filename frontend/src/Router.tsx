import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { walletStore } from "@/stores";
import { AppLayout } from "@/components/layout/AppLayout";
import { withWalletGuard } from "@/components/hoc/withWalletGuard";
import { useWalletInit } from "@/hooks/useWalletInit";
import { LoadingSpinner } from "@/components/ui/primitives/LoadingSpinner";
import CampaignList from "./pages/CampaignList";
import CampaignDetails from "./pages/CampaignDetails";
import WelcomeScreen from "./pages/WelcomeScreen";

const ProtectedCampaignList = withWalletGuard(CampaignList);
const ProtectedCampaignDetails = withWalletGuard(CampaignDetails);

const Router: React.FC = observer(() => {
  const isInitialized = useWalletInit();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <AppLayout>
      <Routes>
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
        <Route
          path="/campaigns"
          element={
            <AnimatePresence mode="wait" initial={false}>
              <ProtectedCampaignList />
            </AnimatePresence>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <AnimatePresence mode="wait" initial={false}>
              <ProtectedCampaignDetails />
            </AnimatePresence>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
});

export default Router;
