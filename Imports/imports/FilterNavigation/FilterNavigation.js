import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
  uniqBy,
} from 'lodash';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import {
  segments,
  AVAILABLE_SEGMENTS_TYPES,
} from '../constants';

const FilterNavigation = ({
  availableSegments,
  segment,
  setSegment,
  reset,
}) => {
  const uniqAvailableSegments = uniqBy(availableSegments, 'name');
  const segmentsForRender = isEmpty(uniqAvailableSegments)
    ? Object.keys(segments)
    : uniqAvailableSegments.map(section => section.name);

  useEffect(() => {
    if (!isEmpty(uniqAvailableSegments)) {
      setSegment(segmentsForRender[0]);
    }
  }, []);

  if (segmentsForRender.length === 1) {
    return null;
  }

  return (
    <ButtonGroup
      fullWidth
      data-test-filters-navigation
    >
      {
        segmentsForRender.map(name => (
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
};

FilterNavigation.propTypes = {
  reset: PropTypes.func.isRequired,
  segment: PropTypes.string,
  setSegment: PropTypes.func.isRequired,
  availableSegments: AVAILABLE_SEGMENTS_TYPES,
};

FilterNavigation.defaultProps = {
  segment: segments.instances,
  availableSegments: [],
};

export default FilterNavigation;
