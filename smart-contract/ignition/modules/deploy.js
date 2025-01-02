const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require('fs');
const path = require('path');

module.exports = buildModule("CryptoFundraiser", (m) => {
    const cryptoFundraiser = m.contract("CryptoFundraiser");
    
    // После деплоя сохраняем адрес
    m.afterDeploy(async (deployments) => {
        const contract = deployments.cryptoFundraiser;
        const address = await contract.getAddress();
        console.log("Contract deployed to:", address);

        // Сохраняем адрес в .env файл фронтенда
        const envPath = path.join(__dirname, '../../../frontend/.env');
        const envContent = `REACT_APP_CONTRACT_ADDRESS=${address}\n`;
        
        fs.writeFileSync(envPath, envContent);
        console.log(`Contract address saved to ${envPath}`);
    });
    
    return { cryptoFundraiser };
}); 