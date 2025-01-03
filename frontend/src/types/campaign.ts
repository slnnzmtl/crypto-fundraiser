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
  autoComplete: boolean;
  status: 'active' | 'completed' | 'failed';
}

export interface CampaignInput {
  title: string;
  description: string;
  image: string;
  goal: string;
  durationInDays: number;
  autoComplete: boolean;
}

export interface CampaignFormData extends CampaignInput {
  durationInDays: number;
} 