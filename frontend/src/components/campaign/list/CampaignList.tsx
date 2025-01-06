import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '@stores/CampaignStore';
import { ViewToggle } from '@components/ui';
import { EmptyState, CampaignListPlaceholder } from '@components/feedback';
import CampaignListItem from '@components/campaign/list/CampaignListItem';
import { useCampaignList } from '@hooks/useCampaignList';
import FilterPanel from '@components/campaign/FilterPanel';
import { theme } from '@/theme';

const CampaignList: React.FC = observer(() => {
  const { handleCreateClick } = useCampaignList();

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

  if (campaignStore.loading || campaignStore.initialLoading) {
    return <CampaignListPlaceholder />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6" style={{ backgroundColor: theme.colors.dark[900] }}>
      <div className="flex justify-end">
        <ViewToggle />
      </div>

      <div className="flex gap-6">
        <div className="w-[320px] shrink-0">
          <FilterPanel />
        </div>

        <div className="flex-1 min-w-0">
          {campaignStore.filteredCampaigns.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={campaignStore.viewType}
                variants={containerVariants}
                initial="exit"
                animate={campaignStore.viewType}
                exit="exit"
                className={`
                  ${campaignStore.viewType === 'grid' 
                    ? 'grid grid-cols-1 xl:grid-cols-2 gap-6'
                    : 'space-y-4'
                  }
                `}
                style={{ color: theme.colors.dark[100] }}
              >
                {campaignStore.filteredCampaigns.map(campaign => (
                  <motion.div
                    key={campaign.id}
                    variants={itemVariants}
                    layout
                    className="h-full"
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
      </div>
    </div>
  );
});

export default CampaignList; 