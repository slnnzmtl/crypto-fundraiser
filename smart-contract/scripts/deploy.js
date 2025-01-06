const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const FileSystem = {
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  },

  copyFile(source, target) {
    if (!fs.existsSync(source)) {
      throw new Error(`Source file not found: ${source}`);
    }
    this.ensureDirectoryExists(path.dirname(target));
    fs.copyFileSync(source, target);
    
    if (!fs.existsSync(target)) {
      throw new Error(`Failed to copy file to: ${target}`);
    }
  },

  writeFile(filePath, content) {
    this.ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Failed to write file: ${filePath}`);
    }
  },

  readJson(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
};

const FrontendManager = {
  updateABI(contractName, abiPath) {
    try {
      const frontendAbiPath = path.join(__dirname, '../../frontend/src/abi', `${contractName}.json`);
      FileSystem.copyFile(abiPath, frontendAbiPath);
      
      const abiContent = fs.readFileSync(frontendAbiPath, 'utf8');
      if (!abiContent || abiContent.trim() === '') {
        throw new Error('ABI file is empty');
      }
      
      console.log(`ABI copied to ${frontendAbiPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to update ABI: ${error.message}`);
      throw error;
    }
  },

  updateEnv(address) {
    try {
      if (!address || !address.startsWith('0x')) {
        throw new Error('Invalid contract address');
      }

      const envPath = path.join(__dirname, '../../frontend/.env');
      const envContent = `REACT_APP_CONTRACT_ADDRESS=${address}\n`;
      FileSystem.writeFile(envPath, envContent);
      
      const writtenContent = fs.readFileSync(envPath, 'utf8');
      if (writtenContent.trim() !== envContent.trim()) {
        throw new Error('ENV file content verification failed');
      }
      
      console.log('Updated frontend .env with new contract address');
      return true;
    } catch (error) {
      console.error(`Failed to update .env: ${error.message}`);
      throw error;
    }
  },

  async restart() {
    try {
      if (process.platform === 'win32') {
        await execAsync('taskkill /F /IM node.exe').catch(() => {});
      } else {
        await execAsync('pkill -f "react-scripts start"').catch(() => {});
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const frontendPath = path.join(__dirname, '../../frontend');
      
      if (!fs.existsSync(frontendPath)) {
        throw new Error('Frontend directory not found');
      }

      const packageJsonPath = path.join(frontendPath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('package.json not found in frontend directory');
      }

      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const child = spawn(npmCmd, ['start'], {
        cwd: frontendPath,
        detached: true,
        stdio: 'ignore'
      });
      
      child.unref();
      
      console.log('Frontend server started in background');
    } catch (error) {
      console.error('Error restarting frontend server:', error);
      throw error;
    }
  }
};

const ContractDeployer = {
  async deploy(contractName) {
    console.log(`Getting ${contractName} factory...`);
    const Factory = await hre.ethers.getContractFactory(contractName);

    console.log(`Deploying ${contractName}...`);
    const contract = await Factory.deploy();

    console.log("Waiting for deployment to complete...");
    await contract.waitForDeployment();
    
    return contract;
  },

  async waitForConfirmations(contract, confirmations) {
    console.log(`Waiting for ${confirmations} block confirmations...`);
    await contract.deploymentTransaction().wait(confirmations);
  },

  async importExamples(contract) {
    try {
      const backupPath = path.join(__dirname, '../data/backup.json');
      const { campaigns, donations } = FileSystem.readJson(backupPath);

      console.log(`Importing ${campaigns.length} example campaigns...`);

      for (let i = 0; i < campaigns.length; i++) {
        const campaign = campaigns[i];
        const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

        const tx = await contract.createCampaign(
          campaign.title,
          campaign.description,
          campaign.goal,
          30,
          campaign.image,
          campaign.autoComplete
        );
        await tx.wait();

        const campaignDonations = donations[i] || [];
        console.log(`Importing ${campaignDonations.length} donations for campaign ${i + 1}`);

        for (const donation of campaignDonations) {
          const [signer] = await hre.ethers.getSigners();
          await signer.sendTransaction({
            to: donation.donor,
            value: donation.amount
          });

          await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [donation.donor],
          });

          const donorSigner = await hre.ethers.getSigner(donation.donor);
          const contractWithDonor = contract.connect(donorSigner);

          const donateTx = await contractWithDonor.donate(
            i,
            donation.message || "",
            { value: donation.amount }
          );
          await donateTx.wait();

          await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [donation.donor],
          });
        }

        if (campaign.status !== "0") {
          await hre.network.provider.request({
            method: "evm_increaseTime",
            params: [30 * 24 * 60 * 60]
          });
          await hre.network.provider.request({
            method: "evm_mine"
          });

          const completeTx = await contract.completeCampaign(i);
          await completeTx.wait();
        }

        console.log(`Campaign ${i + 1} imported successfully`);
      }

      console.log('Example data imported successfully');
    } catch (error) {
      console.error('Failed to import example data:', error);
      throw error;
    }
  }
};

async function main() {
  try {
    const isLocalhost = hre.network.name === 'localhost';
    const contractName = "CryptoFundraiser";

    const contract = await ContractDeployer.deploy(contractName);
    const address = await contract.getAddress();
    console.log(`${contractName} deployed to:`, address);

    if (!isLocalhost) {
      await ContractDeployer.waitForConfirmations(contract, 10);
    }

    const abiPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    
    try {
      await FrontendManager.updateABI(contractName, abiPath);
      await FrontendManager.updateEnv(address);
      console.log('Frontend files updated successfully');
    } catch (error) {
      console.error('Failed to update frontend files:', error);
      process.exit(1);
    }

    // console.log('Restarting frontend server...');
    // await FrontendManager.restart();
  } catch (error) {
    console.error("\nDeployment failed with error:", error);
    process.exitCode = 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  }); 