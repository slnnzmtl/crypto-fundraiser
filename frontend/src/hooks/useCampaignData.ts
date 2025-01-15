import { useEffect, useMemo, useCallback, useState } from "react";
import { campaignStore } from "@stores/CampaignStore";
import { walletStore } from "@stores/WalletStore";
import { useError } from "./useError";
import { ErrorType } from "@error";
import { toCampaignModel } from "@utils/mappers";

export const useCampaignData = (id: string | undefined) => {
  const { showError } = useError();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const loadCampaign = useCallback(async () => {
    if (!id) return;

    try {
      if (!walletStore.address) {
        await walletStore.connect();
      }

      console.log("Loading campaign", id);

      await Promise.all([
        campaignStore.loadCampaignById(parseInt(id)),
        campaignStore.loadCampaignDonations(parseInt(id)),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
      }
    } finally {
      setHasAttemptedLoad(true);
    }
  }, [id, showError]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const currentCampaign = id
    ? campaignStore.campaigns.find((c) => c.id.toString() === id)
    : null;
  const pledged = currentCampaign?.pledged;
  const status = currentCampaign?.status;

  const campaign = useMemo(() => {
    if (!id) return null;

    const found = campaignStore.campaigns.find((c) => c.id.toString() === id);
    console.log("Campaign updated:", found);
    return found ? toCampaignModel(found) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pledged, status]);

  const campaignId = id ? parseInt(id) : null;
  const currentDonations = campaignId
    ? campaignStore.donations[campaignId]
    : [];
  const donationsLength = currentDonations?.length || 0;
  const donationsString = JSON.stringify(currentDonations || []);

  const donations = useMemo(() => {
    if (!id) return [];

    const campaignId = parseInt(id);
    const campaignDonations = campaignStore.donations[campaignId] || [];

    return campaignDonations.map((donation) => ({
      ...donation,
      timestamp:
        donation.timestamp instanceof Date
          ? donation.timestamp
          : new Date(donation.timestamp),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, donationsLength, donationsString]);

  return {
    campaign,
    donations,
    isLoading:
      !hasAttemptedLoad ||
      campaignStore.loading ||
      campaignStore.initialLoading,
    hasAttemptedLoad,
    reload: loadCampaign,
  };
};
