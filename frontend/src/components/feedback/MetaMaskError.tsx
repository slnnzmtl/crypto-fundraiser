import React from 'react';
import { MetaMaskLogo } from '@components/icons';
import { ErrorPage } from '@components/feedback';

const MetaMaskError: React.FC = () => {
  return (
    <ErrorPage
      icon={<MetaMaskLogo className="w-full h-full" />}
      title="MetaMask Required"
      description="To use this application, you need to have MetaMask installed in your browser."
      action={{
        label: "Download MetaMask",
        href: "https://metamask.io/download/"
      }}
    />
  );
};

export default MetaMaskError; 