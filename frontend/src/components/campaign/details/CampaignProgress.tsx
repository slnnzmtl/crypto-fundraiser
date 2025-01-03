import React from 'react';
import { ICampaignProgress } from '@interfaces';
import { ProgressBar } from '@components/ui';

const CampaignProgress: React.FC<ICampaignProgress> = ({ campaign, progress }) => {
  const getProgressColor = () => {
    if (campaign.claimed) {
      return 'bg-green-600';
    }
    return campaign.endAt.getTime() < Date.now() ? 'bg-red-600' : 'bg-blue-600';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">Progress</span>
        <span className="text-gray-400">
          {campaign.pledged} / {campaign.goal} ETH
        </span>
      </div>
      <div className="w-full bg-dark-700 rounded-full h-2">
        <div 
          className={`h-full rounded-full ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(CampaignProgress); 