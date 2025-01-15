import { useState, useEffect, useMemo } from "react";
import { walletStore } from "@stores/WalletStore";
import { campaignStore } from "@stores/CampaignStore";
import { ICampaign } from "@interfaces";

export const useCampaignPermissions = (campaign: ICampaign | null) => {
  const [canWithdraw, setCanWithdraw] = useState(false);

  const isOwner = useMemo(
    () =>
      Boolean(
        walletStore.address &&
          campaign?.owner &&
          typeof campaign.owner === "string" &&
          typeof walletStore.address === "string" &&
          campaign.owner.toLowerCase() === walletStore.address.toLowerCase(),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaign?.owner, walletStore.address, campaign],
  );

  const canDonate = useMemo(
    () =>
      Boolean(
        walletStore.address &&
          campaign?.owner &&
          typeof campaign.owner === "string" &&
          typeof walletStore.address === "string" &&
          campaign.owner.toLowerCase() !== walletStore.address.toLowerCase(),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaign?.owner, walletStore.address],
  );

  useEffect(() => {
    if (campaign && isOwner) {
      campaignStore.canWithdrawFunds(campaign.id).then(setCanWithdraw);
    }
  }, [campaign, isOwner]);

  return {
    isOwner,
    canDonate,
    canWithdraw,
  };
};
