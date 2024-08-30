import PropTypes from 'prop-types';

import {
  segments,
  SORT_OPTIONS,
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
  TITLE: SORT_OPTIONS.TITLE,
  CONTRIBUTORS: SORT_OPTIONS.CONTRIBUTORS,
  PUBLISHERS: 'publishers',
  IS_CHECKED: 'isChecked',
};
