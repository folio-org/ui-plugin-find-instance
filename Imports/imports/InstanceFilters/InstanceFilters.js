import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  checkIfUserInMemberTenant,
  useStripes,
  IfInterface,
} from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
  languageOptions,
  Loading,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
  DateRangeFilter,
} from '@folio/stripes/smart-components';

import {
  filterItemsBy,
  retrieveDatesFromDateRangeFilterString,
  makeDateRangeFilterString,
} from '../utils';
import TagsFilter from '../TagsFilter';
import SharedFilter from '../SharedFilter';
import TenantIdFilter from '../TenantIdFilter';

const DATE_FORMAT = 'YYYY-MM-DD';

const InstanceFilters = ({
  activeFilters: {
    shared = [],
    tenantId = [],
    effectiveLocation = [],
    resource = [],
    language = [],
    format = [],
    mode = [],
    natureOfContent = [],
    discoverySuppress = [],
    staffSuppress = [],
    createdDate = [],
    updatedDate = [],
    source = [],
    tags,
  },
  data: {
    locations,
    resourceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    tagsRecords,
    isLoadingLocationsForTenants,
  },
  onChange,
  onClear,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const langOptions = languageOptions(intl, stripes.locale);

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  const effectiveLocationOptions = locations.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const resourceTypeOptions = resourceTypes.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const instanceFormatOptions = instanceFormats.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const modeOfIssuanceOptions = modesOfIssuance.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const natureOfContentOptions = natureOfContentTerms.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

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

  const sourceOptions = [
    {
      label: <FormattedMessage id="ui-plugin-find-instance.folio" />,
      value: 'FOLIO',
    },
    {
      label: <FormattedMessage id="ui-plugin-find-instance.marc" />,
      value: 'MARC',
    },
  ];

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
        label={<FormattedMessage id="ui-plugin-find-instance.filters.effectiveLocation" />}
        id="effectiveLocation"
        name="effectiveLocation"
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={effectiveLocation.length > 0}
        onClearFilter={() => onClear('effectiveLocation')}
      >
        {isLoadingLocationsForTenants
          ? (
            <Loading />
          )
          : (
            <MultiSelectionFilter
              name="effectiveLocation"
              dataOptions={effectiveLocationOptions}
              selectedValues={effectiveLocation}
              filter={filterItemsBy('label')}
              onChange={onChange}
            />
          )
        }
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.instances.language" />}
        id="language"
        name="language"
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={language.length > 0}
        onClearFilter={() => onClear('language')}
      >
        <MultiSelectionFilter
          name="language"
          dataOptions={langOptions}
          selectedValues={language}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.instances.resourceType" />}
        id="resource"
        name="resource"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={resource.length > 0}
        onClearFilter={() => onClear('resource')}
      >
        <MultiSelectionFilter
          name="resource"
          dataOptions={resourceTypeOptions}
          selectedValues={resource}
          filter={filterItemsBy('label')}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.instanceFormat" />}
        id="format"
        name="format"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={format.length > 0}
        onClearFilter={() => onClear('format')}
      >
        <MultiSelectionFilter
          name="format"
          dataOptions={instanceFormatOptions}
          selectedValues={format}
          filter={filterItemsBy('label')}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.modeOfIssuance" />}
        id="mode"
        name="mode"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode.length > 0}
        onClearFilter={() => onClear('mode')}
      >
        <MultiSelectionFilter
          name="mode"
          dataOptions={modeOfIssuanceOptions}
          selectedValues={mode}
          filter={filterItemsBy('label')}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.natureOfContentTerms" />}
        id="natureOfContent"
        name="natureOfContent"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode.length > 0}
        onClearFilter={() => onClear('natureOfContent')}
      >
        <MultiSelectionFilter
          name="natureOfContent"
          dataOptions={natureOfContentOptions}
          selectedValues={natureOfContent}
          filter={filterItemsBy('label')}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.staffSuppress" />}
        id="staffSuppress"
        name="staffSuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={staffSuppress.length > 0}
        onClearFilter={() => onClear('staffSuppress')}
      >
        <CheckboxFilter
          data-test-filter-instance-staff-suppress
          name="staffSuppress"
          dataOptions={suppressedOptions}
          selectedValues={staffSuppress}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.discoverySuppress" />}
        id="discoverySuppress"
        name="discoverySuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={discoverySuppress.length > 0}
        onClearFilter={() => onClear('discoverySuppress')}
      >
        <CheckboxFilter
          data-test-filter-instance-discovery-suppress
          name="discoverySuppress"
          dataOptions={suppressedOptions}
          selectedValues={discoverySuppress}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.createdDate" />}
        id="createdDate"
        name="createdDate"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={createdDate.length > 0}
        onClearFilter={() => onClear('createdDate')}
      >
        <DateRangeFilter
          name="createdDate"
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(createdDate[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.updatedDate" />}
        id="updatedDate"
        name="updatedDate"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={updatedDate.length > 0}
        onClearFilter={() => onClear('updatedDate')}
      >
        <DateRangeFilter
          name="updatedDate"
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(updatedDate[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-plugin-find-instance.source" />}
        id="source"
        name="source"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={source.length > 0}
        onClearFilter={() => onClear('source')}
      >
        <CheckboxFilter
          data-test-filter-instance-source
          name="source"
          dataOptions={sourceOptions}
          selectedValues={source}
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

InstanceFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFilters.defaultProps = {
  activeFilters: {},
  data: {
    resourceTypes: [],
    locations: [],
  },
};

export default InstanceFilters;
