import { makeAutoObservable, runInAction } from "mobx";
import { contractService } from "@services/ContractService";
import { Campaign, CampaignInput } from "@/types/campaign";
import { ViewType } from "@interfaces";
import { ErrorType } from "@error";
import { walletStore } from "./WalletStore";

class CampaignStore {
  campaigns: Campaign[] = [];
  donations: Record<
    number,
    { donor: string; amount: string; message: string; timestamp: Date }[]
  > = {};
  loading = false;
  initialLoading = true;
  viewType: ViewType = "grid";
  showOnlyOwned = false;
  currentStatus: "all" | "active" | "completed" | "failed" = "all";

  constructor() {
    makeAutoObservable(this);
  }

  private setLoadingState(loading: boolean, initialLoading: boolean) {
    runInAction(() => {
      this.loading = loading;
      this.initialLoading = initialLoading;
    });
  }

  async createCampaign(campaignInput: CampaignInput): Promise<number | void> {
    this.loading = true;

    if (!walletStore.address) {
      await walletStore.connect();
    }
    const campaignId = await contractService.createCampaign(campaignInput);

    this.setLoadingState(false, this.initialLoading);
    return campaignId;
  }

  async loadCampaigns() {
    if (this.loading) return;

    console.log("Loading campaigns");
    this.loading = true;
    await walletStore.checkConnection();

    const campaigns = await contractService.getCampaigns();
    console.log("Campaigns loaded:", campaigns);

    runInAction(() => {
      this.campaigns = campaigns;
    });

    this.setLoadingState(false, false);
  }

  async loadCampaignById(id: number): Promise<void> {
    if (this.loading) return;

    this.loading = true;

    try {
      const existingCampaign = this.campaigns.find(
        (c: { id: number }) => c.id === id,
      );

      if (existingCampaign) {
        console.log("Campaign already loaded:", existingCampaign);
        await this.refreshCampaign(id);
        return;
      }

      await this.loadCampaignWithRetries(id);
    } catch (error) {
      console.error("Error loading campaign:", error);
      this.handleError(error);
    } finally {
      this.setLoadingState(false, false);
    }
  }

  async refreshCampaign(id: number): Promise<void> {
    const campaign = await contractService.getCampaign(id);
    if (campaign) {
      runInAction(() => {
        const index = this.campaigns.findIndex(
          (c: { id: number }) => c.id === id,
        );
        if (index !== -1) {
          this.campaigns[index] = campaign;
        }
      });
    }
  }

  async loadCampaignWithRetries(
    id: number,
    retries = 3,
    delayFactor = 1000,
  ): Promise<void> {
    for (let attempt = 0; attempt < retries; attempt++) {
      const campaign = await contractService.getCampaign(id);
      if (campaign) {
        runInAction(() => {
          const existingIndex = this.campaigns.findIndex(
            (c: { id: number }) => c.id === id,
          );

          if (existingIndex !== -1) {
            this.campaigns[existingIndex] = campaign;
          } else {
            this.campaigns.push(campaign);
          }
        });
        return;
      }

      await this.delay((attempt + 1) * delayFactor);
    }

    throw new Error(`Campaign with ID ${id} not found`);
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loadCampaignDonations(id: number) {
    try {
      this.setLoadingState(true, false);
      const donations = await contractService.getCampaignDonations(id);
      console.log("Donations loaded:", donations);

      runInAction(() => {
        this.donations = {
          ...this.donations,
          [id]: donations,
        };
      });
    } catch (error) {
      console.error("Error loading donations:", error);
      runInAction(() => {
        this.donations[id] = [];
      });
    } finally {
      this.setLoadingState(false, false);
    }
  }

  async donate(id: number, amount: number, message: string = "") {
    try {
      this.setLoadingState(true, false);
      await contractService.donate(id, amount, message);

      await Promise.all([this.loadCampaigns(), this.loadCampaignDonations(id)]);
    } catch (error) {
      console.error("Error donating:", error);
      this.handleError(error);
    } finally {
      this.setLoadingState(false, false);
    }
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
      if (error.message.includes("user rejected")) {
        throw new Error(ErrorType.USER_REJECTED);
      }
      if (error.message.includes("insufficient funds")) {
        throw new Error(ErrorType.INSUFFICIENT_FUNDS);
      }
    }
    throw new Error(ErrorType.NETWORK);
  }

  get filteredCampaigns() {
    let filtered = this.campaigns;

    // Filter by status
    if (this.currentStatus !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.status === this.currentStatus,
      );
    }

    // Filter by ownership
    if (this.showOnlyOwned) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.owner.toLowerCase() === walletStore.address?.toLowerCase(),
      );
    }

    return filtered;
  }

  setViewType(type: ViewType) {
    this.viewType = type;
  }

  setShowOnlyOwned(show: boolean) {
    this.showOnlyOwned = show;
  }

  setStatus(status: "all" | "active" | "completed" | "failed") {
    this.currentStatus = status;
  }
}

export const campaignStore = new CampaignStore();
