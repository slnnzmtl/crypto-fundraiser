import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider & {
      request: (...args: any[]) => Promise<any>;
      on: (...args: any[]) => void;
      removeListener: (...args: any[]) => void;
      selectedAddress: string | null;
      networkVersion: string;
      _metamask: {
        isUnlocked: () => Promise<boolean>;
      };
    };
  }
}

export interface Campaign {
  id: number;
  owner: string;
  goal: bigint;
  deadline: bigint;
  balance: bigint;
  completed: boolean;
}

export interface Donation {
  campaignId: number;
  donor: string;
  amount: bigint;
  timestamp: number;
}

/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
} 