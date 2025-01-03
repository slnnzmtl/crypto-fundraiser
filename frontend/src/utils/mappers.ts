import { Campaign } from '../types/campaign';
import { ICampaign } from '@interfaces';

export const toCampaignModel = (campaign: Campaign): ICampaign => {
  return {
    id: campaign.id,
    owner: campaign.owner,
    title: campaign.title,
    description: campaign.description,
    goal: Number(campaign.goal),
    pledged: Number(campaign.pledged),
    endAt: campaign.endAt,
    status: campaign.claimed ? 'completed' : campaign.endAt.getTime() < Date.now() ? 'failed' : 'active'
  };
}; 