# CryptoFundraiser

A decentralized fundraising platform built on Ethereum that allows users to create and contribute to fundraising campaigns using cryptocurrency.

## Features

- Create fundraising campaigns with customizable goals and durations
- Donate ETH to campaigns with optional messages
- Automatic campaign completion when goals are met
- Transparent transaction history
- Real-time campaign status updates
- Responsive and modern UI
- Network switching support (Mainnet/Sepolia)

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - MobX for state management
  - Framer Motion for animations
  - Tailwind CSS for styling
  - Ethers.js for blockchain interaction

- **Smart Contract:**
  - Solidity
  - Hardhat development environment
  - OpenZeppelin contracts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-fundraiser.git
cd crypto-fundraiser
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install smart contract dependencies
cd ../smart-contract
npm install
```

3. Set up environment variables:
```bash
# In frontend directory
cp .env.example .env

# In smart-contract directory
cp .env.example .env
```

4. Configure environment variables:
- Frontend `.env`:
  - `REACT_APP_CONTRACT_ADDRESS`: Deployed contract address
  - `REACT_APP_CHAIN_ID`: Network chain ID (1 for mainnet, 11155111 for Sepolia)

- Smart Contract `.env`:
  - `PRIVATE_KEY`: Your deployment wallet private key
  - `ETHERSCAN_API_KEY`: For contract verification
  - `ALCHEMY_API_KEY`: For network access

### Development

1. Start the frontend development server:
```bash
cd frontend
npm start
```

2. Deploy the smart contract (for testing):
```bash
cd smart-contract
npx hardhat run scripts/deploy.js --network sepolia
```

### Testing the Project

1. **Install MetaMask:**
   - Install the MetaMask browser extension from the Chrome Web Store

2. **Connect Wallet:**
   - Click "Connect Wallet" on the website
   - Approve the connection request in MetaMask

3. **Switch to Sepolia:**
   - Open MetaMask
   - Switch to the Sepolia test network
   - If not listed, add Sepolia network manually

4. **Get Test ETH:**
   - Visit a Sepolia faucet to get free test ETH
   - Recommended faucets:
     - [Alchemy Faucet](https://sepoliafaucet.com/)
     - [Infura Faucet](https://sepolia-faucet.pk910.de/)

5. **Create Campaign:**
   - Click "Create Campaign"
   - Fill in campaign details
   - Confirm transaction in MetaMask

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin for secure smart contract components
- Ethereum community for inspiration and support
- Contributors and testers 