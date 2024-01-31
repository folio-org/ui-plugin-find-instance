import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isEmpty } from 'lodash';

import {
  useStripes,
  checkIfUserInMemberTenant,
  IfInterface,
} from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import { filterItemsBy } from '../utils';
import TagsFilter from '../TagsFilter';
import SharedFilter from '../SharedFilter';
import TenantIdFilter from '../TenantIdFilter';
import { LocationFilter } from '../LocationFilter';

const propTypes = {
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

const defaultProps = {
  activeFilters: {},
  data: {
    materialTypes: [],
    itemStatuses: [],
    locations: [],
  },
};

const ItemFilters = ({
  activeFilters: {
    shared = [],
    tenantId = [],
    materialType = [],
    itemStatus = [],
    effectiveLocation = [],
    holdingsPermanentLocation = [],
    discoverySuppress = [],
    tags,
  },
  data: {
    materialTypes,
    itemStatuses,
    locations,
    tagsRecords,
    isLoadingLocationsForTenants,
    consortiaTenants,
  },
  onChange,
  onClear,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const materialTypesOptions = materialTypes.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const itemStatusesOptions = itemStatuses.map(({ label, value }) => ({
    label: intl.formatMessage({ id: label }),
    value,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const suppressedOptions = [
    {
      label: <FormattedMessage id="ui-inventory.yes" />,
      value: 'true',
    },
    {
      label: <FormattedMessage id="ui-inventory.no" />,
      value: 'false',
    },
  ];

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  return (
    <>
      {isUserInMemberTenant && (
        <SharedFilter
          activeFilters={shared}
          onClear={() => onClear('shared')}
          onChange={onChange}
        />
      )}
      <IfInterface name="consortia">
        <TenantIdFilter
          activeFilters={tenantId}
          onClear={() => onClear('tenantId')}
          onChange={onChange}
        />
      </IfInterface>
      <Accordion
        label={<FormattedMessage id="ui-inventory.item.status" />}
        id="itemFilterAccordion"
        name="itemFilterAccordion"
        header={FilterAccordionHeader}
        displayClearButton={!isEmpty(itemStatus)}
        onClearFilter={() => onClear('itemStatus')}
      >
        <MultiSelectionFilter
          data-test-filter-item-status
          name="itemStatus"
          dataOptions={itemStatusesOptions}
          selectedValues={itemStatus}
          onChange={onChange}
        />
      </Accordion>
      <LocationFilter
        id="itemEffectiveLocationAccordion"
        name="effectiveLocation"
        label={intl.formatMessage({ id: 'ui-inventory.filters.effectiveLocation' })}
        separator
        isLoadingOptions={isLoadingLocationsForTenants}
        locations={locations}
        consortiaTenants={consortiaTenants}
        selectedValues={effectiveLocation}
        onChange={onChange}
        onClear={onClear}
      />
      <LocationFilter
        id="holdingsPermanentLocationAccordion"
        name="holdingsPermanentLocation"
        label={intl.formatMessage({ id: 'ui-inventory.holdings.permanentLocation' })}
        closedByDefault
        isLoadingOptions={isLoadingLocationsForTenants}
        locations={locations}
        consortiaTenants={consortiaTenants}
        selectedValues={holdingsPermanentLocation}
        onChange={onChange}
        onClear={onClear}
      />
      <Accordion
        label={<FormattedMessage id="ui-inventory.materialType" />}
        id="materialTypeAccordion"
        name="materialTypeAccordion"
        separator
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={!isEmpty(materialType)}
        onClearFilter={() => onClear('materialType')}
      >
        <MultiSelectionFilter
          name="materialType"
          id="materialTypeFilter"
          dataOptions={materialTypesOptions}
          selectedValues={materialType}
          filter={filterItemsBy('label')}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id="itemDiscoverySuppressAccordion"
        name="discoverySuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={discoverySuppress.length > 0}
        onClearFilter={() => onClear('discoverySuppress')}
      >
        <CheckboxFilter
          data-test-filter-item-discovery-suppress
          name="discoverySuppress"
          dataOptions={suppressedOptions}
          selectedValues={discoverySuppress}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        onChange={onChange}
        onClear={onClear}
        selectedValues={tags}
        tagsRecords={tagsRecords}
      />
    </>
  );
};

ItemFilters.propTypes = propTypes;
ItemFilters.defaultProps = defaultProps;

export default ItemFilters;
