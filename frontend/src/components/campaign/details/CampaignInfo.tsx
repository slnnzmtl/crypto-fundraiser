import React from 'react';
import { ICampaignInfo } from '../../../pages/interfaces';
import { pluralize } from '@utils/format';

const CampaignInfo: React.FC<ICampaignInfo> = ({ campaign, daysLeft }) => {
  const getStatusColor = () => {
    if (campaign.status === 'completed') {
      return 'text-green-500';
    }
    return campaign.status === 'failed' ? 'text-red-500' : '';
  };

  const getStatusText = () => {
    switch (campaign.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Active';
    }
  };

  const getDaysLeft = () => {
    if (campaign.status === 'completed') {
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
        <span className="text-gray-400">Owner</span>
        <span className="text-white truncate ml-2 max-w-[200px]" title={campaign.owner}>
          {campaign.owner}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Status</span>
        <span className={`text-white ${getStatusColor()}`}>{getStatusText()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Time Left</span>
        <span className="text-white">{getDaysLeft()}</span>
      </div>
    </div>
  );
};

export default CampaignInfo; 