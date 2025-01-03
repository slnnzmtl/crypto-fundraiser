import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignStore } from '@stores/CampaignStore';
import { useError } from './useError';
import { ErrorType } from '@error';
import { CampaignInput } from '@/types/campaign';

export const useCreateCampaign = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useError();
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (data: CampaignInput) => {
    setIsSubmitting(true);
    try {
      const campaignId = await campaignStore.createCampaign(data);
      if (typeof campaignId === 'number') {
        // Wait for the campaign to be loaded
        await campaignStore.loadCampaignById(campaignId);
        // Add a small delay to ensure indexing
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate(`/campaigns/${campaignId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, showError]);

  return {
    isSubmitting,
    handleSubmit
  };
}; 