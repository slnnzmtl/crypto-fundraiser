import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorProvider } from './hooks/useError';
import { ModalProvider } from './hooks/useModal';
import { useWalletEvents } from './hooks/useWalletEvents';
import NavigationMenu from './components/ui/NavigationMenu';
import Modals from './components/modals';
import './styles/globals.css';
import Router from './Router';

function App() {
  const location = useLocation();
  useWalletEvents();

  // Placeholder for authentication check
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <ErrorProvider>
      <ModalProvider>
        <div className="min-h-screen text-white">
          {isAuthenticated && <NavigationMenu />}
          <main className="container mx-auto px-4">
            <Router />
          </main>
          <Modals />
        </div>
      </ModalProvider>
    </ErrorProvider>
  );
}

export default App;
