import React, { useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { ConnectWallet, Button } from '@components/index';
import { walletStore } from '@stores/index';

interface SidebarMenuProps {
  isOpen: boolean;
  onCreateCampaign: () => void;
  onClose: () => void;
}

interface MenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, className = '' }) => (
  <div 
    className={`w-full ${className}`}
  >
    {children}
  </div>
);

export const SidebarMenu: React.FC<SidebarMenuProps> = observer(({ isOpen, onCreateCampaign, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const handleLogout = useCallback(async () => {
    await walletStore.disconnect();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`
          fixed inset-0 bg-black/50 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Menu */}
      <div 
        ref={menuRef}
        className={`
          fixed top-16 sm:top-20 bg-dark-800 transform transition-all duration-300 ease-out
          w-full md:w-[350px] h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          right-0 z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col p-4">
          <MenuItem onClick={onCreateCampaign} className="sm:hidden">
            Create Campaign
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <ConnectWallet />
          </MenuItem>
          {walletStore.address && (
            <MenuItem onClick={handleLogout} className="text-red-500">
              <Button variant="flat" className="w-full sm:w-auto text-red-500" onClick={handleLogout}>
                Logout
              </Button>
            </MenuItem>
          )}
        </div>
      </div>
    </>
  );
}); 