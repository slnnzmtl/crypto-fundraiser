import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationMenu from './components/ui/NavigationMenu';
import CampaignList from './pages/CampaignList';
import CampaignDetails from './pages/CampaignDetails';
import Modals from './components/modals';
import { ErrorProvider, useError } from './hooks/useError';
import { ModalProvider } from './hooks/useModal';
import { ErrorType } from './types/error';

const AppContent: React.FC = () => {
  const { showError } = useError();

  useEffect(() => {
    if (!window.ethereum) {
      showError(ErrorType.METAMASK);
      return;
    }
  }, [showError]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <NavigationMenu />
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<CampaignList />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
        </Routes>
      </main>
      <Modals />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </ErrorProvider>
  );
};

export default App;
