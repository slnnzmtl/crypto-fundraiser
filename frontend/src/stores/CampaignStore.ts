import { makeAutoObservable, runInAction } from 'mobx';
import { contractService } from '@services/ContractService';
import { Campaign, CampaignInput } from '@/types/campaign';
import { ViewType } from '@interfaces';
import { ErrorType } from '@error';
import { ethers } from 'ethers';
import { walletStore } from './WalletStore';

class CampaignStore {
  campaigns: Campaign[] = [];
  donations: Record<number, { donor: string; amount: string; message: string; timestamp: Date; }[]> = {};
  loading = false;
  initialLoading = true;
  viewType: ViewType = 'grid';
  showOnlyOwned = false;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  private async initialize() {
    try {
      const isConnected = await walletStore.checkConnection();
      runInAction(() => {
        this.initialLoading = false;
        if (isConnected) {
          this.loadCampaigns();
        }
      });
    } catch (error) {
      console.error('Failed to initialize:', error);
      this.setLoadingState(false, false);
    }
  }

  private setLoadingState(loading: boolean, initialLoading: boolean) {
    runInAction(() => {
      this.loading = loading;
      this.initialLoading = initialLoading;
    });
  }

  async createCampaign(campaignInput: CampaignInput): Promise<number | void> {
    this.loading = true;
    try {
      if (!walletStore.address) {
        await walletStore.connect();
      }
      const campaignId = await contractService.createCampaign(campaignInput);
      
      // Wait for a few blocks to ensure the campaign is indexed
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.loadCampaigns();
      
      return campaignId;
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoadingState(false, this.initialLoading);
    }
  }

  async loadCampaigns() {
    if (this.loading) return;

    this.loading = true;
    try {
      const campaigns = await contractService.getCampaigns();
      runInAction(() => {
        this.campaigns = campaigns;
      });
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      this.setLoadingState(false, false);
    }
  }

  async loadCampaignById(id: number) {
    if (this.loading) return;

    this.loading = true;
    try {
      // Try multiple times with increasing delays
      for (let i = 0; i < 3; i++) {
        const campaign = await contractService.getCampaign(id);
        if (campaign) {
          runInAction(() => {
            const existingIndex = this.campaigns.findIndex(c => c.id === id);
            if (existingIndex !== -1) {
              this.campaigns[existingIndex] = campaign;
            } else {
              this.campaigns.push(campaign);
            }
          });
          return;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
      console.error('Failed to load campaign after multiple attempts');
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      this.setLoadingState(false, false);
    }
  }

  async loadCampaignDonations(id: number) {
    try {
      const donations = await contractService.getCampaignDonations(id);
      runInAction(() => {
        this.donations[id] = donations;
      });
    } catch (error) {
      console.error('Failed to load donations:', error);
      runInAction(() => {
        this.donations[id] = [];
      });
      throw error;
    }
  }

  async donate(id: number, amount: number, message: string = '') {
    await contractService.donate(id, amount, message);
    await Promise.all([this.loadCampaigns(), this.loadCampaignDonations(id)]);
  }

  async completeCampaign(id: number) {
    await contractService.completeCampaign(id);
    await this.loadCampaigns();
  }

  async withdrawFunds(id: number) {
    await contractService.withdrawFunds(id);
    await this.loadCampaigns();
  }

  async canWithdrawFunds(id: number): Promise<boolean> {
    return contractService.canWithdrawFunds(id);
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        throw new Error(ErrorType.USER_REJECTED);
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error(ErrorType.INSUFFICIENT_FUNDS);
      }
    }
    throw new Error(ErrorType.NETWORK);
  }

  get filteredCampaigns() {
    return this.showOnlyOwned
      ? this.campaigns.filter(campaign => campaign.owner.toLowerCase() === walletStore.address?.toLowerCase())
      : this.campaigns;
  }

  setViewType(type: ViewType) {
    this.viewType = type;
  }

  setShowOnlyOwned(show: boolean) {
    this.showOnlyOwned = show;
  }
}

export const campaignStore = new CampaignStore();
