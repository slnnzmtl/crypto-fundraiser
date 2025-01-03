import { makeAutoObservable, action, runInAction } from 'mobx';
import { contractService } from '../services/ContractService';
import { Campaign, CampaignInput } from '../types/campaign';
import { ErrorType } from '../types/error';
import { progressStore } from './ProgressStore';
import { walletStore } from './WalletStore';
import { viewStore } from './ViewStore';
import { ICampaign, IDonation, IWallet, IView, ViewType } from './interfaces';

export class CampaignStore implements ICampaign, IWallet, IView {
  // IWallet
  address: string | null = null;

  // IView
  viewType: ViewType = 'grid';
  showOnlyOwned: boolean = false;

  // ICampaign
  campaigns: Campaign[] = [];
  donations: Record<number, IDonation[]> = {};
  loading: boolean = false;
  initialLoading: boolean = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    try {
      if (walletStore.address) {
        await this.loadCampaigns();
      }
    } finally {
      runInAction(() => {
        this.initialLoading = false;
      });
    }
  }

  // IWallet methods
  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  setError(error: string | null) {
    this.error = error;
  }

  @action
  async connect(): Promise<void> {
    await walletStore.connect();
    runInAction(() => {
      this.address = walletStore.address;
    });
  }

  @action
  disconnect(): void {
    walletStore.disconnect();
    runInAction(() => {
      this.address = null;
    });
  }

  @action
  logout(): void {
    this.disconnect();
    this.reset();
  }

  // IView methods
  @action
  setViewType(type: ViewType): void {
    this.viewType = type;
  }

  @action
  setShowOnlyOwned(show: boolean): void {
    this.showOnlyOwned = show;
  }

  setCampaigns = action((campaigns: Campaign[]) => {
    this.campaigns = campaigns;
  });

  setDonations = action((campaignId: number, donations: IDonation[]) => {
    this.donations[campaignId] = donations;
  });

  async loadCampaigns() {
    if (!this.loading) {
      this.setLoading(true);
      this.setError(null);
    }

    try {
      progressStore.start();

      if (!walletStore.address) {
        await walletStore.connect();
        return;
      }
      const campaigns = await contractService.getCampaigns();
      runInAction(() => {
        this.campaigns = campaigns;
      });
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
    this.setError(null);

    try {
      progressStore.start();
      if (!walletStore.address) {
        await walletStore.connect();
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
    this.setError(null);

    try {
      progressStore.start();
      if (!walletStore.address) {
        await walletStore.connect();
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
      if (!walletStore.address) {
        await walletStore.connect();
      }
      const donations = await contractService.getCampaignDonations(campaignId);
      runInAction(() => {
        this.donations[campaignId] = donations;
      });
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
    this.setError(null);

    try {
      progressStore.start();
      if (!walletStore.address) {
        await walletStore.connect();
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

  async canWithdrawFunds(campaignId: number): Promise<boolean> {
    try {
      if (!walletStore.address) {
        return false;
      }
      return await contractService.canWithdrawFunds(campaignId);
    } catch (error) {
      console.error('Failed to check if can withdraw funds:', error);
      return false;
    }
  }

  async withdrawFunds(campaignId: number) {
    this.setLoading(true);
    this.setError(null);

    try {
      progressStore.start();
      if (!walletStore.address) {
        await walletStore.connect();
      }
      await contractService.withdrawFunds(campaignId);
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

  get filteredCampaigns(): Campaign[] {
    if (!viewStore.showOnlyOwned || !walletStore.address) {
      return this.campaigns;
    }
    return this.campaigns.filter(
      campaign => campaign.owner.toLowerCase() === walletStore.address?.toLowerCase()
    );
  }

  reset = action(() => {
    this.campaigns = [];
    this.donations = {};
    this.error = null;
    this.loading = false;
    this.initialLoading = false;
  });
}

export const campaignStore = new CampaignStore(); 