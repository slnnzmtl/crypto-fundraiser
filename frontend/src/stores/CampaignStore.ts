import { makeAutoObservable } from 'mobx';
import { contractService } from '../services/ContractService';
import { Campaign, CampaignInput } from '../types/campaign';

export class CampaignStore {
  campaigns: Campaign[] = [];
  loading: boolean = false;
  error: string | null = null;
  address: string | null = null;

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
      // Ignore initial connection errors
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
      const address = await contractService.connect();
      this.setAddress(address);
      await this.loadCampaigns();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('network');
    } finally {
      this.setLoading(false);
    }
  }

  async loadCampaigns() {
    this.setLoading(true);
    this.error = null;

    try {
      const campaigns = await contractService.getCampaigns();
      this.campaigns = campaigns;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('network');
    } finally {
      this.setLoading(false);
    }
  }

  async createCampaign(campaignInput: CampaignInput) {
    this.setLoading(true);
    this.error = null;

    try {
      await contractService.createCampaign(campaignInput);
      await this.loadCampaigns();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('network');
    } finally {
      this.setLoading(false);
    }
  }

  async donate(campaignId: number, amount: number) {
    this.setLoading(true);
    this.error = null;

    try {
      await contractService.donate(campaignId, amount);
      await this.loadCampaigns();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('network');
    } finally {
      this.setLoading(false);
    }
  }
}

export const campaignStore = new CampaignStore(); 