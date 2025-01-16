import React from "react";
import { observer } from "mobx-react-lite";
import CampaignListComponent from "@components/campaign/list/CampaignList";
import PageTransition from "@components/layout/PageTransition";
import { useCampaignList } from "@hooks/useCampaignList";

const CampaignList: React.FC = () => {
  const { campaigns, isLoading, viewType, handleCreateClick } =
    useCampaignList();

  return (
    <PageTransition>
      <CampaignListComponent
        campaigns={campaigns}
        isLoading={isLoading}
        viewType={viewType}
        handleCreateClick={handleCreateClick}
      />
    </PageTransition>
  );
};

export default observer(CampaignList);
