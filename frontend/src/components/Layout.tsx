import React from 'react';
import { observer } from 'mobx-react-lite';
import NavigationMenu from './ui/NavigationMenu';
import { ModalProvider } from '../hooks/useModal';
import Modals from './modals/index';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-dark-900 text-white">
        <NavigationMenu />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <Modals />
      </div>
    </ModalProvider>
  );
};

export default observer(Layout); 