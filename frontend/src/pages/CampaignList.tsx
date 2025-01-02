import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '../stores/CampaignStore';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import CampaignListPlaceholder from '../components/CampaignListPlaceholder';
import { useModal } from '../hooks/useModal';
import { useError } from '../hooks/useError';
import { ErrorType } from '../types/error';

const CampaignList: React.FC = () => {
  const modal = useModal();
  const { showError } = useError();

  const handleCreateClick = async () => {
    try {
      if (!campaignStore.address) {
        await campaignStore.connect();
      }
      modal.openModal('createCampaign');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorType.METAMASK) {
          showError(ErrorType.METAMASK);
        } else if (error.message === ErrorType.NETWORK) {
          showError(ErrorType.NETWORK);
        } else if (error.message === ErrorType.USER_REJECTED) {
          showError(ErrorType.USER_REJECTED);
        }
      }
    }
  };

  if (campaignStore.loading) {
    return (
      <div className="mt-8">
        <CampaignListPlaceholder />
      </div>
    );
  }

  if (campaignStore.campaigns.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState onCreateClick={handleCreateClick} />
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaignStore.campaigns.map(campaign => (
        <Link 
          key={campaign.id} 
          to={`/campaign/${campaign.id}`}
          className="bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors"
        >
          {campaign.image && (
            <div className="aspect-video bg-dark-900">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{campaign.title || 'Untitled Campaign'}</h3>
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
        </Link>
      ))}
    </div>
  );
};

export default observer(CampaignList); 