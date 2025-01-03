import React from 'react';
import { ICampaign } from '@interfaces';
import { ImagePlaceholder } from '@components/ui';

interface Props {
  campaign: ICampaign;
}

const CampaignHeader: React.FC<Props> = ({ campaign }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="aspect-video w-full">
        {!imageError && campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder className="rounded-lg" />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
        <p className="mt-2 text-gray-400 whitespace-pre-wrap">{campaign.description}</p>
      </div>
    </div>
  );
};

export default CampaignHeader; 