import PropTypes from 'prop-types';

export const itemStatuses = [
  { label: 'ui-plugin-find-instance.item.status.agedToLost', value: 'Aged to lost' },
  { label: 'ui-plugin-find-instance.item.status.available', value: 'Available' },
  { label: 'ui-plugin-find-instance.item.status.awaitingPickup', value: 'Awaiting pickup' },
  { label: 'ui-plugin-find-instance.item.status.awaitingDelivery', value: 'Awaiting delivery' },
  { label: 'ui-plugin-find-instance.item.status.checkedOut', value: 'Checked out' },
  { label: 'ui-plugin-find-instance.item.status.claimedReturned', value: 'Claimed returned' },
  { label: 'ui-plugin-find-instance.item.status.declaredLost', value: 'Declared lost' },
  { label: 'ui-plugin-find-instance.item.status.inProcess', value: 'In process' },
  { label: 'ui-plugin-find-instance.item.status.inProcessNonRequestable', value: 'In process (non-requestable)' },
  { label: 'ui-plugin-find-instance.item.status.inTransit', value: 'In transit' },
  { label: 'ui-plugin-find-instance.item.status.intellectualItem', value: 'Intellectual item' },
  { label: 'ui-plugin-find-instance.item.status.longMissing', value: 'Long missing' },
  { label: 'ui-plugin-find-instance.item.status.lostAndPaid', value: 'Lost and paid' },
  { label: 'ui-plugin-find-instance.item.status.missing', value: 'Missing' },
  { label: 'ui-plugin-find-instance.item.status.onOrder', value: 'On order' },
  { label: 'ui-plugin-find-instance.item.status.orderClosed', value: 'Order closed' },
  { label: 'ui-plugin-find-instance.item.status.paged', value: 'Paged' },
  { label: 'ui-plugin-find-instance.item.status.restricted', value: 'Restricted' },
  { label: 'ui-plugin-find-instance.item.status.unavailable', value: 'Unavailable' },
  { label: 'ui-plugin-find-instance.item.status.unknown', value: 'Unknown' },
  { label: 'ui-plugin-find-instance.item.status.withdrawn', value: 'Withdrawn' },
];

export const segments = {
  instances: 'instances',
  holdings: 'holdings',
  items: 'items',
};

export const CQL_FIND_ALL = 'cql.allRecords=1';

export const AVAILABLE_SEGMENTS_TYPES = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.oneOf([segments.instances, segments.holdings, segments.items]),
  })
);

export const CONFIG_TYPES = PropTypes.shape({
  availableSegments: AVAILABLE_SEGMENTS_TYPES,
});

export const DEFAULT_FILTERS_NUMBER = 6;
