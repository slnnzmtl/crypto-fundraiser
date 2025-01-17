import React from "react";
import { Card, Button } from "@components/ui";
import { motion } from "framer-motion";
import { walletStore } from "@stores/index";

type StatusType = "all" | "active" | "completed" | "failed";

interface FilterContentProps {
  statusFilter: StatusType;
  onStatusChange: (status: StatusType) => void;
  showOnlyOwned: boolean;
  onShowOnlyOwnedChange: (show: boolean) => void;
  onClearAll: () => void;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  statusFilter,
  onStatusChange,
  showOnlyOwned,
  onShowOnlyOwnedChange,
  onClearAll,
}) => {
  const statuses: Array<{ value: StatusType; label: string }> = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <Card type="material">
      <div className="flex flex-col gap-6">
        {walletStore.address && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">
              Ownership
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyOwned}
                onChange={(e) => onShowOnlyOwnedChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-dark-800 text-yellow-600 focus:ring-yellow-600"
              />
              <span className="text-sm text-gray-300">
                Show only my campaigns
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map(({ value, label }) => (
              <Button
                key={value}
                onClick={() => onStatusChange(value)}
                variant={statusFilter === value ? "primary" : "secondary"}
                size="small"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {(statusFilter !== "all" || showOnlyOwned) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-2 text-sm text-gray-400 border-t border-dark-700 pt-4"
          >
            <span>Active filters:</span>
            {statusFilter !== "all" && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-yellow-400">
                {statuses.find((s) => s.value === statusFilter)?.label}
              </span>
            )}
            {showOnlyOwned && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-yellow-400">
                My Campaigns
              </span>
            )}
            <Button
              onClick={onClearAll}
              variant="flat"
              className="ml-auto h-auto p-0"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};
