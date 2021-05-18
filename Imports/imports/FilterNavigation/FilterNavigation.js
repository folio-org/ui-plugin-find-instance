import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { segments } from '../constants';

const FilterNavigation = ({ segment, setSegment, reset }) => (
  <ButtonGroup
    fullWidth
    data-test-filters-navigation
  >
    {
      Object.keys(segments).map(name => (
        <Button
          key={`${name}`}
          onClick={() => { setSegment(name); reset(); }}
          buttonStyle={`${segment === name ? 'primary' : 'default'}`}
          id={`segment-navigation-${name}`}
        >
          <FormattedMessage id={`ui-inventory.filters.${name}`} />
        </Button>
      ))
    }
  </ButtonGroup>
);

FilterNavigation.propTypes = {
  segment: PropTypes.string,
  setSegment: PropTypes.func.isRequired,
};

FilterNavigation.defaultProps = {
  segment: segments.instances,
};

export default FilterNavigation;
