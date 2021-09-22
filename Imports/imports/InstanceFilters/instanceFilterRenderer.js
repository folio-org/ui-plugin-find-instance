import React from 'react';
import InstanceFilters from './InstanceFilters';

// instanceFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const instanceFilterRenderer = data => props => {
  const {
    locations,
    instanceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    tags,
    onFetchFacets,
    parentResources,
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
    <InstanceFilters
      activeFilters={activeFilters.state}
      data={{
        locations,
        resourceTypes: instanceTypes,
        instanceFormats,
        modesOfIssuance,
        tagsRecords: tags,
        natureOfContentTerms,
        query,
        onFetchFacets,
        parentResources,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default instanceFilterRenderer;
