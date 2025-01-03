import { makeAutoObservable, action, runInAction } from 'mobx';
import { contractService, isWalletDisconnected } from '../services/ContractService';
import { ErrorType } from '../types/error';
import { IWallet } from './interfaces';

export class WalletStore implements IWallet {
  address: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  private accountCheckInterval: NodeJS.Timer | null = null;

  constructor() {
    makeAutoObservable(this);
    this.init();

    if (window.ethereum) {
      this.setupAccountsListener();
    }
  }

  private setupAccountsListener = () => {
    const checkAccounts = async () => {
      try {
        if (isWalletDisconnected()) {
          return;
        }

        const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          this.disconnect();
        } else if (accounts[0].toLowerCase() !== this.address?.toLowerCase()) {
          runInAction(() => {
            this.address = accounts[0];
          });
        }
      } catch (error) {
        console.error('Failed to check accounts:', error);
      }
    };

    checkAccounts();
    this.accountCheckInterval = setInterval(checkAccounts, 3000);
  };

  private async init() {
    try {
      if (isWalletDisconnected()) {
        runInAction(() => {
          this.loading = false;
        });
        return;
      }

      const address = await contractService.checkConnection();
      runInAction(() => {
        this.address = address;
        this.loading = false;
      });
    } catch (error) {
      console.error('Failed to initialize:', error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setLoading = action((loading: boolean) => {
    this.loading = loading;
  });

  setError = action((error: string | null) => {
    this.error = error;
  });

  setAddress = action((address: string | null) => {
    this.address = address;
  });

  async connect() {
    this.setLoading(true);
    this.setError(null);

    try {
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