import React from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { useError } from '@hooks/useError';
import { useCampaignData } from '@hooks/useCampaignData';
import { useCampaignPermissions } from '@hooks/useCampaignPermissions';
import { useCampaignActions } from '@hooks/useCampaignActions';
import { CampaignDetailsLayout } from '@components/campaign/details/CampaignDetailsLayout';
import { CampaignDetailsPlaceholder, ErrorPage } from '@components/feedback';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const { campaign, donations, isLoading: loading } = useCampaignData(id);
  const { isOwner, canDonate } = useCampaignPermissions(campaign);
  const { isSubmitting, handleDonate, handleComplete } = useCampaignActions(campaign, showError);

  const timeLeft = React.useMemo(() => {
    if (!campaign) return 0;
    return Math.max(0, campaign.endAt.getTime() - Date.now());
  }, [campaign]);

  const daysLeft = React.useMemo(() => {
    if (!campaign) return 0;
    return Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  }, [timeLeft]);

  const progress = React.useMemo(() => {
    if (!campaign) return 0;
    return Math.min((campaign.pledged / campaign.goal) * 100, 100);
  }, [campaign]);

  if (loading) {
    return <CampaignDetailsPlaceholder />;
  }

  if (!campaign) {
    return (
      <ErrorPage
        title="Campaign Not Found" 
        description="The campaign you're looking for doesn't exist or has been removed."
        icon="error"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="py-8"
    >
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
    </motion.div>
  );
};

export default observer(CampaignDetails); 