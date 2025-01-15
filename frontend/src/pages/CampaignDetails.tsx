import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useCampaignData } from "@hooks/useCampaignData";
import { useCampaignPermissions } from "@hooks/useCampaignPermissions";
import { useCampaignActions } from "@hooks/useCampaignActions";
import { useError } from "@hooks/useError";
import { CampaignDetailsLayout } from "@components/campaign/details/CampaignDetailsLayout";
import { CampaignDetailsPlaceholder } from "@components/feedback";
import PageTransition from "@components/layout/PageTransition";

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const { campaign, donations, isLoading } = useCampaignData(id);
  const { isOwner, canDonate } = useCampaignPermissions(campaign);
  const { isSubmitting, handleDonate, handleComplete } = useCampaignActions(
    campaign,
    showError,
  );

  const timeLeft = useMemo(() => {
    if (!campaign) return 0;
    return Math.max(0, campaign.endAt.getTime() - Date.now());
  }, [campaign]);

  const daysLeft = useMemo(() => {
    if (!campaign) return 0;
    return Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  }, [timeLeft, campaign]);

  const progress = useMemo(() => {
    if (!campaign) return 0;
    return Math.min((campaign.pledged / campaign.goal) * 100, 100);
  }, [campaign]);

  if (isLoading || !campaign) {
    return <CampaignDetailsPlaceholder />;
  }

  return (
    <PageTransition>
      <CampaignDetailsLayout
        campaign={campaign}
        donations={donations}
        progress={progress}
        daysLeft={daysLeft}
        isOwner={isOwner}
        canDonate={canDonate}
        isSubmitting={isSubmitting}
        onDonate={handleDonate}
        onComplete={handleComplete}
      />
    </PageTransition>
  );
};

export default observer(CampaignDetails);
