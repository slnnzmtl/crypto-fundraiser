import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CampaignList from './pages/CampaignList';
import CampaignDetails from './pages/CampaignDetails';
import { ErrorProvider } from './hooks/useError';
import { ModalProvider } from './hooks/useModal';
import NavigationMenu from './components/ui/NavigationMenu';
import Modals from './components/modals';

function App() {
  const location = useLocation();

  return (
    <ErrorProvider>
      <ModalProvider>
        <div className="min-h-screen bg-dark-900 text-white">
          <NavigationMenu />
          <main className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<CampaignList />} />
                <Route path="/campaign/:id" element={<CampaignDetails />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Modals />
        </div>
      </ModalProvider>
    </ErrorProvider>
  );
}

export default App;
