const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to kill existing frontend server
function killFrontendServer() {
  return new Promise((resolve, reject) => {
    // On macOS/Linux
    exec('lsof -ti:3000 | xargs kill -9', (error) => {
      // Ignore error as it might mean no process was running
      resolve();
    });
  });
}

async function exportState(oldContract) {
  try {
    // Export state if old contract exists
    if (oldContract) {
      console.log('Exporting state from old contract...');
      await exec('node scripts/exportState.js');
      console.log('State exported successfully');
    }
  } catch (error) {
    console.error('Failed to export state:', error);
  }
}

async function importState(newContract) {
  try {
    // Check if we have a backup to import
    const backupPath = path.join(__dirname, '../data/backup.json');
    if (fs.existsSync(backupPath)) {
      console.log('Importing state to new contract...');
      await exec('node scripts/importState.js');
      console.log('State imported successfully');
    }
  } catch (error) {
    console.error('Failed to import state:', error);
  }
}

async function main() {
  try {
    // Get the old contract address if it exists
    const envPath = path.join(__dirname, '../../frontend/.env');
    let oldContractAddress;
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/REACT_APP_CONTRACT_ADDRESS=(.*)/);
      if (match) {
        oldContractAddress = match[1];
      }
    }

    // Export state from old contract if it exists
    if (oldContractAddress) {
      const CryptoFundraiser = await hre.ethers.getContractFactory("CryptoFundraiser");
      const oldContract = await CryptoFundraiser.attach(oldContractAddress);
      await exportState(oldContract);
    }

    // Get the contract factory
    console.log("Getting contract factory...");
    const CryptoFundraiser = await hre.ethers.getContractFactory("CryptoFundraiser");
    console.log("Contract factory bytecode hash:", hre.ethers.keccak256(CryptoFundraiser.bytecode));

    // Deploy the contract
    console.log("Deploying CryptoFundraiser...");
    const cryptoFundraiser = await CryptoFundraiser.deploy();

    // Wait for deployment to complete
    console.log("Waiting for deployment to complete...");
    await cryptoFundraiser.waitForDeployment();
    const address = await cryptoFundraiser.getAddress();
    console.log("CryptoFundraiser deployed to:", address);

    // Wait for more block confirmations to ensure deployment is stable
    console.log("Waiting for block confirmations...");
    const deploymentReceipt = await cryptoFundraiser.deploymentTransaction().wait(10);
    console.log("Deployment confirmed in block:", deploymentReceipt.blockNumber);

    // Copy ABI to frontend
    const abiPath = path.join(__dirname, '../artifacts/contracts/CryptoFundraiser.sol/CryptoFundraiser.json');
    const frontendAbiPath = path.join(__dirname, '../../frontend/src/abi/CryptoFundraiser.json');

    // Create directory if it doesn't exist
    const abiDir = path.dirname(frontendAbiPath);
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir, { recursive: true });
    }
    
    // Copy ABI file
    fs.copyFileSync(abiPath, frontendAbiPath);
    console.log(`ABI copied to ${frontendAbiPath}`);

    // Update .env file in frontend directory
    const envContent = `REACT_APP_CONTRACT_ADDRESS=${address}\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('Updated frontend .env with new contract address');

    // Import state to new contract
    await importState(cryptoFundraiser);

    // Kill existing frontend server and start a new one
    console.log('Restarting frontend server...');
    await killFrontendServer();
    
    exec('cd ../../frontend && npm start', (error, stdout, stderr) => {
      if (error) {
        console.error('Error restarting frontend server:', error);
        return;
      }
      console.log('Frontend server restarted');
      
      // Log stdout and stderr
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });

  } catch (error) {
    console.error("\nDeployment failed with error:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.transaction) {
      console.error("Error transaction:", error.transaction);
    }
    process.exitCode = 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  }); 