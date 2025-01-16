import { useCallback, useEffect } from "react";
import { campaignStore } from "@stores/CampaignStore";
import { useModal } from "@hooks/useModal";
import { useError } from "@hooks/useError";
import { ErrorType } from "@error";
import { walletStore } from "@/stores";

export const useCampaignList = () => {
  const modal = useModal();
  const { showError } = useError();

  useEffect(() => {
    if (walletStore.address) {
      try {
        campaignStore.loadCampaigns();
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message as ErrorType);
        }
      }
    }
  }, [showError]);

  const handleCreateClick = useCallback(async () => {
    if (!walletStore.address) {
      try {
        await walletStore.connect();
        await campaignStore.loadCampaigns();
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message as ErrorType);
        }
        return;
      }
    }
    modal.openModal("createCampaign");
  }, [modal, showError]);

  return {
    campaigns: campaignStore.filteredCampaigns,
    viewType: campaignStore.viewType,
    showOnlyOwned: campaignStore.showOnlyOwned,
    isLoading: campaignStore.loading || campaignStore.initialLoading,
    handleCreateClick,
  };
};
