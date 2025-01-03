import { useEffect, useMemo, useCallback, useState } from 'react';
import { campaignStore } from '@stores/CampaignStore';
import { walletStore } from '@stores/WalletStore';
import { useError } from './useError';
import { ErrorType } from '@error';
import { ICampaign } from '@interfaces';
import { toCampaignModel } from '@utils/mappers';

export const useCampaignData = (id: string | undefined) => {
  const { showError } = useError();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const loadCampaign = useCallback(async () => {
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
    } finally {
      setHasAttemptedLoad(true);
    }
  }, [id, showError]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const campaign = useMemo(() => {
    const found = campaignStore.campaigns.find(c => c.id.toString() === id);
    return found ? toCampaignModel(found) : null;
  }, [id, campaignStore.campaigns]);

  const donations = useMemo(() => 
    id ? campaignStore.donations[parseInt(id)] || [] : [],
    [id, campaignStore.donations]
  );

  return {
    campaign,
    donations,
    isLoading: !hasAttemptedLoad || campaignStore.loading || campaignStore.initialLoading,
    hasAttemptedLoad,
    reload: loadCampaign
  };
}; 