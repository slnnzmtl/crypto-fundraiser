import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { campaignStore } from '@stores/CampaignStore';
import CampaignListComponent from '@components/campaign/list/CampaignList';
import PageTransition from '@components/layout/PageTransition';

const CampaignList: React.FC = () => {
  useEffect(() => {
    campaignStore.loadCampaigns();
  }, []);

  return (
    <PageTransition>
      <CampaignListComponent />
    </PageTransition>
  );
};

export default observer(CampaignList); 