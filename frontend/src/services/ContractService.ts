import { ethers } from 'ethers';
import { Campaign, CampaignInput } from '../types/campaign';
import { ErrorType } from '../types/error';

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

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "campaigns",
    "outputs": [
      {"internalType": "address payable", "name": "owner", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "image", "type": "string"},
      {"internalType": "uint256", "name": "goal", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "uint256", "name": "balance", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"},
      {"internalType": "bool", "name": "autoComplete", "type": "bool"},
      {"internalType": "uint8", "name": "status", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "goalInWei", "type": "uint256"},
      {"internalType": "uint256", "name": "durationInDays", "type": "uint256"},
      {"internalType": "string", "name": "image", "type": "string"},
      {"internalType": "bool", "name": "autoComplete", "type": "bool"}
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_campaignId", "type": "uint256"},
      {"internalType": "string", "name": "_message", "type": "string"}
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
    "name": "completeCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
    "name": "canWithdrawFunds",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
    "name": "getCampaignStatus",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "image",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "goal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "CampaignCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
    "name": "getCampaign",
    "outputs": [
      {
        "components": [
          {"internalType": "address payable", "name": "owner", "type": "address"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "image", "type": "string"},
          {"internalType": "uint256", "name": "goal", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "uint256", "name": "balance", "type": "uint256"},
          {"internalType": "bool", "name": "completed", "type": "bool"},
          {"internalType": "bool", "name": "autoComplete", "type": "bool"},
          {"internalType": "uint8", "name": "status", "type": "uint8"}
        ],
        "internalType": "struct CryptoFundraiser.Campaign",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private connectionPromise: Promise<string> | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

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

  async connect(): Promise<string> {
    // Clear disconnected state when explicitly connecting
    setWalletDisconnected(false);

    if (!window.ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    // If there's already a connection attempt in progress, return it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    try {
      // Create a new connection promise with timeout
      this.connectionPromise = (async () => {
        try {
          // Set a timeout to clear the connection state if it takes too long
          this.connectionTimeout = setTimeout(() => {
            this.clearConnectionState();
          }, 30000); // 30 seconds timeout

          // First check if we're already connected
          const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
          if (!accounts || accounts.length === 0) {
            // Only request permissions if we're not already connected
            const permissions = await window.ethereum!.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }]
            });

            if (!permissions || permissions.length === 0) {
              throw new Error(ErrorType.USER_REJECTED);
            }

            // Get the accounts after permissions are granted
            const newAccounts = await window.ethereum!.request({ method: 'eth_accounts' });
            if (!newAccounts || newAccounts.length === 0) {
              throw new Error(ErrorType.USER_REJECTED);
            }
          }

          // Clean up any existing provider
          if (this.provider) {
            this.provider.removeAllListeners();
          }
          
          this.provider = new ethers.BrowserProvider(window.ethereum!);
          const signer = await this.provider.getSigner();
          const contractAddress = this.validateContractAddress();
          
          this.contract = new ethers.Contract(
            contractAddress,
            CONTRACT_ABI,
            signer
          );

          // Clear the timeout since we succeeded
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }

          return accounts[0];
        } catch (error) {
          console.error('Failed to connect:', error);
          // Clear the connection state on error
          this.clearConnectionState();
          if (error instanceof Error) {
            if (error.message.includes('user rejected')) {
              throw new Error(ErrorType.USER_REJECTED);
            }
            // Handle the specific error code for multiple requests
            if (error.message.includes('-32002')) {
              throw new Error(ErrorType.METAMASK_PENDING);
            }
          }
          throw error;
        }
      })();

      return await this.connectionPromise;
    } catch (error) {
      // Clear the connection state on error
      this.clearConnectionState();
      throw error;
    }
  }

  async checkConnection(): Promise<string | null> {
    // Check if wallet was explicitly disconnected
    if (isWalletDisconnected()) {
      return null;
    }

    if (!window.ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // If there's a connection in progress, wait for it
      if (this.connectionPromise) {
        return await this.connectionPromise;
      }

      const ethereum = window.ethereum;
      if (!ethereum) {
        throw new Error(ErrorType.METAMASK);
      }

      // Check if already connected without prompting
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        return null;
      }

      this.provider = new ethers.BrowserProvider(ethereum);
      const signer = await this.provider.getSigner();
      const contractAddress = this.validateContractAddress();
      
      this.contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      );

      // Clear disconnected state since we're now connected
      setWalletDisconnected(false);

      return accounts[0];
    } catch (error) {
      console.error('Failed to check connection:', error);
      // Don't throw on check connection errors, just return null
      return null;
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    if (!this.contract || !this.provider) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const count = await this.contract.campaignCount();
      const campaigns: Campaign[] = [];

      for (let i = 0; i < count; i++) {
        try {
          const campaign = await this.contract.campaigns(i);
          const status = await this.contract.getCampaignStatus(i);
          const statusMap = ['active', 'completed', 'failed'];
          
          campaigns.push({
            id: i,
            creator: campaign.owner,
            owner: campaign.owner,
            title: campaign.title || '',
            description: campaign.description || '',
            image: campaign.image || '',
            goal: ethers.formatEther(campaign.goal),
            pledged: ethers.formatEther(campaign.balance),
            startAt: new Date(0),
            endAt: new Date(Number(campaign.deadline) * 1000),
            autoComplete: campaign.autoComplete,
            status: statusMap[status] as 'active' | 'completed' | 'failed'
          });
        } catch (error) {
          console.error(`Failed to get campaign ${i}:`, error);
        }
      }

      return campaigns;
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      throw new Error(ErrorType.GET_CAMPAIGNS_FAILED);
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
      
      const tx = await this.contract.createCampaign(
        title,
        description,
        goalInWei,
        durationInDays,
        image || '',
        autoComplete
      );
      await tx.wait();

      // Get the current campaign count (new campaign ID)
      const count = await this.contract.campaignCount();
      return Number(count) - 1;
    } catch (error) {
      console.error('Failed to create campaign:', error);
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
      }
      throw new Error(ErrorType.NETWORK);
    }
  }

  async donate(campaignId: number, amount: number, message: string = ''): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.donate(campaignId, message, { value: amountInWei });
      await tx.wait();
    } catch (error) {
      console.error('Failed to donate:', error);
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
      }
      throw new Error(ErrorType.NETWORK);
    }
  }

  async getCampaignDonations(campaignId: number): Promise<{ donor: string; amount: string; message: string; timestamp: Date; }[]> {
    if (!this.contract || !this.provider) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Get donation events for this campaign
      const filter = {
        address: this.contract.target as string,
        topics: [
          ethers.id("DonationReceived(uint256,address,uint256,string)"),
          ethers.toBeHex(campaignId, 32)
        ]
      };
      
      const events = await this.provider.getLogs({
        ...filter,
        fromBlock: 0,
        toBlock: 'latest'
      });
      
      // Map events to donation objects
      const donations = await Promise.all(events.map(async (event) => {
        const block = await event.getBlock();
        // Donor is the second topic (index 2)
        const donor = ethers.getAddress('0x' + event.topics[2].slice(26));
        // Amount and message are in the data field
        const [amount, message] = ethers.AbiCoder.defaultAbiCoder().decode(['uint256', 'string'], event.data);
        
        return {
          donor,
          amount: ethers.formatEther(amount),
          message: message || '',
          timestamp: new Date(block.timestamp * 1000)
        };
      }));
      
      // Sort by timestamp, most recent first
      return donations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to get campaign donations:', error);
      throw new Error(ErrorType.NETWORK);
    }
  }

  async completeCampaign(campaignId: number): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const tx = await this.contract.completeCampaign(campaignId);
      await tx.wait();
    } catch (error) {
      console.error('Failed to complete campaign:', error);
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
      }
      throw new Error(ErrorType.NETWORK);
    }
  }

  async canWithdrawFunds(campaignId: number): Promise<boolean> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Get campaign details instead of using canWithdrawFunds
      const campaign = await this.contract.campaigns(campaignId);
      
      // Can withdraw if campaign is completed and has balance
      return campaign.completed && Number(campaign.balance) > 0;
    } catch (error) {
      console.error('Failed to check if can withdraw funds:', error);
      return false;
    }
  }

  async withdrawFunds(campaignId: number): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const tx = await this.contract.withdrawFunds(campaignId);
      await tx.wait();
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
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
        if (error.message.includes('Only owner can withdraw funds')) {
          throw new Error(ErrorType.UNAUTHORIZED);
        }
      }
      throw new Error(ErrorType.NETWORK);
    }
  }
}

export const contractService = new ContractService(); 