import React from 'react';
import { Card } from './ui/primitives';

const CampaignCard: React.FC = () => (
  <Card className="animate-pulse">
    <div className="aspect-video bg-dark-900/50" />
    <div className="p-4 space-y-4">
      <div className="h-6 bg-dark-700/50 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-dark-700/50 rounded" />
        <div className="h-4 bg-dark-700/50 rounded w-5/6" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-dark-700/50 rounded w-20" />
        <div className="h-4 bg-dark-700/50 rounded w-24" />
      </div>
    </div>
  </Card>
);

const CampaignListPlaceholder: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CampaignCard key={i} />
      ))}
    </div>
  );
};

export default CampaignListPlaceholder; 