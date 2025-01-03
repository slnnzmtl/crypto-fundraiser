import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../../types/campaign';
import ImagePlaceholder from '../../ui/ImagePlaceholder';
import StatusBadge from '../../ui/StatusBadge';

interface Props {
  campaign: Campaign;
  viewType: 'grid' | 'list';
}

const CampaignListItem: React.FC<Props> = ({ campaign, viewType }) => {
  return (
    <Link 
      key={campaign.id} 
      to={`/campaign/${campaign.id}`}
      className={`
        bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors
        ${viewType === 'list' ? 'block' : ''}
      `}
    >
      <div className={`
        ${viewType === 'list' ? 'flex gap-2 sm:gap-6' : ''}
      `}>
        <div className={`
          ${viewType === 'list' 
            ? 'w-32 sm:w-48'
            : 'aspect-video'
          }
          min-h-full
        `}>
          {campaign.image ? (
            <img 
              src={campaign.image} 
              alt={campaign.title} 
              className="w-full h-full object-cover min-h-full"
            />
          ) : (
            <ImagePlaceholder className="min-h-full" />
          )}
        </div>
        <div className="p-2 sm:p-4 flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
            <h3 className="text-base sm:text-lg font-semibold">{campaign.title || 'Untitled Campaign'}</h3>
            <StatusBadge campaign={campaign} />
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {campaign.description || 'No description'}
          </p>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm">
            <div className="text-gray-400">
              Goal: <span className="text-white">{campaign.goal} ETH</span>
            </div>
            <div className="text-gray-400">
              Raised: <span className="text-white">{campaign.pledged} ETH</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignListItem; 