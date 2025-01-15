import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { Button, ProgressBar } from "./primitives";
import { BurgerMenu } from "./BurgerMenu";
import { SidebarMenu } from "./SidebarMenu";
import { progressStore } from "../../stores/ProgressStore";

const NavigationMenu: React.FC = observer(() => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoHome = useCallback(() => {
    navigate("/campaigns");
    setIsMenuOpen(false);
  }, [navigate]);

  const handleCreateCampaign = useCallback(() => {
    openModal("createCampaign");
    setIsMenuOpen(false);
  }, [openModal]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-dark-800/50 dark:bg-dark-900/90">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {/* Main Navigation */}
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              className="px-0 text-lg sm:text-xl font-bold text-white"
              onClick={handleGoHome}
            >
              CryptoFundraiser
            </Button>
            <Button
              variant="flat"
              onClick={handleCreateCampaign}
              className="hidden sm:block"
            >
              Create Campaign
            </Button>
          </div>
          <BurgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>

        <SidebarMenu
          isOpen={isMenuOpen}
          onCreateCampaign={handleCreateCampaign}
          onClose={closeMenu}
        />
      </div>
      {progressStore.isVisible && (
        <ProgressBar
          progress={progressStore.progress}
          className="absolute bottom-0 left-0 w-full"
        />
      )}
    </header>
  );
});

export default NavigationMenu;
