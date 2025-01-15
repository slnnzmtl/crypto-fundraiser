import React from "react";
import { Card } from "@components/ui";

interface Donation {
  donor: string;
  amount: string;
  message: string;
  timestamp: Date;
}

interface DonationListItemProps {
  donation: Donation;
}

export const DonationListItem: React.FC<DonationListItemProps> = ({
  donation,
}) => {
  const formatDate = (timestamp: Date) => {
    try {
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return "Invalid date";
      }
      return timestamp.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <Card className="flex flex-col space-y-2 ">
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-2 items-start mb-2">
        <div className="flex items-center flex-wrap space-x-2 w-full">
          <p className="text-sm text-gray-400">From</p>
          <p className="text-sm font-medium truncate" title={donation.donor}>
            {donation.donor}
          </p>
        </div>

        <p className="text-lg font-bold text-nowrap">{donation.amount} ETH</p>
      </div>
      {donation.message && (
        <div className="flex justify-between pt-2 border-t border-dark-600">
          <p className="text-sm text-gray-300">{donation.message}</p>
          <p className="text-xs text-gray-400">
            {formatDate(donation.timestamp)}
          </p>
        </div>
      )}
    </Card>
  );
};
