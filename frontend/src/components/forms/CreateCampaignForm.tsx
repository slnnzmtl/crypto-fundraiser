import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, TextArea, Button } from '../ui/primitives';
import { campaignStore } from '../../stores/CampaignStore';
import { CampaignInput } from '../../types/campaign';
import { pluralize } from '../../utils/format';
import { useError } from '../../hooks/useError';
import { ErrorType } from '../../types/error';

interface Props {
  onSuccess: () => void;
}

const initialFormData: CampaignInput = {
  title: '',
  description: '',
  goal: '',
  durationInDays: 30,
  image: '',
  autoComplete: false,
};

const CreateCampaignForm: React.FC<Props> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        if (name === 'goal') {
          const numericValue = value.replace(/[^\d.]/g, '');
          const parts = numericValue.split('.');
          return {
            ...prev,
            [name]: parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 4)}` : parts[0],
          };
        }

        if (name === 'durationInDays') {
          const intValue = parseInt(value, 10) || 30;
          return { ...prev, [name]: Math.max(1, intValue) };
        }

        return { ...prev, [name]: value };
      });
    },
    []
  );

  const handleToggleAutoComplete = useCallback(() => {
    setFormData((prev) => ({ ...prev, autoComplete: !prev.autoComplete }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const campaignId = await campaignStore.createCampaign(formData);
        onSuccess();
        navigate(`/campaign/${campaignId}`);
      } catch (error) {
        console.error('Failed to create campaign:', error);
        if (error instanceof Error) {
          const errorMap: Record<string, ErrorType> = {
            [ErrorType.METAMASK]: ErrorType.METAMASK,
            [ErrorType.NETWORK]: ErrorType.NETWORK,
            [ErrorType.USER_REJECTED]: ErrorType.USER_REJECTED,
            [ErrorType.METAMASK_PENDING]: ErrorType.METAMASK_PENDING,
          };
          showError(errorMap[error.message] || ErrorType.NETWORK);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, navigate, onSuccess, showError]
  );

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
          required
        />
        <div className="bg-dark-700 rounded-lg px-4 flex items-center text-gray-400">ETH</div>
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

      <Button type="submit" className="h-12" isLoading={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Campaign'}
      </Button>
    </form>
  );
};

export default CreateCampaignForm;
