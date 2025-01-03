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

    // Get backup data
    const backupPath = path.join(__dirname, '../data/backup.json');
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const { campaigns } = backup;

    // Get contract instance
    const CryptoFundraiser = await ethers.getContractFactory("CryptoFundraiser");
    const contract = await CryptoFundraiser.attach(contractAddress);

    console.log(`Starting import of ${campaigns.length} campaigns...`);

    // Import each campaign
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      
      // Calculate remaining duration in days
      const deadline = parseInt(campaign.deadline);
      const now = Math.floor(Date.now() / 1000);
      const remainingSeconds = Math.max(0, deadline - now);
      const durationInDays = Math.ceil(remainingSeconds / (24 * 60 * 60));

      console.log(`Importing campaign ${i + 1}/${campaigns.length}: ${campaign.title}`);

      try {
        // Create campaign
        const tx = await contract.createCampaign(
          campaign.title,
          campaign.description,
          campaign.goal,
          durationInDays,
          campaign.image,
          campaign.autoComplete
        );
        await tx.wait();

        // If campaign was completed or has a status, update it
        if (campaign.completed || campaign.status) {
          const completeTx = await contract.completeCampaign(i);
          await completeTx.wait();
        }

        console.log(`Campaign ${i + 1} imported successfully`);
      } catch (error) {
        console.error(`Failed to import campaign ${i + 1}:`, error);
      }
    }

    console.log('Import completed successfully');
    
  } catch (error) {
    console.error('Failed to import state:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 