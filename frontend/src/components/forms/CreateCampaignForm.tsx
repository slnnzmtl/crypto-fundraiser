import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, TextArea, Button } from '../ui/primitives';
import { campaignStore } from '../../stores/CampaignStore';
import { CampaignInput } from '../../types/campaign';
import { pluralize } from '../../utils/format';

interface Props {
  onSuccess: () => void;
}

export default function CreateCampaignForm({ onSuccess }: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CampaignInput>({
    title: '',
    description: '',
    goal: '',
    durationInDays: 30,
    image: '',
    autoComplete: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'goal') {
      // Allow numbers and one decimal point
      const numericValue = value.replace(/[^\d.]/g, '');
      
      // Handle decimal points
      const parts = numericValue.split('.');
      let sanitizedValue = parts[0];
      if (parts.length > 1) {
        // Keep only first decimal point and up to 4 decimal places
        sanitizedValue += '.' + parts[1].slice(0, 4);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      return;
    }

    if (name === 'durationInDays') {
      // Only allow positive integers
      const intValue = parseInt(value) || 30;
      setFormData(prev => ({
        ...prev,
        [name]: Math.max(1, intValue)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleToggleAutoComplete = useCallback(() => {
    setFormData(prev => ({ ...prev, autoComplete: !prev.autoComplete }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const campaignId = await campaignStore.createCampaign(formData);
      onSuccess();
      // Redirect to the newly created campaign
      navigate(`/campaign/${campaignId}`);
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
        label="Campaign Title"
        required
      />

      <TextArea
        name="description"
        value={formData.description}
        onChange={handleChange}
        label="Description"
        required
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="goal"
          type="text"
          inputMode="decimal"
          pattern="\d*\.?\d*"
          value={formData.goal}
          onChange={handleChange}
          label="Goal Amount"
          min="0"
          step="any"
          required
        />
        <div className="bg-dark-700 rounded-lg px-4 flex items-center text-gray-400">
          ETH
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="durationInDays"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.durationInDays}
          onChange={handleChange}
          label="Duration"
          min="1"
          required
        />
        <div className="bg-dark-700 rounded-lg px-4 flex items-center text-gray-400">
          {pluralize(Number(formData.durationInDays), 'day')}
        </div>
      </div>

      <Input
        name="image"
        type="url"
        value={formData.image}
        onChange={handleChange}
        label="Image URL"
        placeholder="https://"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoComplete"
          checked={formData.autoComplete}
          onChange={handleToggleAutoComplete}
          className="w-4 h-4 text-blue-600 bg-dark-800 border-dark-700 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoComplete" className="text-white">
          Auto-complete when goal is reached
        </label>
      </div>

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
}