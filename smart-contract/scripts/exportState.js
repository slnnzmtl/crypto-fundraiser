const fs = require('fs');
const path = require('path');
const { ethers } = require("hardhat");

async function main() {
  try {
    // Get the deployed contract address from .env
    const envPath = path.join(__dirname, '../../frontend/.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const contractAddress = envContent.match(/REACT_APP_CONTRACT_ADDRESS=(.*)/)[1];

    if (!contractAddress) {
      throw new Error('Contract address not found in .env file');
    }

    // Get contract instance
    const CryptoFundraiser = await ethers.getContractFactory("CryptoFundraiser");
    const contract = await CryptoFundraiser.attach(contractAddress);

    // Get campaign count
    const campaignCount = await contract.campaignCount();
    
    // Get all campaigns
    const campaigns = [];
    const donations = {};

    for (let i = 0; i < campaignCount; i++) {
      const campaign = await contract.campaigns(i);
      
      // Get all donations for this campaign
      const events = await contract.queryFilter(contract.filters.DonationReceived(i));
      const campaignDonations = events.map(event => ({
        donor: event.args.donor,
        amount: event.args.amount.toString(),
        campaignId: event.args.campaignId.toString()
      }));

      campaigns.push({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        image: campaign.image,
        goal: campaign.goal.toString(),
        deadline: campaign.deadline.toString(),
        balance: campaign.balance.toString(),
        completed: campaign.completed,
        autoComplete: campaign.autoComplete
      });

      donations[i] = campaignDonations;
    }

    // Save state to file
    const state = {
      campaigns,
      donations,
      timestamp: new Date().toISOString()
    };

    const backupPath = path.join(__dirname, '../data/backup.json');
    
    // Create directory if it doesn't exist
    const dir = path.dirname(backupPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(backupPath, JSON.stringify(state, null, 2));
    console.log(`State exported to ${backupPath}`);
    console.log(`Total campaigns exported: ${campaigns.length}`);
    
  } catch (error) {
    console.error('Failed to export state:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 