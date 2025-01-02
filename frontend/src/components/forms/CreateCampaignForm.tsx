import React, { useState } from 'react';
import { Input, TextArea, Button } from '../ui/primitives';
import { campaignStore } from '../../stores/CampaignStore';
import { CampaignInput } from '../../types/campaign';

interface Props {
  onSuccess: () => void;
}

const CreateCampaignForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CampaignInput>({
    title: '',
    description: '',
    goal: '',
    durationInDays: 0,
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationInDays' ? parseInt(value) || 30 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await campaignStore.createCampaign(formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Campaign title"
        required
      />

      <TextArea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="goal"
          type="number"
          value={formData.goal}
          onChange={handleChange}
          placeholder="Goal amount"
          min="0"
          step="0.0001"
          required
        />
        <div className="bg-dark-700 rounded-lg px-4 flex items-center text-gray-400">
          ETH
        </div>
      </div>

      <Input
        name="durationInDays"
        type="number"
        value={formData.durationInDays}
        onChange={handleChange}
        placeholder="Duration in days"
        min="1"
        required
      />

      <Button
        type="submit"
        className="h-12"
        isLoading={isSubmitting}
        disabled={!campaignStore.address}
      >
        {!campaignStore.address 
          ? 'Connect wallet to create'
          : isSubmitting 
            ? 'Creating...' 
            : 'Create Campaign'}
      </Button>
    </form>
  );
};

export default CreateCampaignForm;