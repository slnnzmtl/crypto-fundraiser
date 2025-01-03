import React from 'react';
import { ICampaignHeader } from '../../../pages/interfaces';
import ImagePlaceholder from '../../ui/ImagePlaceholder';
import StatusBadge from '../../ui/StatusBadge';

const CampaignHeader: React.FC<ICampaignHeader> = ({ campaign }) => {
  const getStatusColor = () => {
    if (campaign.claimed) {
      return 'bg-green-600/20 text-green-500';
    }
    return campaign.endAt.getTime() < Date.now()
      ? 'bg-red-600/20 text-red-500'
      : 'bg-blue-600/20 text-blue-500';
  };

  const getStatusText = () => {
    if (campaign.claimed) {
      return 'Completed';
    }
    return campaign.endAt.getTime() < Date.now() ? 'Ended' : 'Active';
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video w-full">
        {campaign.image && campaign.image.trim() ? (
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ImagePlaceholder className="rounded-lg" />
        )}
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

export default React.memo(CampaignHeader); 