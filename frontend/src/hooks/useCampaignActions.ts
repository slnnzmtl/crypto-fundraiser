import { useState, useCallback } from 'react';
import { ICampaign } from '@interfaces';
import { campaignStore } from '@stores/CampaignStore';
import { ErrorType } from '@error';

export const useCampaignActions = (campaign: ICampaign | null, showError: (error: ErrorType) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonate = useCallback(async (amount: string, message?: string) => {
    if (!campaign) return;
    setIsSubmitting(true);

    try {
      await campaignStore.donate(campaign.id, parseFloat(amount), message);
      await campaignStore.loadCampaignById(campaign.id);
      await campaignStore.loadCampaignDonations(campaign.id);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [campaign, showError]);

  const handleComplete = useCallback(async () => {
    if (!campaign) return;
    setIsSubmitting(true);
    try {
      await campaignStore.completeCampaign(campaign.id);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [campaign, showError]);

  const handleWithdraw = useCallback(async () => {
    if (!campaign) return;
    setIsSubmitting(true);
    try {
      await campaignStore.withdrawFunds(campaign.id);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [campaign, showError]);

  return {
    isSubmitting,
    handleDonate,
    handleComplete,
    handleWithdraw
  };
}; 