export enum ErrorType {
  METAMASK = 'METAMASK',
  NETWORK = 'NETWORK',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_REJECTED = 'USER_REJECTED',
  METAMASK_PENDING = 'METAMASK_PENDING',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GET_CAMPAIGNS_FAILED = 'GET_CAMPAIGNS_FAILED'
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