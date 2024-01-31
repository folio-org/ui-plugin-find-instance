import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
  Loading,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import {
  filterItemsBy,
  isUserInConsortiumMode,
} from '../utils';

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  closedByDefault: PropTypes.bool,
  separator: PropTypes.bool,
  isLoadingOptions: PropTypes.bool.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  consortiaTenants: PropTypes.arrayOf(PropTypes.object),
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export const LocationFilter = ({
  id,
  name,
  label,
  closedByDefault,
  separator,
  isLoadingOptions,
  locations,
  consortiaTenants,
  selectedValues,
  onChange,
  onClear,
}) => {
  const stripes = useStripes();

  const uniqueLocations = uniqBy(locations, 'id');
  const groupedLocations = groupBy(uniqueLocations, 'name');
  const groupedConsortiaTenants = groupBy(consortiaTenants, 'id');

  const getOptions = () => {
    if (isUserInConsortiumMode(stripes)) {
      return uniqueLocations.map(({ name: locationName, id: locationId, _tenantId }) => {
        const isDuplicate = groupedLocations[locationName].length > 1;
        const tenantName = groupedConsortiaTenants[_tenantId][0].name;

        return {
          label: isDuplicate ? `${locationName} (${tenantName})` : locationName,
          value: locationId,
        };
      });
    }

    return locations.map(({ name: locationName, id: locationId }) => ({
      label: locationName,
      value: locationId,
    }));
  };

  return (
    <Accordion
      id={id}
      name={name}
      label={label}
      closedByDefault={closedByDefault}
      separator={separator}
      header={FilterAccordionHeader}
      displayClearButton={selectedValues.length > 0}
      onClearFilter={() => onClear(name)}
    >
      {isLoadingOptions
        ? <Loading data-testid="loading-options" />
        : (
          <MultiSelectionFilter
            name={name}
            dataOptions={getOptions()}
            selectedValues={selectedValues}
            filter={filterItemsBy('label')}
            onChange={onChange}
          />
        )
      }
    </Accordion>
  );
};

LocationFilter.propTypes = propTypes;
LocationFilter.defaultProps = {
  consortiaTenants: [],
  selectedValues: [],
  closedByDefault: false,
  separator: false,
};
