import React from 'react';
import { ICampaignHeader } from '../../../pages/interfaces';
import { ImagePlaceholder } from '@components/ui';

const CampaignHeader: React.FC<ICampaignHeader> = ({ campaign }) => {
  const getStatusColor = () => {
    if (campaign.status === 'completed') {
      return 'bg-green-600/20 text-green-500';
    }
    return campaign.status === 'failed'
      ? 'bg-red-600/20 text-red-500'
      : 'bg-blue-600/20 text-blue-500';
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

  return (
    <div className="space-y-6">
      <div className="aspect-video w-full">
        <ImagePlaceholder className="rounded-lg" />
      </div>

      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      <p className="text-gray-400">{campaign.description}</p>
    </div>
  );
};

export default CampaignHeader; 