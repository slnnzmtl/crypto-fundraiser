import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ViewToggle } from "@components/ui";
import { EmptyState, CampaignListPlaceholder } from "@components/feedback";
import CampaignListItem from "@components/campaign/list/CampaignListItem";
import { useCampaignList } from "@hooks/useCampaignList";
import FilterPanel from "@components/campaign/FilterPanel";
import { theme } from "@/theme";

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

const itemVariants = {
  grid: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  list: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const filterVariants = {
  open: {
    width: "20rem",
    opacity: 1,
    transition: {
      width: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
  closed: {
    width: 0,
    opacity: 0,
    transition: {
      width: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

const CampaignList: React.FC = observer(() => {
  const { campaigns, isLoading, viewType, handleCreateClick } =
    useCampaignList();
  const [isFilterOpen, setIsFilterOpen] = useState(true);

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
                : "space-y-4"
            }
          `}
          style={{ color: theme.colors.dark[100] }}
        >
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={itemVariants}
              layout
              className="h-full"
            >
              <CampaignListItem campaign={campaign} viewType={viewType} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }, [viewType, isLoading, campaigns, handleCreateClick]);

  return (
    <div className="mt-8 flex flex-col gap-6">
      {!isLoading && (
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
          </button>
          <ViewToggle />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {!isLoading && (
          <motion.div
            variants={filterVariants}
            initial="closed"
            animate={isFilterOpen ? "open" : "closed"}
            className="overflow-hidden flex-shrink-0"
          >
            <div className="w-80">
              <FilterPanel />
            </div>
          </motion.div>
        )}

        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
});

export default CampaignList;
