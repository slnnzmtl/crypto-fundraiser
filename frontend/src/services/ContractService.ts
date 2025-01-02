import { ethers } from 'ethers';
import { Campaign, CampaignInput } from '../types/campaign';
import { ErrorType } from '../types/error';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

// Check contract address on initialization
if (!CONTRACT_ADDRESS) {
  console.error('Contract address is not configured in .env file');
} else {
  console.log('Using contract address:', CONTRACT_ADDRESS);
}

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
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "goal", "type": "uint256"},
      {"internalType": "uint256", "name": "balance", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "goal", "type": "uint256"},
      {"internalType": "uint256", "name": "durationInDays", "type": "uint256"},
      {"internalType": "string", "name": "image", "type": "string"}
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  private validateContractAddress(): string {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address is not configured');
    }
    return CONTRACT_ADDRESS;
  }

  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      const contractAddress = this.validateContractAddress();
      
      this.contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      );

      return signer.getAddress();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw new Error(ErrorType.NETWORK);
    }
  }

  async checkConnection(): Promise<string | null> {
    if (!window.ethereum) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await this.provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await this.provider.getSigner();
        const contractAddress = this.validateContractAddress();
        
        this.contract = new ethers.Contract(
          contractAddress,
          CONTRACT_ABI,
          signer
        );

        return accounts[0].address;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to check connection:', error);
      throw new Error(ErrorType.NETWORK);
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
          campaigns.push({
            id: i,
            creator: campaign.owner,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            image: campaign.image,
            goal: ethers.formatEther(campaign.goal),
            pledged: ethers.formatEther(campaign.balance),
            startAt: new Date(0),
            endAt: new Date(Number(campaign.deadline) * 1000),
            claimed: campaign.completed
          });
        } catch (error) {
          console.error(`Failed to get campaign ${i}:`, error);
        }
      }

      return campaigns;
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      throw new Error(ErrorType.NETWORK);
    }
  }

  async getCampaign(id: number): Promise<Campaign | null> {
    if (!this.contract) {
      throw new Error('Contract is not initialized');
    }

    try {
      const [owner, goal, balance, deadline, completed] = await this.contract.campaigns(id);
      return {
        id,
        creator: owner,
        owner: owner,
        title: '',
        description: '',
        image: '',
        goal: ethers.formatEther(goal),
        pledged: ethers.formatEther(balance),
        startAt: new Date(0),
        endAt: new Date(Number(deadline) * 1000),
        claimed: completed
      };
    } catch (error) {
      console.error('Failed to get campaign:', error);
      return null;
    }
  }

  async createCampaign(campaignInput: CampaignInput): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const { title, description, goal, durationInDays, image } = campaignInput;
      
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
      const deadline = Math.floor(Date.now() / 1000) + (durationInDays * 24 * 60 * 60);
      
      const tx = await this.contract.createCampaign(
        title,
        description,
        goalInWei,
        deadline,
        image || ''
      );
      await tx.wait();
    } catch (error) {
      console.error('Failed to create campaign:', error);
      if (error instanceof Error && error.message.includes('user rejected')) {
        throw new Error(ErrorType.USER_REJECTED);
      }
      throw new Error(ErrorType.NETWORK);
    }
  }

  async donate(campaignId: number, amount: number): Promise<void> {
    if (!this.contract) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.donate(campaignId, { value: amountInWei });
      await tx.wait();
    } catch (error) {
      console.error('Failed to donate:', error);
      if (error instanceof Error && error.message.includes('user rejected')) {
        throw new Error(ErrorType.USER_REJECTED);
      }
      throw new Error(ErrorType.NETWORK);
    }
  }
}

export const contractService = new ContractService(); 