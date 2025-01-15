import React from "react";
import { Card, Glass } from "../ui";

const DonationHistoryPlaceholder: React.FC = () => (
  <Card className="animate-pulse space-y-4">
    <div className="h-6 bg-dark-700/50 rounded w-40" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Glass key={i} intensity="high" className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-dark-700/50 rounded w-32" />
            <div className="h-5 bg-dark-700/50 rounded w-24" />
          </div>
          <div className="h-4 bg-dark-700/50 rounded w-40" />
        </Glass>
      ))}
    </div>
  </Card>
);

const CampaignDetailsPlaceholder: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video w-full bg-dark-700/50 rounded-lg" />

            {/* Campaign Info */}
            <Card className="space-y-6">
              {/* Title and Status */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-8 bg-dark-700/50 rounded w-3/4" />
                  <div className="h-5 bg-dark-700/50 rounded w-1/3" />
                </div>
                <div className="h-10 bg-dark-700/50 rounded w-24" />
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="h-2 bg-dark-700/50 rounded-full" />
                <div className="flex justify-between">
                  <div className="h-6 bg-dark-700/50 rounded w-32" />
                  <div className="h-6 bg-dark-700/50 rounded w-24" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-dark-700/50 rounded" />
                <div className="h-4 bg-dark-700/50 rounded" />
                <div className="h-4 bg-dark-700/50 rounded w-3/4" />
              </div>

              {/* Campaign Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-4 bg-dark-700/50 rounded w-20" />
                    <div className="h-6 bg-dark-700/50 rounded w-24" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="space-y-6">
              <div className="space-y-4">
                <div className="h-6 bg-dark-700/50 rounded w-1/2" />
                <div className="h-12 bg-dark-700/50 rounded" />
                <div className="h-12 bg-dark-700/50 rounded" />
              </div>
            </Card>

            {/* Donation History */}
            <DonationHistoryPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPlaceholder;
