import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ViewToggle } from "@components/ui";
import { EmptyState, CampaignListPlaceholder } from "@components/feedback";
import CampaignListItem from "@components/campaign/list/CampaignListItem";
import { FilterPanel, FilterToggleButton } from "@components/filters";
import { theme } from "@/theme";
import { Campaign } from "@/types/campaign";

const containerVariants = {
  grid: {
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
  list: {
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const CampaignList: React.FC<{
  campaigns: Campaign[];
  isLoading: boolean;
  viewType: "grid" | "list";
  handleCreateClick: () => void;
}> = observer(({ campaigns, isLoading, viewType, handleCreateClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const handleToggleFilterPanel = () => setIsFilterOpen(!isFilterOpen);

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <CampaignListPlaceholder />;
    }

    if (campaigns.length === 0) {
      return (
        <EmptyState
          title="No campaigns found"
          description="Try adjusting your filters or search query."
          action={{
            label: "Create Campaign",
            onClick: handleCreateClick,
          }}
        />
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewType}
          variants={containerVariants}
          initial="exit"
          animate={viewType}
          exit="exit"
          className={`
            ${
              viewType === "grid"
                ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr gap-6"
                : "flex flex-col gap-6"
            }
          `}
          style={{ color: theme.colors.dark[100] }}
        >
          {campaigns.map((campaign) => (
            <CampaignListItem campaign={campaign} viewType={viewType} />
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }, [viewType, isLoading, campaigns, handleCreateClick]);

  return (
    <div className="mt-8 flex flex-col gap-6 min-h-screen">
      {!isLoading && (
        <div className="flex justify-between items-center gap-4">
          <FilterToggleButton onToggle={handleToggleFilterPanel} />
          <ViewToggle />
        </div>
      )}

      <div
        className={`flex flex-col md:flex-row  ${isFilterOpen ? "gap-6" : ""}`}
      >
        {!isLoading && <FilterPanel isOpen={isFilterOpen} />}
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
});

export default CampaignList;
