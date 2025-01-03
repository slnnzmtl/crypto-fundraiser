import React from 'react';
import { Campaign } from '../../types/campaign';

interface Props {
  campaign: Campaign;
  className?: string;
}

const StatusBadge: React.FC<Props> = ({ campaign, className = '' }) => {
  const getStatusConfig = () => {
    if (campaign.claimed) {
      return {
        className: 'bg-green-600/20 text-green-500',
        label: 'Completed'
      };
    }
    
    if (campaign.endAt.getTime() < Date.now()) {
      return {
        className: 'bg-red-600/20 text-red-500',
        label: 'Ended'
      };
    }
    
    return {
      className: 'bg-blue-600/20 text-blue-500',
      label: 'Active'
    };
  };

  const { className: statusClassName, label } = getStatusConfig();

  return (
    <span className={`text-xs sm:text-sm px-2 py-1 rounded ${statusClassName} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge; 