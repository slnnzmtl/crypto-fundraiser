import { observer } from "mobx-react-lite";
import { FilterContainer } from "./FilterContainer";
import { FilterContent } from "./FilterContent";
import { useFilters } from "@/hooks/useFilters";
import { campaignStore } from "@/stores";

interface FilterPanelProps {
  isOpen: boolean;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = observer(({ isOpen }) => {
  const { statusFilter, setStatusFilter } = useFilters();

  const handleClearAll = () => {
    setStatusFilter("all");
    campaignStore.setShowOnlyOwned(false);
  };

  return (
    <FilterContainer isOpen={isOpen}>
      <FilterContent
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        showOnlyOwned={campaignStore.showOnlyOwned}
        onShowOnlyOwnedChange={campaignStore.setShowOnlyOwned}
        onClearAll={handleClearAll}
      />
    </FilterContainer>
  );
});

export default FilterPanel;
