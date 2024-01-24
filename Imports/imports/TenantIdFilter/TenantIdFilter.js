import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import CheckboxFacet from '../CheckboxFacet';
import DataContext from '../DataContext';

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
  const { consortiaTenants } = useContext(DataContext);

  const dataOptions = consortiaTenants?.map(({ id, name }) => ({
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
        onChange={onChange}
        isFilterable
      />
    </Accordion>
  );
};

TenantIdFilter.propTypes = propTypes;

export default TenantIdFilter;
