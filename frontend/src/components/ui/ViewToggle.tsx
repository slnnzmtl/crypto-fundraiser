import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '../../stores/CampaignStore';
import { ViewType } from '@stores/interfaces';

interface ViewToggleProps {
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = observer(({ className = '' }) => {
  const handleViewChange = (type: ViewType) => {
    campaignStore.setViewType(type);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => handleViewChange('grid')}
        className={`p-2 rounded transition-colors ${
          campaignStore.viewType === 'grid'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
        }`}
        title="Grid view"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        onClick={() => handleViewChange('list')}
        className={`p-2 rounded transition-colors ${
          campaignStore.viewType === 'list'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
        }`}
        title="List view"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  );
}); 