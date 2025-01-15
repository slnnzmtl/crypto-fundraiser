import React from "react";
import { Card } from "@components/ui";
import { DonationListItem } from "./DonationListItem";

interface Donation {
  donor: string;
  amount: string;
  message: string;
  timestamp: Date;
}

interface DonationListProps {
  donations: Donation[];
  className?: string;
}

export const DonationList: React.FC<DonationListProps> = ({
  donations,
  className = "",
}) => {
  if (!Array.isArray(donations) || donations.length === 0) {
    return (
      <Card className={`text-center py-8 ${className}`}>
        <p className="text-gray-400">No donations yet</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold">Recent Donations</h2>
      <div className="space-y-4 overflow-y-auto">
        {donations.map((donation, index) => (
          <DonationListItem key={index} donation={donation} />
        ))}
      </div>
    </div>
  );
};
