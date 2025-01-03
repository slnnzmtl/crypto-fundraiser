import React from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { campaignStore } from '@stores/CampaignStore';
import { walletStore } from '@stores/WalletStore';
import { useError } from '@hooks/useError';
import { ErrorType } from '@error';
import {
  CampaignDetailsPlaceholder,
  PageTransition,
  DonationList,
  CampaignHeader,
  CampaignProgress,
  CampaignActions,
  CampaignInfo
} from '@components/index';
import { useCampaignData } from '@hooks/useCampaignData';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const { campaign, donations, isLoading } = useCampaignData(id);
  const [canWithdraw, setCanWithdraw] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle campaign not found error
  React.useEffect(() => {
    if (!isLoading && !campaign) {
      showError(ErrorType.NOT_FOUND);
    }
  }, [isLoading, campaign, showError]);

  const isOwner = React.useMemo(() => Boolean(
    walletStore.address && 
    campaign?.owner && 
    typeof campaign.owner === 'string' && 
    typeof walletStore.address === 'string' && 
    campaign.owner.toLowerCase() === walletStore.address.toLowerCase()
  ), [campaign?.owner, walletStore.address]);

  const canDonate = React.useMemo(() => Boolean(
    walletStore.address && 
    campaign?.owner && 
    typeof campaign.owner === 'string' && 
    typeof walletStore.address === 'string' && 
    campaign.owner.toLowerCase() !== walletStore.address.toLowerCase()
  ), [campaign?.owner, walletStore.address]);

  React.useEffect(() => {
    if (campaign && isOwner) {
      campaignStore.canWithdrawFunds(campaign.id).then(setCanWithdraw);
    }
  }, [campaign, isOwner]);

  const handleDonate = React.useCallback(async (amount: string) => {
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

  const handleComplete = React.useCallback(async () => {
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

  const handleWithdraw = React.useCallback(async () => {
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

  if (isLoading) {
    return (
      <PageTransition>
        <CampaignDetailsPlaceholder />
      </PageTransition>
    );
  }

  if (!campaign) {
    return null;
  }

  const timeLeft = Math.max(0, campaign.endAt.getTime() - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const progress = Math.min((Number(campaign.pledged) / Number(campaign.goal)) * 100, 100);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <CampaignHeader campaign={campaign} />
            <CampaignProgress campaign={campaign} progress={progress} />
            <DonationList donations={donations} />
          </div>

          <div className="space-y-6">
            <CampaignActions
              campaign={campaign}
              isOwner={isOwner}
              canDonate={canDonate}
              canWithdraw={canWithdraw}
              isSubmitting={isSubmitting}
              onDonate={handleDonate}
              onComplete={handleComplete}
              onWithdraw={handleWithdraw}
            />
            <CampaignInfo campaign={campaign} daysLeft={daysLeft} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default observer(CampaignDetails); 