import React from "react";
import { Link } from "react-router-dom";
import { ViewType } from "@interfaces";
import { ImagePlaceholder } from "@components/ui";
import { Campaign } from "@/types/campaign";
import { motion } from "framer-motion";

interface Props {
  campaign: Campaign;
  viewType: ViewType;
}

const itemVariants = {
  grid: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  list: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const CampaignListItem: React.FC<Props> = ({ campaign, viewType }) => {
  const [imageError, setImageError] = React.useState(false);

  const getStatusColor = () => {
    if (campaign.status === "completed") {
      return "bg-green-600/20 text-green-500";
    }
    return campaign.status === "failed"
      ? "bg-red-600/20 text-red-500"
      : "bg-primary/20 text-yellow-500";
  };

  const getStatusText = () => {
    switch (campaign.status) {
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Active";
    }
  };

  return (
    <Link to={`/campaigns/${campaign.id}`}>
      <motion.div
        key={campaign.id}
        variants={itemVariants}
        layout
        className={`
        block bg-dark-800 rounded-lg overflow-hidden hover:bg-primary/10 transition-colors
        ${viewType === "list" ? "flex gap-0 md:gap-6" : ""}
      `}
      >
        <div
          className={
            viewType === "list" ? "min-w-[30%] w-48 shrink-1" : "aspect-video"
          }
        >
          {!imageError && campaign.image ? (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-40 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" />
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col jsutify-between">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base md:text-lg font-medium leading-tight">
              {campaign.title}
            </h3>
            <div className="text-xs md:text-sm shrink-0">
              <span
                className={`px-2 py-1 text-xs md:text-sm rounded ${getStatusColor()}`}
              >
                {getStatusText()}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs md:text-sm text-gray-400 line-clamp-2">
            {campaign.description}
          </p>

          <div className="mt-4 flex flex-col md:flex-row justify-between text-xs md:text-sm">
            <div>
              <span className="text-gray-400">Goal: </span>
              <span>{Number(campaign.goal)} ETH</span>
            </div>
            <div>
              <span className="text-gray-400">Pledged: </span>
              <span>{Number(campaign.pledged)} ETH</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CampaignListItem;
