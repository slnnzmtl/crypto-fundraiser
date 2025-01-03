import { Campaign } from '../types/campaign';
import { ICampaign } from '@interfaces';

export const toCampaignModel = (campaign: Campaign): ICampaign => {
  return {
    id: campaign.id,
    owner: campaign.owner,
    title: campaign.title,
    description: campaign.description,
    goal: parseFloat(campaign.goal),
    pledged: parseFloat(campaign.pledged),
    endAt: campaign.endAt,
    status: campaign.status,
    image: campaign.image
  };
}; 