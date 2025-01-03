import React from 'react';
import { Link } from 'react-router-dom';
import { ViewType } from '@interfaces';
import { ImagePlaceholder } from '@components/ui';
import { Campaign } from '@/types/campaign';

interface Props {
  campaign: Campaign;
  viewType: ViewType;
}

const CampaignListItem: React.FC<Props> = ({ campaign, viewType }) => {
  const [imageError, setImageError] = React.useState(false);

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
    <Link
      to={`/campaigns/${campaign.id}`}
      className={`
        block bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors
        ${viewType === 'list' ? 'flex gap-6' : ''}
      `}
    >
      <div className={viewType === 'list' ? 'w-48 shrink-0' : 'aspect-video'}>
        {!imageError && campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-medium leading-tight">{campaign.title}</h3>
          <div className="text-sm shrink-0">
            <span className={`px-2 py-1 rounded ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
          {campaign.description}
        </p>

        <div className="mt-4 flex justify-between text-sm">
          <div>
            <span className="text-gray-400">Goal: </span>
            <span>{Number(campaign.goal)} ETH</span>
          </div>
          <div>
            <span className="text-gray-400">Pledged: </span>
            <span>{Number(campaign.pledged)} ETH</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignListItem; 