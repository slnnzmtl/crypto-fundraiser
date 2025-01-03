import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICampaignActions } from '../../../pages/interfaces';
import { Button, Input, TextArea } from '@components/ui';
import { useDonationForm } from '@hooks/useDonationForm';

const CampaignActions: React.FC<ICampaignActions> = ({
  campaign,
  isOwner,
  canDonate,
  isSubmitting,
  onDonate,
  onComplete
}) => {
  const { amount, setAmount, isValid, error } = useDonationForm();
  const [message, setMessage] = useState('');
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      await onDonate(amount, message);
      setAmount('');
      setMessage('');
      setIsAmountFocused(false);
    }
  };

  if (isOwner) {
    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          disabled={campaign.status !== 'active' || isSubmitting}
          onClick={onComplete}
          isLoading={isSubmitting}
          className="w-full"
        >
          Complete Campaign
        </Button>
      </div>
    );
  }

  if (!canDonate || campaign.status !== 'active') {
    return null;
  }

  const showMessageField = isAmountFocused || amount !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
        onFocus={() => setIsAmountFocused(true)}
        onBlur={() => setIsAmountFocused(false)}
        placeholder="Amount in ETH"
        error={error}
        disabled={isSubmitting}
        label="Donate"
        min="0"
        step="0.00001"
        required
        className="no-arrows"
      />
      <AnimatePresence mode="sync">
        {showMessageField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextArea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Leave a message (optional)"
              disabled={isSubmitting}
              label="Message"
              maxLength={200}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        type="submit"
        variant="primary"
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
        className="w-full"
      >
        Donate
      </Button>
    </form>
  );
};

export default CampaignActions; 