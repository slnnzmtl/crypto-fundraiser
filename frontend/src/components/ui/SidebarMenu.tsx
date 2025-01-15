import React, { useEffect, useRef, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Button, Glass } from "@components/index";
import { campaignStore, walletStore } from "@stores/index";

interface SidebarMenuProps {
  isOpen: boolean;
  onCreateCampaign: () => void;
  onClose: () => void;
}

interface MenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  className = "",
  onClick,
}) => (
  <div className={`w-full ${className}`}>
    <Button
      variant="flat"
      className={`w-full sm:w-auto ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  </div>
);

export const SidebarMenu: React.FC<SidebarMenuProps> = observer(
  ({ isOpen, onCreateCampaign, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
      await walletStore.disconnect();
      onClose();
    };

    const handleConnect = async () => {
      try {
        await walletStore.connect();
        await campaignStore.loadCampaigns();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    return (
      <>
        <Glass
          intensity="medium"
          className={`
          fixed inset-0 transition-opacity bg-dark-900/50 dark:bg-dark-900/60 border-none duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        >
          <div
            ref={menuRef}
            className={`
          fixed top-16 sm:top-20 transform transition-all duration-300 ease-out
          w-full md:w-[350px] h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          right-0 z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
          >
            <div className="flex flex-col p-4">
              <MenuItem onClick={onCreateCampaign} className="sm:hidden">
                Create Campaign
              </MenuItem>

              {!walletStore.address && (
                <MenuItem onClick={handleConnect}>Connect Wallet</MenuItem>
              )}

              {walletStore.address && (
                <MenuItem onClick={handleLogout} className="text-red-500">
                  Logout
                </MenuItem>
              )}
            </div>
          </div>
        </Glass>
      </>
    );
  },
);
