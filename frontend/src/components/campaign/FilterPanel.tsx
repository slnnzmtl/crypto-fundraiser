import React from "react";
import { observer } from "mobx-react-lite";
import { useFilters } from "../../hooks/useFilters";
import { motion } from "framer-motion";
import { campaignStore, walletStore } from "@stores/index";
import { Card, Button } from "../ui";

type StatusType = "all" | "active" | "completed" | "failed";

const FilterPanel: React.FC = observer(() => {
  const { statusFilter, setStatusFilter } = useFilters();

  const handleStatusChange = (value: StatusType) => {
    setStatusFilter(value);
  };

  const statuses: Array<{ value: StatusType; label: string }> = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <Card type="material" className="sticky top-24">
      <div className="flex flex-col gap-6">
        {walletStore.address && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">
              Ownership
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campaignStore.showOnlyOwned}
                onChange={(e) =>
                  campaignStore.setShowOnlyOwned(e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-600 bg-dark-800 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-gray-300">
                Show only my campaigns
              </span>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map(({ value, label }) => (
              <Button
                key={value}
                onClick={() => handleStatusChange(value)}
                variant={statusFilter === value ? "primary" : "secondary"}
                size="small"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(statusFilter !== "all" || campaignStore.showOnlyOwned) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-2 text-sm text-gray-400 border-t border-dark-700 pt-4"
          >
            <span>Active filters:</span>
            {statusFilter !== "all" && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-blue-400">
                {statuses.find((s) => s.value === statusFilter)?.label}
              </span>
            )}
            {campaignStore.showOnlyOwned && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-blue-400">
                My Campaigns
              </span>
            )}
            <Button
              onClick={() => {
                handleStatusChange("all");
                campaignStore.setShowOnlyOwned(false);
              }}
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
});

export default FilterPanel;
