import React from 'react';
import { Card } from '@components/ui';

interface Donation {
  donor: string;
  amount: string;
  timestamp: Date;
}

interface DonationListProps {
  donations: Donation[];
  className?: string;
}

export const DonationList: React.FC<DonationListProps> = ({ donations, className = '' }) => {
  if (donations.length === 0) {
    return (
      <Card className={`text-center py-8 ${className}`}>
        <p className="text-gray-400">No donations yet</p>
      </Card>
    );
  }

  return (
    <Card className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold">Recent Donations</h2>
      <div className="space-y-2">
        {donations.map((donation, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-400">From</p>
              <p className="text-sm font-medium truncate" title={donation.donor}>
                {donation.donor}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-lg font-bold">{donation.amount} ETH</p>
              <p className="text-xs text-gray-400">
                {donation.timestamp.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 