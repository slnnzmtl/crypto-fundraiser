import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { campaignStore } from '../stores/CampaignStore';
import { Card, Input, Button } from '../components/ui/primitives';
import { DonationList } from '../components/DonationList';
import { useError } from '../hooks/useError';
import { ErrorType } from '../types/error';
import CampaignDetailsPlaceholder from '../components/CampaignDetailsPlaceholder';
import { pluralize } from '../utils/format';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import PageTransition from '../components/PageTransition';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateAmount = useCallback((value: string): boolean => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    if (numValue <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }
    setAmountError(null);
    return true;
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setAmountError(null);
    }
  }, [validateAmount]);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        if (!campaignStore.address) {
          await campaignStore.connect();
        }
        await campaignStore.loadCampaigns();
        if (id) {
          await campaignStore.loadCampaignDonations(parseInt(id));
        }
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message as ErrorType);
        } else {
          showError(ErrorType.NETWORK);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [id, showError]);

  const campaign = campaignStore.campaigns.find(c => c.id.toString() === id);
  const donations = id ? campaignStore.donations[parseInt(id)] || [] : [];

  if (isLoading) {
    return (
      <PageTransition>
        <CampaignDetailsPlaceholder />
      </PageTransition>
    );
  }

  if (!campaign) {
    showError(ErrorType.NOT_FOUND);
    return null;
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateAmount(amount)) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (!campaignStore.address) {
        await campaignStore.connect();
      }
      await campaignStore.donate(campaign.id, parseFloat(amount));
      setAmount('');
      setAmountError(null);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (!campaignStore.address) {
        await campaignStore.connect();
      }
      await campaignStore.completeCampaign(campaign.id);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message as ErrorType);
      } else {
        showError(ErrorType.NETWORK);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = Math.min((Number(campaign.pledged) / Number(campaign.goal)) * 100, 100);
  const isOwner = campaign && campaignStore.address && campaign.owner.toLowerCase() === campaignStore.address.toLowerCase();
  const canDonate = campaign && campaignStore.address && campaign.owner.toLowerCase() !== campaignStore.address.toLowerCase();
  const timeLeft = Math.max(0, campaign.endAt.getTime() - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const getDaysLeft = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? pluralize(daysLeft, 'day') : 'Ended';
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="aspect-video w-full">
              {campaign.image && campaign.image.trim() ? (
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImagePlaceholder className="rounded-lg" />
              )}
            </div>

            <Card className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{campaign.title}</h1>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded ${
                    campaign.claimed 
                      ? 'bg-green-600/20 text-green-500' 
                      : campaign.endAt.getTime() < Date.now() 
                        ? 'bg-red-600/20 text-red-500'
                        : 'bg-blue-600/20 text-blue-500'
                  }`}>
                    {campaign.claimed 
                      ? 'Completed' 
                      : campaign.endAt.getTime() < Date.now() 
                        ? 'Ended'
                        : 'Active'}
                  </span>
                </div>
              </div>
              <p className="text-gray-400">{campaign.description}</p>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-400">
                    {campaign.pledged} / {campaign.goal} ETH
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full ${
                      campaign.claimed 
                        ? 'bg-green-600' 
                        : campaign.endAt.getTime() < Date.now() 
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>

            <DonationList donations={donations} />
          </div>

          <div className="space-y-6">
            <Card className="space-y-6">
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
                      disabled={!campaignStore.address || !!amountError}
                      className="w-full"
                    >
                      {!campaignStore.address 
                        ? 'Connect wallet to donate'
                        : isSubmitting 
                          ? 'Processing...' 
                          : 'Donate'}
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Campaign ID</span>
                  <span className="text-white">#{campaign.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white truncate ml-2 max-w-[200px]" title={campaign.creator}>
                    {campaign.creator}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Owner</span>
                  <span className="text-white truncate ml-2 max-w-[200px]" title={campaign.owner}>
                    {campaign.owner}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Goal</span>
                  <span className="text-white">{campaign.goal} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pledged</span>
                  <span className="text-white">{campaign.pledged} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Date</span>
                  <span className="text-white">
                    {campaign.startAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Date</span>
                  <span className="text-white">
                    {campaign.endAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Left</span>
                  <span className={`text-white ${
                    campaign.claimed 
                      ? 'text-green-500' 
                      : campaign.endAt.getTime() < Date.now() 
                        ? 'text-red-500'
                        : ''
                  }`}>
                    {campaign.claimed 
                      ? 'Completed' 
                      : getDaysLeft(campaign.endAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`text-white ${
                    campaign.claimed 
                      ? 'text-green-500' 
                      : campaign.endAt.getTime() < Date.now() 
                        ? 'text-red-500'
                        : 'text-blue-500'
                  }`}>
                    {campaign.claimed 
                      ? 'Completed' 
                      : campaign.endAt.getTime() < Date.now() 
                        ? 'Ended'
                        : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Auto Complete</span>
                  <span className="text-white">
                    {campaign.autoComplete ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </Card>

            {isOwner && !campaign.claimed && (
              <Button
                onClick={handleComplete}
                isLoading={isSubmitting}
                disabled={!campaignStore.address || (daysLeft > 0 && Number(campaign.pledged) < Number(campaign.goal))}
                className="w-full"
                variant={daysLeft > 0 && Number(campaign.pledged) < Number(campaign.goal) ? 'secondary' : 'primary'}
              >
                {daysLeft > 0 
                  ? Number(campaign.pledged) >= Number(campaign.goal)
                    ? 'Complete Campaign'
                    : `${pluralize(daysLeft, 'day')} until completion` 
                  : 'Complete Campaign'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default observer(CampaignDetails); 