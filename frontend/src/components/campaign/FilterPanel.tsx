import React from 'react';
import { observer } from 'mobx-react-lite';
import { useFilters } from '../../hooks/useFilters';
import { motion } from 'framer-motion';
import { campaignStore, walletStore } from '@stores/index';

type StatusType = 'all' | 'active' | 'completed' | 'failed';

const FilterPanel: React.FC = observer(() => {
  const { statusFilter, setStatusFilter } = useFilters();

  const handleStatusChange = (value: StatusType) => {
    setStatusFilter(value);
  };

  const statuses: Array<{ value: StatusType; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-xl sticky top-24"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h3 className="text-lg font-medium text-white">Filters</h3>
        </div>

        {/* Ownership Filter */}
        {walletStore.address && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">
              Ownership
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campaignStore.showOnlyOwned}
                onChange={(e) => campaignStore.setShowOnlyOwned(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-dark-800 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-gray-300">Show only my campaigns</span>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map(({ value, label }) => (
              <motion.button
                key={value}
                onClick={() => handleStatusChange(value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${statusFilter === value
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                  }
                `}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(statusFilter !== 'all' || campaignStore.showOnlyOwned) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-2 text-sm text-gray-400 border-t border-dark-700 pt-4"
          >
            <span>Active filters:</span>
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-blue-400">
                {statuses.find(s => s.value === statusFilter)?.label}
              </span>
            )}
            {campaignStore.showOnlyOwned && (
              <span className="px-2 py-1 rounded-md bg-dark-700 text-blue-400">
                My Campaigns
              </span>
            )}
            <button
              onClick={() => {
                handleStatusChange('all');
                campaignStore.setShowOnlyOwned(false);
              }}
              className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default FilterPanel; 