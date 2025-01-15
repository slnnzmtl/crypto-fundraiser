import React from "react";
import { Campaign } from "@/types/campaign";

interface Props {
  campaign: Campaign;
  className?: string;
}

const StatusBadge: React.FC<Props> = ({ campaign, className = "" }) => {
  const getStatusConfig = () => {
    switch (campaign.status) {
      case "completed":
        return {
          className: "bg-green-600/20 text-green-500",
          label: "Completed",
        };
      case "failed":
        return {
          className: "bg-red-600/20 text-red-500",
          label: "Failed",
        };
      default:
        return {
          className: "bg-primary/20 text-blue-500",
          label: "Active",
        };
    }
  };

  const { className: statusClassName, label } = getStatusConfig();

  return (
    <span
      className={`text-xs sm:text-sm px-2 py-1 rounded ${statusClassName} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
