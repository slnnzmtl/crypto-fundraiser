import React from 'react';
import { ICampaignProgress } from '../../../pages/interfaces';
import { ProgressBar } from '@components/ui';

const CampaignProgress: React.FC<ICampaignProgress> = ({ campaign, progress }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-3xl font-bold">{campaign.pledged.toFixed(2)}</span>
          <span className="text-gray-400 ml-1">ETH</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400">Goal: </span>
          <span>{campaign.goal.toFixed(2)} ETH</span>
        </div>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default CampaignProgress; 