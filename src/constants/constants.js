import PropTypes from 'prop-types';

import { segments } from '@folio/stripes-inventory-components';

export const AVAILABLE_SEGMENTS_TYPES = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.oneOf([segments.instances, segments.holdings, segments.items]),
  })
);

export const CONFIG_TYPES = PropTypes.shape({
  availableSegments: AVAILABLE_SEGMENTS_TYPES,
});
