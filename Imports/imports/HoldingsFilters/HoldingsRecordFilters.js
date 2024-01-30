import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import {
  useStripes,
  checkIfUserInMemberTenant,
  IfInterface,
} from '@folio/stripes/core';

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
    locations: [],
  },
};

const HoldingsRecordFilters = ({
  activeFilters: {
    shared = [],
    tenantId = [],
    discoverySuppress = [],
    effectiveLocation = [],
    holdingsPermanentLocation = [],
    tags,
  },
  data: {
    isLoadingLocationsForTenants,
    locations,
    tagsRecords,
    consortiaTenants,
  },
  onChange,
  onClear,
}) => {
  const intl = useIntl();
  const stripes = useStripes();

  const suppressedOptions = [
    {
      label: <FormattedMessage id="ui-plugin-find-instance.yes" />,
      value: 'true',
    },
    {
      label: <FormattedMessage id="ui-plugin-find-instance.no" />,
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
      <LocationFilter
        id="holdingsEffectiveLocationAccordion"
        name="effectiveLocation"
        label={intl.formatMessage({ id: 'ui-plugin-find-instance.filters.effectiveLocation' })}
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
        label={intl.formatMessage({ id: 'ui-plugin-find-instance.holdings.permanentLocation' })}
        closedByDefault
        isLoadingOptions={isLoadingLocationsForTenants}
        locations={locations}
        consortiaTenants={consortiaTenants}
        selectedValues={holdingsPermanentLocation}
        onChange={onChange}
        onClear={onClear}
      />
      <Accordion
        data-test-filter-holding-discovery-suppress
        label={<FormattedMessage id="ui-plugin-find-instance.discoverySuppress" />}
        id="holdingDiscoverySuppress"
        name="discoverySuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={discoverySuppress.length > 0}
        onClearFilter={() => onClear('discoverySuppress')}
      >
        <CheckboxFilter
          data-test-filter-holdings-discovery-suppress
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

HoldingsRecordFilters.propTypes = propTypes;
HoldingsRecordFilters.defaultProps = defaultProps;

export default HoldingsRecordFilters;
