import React from 'react';
import { Card } from '@components/ui';

interface Donation {
  donor: string;
  amount: string;
  message: string;
  timestamp: Date;
}

interface DonationListProps {
  donations: Donation[];
  className?: string;
}

export const DonationList: React.FC<DonationListProps> = ({ donations, className = '' }) => {
  if (!Array.isArray(donations) || donations.length === 0) {
    return (
      <Card className={`text-center py-8 ${className}`}>
        <p className="text-gray-400">No donations yet</p>
      </Card>
    );
  }

  const formatDate = (timestamp: Date) => {
    try {
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return 'Invalid date';
      }
      return timestamp.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold">Recent Donations</h2>
      <div className="space-y-2">
        {donations.map((donation, index) => (
          <div 
            key={index}
            className="flex flex-col p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">From</p>
                <p className="text-sm font-medium truncate" title={donation.donor}>
                  {donation.donor}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-bold">{donation.amount} ETH</p>
                <p className="text-xs text-gray-400">
                  {formatDate(donation.timestamp)}
                </p>
              </div>
            </div>
            {donation.message && (
              <div className="mt-2 pt-2 border-t border-dark-600">
                <p className="text-sm text-gray-300">{donation.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}; 