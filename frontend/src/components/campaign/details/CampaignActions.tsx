import React from 'react';
import { ICampaignActions } from '@interfaces';
import { Button, Input } from '@components/ui';
import { pluralize } from '@utils/format';
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
  const { 
    amount, 
    amountError, 
    handleAmountChange, 
    handleDonate 
  } = useDonationForm(campaign, onDonate);

  const daysLeft = Math.ceil(Math.max(0, campaign.endAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const canComplete = !campaign.claimed && (daysLeft <= 0 || Number(campaign.pledged) >= Number(campaign.goal));

  return (
    <div className="space-y-6">
      {canDonate && !campaign.claimed && campaign.endAt.getTime() > Date.now() && (
        <form onSubmit={handleDonate}>
          <div className="space-y-4">
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="0.00001"
              required
              placeholder="Amount in ETH"
              error={amountError}
              label="Amount"
            />
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!!amountError}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Donate'}
            </Button>
          </div>
        </form>
      )}

      {isOwner && !campaign.claimed && (
        <Button
          onClick={onComplete}
          isLoading={isSubmitting}
          disabled={!canComplete}
          className="w-full"
          variant={canComplete ? 'primary' : 'secondary'}
        >
          {daysLeft > 0 
            ? Number(campaign.pledged) >= Number(campaign.goal)
              ? 'Complete Campaign'
              : `${pluralize(daysLeft, 'day')} until completion` 
            : 'Complete Campaign'}
        </Button>
      )}

      {isOwner && campaign.claimed && canWithdraw && (
        <Button
          onClick={onWithdraw}
          isLoading={isSubmitting}
          className="w-full"
          variant="primary"
        >
          Withdraw Funds
        </Button>
      )}
    </div>
  );
};

export default React.memo(CampaignActions); 