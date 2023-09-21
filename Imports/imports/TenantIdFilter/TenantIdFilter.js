import { useQuery } from 'react-query';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import useTenantKy from '../../../temp/useTenantKy';

const propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

const TenantIdFilter = ({
  activeFilters,
  onClear,
  onChange,
}) => {
  const namespace = useNamespace();
  const stripes = useStripes();

  const { centralTenantId, id: consortiumId } = stripes.user.user.consortium || {};

  const ky = useTenantKy({ tenantId: centralTenantId });

  const { data } = useQuery(
    [namespace, consortiumId],
    () => ky.get(`consortia/${consortiumId}/tenants`).json(),
    {
      enabled: Boolean(consortiumId),
    },
  );

  const dataOptions = data?.tenants?.map(({ id, name }) => ({
    label: name,
    value: id,
  })) || [];

  return (
    <Accordion
      id="tenantId"
      name="tenantId"
      label={<FormattedMessage id="ui-inventory.filters.tenantId" />}
      closedByDefault
      separator={false}
      header={FilterAccordionHeader}
      displayClearButton={activeFilters?.length > 0}
      onClearFilter={() => onClear('tenantId')}
    >
      <CheckboxFilter
        name="tenantId"
        dataOptions={dataOptions}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </Accordion>
  );
};

TenantIdFilter.propTypes = propTypes;

export default TenantIdFilter;
