import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { campaignStore } from '@stores/CampaignStore';

export const useFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'failed'>(
    (queryParams.get('status') as 'all' | 'active' | 'completed' | 'failed') || 'all'
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('status', statusFilter);
    navigate({ search: params.toString() }, { replace: true });
    
    // Update the store's status filter
    campaignStore.setStatus(statusFilter);
  }, [statusFilter, navigate, location.search]);

  return {
    statusFilter,
    setStatusFilter,
  };
}; 