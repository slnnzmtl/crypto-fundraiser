import React from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore, walletStore } from '@stores/index';

export const CampaignFilter: React.FC = observer(() => {
  if (!walletStore.address) {
    return null;
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={campaignStore.showOnlyOwned}
        onChange={(e) => campaignStore.setShowOnlyOwned(e.target.checked)}
        className="w-4 h-4 rounded border-gray-600 bg-dark-800 text-blue-600 focus:ring-blue-600"
      />
      <span>Show only my campaigns</span>
    </label>
  );
});

export default CampaignFilter; 