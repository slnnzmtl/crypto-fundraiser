import { Campaign } from './campaign';

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

export interface ICampaignHeader {
  campaign: Campaign;
}

export interface ICampaignInfo {
  campaign: Campaign;
  daysLeft: number;
} 