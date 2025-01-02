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
      {"internalType": "address payable", "name": "owner", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "image", "type": "string"},
      {"internalType": "uint256", "name": "goal", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "uint256", "name": "balance", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"},
      {"internalType": "bool", "name": "autoComplete", "type": "bool"}
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
    "inputs": [{"internalType": "uint256", "name": "_campaignId", "type": "uint256"}],
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
      }
    ],
    "name": "DonationReceived",
    "type": "event"
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
            title: campaign.title || '',
            description: campaign.description || '',
            image: campaign.image || '',
            goal: ethers.formatEther(campaign.goal),
            pledged: ethers.formatEther(campaign.balance),
            startAt: new Date(0),
            endAt: new Date(Number(campaign.deadline) * 1000),
            claimed: campaign.completed,
            autoComplete: campaign.autoComplete
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
      const campaign = await this.contract.campaigns(id);
      return {
        id,
        creator: campaign.owner,
        owner: campaign.owner,
        title: campaign.title || '',
        description: campaign.description || '',
        image: campaign.image || '',
        goal: ethers.formatEther(campaign.goal),
        pledged: ethers.formatEther(campaign.balance),
        startAt: new Date(0),
        endAt: new Date(Number(campaign.deadline) * 1000),
        claimed: campaign.completed,
        autoComplete: campaign.autoComplete
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

  async getCampaignDonations(campaignId: number): Promise<{ donor: string; amount: string; timestamp: Date; }[]> {
    if (!this.contract || !this.provider) {
      throw new Error(ErrorType.METAMASK);
    }

    try {
      // Get donation events for this campaign
      const filter = {
        address: this.contract.target as string,
        topics: [
          ethers.id("DonationReceived(uint256,address,uint256)"),
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
        // Amount is in the data field
        const amount = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], event.data)[0];
        
        return {
          donor,
          amount: ethers.formatEther(amount),
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
      if (error instanceof Error && error.message.includes('user rejected')) {
        throw new Error(ErrorType.USER_REJECTED);
      }
      throw new Error(ErrorType.NETWORK);
    }
  }
}

export const contractService = new ContractService(); 