export interface Campaign {
  id: number;
  creator: string;
  owner: string;
  title: string;
  description: string;
  image: string;
  goal: string;
  pledged: string;
  startAt: Date;
  endAt: Date;
  claimed: boolean;
}

export interface CampaignInput {
  title: string;
  description: string;
  image: string;
  goal: string;
  durationInDays: number;
}

export interface CampaignFormData extends CampaignInput {
  durationInDays: number;
} 