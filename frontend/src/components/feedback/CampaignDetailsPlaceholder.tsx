import React from 'react';
import { Card } from '../ui';

const CampaignDetailsPlaceholder: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="animate-pulse space-y-6">
        <div className="aspect-video w-full bg-dark-700 rounded-lg" />
        <Card className="space-y-4">
          <div className="h-8 bg-dark-700 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-dark-700 rounded" />
            <div className="h-4 bg-dark-700 rounded w-5/6" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetailsPlaceholder; 