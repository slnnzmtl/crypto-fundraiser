import React from 'react';
import Modal from '../ui/Modal';
import CreateCampaignForm from '../forms/CreateCampaignForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCampaignModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      title="New Campaign"
      isOpen={isOpen} 
      onClose={onClose}
    >
      <CreateCampaignForm onSuccess={onClose} />
    </Modal>
  );
};

export default CreateCampaignModal; 