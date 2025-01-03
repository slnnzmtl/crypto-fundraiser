export interface ICampaign {
  id: number;
  owner: string;
  title: string;
  description: string;
  goal: number;
  pledged: number;
  endAt: Date;
  status: 'active' | 'completed' | 'failed';
  image: string;
}

export interface IDonation {
  id: number;
  campaignId: number;
  donor: string;
  amount: number;
  timestamp: Date;
}

export interface IWallet {
  address: string | null;
  connect(): Promise<void>;
  disconnect(): void;
}

export interface ICampaignStore {
  campaigns: ICampaign[];
  donations: Record<number, IDonation[]>;
  loading: boolean;
  initialLoading: boolean;
  loadCampaigns(): Promise<void>;
  loadCampaignDonations(id: number): Promise<void>;
  donate(id: number, amount: number): Promise<void>;
  completeCampaign(id: number): Promise<void>;
  withdrawFunds(id: number): Promise<void>;
  canWithdrawFunds(id: number): Promise<boolean>;
}

export type ViewType = 'grid' | 'list';