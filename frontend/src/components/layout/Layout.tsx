import React from 'react';
import { observer } from 'mobx-react-lite';
import { NavigationMenu } from '@components/ui';
import { ModalProvider } from '@hooks/useModal';
import Modals from '@components/modals';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ModalProvider>
      <div className="min-h-screen text-white">
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