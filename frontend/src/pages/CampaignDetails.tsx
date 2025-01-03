import React from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
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
import { useCampaignPermissions } from '@hooks/useCampaignPermissions';
import { useCampaignActions } from '@hooks/useCampaignActions';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const { campaign, donations, isLoading, hasAttemptedLoad } = useCampaignData(id);
  const { isOwner, canDonate, canWithdraw } = useCampaignPermissions(campaign);
  const { isSubmitting, handleDonate, handleComplete, handleWithdraw } = useCampaignActions(campaign, showError);
  const [hasShownError, setHasShownError] = React.useState(false);

  // Handle campaign not found error
  React.useEffect(() => {
    if (hasAttemptedLoad && !isLoading && !campaign && !hasShownError) {
      showError(ErrorType.NOT_FOUND);
      setHasShownError(true);
    }
  }, [hasAttemptedLoad, isLoading, campaign, showError, hasShownError]);

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
  const progress = Math.min((campaign.pledged / campaign.goal) * 100, 100);

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