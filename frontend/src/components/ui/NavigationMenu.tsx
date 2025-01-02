import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Button, ProgressBar } from './primitives';
import { BurgerMenu } from './BurgerMenu';
import { SidebarMenu } from './SidebarMenu';
import { progressStore } from '../../stores/ProgressStore';

const NavigationMenu: React.FC = observer(() => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoHome = useCallback(() => {
    navigate('/');
    setIsMenuOpen(false);
  }, [navigate]);

  const handleCreateCampaign = useCallback(() => {
    openModal('createCampaign');
    setIsMenuOpen(false);
  }, [openModal]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="bg-dark-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center">
            <Button variant="flat" className="text-lg sm:text-xl font-bold text-white" onClick={handleGoHome}>
              CryptoFundraiser
            </Button>
            <Button variant="flat" onClick={handleCreateCampaign} className="hidden sm:block outline-none">
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
          className="absolute bottom-0 left-0" 
        />
      )}
    </header>
  );
});

export default NavigationMenu; 