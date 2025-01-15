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

      const campaignId = parseInt(id);
      await Promise.all([
        campaignStore.loadCampaignById(campaignId),
        campaignStore.loadCampaignDonations(campaignId),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showError((errorMessage as ErrorType) || ErrorType.NETWORK);
    } finally {
      setHasAttemptedLoad(true);
    }
  }, [id, showError]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const campaign = useMemo(() => {
    if (!id) return null;

    const campaignId = parseInt(id);
    const foundCampaign = campaignStore.campaigns.find(
      (c) => c.id === campaignId,
    );
    console.log("Campaign updated:", foundCampaign);
    return foundCampaign ? toCampaignModel(foundCampaign) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, campaignStore.campaigns]);

  const donationsLength = Object.entries(campaignStore.donations).length;

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
  }, [id, campaignStore.donations, donationsLength]);

  const isLoading = useMemo(
    () =>
      !hasAttemptedLoad ||
      campaignStore.loading ||
      campaignStore.initialLoading,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasAttemptedLoad, campaignStore.loading, campaignStore.initialLoading],
  );

  return {
    campaign,
    donations,
    isLoading,
    hasAttemptedLoad,
    reload: loadCampaign,
  };
};
