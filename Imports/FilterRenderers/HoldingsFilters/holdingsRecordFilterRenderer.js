import React from 'react';

import HoldingsRecordFilters from '../../imports/HoldingsFilters';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = data => onChange => {
  const {
    locations,
    tags,
    consortiaTenants,
    isLoadingLocationsForTenants,
  } = data;
  const activeFiltersObj = onChange.activeFilters.state;

  const onChangeHandler = (filterObj) => {
    const newValue = { [filterObj.name]: filterObj.values };
    onChange.getFilterHandlers().state(newValue);
  };

  return (
    <HoldingsRecordFilters
      activeFilters={activeFiltersObj}
      data={{
        locations,
        tagsRecords: tags,
        isLoadingLocationsForTenants,
        consortiaTenants,
      }}
      onChange={onChangeHandler}
      onClear={(name) => onChangeHandler({ name, values: [] })}
    />
  );
};

export default holdingsRecordFilterRenderer;
