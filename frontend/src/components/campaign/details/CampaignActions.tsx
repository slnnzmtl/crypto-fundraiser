import React from 'react';
import { ICampaignActions } from '../../../pages/interfaces';
import { Button, Input } from '@components/ui';
import { useDonationForm } from '@hooks/useDonationForm';

const CampaignActions: React.FC<ICampaignActions> = ({
  campaign,
  isOwner,
  canDonate,
  canWithdraw,
  isSubmitting,
  onDonate,
  onComplete,
  onWithdraw
}) => {
  const { amount, setAmount, isValid, error } = useDonationForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onDonate(amount);
    }
  };

  if (isOwner) {
    return (
      <div className="space-y-4">
        <Button
          variant="primary"
          disabled={!canWithdraw || isSubmitting}
          onClick={onWithdraw}
          isLoading={isSubmitting}
          className="w-full"
        >
          Withdraw Funds
        </Button>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        error={error}
        disabled={isSubmitting}
      />
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