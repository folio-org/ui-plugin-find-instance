import React from 'react';

import ItemFilters from '../../imports/ItemFilters';
import { itemStatuses } from '../../imports/constants';

// itemFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const itemFilterRenderer = data => onChange => {
  const {
    materialTypes,
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
    <ItemFilters
      activeFilters={activeFiltersObj}
      data={{
        materialTypes,
        itemStatuses,
        locations,
        tagsRecords: tags,
        consortiaTenants,
        isLoadingLocationsForTenants,
      }}
      onChange={onChangeHandler}
      onClear={(name) => onChangeHandler({ name, values: [] })}
    />
  );
};

export default itemFilterRenderer;
