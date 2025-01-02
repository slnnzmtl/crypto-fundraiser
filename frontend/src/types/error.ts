export enum ErrorType {
  METAMASK = 'metamask',
  NETWORK = 'network',
  NOT_FOUND = 'notFound',
  UNAUTHORIZED = 'unauthorized',
  USER_REJECTED = 'userRejected'
}

export interface ErrorConfig {
  type: ErrorType;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
} 