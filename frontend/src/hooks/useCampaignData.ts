import { useEffect, useMemo } from 'react';
import { campaignStore } from '../stores/CampaignStore';
import { walletStore } from '../stores/WalletStore';
import { useError } from './useError';
import { ErrorType } from '../types/error';

export const useCampaignData = (id: string | undefined) => {
  const { showError } = useError();

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        if (!walletStore.address) {
          await walletStore.connect();
        }
        await campaignStore.loadCampaigns();
        if (id) {
          await campaignStore.loadCampaignDonations(parseInt(id));
        }
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message as ErrorType);
        } else {
          showError(ErrorType.NETWORK);
        }
      }
    };

    loadCampaign();
  }, [id, showError]);

  const campaign = useMemo(() => 
    campaignStore.campaigns.find(c => c.id.toString() === id),
    [id, campaignStore.campaigns]
  );

  const donations = useMemo(() => 
    id ? campaignStore.donations[parseInt(id)] || [] : [],
    [id, campaignStore.donations]
  );

  return {
    campaign,
    donations,
    isLoading: campaignStore.loading || campaignStore.initialLoading
  };
}; 