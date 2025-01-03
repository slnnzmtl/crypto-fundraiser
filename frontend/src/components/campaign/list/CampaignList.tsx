import React from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EmptyState,
  CampaignListPlaceholder,
  CampaignListItem,
  PageTransition,
  ViewToggle,
  CampaignFilter
} from '@components/index';
import { useCampaignList } from '@hooks/useCampaignList';
import { useListAnimation } from '@hooks/useListAnimation';

const CampaignList: React.FC = () => {
  const { 
    campaigns, 
    viewType, 
    showOnlyOwned, 
    isLoading, 
    handleCreateClick 
  } = useCampaignList();

  const { 
    containerVariants, 
    itemVariants, 
    getContainerClassName 
  } = useListAnimation(viewType);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <CampaignFilter />
            <ViewToggle />
          </div>
          <CampaignListPlaceholder />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <CampaignFilter />
          <ViewToggle />
        </div>

        {campaigns.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewType}
              variants={containerVariants}
              initial="exit"
              animate={viewType}
              exit="exit"
              className={getContainerClassName()}
            >
              {campaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  variants={itemVariants}
                  layout
                >
                  <CampaignListItem 
                    campaign={campaign}
                    viewType={viewType}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            title={showOnlyOwned ? "You haven't created any campaigns yet" : "No campaigns yet"}
            description={showOnlyOwned 
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