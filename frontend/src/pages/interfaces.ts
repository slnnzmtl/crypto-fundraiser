import { Campaign } from '../types/campaign';
import { IDonation } from '../stores/interfaces';

export interface ICampaignHeader {
  campaign: Campaign;
}

export interface ICampaignProgress {
  campaign: Campaign;
  progress: number;
}

export interface ICampaignActions {
  campaign: Campaign;
  isOwner: boolean;
  canDonate: boolean;
  canWithdraw: boolean;
  isSubmitting: boolean;
  onDonate: (amount: string) => Promise<void>;
  onComplete: () => Promise<void>;
  onWithdraw: () => Promise<void>;
}

export interface ICampaignInfo {
  campaign: Campaign;
  daysLeft: number;
}

export interface ICampaignDonations {
  donations: IDonation[];
} 