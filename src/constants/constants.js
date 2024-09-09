import PropTypes from 'prop-types';

import {
  segments,
  SEARCH_COLUMN_NAMES,
} from '@folio/stripes-inventory-components';

export const AVAILABLE_SEGMENTS_TYPES = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.oneOf([segments.instances, segments.holdings, segments.items]),
  })
);

export const CONFIG_TYPES = PropTypes.shape({
  availableSegments: AVAILABLE_SEGMENTS_TYPES,
});

export const SEARCH_RESULTS_COLUMNS = {
  ...SEARCH_COLUMN_NAMES,
  IS_CHECKED: 'isChecked',
};
