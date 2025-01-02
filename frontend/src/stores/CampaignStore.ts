import { makeAutoObservable } from 'mobx';
import { contractService } from '../services/ContractService';
import { Campaign, CampaignInput } from '../types/campaign';
import { ErrorType } from '../types/error';
import { progressStore } from './ProgressStore';

export type ViewType = 'grid' | 'list';

export interface Donation {
  donor: string;
  amount: string;
  timestamp: Date;
}

const VIEW_TYPE_KEY = 'campaignViewType';

export class CampaignStore {
  campaigns: Campaign[] = [];
  donations: Record<number, Donation[]> = {};
  loading: boolean = false;
  initialLoading: boolean = true;
  error: string | null = null;
  address: string | null = null;
  viewType: ViewType = localStorage.getItem(VIEW_TYPE_KEY) as ViewType || 'grid';
  showOnlyOwned: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    try {
      const address = await contractService.checkConnection();
      if (address) {
        this.setAddress(address);
        await this.loadCampaigns();
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
    } finally {
      this.initialLoading = false;
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setAddress(address: string | null) {
    this.address = address;
  }

  async connect() {
    this.setLoading(true);
    this.error = null;

    try {
      progressStore.start();
      const address = await contractService.connect();
      this.setAddress(address);
      progressStore.finish();
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    } finally {
      this.setLoading(false);
    }
  }

  async loadCampaigns() {
    this.setLoading(true);
    this.error = null;

    try {
      progressStore.start();
      if (!this.address) {
        await this.connect();
      }
      const campaigns = await contractService.getCampaigns();
      this.campaigns = campaigns;
      progressStore.finish();
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.GET_CAMPAIGNS_FAILED);
    } finally {
      this.setLoading(false);
    }
  }

  async createCampaign(campaignInput: CampaignInput): Promise<number> {
    this.setLoading(true);
    this.error = null;

    try {
      progressStore.start();
      if (!this.address) {
        await this.connect();
      }
      const campaignId = await contractService.createCampaign(campaignInput);
      await this.loadCampaigns();
      progressStore.finish();
      return campaignId;
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    } finally {
      this.setLoading(false);
    }
  }

  async donate(campaignId: number, amount: number) {
    this.setLoading(true);
    this.error = null;

    try {
      progressStore.start();
      if (!this.address) {
        await this.connect();
      }
      await contractService.donate(campaignId, amount);
      await Promise.all([
        this.loadCampaigns(),
        this.loadCampaignDonations(campaignId)
      ]);
      progressStore.finish();
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    } finally {
      this.setLoading(false);
    }
  }

  async loadCampaignDonations(campaignId: number) {
    try {
      progressStore.start();
      if (!this.address) {
        await this.connect();
      }
      const donations = await contractService.getCampaignDonations(campaignId);
      this.donations[campaignId] = donations;
      progressStore.finish();
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    }
  }

  async completeCampaign(campaignId: number) {
    this.setLoading(true);
    this.error = null;

    try {
      progressStore.start();
      if (!this.address) {
        await this.connect();
      }
      await contractService.completeCampaign(campaignId);
      await this.loadCampaigns();
      progressStore.finish();
    } catch (error) {
      progressStore.reset();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    } finally {
      this.setLoading(false);
    }
  }

  setViewType(type: ViewType) {
    this.viewType = type;
    localStorage.setItem(VIEW_TYPE_KEY, type);
  }

  get filteredCampaigns(): Campaign[] {
    if (!this.showOnlyOwned || !this.address) {
      return this.campaigns;
    }
    return this.campaigns.filter(
      campaign => campaign.owner.toLowerCase() === this.address?.toLowerCase()
    );
  }

  setShowOnlyOwned(show: boolean) {
    this.showOnlyOwned = show;
  }

  async logout() {
    this.setAddress(null);
    this.setShowOnlyOwned(false);
    this.campaigns = [];
    this.donations = {};
    this.error = null;
    this.loading = false;
  }
}

export const campaignStore = new CampaignStore(); 