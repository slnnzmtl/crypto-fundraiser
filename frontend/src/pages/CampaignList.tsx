import React from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { campaignStore } from '../stores/CampaignStore';
import EmptyState from '../components/EmptyState';
import CampaignListPlaceholder from '../components/CampaignListPlaceholder';
import { useModal } from '../hooks/useModal';
import { useError } from '../hooks/useError';
import { ErrorType } from '../types/error';
import { ViewToggle } from '../components/ui/ViewToggle';
import CampaignFilter from '../components/ui/CampaignFilter';
import CampaignListItem from '../components/CampaignListItem';
import PageTransition from '../components/PageTransition';

const CampaignList: React.FC = () => {
  const modal = useModal();
  const { showError } = useError();

  const handleCreateClick = async () => {
    // Try to connect wallet first if not connected
    if (!campaignStore.address) {
      try {
        await campaignStore.connect();
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message as ErrorType);
        }
        return;
      }
    }
    
    // Open create campaign modal
    modal.openModal('createCampaign');
  };

  const containerVariants = {
    grid: {
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    },
    list: {
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    grid: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    list: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <PageTransition>
      <div className="mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <CampaignFilter />
          <ViewToggle />
        </div>

        {campaignStore.loading || campaignStore.initialLoading ? (
          <CampaignListPlaceholder />
        ) : campaignStore.filteredCampaigns.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={campaignStore.viewType}
              variants={containerVariants}
              initial="exit"
              animate={campaignStore.viewType}
              exit="exit"
              className={`
                ${campaignStore.viewType === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }
              `}
            >
              {campaignStore.filteredCampaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  variants={itemVariants}
                  layout
                >
                  <CampaignListItem 
                    campaign={campaign}
                    viewType={campaignStore.viewType}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            title={campaignStore.showOnlyOwned ? "You haven't created any campaigns yet" : "No campaigns yet"}
            description={campaignStore.showOnlyOwned 
              ? "Create your first campaign to start fundraising"
              : "Be the first to create a campaign"}
            action={{
              label: "Create Campaign",
              onClick: handleCreateClick
            }}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default observer(CampaignList); 