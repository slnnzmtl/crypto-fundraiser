export enum ErrorType {
  METAMASK = 'Please install MetaMask',
  USER_REJECTED = 'Transaction was rejected',
  METAMASK_PENDING = 'Please complete the pending MetaMask action',
  INSUFFICIENT_FUNDS = 'Insufficient funds',
  NETWORK = 'Network error occurred',
  GET_CAMPAIGNS_FAILED = 'Failed to get campaigns',
  CREATE_CAMPAIGN_FAILED = 'Failed to create campaign',
  NETWORK_ERROR = 'Network connection error',
  CONTRACT_ERROR = 'Smart contract error',
  PROVIDER_ERROR = 'Provider connection error',
  UNAUTHORIZED = 'Unauthorized action',
  NOT_CONNECTED = 'Not connected to wallet',
  WALLET_ERROR = 'Wallet connection error',
  UNKNOWN_ERROR = 'An unknown error occurred'
}

export interface ErrorAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface ErrorConfig {
  type: ErrorType;
  title: string;
  description: string;
  action?: ErrorAction;
} 