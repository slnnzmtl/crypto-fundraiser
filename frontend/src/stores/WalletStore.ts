import { makeAutoObservable, action } from "mobx";
import { contractService } from "@services/ContractService";
import { ErrorType } from "@error";

class WalletStore {
  address: string | null = null;
  loading = false;
  error: string | null = null;
  private accountCheckInterval: NodeJS.Timer | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAddress = action((address: string | null) => {
    this.address = address;
  });

  setLoading = action((loading: boolean) => {
    this.loading = loading;
  });

  setError = action((error: string | null) => {
    this.error = error;
  });

  async checkNetwork(): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      return chainId === "0xaa36a7"; // Sepolia chainId
    } catch (error) {
      console.error("Failed to check network:", error);
      return false;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.checkNetwork();

      const address = await contractService.checkConnection();

      this.setAddress(address);
      return !!address;
    } catch (error) {
      console.error("Failed to check connection:", error);
      return false;
    }
  }

  async connect() {
    this.setLoading(true);
    this.setError(null);

    try {
      const isCorrectNetwork = await this.checkNetwork();
      if (!isCorrectNetwork) {
        throw new Error(ErrorType.NETWORK);
      }

      const address = await contractService.connect();
      this.setAddress(address);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorType.NETWORK);
    } finally {
      this.setLoading(false);
    }
  }

  disconnect = action(() => {
    this.address = null;
    this.error = null;
    this.loading = false;

    if (this.accountCheckInterval) {
      clearInterval(this.accountCheckInterval);
      this.accountCheckInterval = null;
    }

    contractService.disconnect();
  });
}

export const walletStore = new WalletStore();
