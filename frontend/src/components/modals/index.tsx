import React from "react";
import { useModal } from "../../hooks/useModal";
import CreateCampaignModal from "./CreateCampaignModal";

const Modals: React.FC = () => {
  const modal = useModal();

  return (
    <>
      <CreateCampaignModal
        isOpen={modal.isOpen("createCampaign")}
        onClose={() => modal.closeModal("createCampaign")}
      />
    </>
  );
};

export default Modals;
