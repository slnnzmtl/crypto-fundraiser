module.exports = {
    contractAddress: {
        localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        mainnet: "",  // Добавьте после деплоя
        testnet: ""   // Добавьте после деплоя
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            chainId: 1
        }
    },
    // ABI вашего контракта
    contractABI: [
        {
            "inputs": [{"internalType": "uint256","name": "_goal","type": "uint256"},{"internalType": "uint256","name": "_durationInDays","type": "uint256"}],
            "name": "createCampaign",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256","name": "_campaignId","type": "uint256"}],
            "name": "donate",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getCampaigns",
            "outputs": [{"components": [{"internalType": "address payable","name": "owner","type": "address"},{"internalType": "uint256","name": "goal","type": "uint256"},{"internalType": "uint256","name": "deadline","type": "uint256"},{"internalType": "uint256","name": "balance","type": "uint256"},{"internalType": "bool","name": "completed","type": "bool"}],"internalType": "struct CryptoFundraiser.Campaign[]","name": "","type": "tuple[]"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address","name": "_donor","type": "address"}],
            "name": "getDonations",
            "outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256","name": "_campaignId","type": "uint256"}],
            "name": "completeCampaign",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256","name": "_campaignId","type": "uint256"}],
            "name": "refund",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}; 