import React from 'react';

import HoldingsRecordFilters from './HoldingsRecordFilters';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = ({ locations, tags }) => onChange => {
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
      }}
      onChange={onChangeHandler}
      onClear={(name) => onChangeHandler({ name, values: [] })}
    />
  );
};

export default holdingsRecordFilterRenderer;
