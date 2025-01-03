import { useState, useCallback } from 'react';
import { campaignStore } from '@stores/CampaignStore';
import { ICampaign } from '@interfaces';
import { ErrorType } from '@error';

export const useCampaignActions = (
  campaign: ICampaign | null,
  showError: (error: ErrorType) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonate = useCallback(async (amount: string) => {
    if (!campaign) return;
    setIsSubmitting(true);
    try {
      await campaignStore.donate(campaign.id, parseFloat(amount));
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
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
      } else {
        showError(ErrorType.NETWORK);
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
      } else {
        showError(ErrorType.NETWORK);
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