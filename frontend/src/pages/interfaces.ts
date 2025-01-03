import { ICampaign } from '@interfaces';
import { IDonation } from '@interfaces';

export interface ICampaignHeader {
  campaign: ICampaign;
}

export interface ICampaignProgress {
  campaign: ICampaign;
  progress: number;
}

export interface ICampaignActions {
  campaign: ICampaign;
  isOwner: boolean;
  canDonate: boolean;
  isSubmitting: boolean;
  onDonate: (amount: string, message?: string) => Promise<void>;
  onComplete: () => Promise<void>;
}

export interface ICampaignInfo {
  campaign: ICampaign;
  daysLeft: number;
}

export interface ICampaignDonations {
  donations: IDonation[];
}

export type ViewType = 'grid' | 'list'; 