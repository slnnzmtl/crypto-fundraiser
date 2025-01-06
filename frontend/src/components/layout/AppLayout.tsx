import React from 'react';
import { observer } from 'mobx-react-lite';
import { walletStore } from '@/stores';
import NavigationMenu from '@/components/ui/NavigationMenu';
import { theme } from '@/theme';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = observer(({ children }) => {
  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: theme.colors.dark[900] }}
    >
      {walletStore.address && <NavigationMenu />}
      <main 
        className={`${walletStore.address ? 'pt-20 sm:pt-24' : ''}`}
        style={{ color: theme.colors.dark[100] }}
      >
        {children}
      </main>
    </div>
  );
}); 