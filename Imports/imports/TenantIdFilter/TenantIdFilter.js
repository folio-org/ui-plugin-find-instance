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

import useTenantKy from '../../../temp/useTenantKy';
import CheckboxFacet from '../CheckboxFacet';

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

  const { data, isFetching } = useQuery(
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

  const name = 'tenantId';

  return (
    <Accordion
      id={name}
      name={name}
      label={<FormattedMessage id="ui-plugin-find-instance.filters.tenantId" />}
      closedByDefault
      separator={false}
      header={FilterAccordionHeader}
      displayClearButton={activeFilters?.length > 0}
      onClearFilter={() => onClear(name)}
    >
      <CheckboxFacet
        name={name}
        dataOptions={dataOptions || []}
        selectedValues={activeFilters}
        isPending={isFetching}
        onChange={onChange}
        isFilterable
      />
    </Accordion>
  );
};

TenantIdFilter.propTypes = propTypes;

export default TenantIdFilter;
