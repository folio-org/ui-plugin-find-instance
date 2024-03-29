import React from 'react';

import InstanceFilters from '../../imports/InstanceFilters';

// instanceFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const instanceFilterRenderer = data => onChange => {
  const {
    locations,
    instanceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    tags,
    isLoadingLocationsForTenants,
    consortiaTenants,
  } = data;

  const activeFiltersObj = onChange.activeFilters.state;

  const onChangeHandler = (filterObj) => {
    const newValue = { [filterObj.name]: filterObj.values };
    onChange.getFilterHandlers().state(newValue);
  };

  return (
    <InstanceFilters
      activeFilters={activeFiltersObj}
      data={{
        locations,
        resourceTypes: instanceTypes,
        instanceFormats,
        modesOfIssuance,
        tagsRecords: tags,
        natureOfContentTerms,
        isLoadingLocationsForTenants,
        consortiaTenants,
      }}
      onChange={onChangeHandler}
      onClear={(name) => onChangeHandler({ name, values: [] })}
    />
  );
};

export default instanceFilterRenderer;
