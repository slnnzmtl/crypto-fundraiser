import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { campaignStore } from '../stores/CampaignStore';
import { Card, Input, Button } from '../components/ui/primitives';
import { useError } from '../hooks/useError';
import { ErrorType } from '../types/error';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useError();
  const campaign = campaignStore.campaigns.find(c => c.id.toString() === id);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign) {
    showError(ErrorType.NOT_FOUND);
    return null;
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (!campaignStore.address) {
        await campaignStore.connect();
      }
      await campaignStore.donate(campaign.id, parseFloat(amount));
      setAmount('');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorType.METAMASK) {
          showError(ErrorType.METAMASK);
        } else if (error.message === ErrorType.NETWORK) {
          showError(ErrorType.NETWORK);
        } else if (error.message === ErrorType.USER_REJECTED) {
          showError(ErrorType.USER_REJECTED);
        } else {
          console.error('Failed to donate:', error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = Math.min((Number(campaign.pledged) / Number(campaign.goal)) * 100, 100);
  const isOwner = campaign && campaignStore.address && campaign.owner.toLowerCase() === campaignStore.address.toLowerCase();
  const canDonate = campaign && campaignStore.address && campaign.owner.toLowerCase() !== campaignStore.address.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {campaign.image ? (
            <div className="aspect-video w-full bg-dark-900">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-dark-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No image</p>
            </div>
          )}

          <Card className="space-y-4">
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
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
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="space-y-6">
            {canDonate && (
              <form onSubmit={handleDonate}>
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    placeholder="Amount in ETH"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!campaignStore.address}
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
                <span className="text-gray-400">Creator</span>
                <span className="text-white">{campaign.creator}</span>
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
                <span className="text-gray-400">End Date</span>
                <span className="text-white">
                  {new Date(campaign.endAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default observer(CampaignDetails); 