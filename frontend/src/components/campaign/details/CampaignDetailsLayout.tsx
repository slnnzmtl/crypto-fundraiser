import React from 'react';
import { ICampaign } from '@interfaces';
import CampaignHeader from './CampaignHeader';
import CampaignProgress from './CampaignProgress';
import CampaignInfo from './CampaignInfo';
import CampaignActions from './CampaignActions';
import { DonationList } from '../donations/DonationList';

interface Donation {
  timestamp: Date;
  donor: string;
  amount: string;
  message: string;
}

interface CampaignDetailsLayoutProps {
  campaign: ICampaign;
  donations: Donation[];
  progress: number;
  daysLeft: number;
  isOwner: boolean;
  canDonate: boolean;
  isSubmitting: boolean;
  onDonate: (amount: string, message?: string) => Promise<void>;
  onComplete: () => Promise<void>;
}

const MobileLayout: React.FC<CampaignDetailsLayoutProps> = ({
  campaign,
  progress,
  daysLeft,
  isOwner,
  canDonate,
  isSubmitting,
  donations,
  onDonate,
  onComplete
}) => (
  <div className="md:hidden space-y-6">
    <CampaignHeader campaign={campaign} />
    <CampaignProgress campaign={campaign} progress={progress} />

    <CampaignInfo campaign={campaign} daysLeft={daysLeft} />
    <CampaignActions
      campaign={campaign}
      isOwner={isOwner}
      canDonate={canDonate}
      isSubmitting={isSubmitting}
      onDonate={onDonate}
      onComplete={onComplete}
    />

    <DonationList donations={donations} />
  </div>
);

const DesktopLayout: React.FC<CampaignDetailsLayoutProps> = ({
  campaign,
  donations,
  progress,
  daysLeft,
  isOwner,
  canDonate,
  isSubmitting,
  onDonate,
  onComplete
}) => (
  <div className="hidden md:grid gap-6 md:grid-cols-[2fr,1fr]">
    <div className="space-y-6">
      <CampaignHeader campaign={campaign} />
      <CampaignProgress campaign={campaign} progress={progress} />
      <DonationList donations={donations} />
    </div>
    <div className="space-y-4">
      <CampaignInfo campaign={campaign} daysLeft={daysLeft} />
      <CampaignActions
        campaign={campaign}
        isOwner={isOwner}
        canDonate={canDonate}
        isSubmitting={isSubmitting}
        onDonate={onDonate}
        onComplete={onComplete}
      />
    </div>
  </div>
);

export const CampaignDetailsLayout: React.FC<CampaignDetailsLayoutProps> = (props) => (
  <div className="space-y-6">
    <MobileLayout {...props} />
    <DesktopLayout {...props} />
  </div>
); 