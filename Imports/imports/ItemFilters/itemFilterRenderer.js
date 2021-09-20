import React from 'react';

import ItemFilters from './ItemFilters';
import { itemStatuses } from '../constants';

// itemFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const itemFilterRenderer = data => props => {
  const {
    materialTypes,
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
    <ItemFilters
      activeFilters={activeFilters.state}
      data={{
        materialTypes,
        itemStatuses,
        locations,
        query,
        parentResources,
        onFetchFacets,
        tagsRecords: tags,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default itemFilterRenderer;
