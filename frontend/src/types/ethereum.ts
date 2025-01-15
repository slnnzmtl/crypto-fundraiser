import { Eip1193Provider } from "ethers";

// Use intersection type for compatibility

// Declare the global window interface with the combined type
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// Helper type for ethereum provider events
export type EthereumEvent =
  | "chainChanged"
  | "accountsChanged"
  | "connect"
  | "disconnect";

// Helper type for ethereum provider methods
export type EthereumMethod =
  | "eth_chainId"
  | "eth_requestAccounts"
  | "wallet_switchEthereumChain";
