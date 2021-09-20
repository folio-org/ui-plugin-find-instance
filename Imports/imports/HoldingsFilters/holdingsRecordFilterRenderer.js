import React from 'react';

import HoldingsRecordFilters from './HoldingsRecordFilters';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = (data) => props => {
  const {
    locations,
    tags,
    parentResources,
    onFetchFacets,
  } = data;
  const {
    activeFilters,
    getFilterHandlers,
  } = props;
  const { query } = parentResources;
  const onChange = (filterObj) => {
    const newValue = { [filterObj.name]: filterObj.values };
    getFilterHandlers().state(newValue);
  };

  return (
    <HoldingsRecordFilters
      activeFilters={activeFilters.state}
      data={{
        locations,
        tagsRecords: tags,
        query,
        onFetchFacets,
        parentResources,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default holdingsRecordFilterRenderer;
