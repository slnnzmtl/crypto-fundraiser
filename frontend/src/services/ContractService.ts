import { ethers } from 'ethers';
import { Campaign, CampaignInput } from '../types/campaign';
import { ErrorType } from '../types/error';
import CryptoFundraiserArtifact from '../abi/CryptoFundraiser.json';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const WALLET_DISCONNECTED_KEY = 'wallet_disconnected';

// Check contract address on initialization
if (!CONTRACT_ADDRESS) {
  console.error('Contract address is not configured in .env file');
}

// Helper function to check if wallet is disconnected
export const isWalletDisconnected = () => localStorage.getItem(WALLET_DISCONNECTED_KEY) === 'true';

// Helper function to set wallet disconnected state
export const setWalletDisconnected = (disconnected: boolean) => {
  if (disconnected) {
    localStorage.setItem(WALLET_DISCONNECTED_KEY, 'true');
  } else {
    localStorage.removeItem(WALLET_DISCONNECTED_KEY);
  }
};

// Type for raw campaign data from contract
interface RawCampaign {
  owner: string;
  title: string;
  description: string;
  image: string;
  goal: bigint;      // uint96
  deadline: bigint;  // uint40
  balance: bigint;   // uint96
  completed: boolean;
  autoComplete: boolean;
  status: number;    // enum Status
}

// Centralized error handling function
function handleError(error: any, context: string) {
  console.error(`Error in ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('user rejected')) {
      throw new Error(ErrorType.USER_REJECTED);
    }
    if (error.message.includes('insufficient funds')) {
      throw new Error(ErrorType.INSUFFICIENT_FUNDS);
    }
    if (error.message.includes('-32002')) {
      throw new Error(ErrorType.METAMASK_PENDING);
    }
    throw new Error(`${ErrorType.NETWORK}: ${error.message}`);
  }
  throw new Error(ErrorType.NETWORK);
}

class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private connectionPromise: Promise<string> | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private cachedCampaignCount: number | null = null; // Cache for campaign count

  private validateContractAddress(): string {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address is not configured');
    }
    return CONTRACT_ADDRESS;
  }

  private clearConnectionState() {
    this.connectionPromise = null;
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  disconnect() {
    // Clean up our local state
    this.provider?.removeAllListeners();
    this.contract = null;
    this.provider = null;
    this.clearConnectionState();

    // Store disconnected state
    setWalletDisconnected(true);
  }

  private async establishConnection(): Promise<string> {
    if (!window.ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    const ethereum = window.ethereum;
    if (!ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error(ErrorType.METAMASK);
    }

    this.provider = new ethers.BrowserProvider(ethereum);
    const signer = await this.provider.getSigner();
    const contractAddress = this.validateContractAddress();
    
    this.contract = new ethers.Contract(
      contractAddress,
      CryptoFundraiserArtifact.abi,
      signer
    );

    // Clear disconnected state since we're now connected
    setWalletDisconnected(false);

    return accounts[0];
  }

  async connect(): Promise<string> {
    try {
      // If there's a connection in progress, return it
      if (this.connectionPromise) {
        return await this.connectionPromise;
      }

      // Create a new connection promise
      this.connectionPromise = this.establishConnection();

      // Set up timeout to clear connection promise
      this.connectionTimeout = setTimeout(() => {
        this.clearConnectionState();
      }, 30000); // Clear after 30 seconds

      return await this.connectionPromise;
    } catch (error) {
      this.clearConnectionState();
      handleError(error, 'connect');
      return '';
    }
  }

  async checkConnection(): Promise<string | null> {
    // Check if wallet was explicitly disconnected
    if (isWalletDisconnected()) {
      return null;
    }

    try {
      // If there's a connection in progress, wait for it
      if (this.connectionPromise) {
        return await this.connectionPromise;
      }

      return await this.establishConnection();
    } catch (error) {
      handleError(error, 'checkConnection');
      return null;
    }
  }

  private async fetchCampaignCount(): Promise<number> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    if (this.cachedCampaignCount === null) {
      const count = await this.contract.campaignCount();
      console.log('Campaign count:', count);
      this.cachedCampaignCount = Number(count);
    }
    return this.cachedCampaignCount;
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      // Use existing connection check
      const account = await this.checkConnection();
      if (!account || !this.contract) {
        throw new Error(ErrorType.METAMASK);
      }

      const count = await this.fetchCampaignCount();
      
      // If count is 0 or decoding fails, return empty array
      if (count === 0) {
        console.log('No campaigns found');
        return [];
      }

      const campaigns = await this.contract.getCampaigns() as RawCampaign[];
      console.log('Raw campaigns:', campaigns);
      
      if (!campaigns || campaigns.length === 0) {
        return [];
      }

      return campaigns.map((campaign, index) => {
        try {
          // Handle BigInt values properly
          const goal = campaign.goal?.toString() || '0';
          const deadline = campaign.deadline?.toString() || '0';
          const balance = campaign.balance?.toString() || '0';

          return {
            id: index,
            creator: campaign.owner,
            owner: campaign.owner,
            title: campaign.title?.trim() || '',
            description: campaign.description?.trim() || '',
            image: campaign.image?.trim() || '',
            goal: ethers.formatEther(goal),
            pledged: ethers.formatEther(balance),
            startAt: new Date(0),
            endAt: new Date(Number(deadline) * 1000),
            autoComplete: campaign.autoComplete,
            status: this.mapStatus(campaign.status)
          };
        } catch (error) {
          console.error(`Failed to process campaign at index ${index}:`, error);
          return null;
        }
      }).filter((campaign): campaign is Campaign => campaign !== null);
    } catch (error) {
      handleError(error, 'getCampaigns');
      return [];
    }
  }

  private mapStatus(status: number): 'active' | 'completed' | 'failed' {
    const statusMap = ['active', 'completed', 'failed'];
    return statusMap[status] as 'active' | 'completed' | 'failed';
  }

  async getCampaign(id: number): Promise<Campaign | null> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const campaign = await this.contract.getCampaign(id);
      if (!campaign) return null;

      return {
        id,
        creator: campaign.owner,
        owner: campaign.owner,
        title: campaign.title || '',
        description: campaign.description || '',
        image: campaign.image || '',
        goal: ethers.formatEther(campaign.goal),
        pledged: ethers.formatEther(campaign.balance),
        startAt: new Date(0), // Contract doesn't store start time
        endAt: new Date(Number(campaign.deadline) * 1000),
        autoComplete: campaign.autoComplete,
        status: this.mapStatus(campaign.status)
      };
    } catch (error) {
      console.error('Failed to get campaign:', error);
      return null;
    }
  }

  async createCampaign(campaignInput: CampaignInput): Promise<number> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const { title, description, goal, durationInDays, image, autoComplete } = campaignInput;
      
      // Validate input data
      if (!title?.trim()) {
        throw new Error('Title is required');
      }
      if (!description?.trim()) {
        throw new Error('Description is required');
      }
      if (!goal || isNaN(Number(goal)) || Number(goal) <= 0) {
        throw new Error('Goal must be a positive number');
      }
      if (!durationInDays || durationInDays <= 0) {
        throw new Error('Duration must be a positive number');
      }

      const goalInWei = ethers.parseEther(goal.toString());
      
      // Ensure durationInDays is uint16
      const duration = Math.min(Math.max(1, durationInDays), 180);
      
      const tx = await this.contract.createCampaign(
        title.trim(),
        description.trim(),
        goalInWei,
        duration,
        image?.trim() || '',
        autoComplete
      );
      await tx.wait();

      // Invalidate cache after creating a new campaign
      this.cachedCampaignCount = null;

      // Get the current campaign count (new campaign ID)
      const count = await this.contract.campaignCount();
      return Number(count) - 1;
    } catch (error) {
      handleError(error, 'createCampaign');
      return -1;
    }
  }

  async donate(campaignId: number, amount: number, message: string = ''): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Convert amount to Wei and ensure it's a valid number
      const amountInWei = ethers.parseEther(amount.toString());
      
      // Ensure message is never undefined or null
      console.log('Preparing donation:', {
        campaignId,
        message,
        value: amountInWei.toString()
      });

      // Get gas estimate first
      const gasEstimate = await this.contract.donate.estimateGas(
        campaignId,
        message || '',
        { value: amountInWei }
      );

      console.log('Gas estimate:', gasEstimate.toString());

      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

      console.log({
        campaignId: campaignId,
        message: message || '',
        value: amountInWei.toString(),
        gasLimit
      });
      // Send transaction with estimated gas
      const tx = await this.contract.donate(
        campaignId,
        message || '',
        {
          value: amountInWei,
          gasLimit
        }
      );

      console.log('Donation transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Donation confirmed:', receipt);
    } catch (error: any) {
      console.error('Donation error:', error);
      
      // Check for specific error cases
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        const reason = error.reason || 'Transaction would fail';
        throw new Error(`${ErrorType.CONTRACT_ERROR}: ${reason}`);
      }
      
      handleError(error, 'donate');
    }
  }

  

  async completeCampaign(campaignId: number): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Ensure campaignId is uint32
      const tx = await this.contract.completeCampaign(campaignId >>> 0);
      await tx.wait();
    } catch (error) {
      handleError(error, 'completeCampaign');
    }
  }

  async withdrawFunds(campaignId: number): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Ensure campaignId is uint32
      const tx = await this.contract.withdrawFunds(campaignId >>> 0);
      await tx.wait();
    } catch (error) {
      handleError(error, 'withdrawFunds');
    }
  }

  async canWithdrawFunds(campaignId: number): Promise<boolean> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Ensure campaignId is uint32
      return await this.contract.canWithdrawFunds(campaignId >>> 0);
    } catch (error) {
      handleError(error, 'canWithdrawFunds');
      return false;
    }
  }

  async getCampaignDonations(campaignId: number): Promise<{ donor: string; amount: string; message: string; timestamp: Date; }[]> {
    if (!this.contract || !this.provider) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Get donation events for this campaign using the correct event signature
      const filter = this.contract.filters.DonationReceived(
        campaignId,  // campaignId as uint32
        null              // any donor address
      );
      
      const events = await this.contract.queryFilter(filter, 0, 'latest');
      console.log('Found donation events:', events);
      
      // Map events to donation objects
      const donations = await Promise.all(events.map(async (event) => {
        if (!('args' in event) || !event.args) {
          console.error('Event is not properly formatted:', event);
          return null;
        }

        const block = await event.getBlock();
        const eventLog = event as ethers.EventLog;

        return {
          donor: eventLog.args[1], // donor is the second argument
          amount: ethers.formatEther(eventLog.args[2]), // amount is the third argument
          message: eventLog.args[3] || '', // message is the fourth argument
          timestamp: new Date(block.timestamp * 1000)
        };
      }));
      
      // Filter out null values and sort by timestamp
      return donations
        .filter((d): d is NonNullable<typeof d> => d !== null)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error getting campaign donations:', error);
      handleError(error, 'getCampaignDonations');
      return [];
    }
  }
}

export const contractService = new ContractService(); 