import React from 'react';
import { ICampaignInfo } from '../../../pages/interfaces';
import { pluralize } from '../../../utils/format';

const CampaignInfo: React.FC<ICampaignInfo> = ({ campaign, daysLeft }) => {
  const getStatusColor = () => {
    if (campaign.claimed) {
      return 'text-green-500';
    }
    return campaign.endAt.getTime() < Date.now() ? 'text-red-500' : '';
  };

  const getStatusText = () => {
    if (campaign.claimed) {
      return 'Completed';
    }
    return campaign.endAt.getTime() < Date.now() ? 'Ended' : 'Active';
  };

  const getDaysLeft = () => {
    if (campaign.claimed) {
      return 'Completed';
    }
    return daysLeft > 0 ? pluralize(daysLeft, 'day') : 'Ended';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-400">Campaign ID</span>
        <span className="text-white">#{campaign.id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Creator</span>
        <span className="text-white truncate ml-2 max-w-[200px]" title={campaign.creator}>
          {campaign.creator}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Owner</span>
        <span className="text-white truncate ml-2 max-w-[200px]" title={campaign.owner}>
          {campaign.owner}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Goal</span>
        <span className="text-white">{campaign.goal} ETH</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Pledged</span>
        <span className="text-white">{campaign.pledged} ETH</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Start Date</span>
        <span className="text-white">
          {campaign.startAt.toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">End Date</span>
        <span className="text-white">
          {campaign.endAt.toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Time Left</span>
        <span className={`text-white ${getStatusColor()}`}>
          {getDaysLeft()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Status</span>
        <span className={`text-white ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Auto Complete</span>
        <span className="text-white">
          {campaign.autoComplete ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};

export default React.memo(CampaignInfo); 