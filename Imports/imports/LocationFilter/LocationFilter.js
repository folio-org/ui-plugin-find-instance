import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';

import {
  Accordion,
  FilterAccordionHeader,
  Loading,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { filterItemsBy } from '../utils';

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  closedByDefault: PropTypes.bool,
  separator: PropTypes.bool,
  isLoadingOptions: PropTypes.bool.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  selectedValues,
  onChange,
  onClear,
}) => {
  const locationOptions = uniqBy(locations, 'id').map(({ name: locationName, id: locationId }) => ({
    label: locationName,
    value: locationId,
  }));

  const groupedLocations = groupBy(locationOptions, 'label');

  // `itemToString` is used both as a `key` in the options list and for accessible announcements among options,
  // so let's add `id` only for duplicates.
  const getItemToString = option => {
    if (!option) return '';

    const isDuplicate = groupedLocations[option.label].length > 1;

    if (isDuplicate) {
      return `${option.label} id: ${option.value}`;
    }

    return option.label;
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
            dataOptions={locationOptions}
            selectedValues={selectedValues}
            filter={filterItemsBy('label')}
            itemToString={getItemToString}
            onChange={onChange}
          />
        )
      }
    </Accordion>
  );
};

LocationFilter.propTypes = propTypes;
LocationFilter.defaultProps = {
  selectedValues: [],
  closedByDefault: false,
  separator: false,
};
