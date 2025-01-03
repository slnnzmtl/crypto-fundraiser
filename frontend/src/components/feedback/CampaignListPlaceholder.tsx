import React from 'react';
import { Card } from '@components/ui';
import { campaignStore } from '@stores/CampaignStore';
import { observer } from 'mobx-react-lite';

const CampaignCard: React.FC = () => {
  const isList = campaignStore.viewType === 'list';

  return (
    <Card className="animate-pulse">
      <div className={isList ? 'flex gap-6' : ''}>
        <div className={`
          bg-dark-900/50
          ${isList ? 'w-48 h-32' : 'aspect-video'}
        `} />
        <div className={`p-4 ${isList ? 'flex-1' : ''}`}>
          <div className="h-6 bg-dark-700/50 rounded w-3/4 mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-dark-700/50 rounded" />
            <div className="h-4 bg-dark-700/50 rounded w-5/6" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-dark-700/50 rounded w-20" />
            <div className="h-4 bg-dark-700/50 rounded w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
};

const CampaignListPlaceholder: React.FC = observer(() => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-24 h-10 bg-dark-700/50 rounded" />
      </div>
      <div className={`
        ${campaignStore.viewType === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }
      `}>
        {[...Array(6)].map((_, i) => (
          <CampaignCard key={i} />
        ))}
      </div>
    </div>
  );
});

export default CampaignListPlaceholder; 