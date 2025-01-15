import React from "react";
import { Card, Glass } from "@components/ui";
import { campaignStore } from "@stores/CampaignStore";
import { observer } from "mobx-react-lite";

const CampaignCard: React.FC = () => {
  const isList = campaignStore.viewType === "list";

  return (
    <Card className="h-full animate-pulse">
      <div className={`${isList ? "flex gap-6" : "flex flex-col h-full"}`}>
        {/* Image placeholder */}
        <div
          className={`
          bg-dark-900/50 rounded-lg
          ${isList ? "w-48 h-32" : "aspect-video w-full"}
        `}
        />

        {/* Content */}
        <div
          className={`flex flex-col ${isList ? "flex-1 py-4" : "p-6"} gap-4`}
        >
          {/* Title */}
          <div className="h-7 bg-dark-700/50 rounded w-3/4" />

          {/* Description */}
          <div className="space-y-2 flex-grow">
            <div className="h-4 bg-dark-700/50 rounded" />
            <div className="h-4 bg-dark-700/50 rounded w-5/6" />
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-2 bg-dark-700/50 rounded-full" />
            <div className="flex justify-between">
              <div className="h-4 bg-dark-700/50 rounded w-20" />
              <div className="h-4 bg-dark-700/50 rounded w-24" />
            </div>
          </div>

          {/* Footer */}
          <Glass
            intensity="high"
            className="flex justify-between items-center p-4 mt-auto"
          >
            <div className="h-4 bg-dark-700/50 rounded w-24" />
            <div className="h-4 bg-dark-700/50 rounded w-20" />
          </Glass>
        </div>
      </div>
    </Card>
  );
};

const CampaignListPlaceholder: React.FC = observer(() => {
  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="h-8 bg-dark-700/50 rounded w-24" />
        <div className="h-10 bg-dark-700/50 rounded w-24" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Panel Placeholder */}
        <div className="w-full md:w-80">
          <Card className="animate-pulse p-6 space-y-6">
            <div className="h-6 bg-dark-700/50 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-10 bg-dark-700/50 rounded" />
              <div className="h-10 bg-dark-700/50 rounded" />
              <div className="h-10 bg-dark-700/50 rounded" />
            </div>
          </Card>
        </div>

        {/* Campaign Grid/List */}
        <div className="flex-1 min-w-0">
          <div
            className={`
            ${
              campaignStore.viewType === "grid"
                ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr gap-6"
                : "space-y-4"
            }
          `}
          >
            {[...Array(6)].map((_, i) => (
              <CampaignCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CampaignListPlaceholder;
