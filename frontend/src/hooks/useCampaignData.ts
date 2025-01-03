import { useEffect, useMemo, useCallback, useState } from 'react';
import { campaignStore } from '@stores/CampaignStore';
import { walletStore } from '@stores/WalletStore';
import { useError } from './useError';
import { ErrorType } from '@error';
import { toCampaignModel } from '@utils/mappers';

export const useCampaignData = (id: string | undefined) => {
  const { showError } = useError();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const loadCampaign = useCallback(async () => {
    if (!id) return;

    try {
      if (!walletStore.address) {
        await walletStore.connect();
      }

      await Promise.all([
        campaignStore.loadCampaignById(parseInt(id)),
        campaignStore.loadCampaignDonations(parseInt(id))
      ]);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
      }
    } finally {
      setHasAttemptedLoad(true);
    }
  }, [id, showError]);

  useEffect(() => {
    loadCampaign();
  }, []);

  const campaign = useMemo(() => {
    const found = campaignStore.campaigns.find(c => c.id.toString() === id);
    return found ? toCampaignModel(found) : null;
  }, [id, campaignStore.campaigns]);

  const donations = useMemo(() => {
    if (!id) return [];
    const campaignDonations = campaignStore.donations[parseInt(id)] || [];
    
    return campaignDonations.map(donation => ({
      ...donation,
      timestamp: donation.timestamp instanceof Date ? 
        donation.timestamp : 
        new Date(donation.timestamp)
    }));
  }, [id, Object.keys(campaignStore.donations).length]);

  return {
    campaign,
    donations,
    isLoading: !hasAttemptedLoad || campaignStore.loading || campaignStore.initialLoading,
    hasAttemptedLoad,
    reload: loadCampaign
  };
}; 