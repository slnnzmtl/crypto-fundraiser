import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../types/campaign';
import ImagePlaceholder from './ui/ImagePlaceholder';

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
        ${viewType === 'list' ? 'flex gap-6' : ''}
      `}>
        <div className={`
          ${viewType === 'list' 
            ? 'w-48 h-32'
            : 'aspect-video'
          }
        `}>
          {campaign.image ? (
            <img 
              src={campaign.image} 
              alt={campaign.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{campaign.title || 'Untitled Campaign'}</h3>
            <span className={`text-sm px-2 py-1 rounded ${
              campaign.claimed 
                ? 'bg-green-600/20 text-green-500' 
                : campaign.endAt.getTime() < Date.now() 
                  ? 'bg-red-600/20 text-red-500'
                  : 'bg-blue-600/20 text-blue-500'
            }`}>
              {campaign.claimed 
                ? 'Completed' 
                : campaign.endAt.getTime() < Date.now() 
                  ? 'Ended'
                  : 'Active'}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {campaign.description || 'No description'}
          </p>
          <div className="flex justify-between items-center text-sm">
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