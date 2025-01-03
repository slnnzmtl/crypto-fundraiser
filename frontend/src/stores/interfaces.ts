import { Campaign, CampaignInput } from '../types/campaign';

export interface ILoadable {
  loading: boolean;
  error: string | null;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
}

export interface IWallet extends ILoadable {
  address: string | null;
  connect(): Promise<void>;
  disconnect(): void;
}

export interface IDonation {
  donor: string;
  amount: string;
  timestamp: Date;
}

export interface ICampaign extends ILoadable {
  campaigns: Campaign[];
  donations: Record<number, IDonation[]>;
  initialLoading: boolean;
  loadCampaigns(): Promise<void>;
  createCampaign(input: CampaignInput): Promise<number>;
  donate(campaignId: number, amount: number): Promise<void>;
  loadCampaignDonations(campaignId: number): Promise<void>;
  completeCampaign(campaignId: number): Promise<void>;
  canWithdrawFunds(campaignId: number): Promise<boolean>;
  withdrawFunds(campaignId: number): Promise<void>;
  filteredCampaigns: Campaign[];
  reset(): void;
}

export type ViewType = 'grid' | 'list';

export interface IView {
  viewType: ViewType;
  showOnlyOwned: boolean;
  setViewType(type: ViewType): void;
  setShowOnlyOwned(show: boolean): void;
} 