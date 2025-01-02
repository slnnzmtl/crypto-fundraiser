const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  try {
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

    // Get the deployed bytecode
    const provider = await hre.ethers.provider;
    const deployedBytecode = await provider.getCode(address);
    console.log("Deployed bytecode length:", deployedBytecode.length);
    console.log("Deployed bytecode hash:", hre.ethers.keccak256(deployedBytecode));

    // Verify the deployment by calling multiple view functions
    console.log("\nVerifying deployment by calling contract functions...");
    
    console.log("Testing campaignCount...");
    const campaignCount = await cryptoFundraiser.campaignCount();
    console.log("Current campaign count:", campaignCount);

    // Try to get the first campaign (should be empty/revert)
    console.log("\nTesting campaigns mapping...");
    try {
        await cryptoFundraiser.campaigns(0);
        console.log("Campaign mapping is accessible");
    } catch (error) {
        console.log("Campaign mapping reverted as expected (no campaigns yet)");
        console.log("Revert reason:", error.message);
    }

    // Save the contract address to frontend .env file
    const envPath = path.join(__dirname, '../../frontend/.env');
    const envContent = `REACT_APP_CONTRACT_ADDRESS=${address}\n`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(`\nContract address saved to ${envPath}`);

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

    // Verify the contract on Etherscan
    if (process.env.ETHERSCAN_API_KEY && hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
      console.log("\nWaiting 30 seconds before verifying on Etherscan...");
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      console.log("Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: address,
          constructorArguments: [],
        });
        console.log("Contract verified on Etherscan");
      } catch (error) {
        if (error.message.includes("Already Verified")) {
          console.log("Contract was already verified");
        } else {
          console.log("Verification error:", error.message);
          console.log("You can try verifying manually later using:");
          console.log(`npx hardhat verify --network ${hre.network.name} ${address}`);
        }
      }
    }

    console.log("\nDeployment completed successfully!");
    console.log("Contract address:", address);
    console.log("Block number:", deploymentReceipt.blockNumber);
    console.log("\nPlease restart your frontend application to use the new contract address");
  } catch (error) {
    console.error("\nDeployment failed with error:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.transaction) {
      console.error("Error transaction:", error.transaction);
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  }); 