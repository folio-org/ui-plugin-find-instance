import PropTypes from 'prop-types';

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
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  dataOptions,
  selectedValues,
  onChange,
  onClear,
}) => {
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
            dataOptions={dataOptions}
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
  selectedValues: [],
  closedByDefault: false,
  separator: false,
};
