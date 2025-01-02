import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '../stores/CampaignStore';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import CampaignListPlaceholder from '../components/CampaignListPlaceholder';
import { useModal } from '../hooks/useModal';
import { useError } from '../hooks/useError';
import { ErrorType } from '../types/error';
import { ViewToggle } from '../components/ui/ViewToggle';
import CampaignFilter from '../components/ui/CampaignFilter';

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

  if (campaignStore.loading || campaignStore.initialLoading) {
    return (
      <div className="mt-8">
        <CampaignListPlaceholder />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {campaignStore.filteredCampaigns.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <CampaignFilter />
            <ViewToggle />
          </div>
          <div className={`
            ${campaignStore.viewType === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }
          `}>
            {campaignStore.filteredCampaigns.map(campaign => (
              <Link 
                key={campaign.id} 
                to={`/campaign/${campaign.id}`}
                className={`
                  bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors
                  ${campaignStore.viewType === 'list' ? 'block' : ''}
                `}
              >
                <div className={`
                  ${campaignStore.viewType === 'list' ? 'flex gap-6' : ''}
                `}>
                  {campaign.image && (
                    <div className={`
                      bg-dark-900
                      ${campaignStore.viewType === 'list' 
                        ? 'w-48 h-32'
                        : 'aspect-video'
                      }
                    `}>
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title={campaignStore.showOnlyOwned ? "You haven't created any campaigns yet" : "No campaigns yet"}
          description={campaignStore.showOnlyOwned 
            ? "Create your first campaign to start fundraising"
            : "Be the first to create a campaign"}
          action={{
            label: "Create Campaign",
            onClick: handleCreateClick
          }}
        />
      )}
    </div>
  );
};

export default observer(CampaignList); 