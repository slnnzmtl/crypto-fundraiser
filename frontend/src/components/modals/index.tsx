import React from 'react';
import { useModal, ModalType } from '../../hooks/useModal';
import CreateCampaignModal from './CreateCampaignModal';

const Modals: React.FC = () => {
  const modal = useModal();

  return (
    <>
      <CreateCampaignModal 
        isOpen={modal.isOpen('createCampaign')} 
        onClose={() => modal.closeModal('createCampaign')} 
      />
      {/* Здесь можно добавить другие модальные окна */}
    </>
  );
};

export default Modals; 