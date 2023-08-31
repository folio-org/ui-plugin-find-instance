import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

const SharedFilter = ({
  activeFilters,
  onClear,
  onChange,
}) => {
  const ky = useOkapiKy();
  const namespace = useNamespace();

  const getSuppressedLabel = (id) => (id === 'true' ? 'yes' : 'no');

  // for now we're requesting facets directly in this component
  // ideally, we need to use the same mechanism as in ui-inventory
  // but it  requires a lot of work to create a new ui repo, move common components and import in both modules etc
  const { data } = useQuery([namespace, 'shared'], () => ky.get('search/instances/facets', {
    searchParams: {
      facet: 'shared',
      query: 'id = *',
    },
  }).json());

  const dataOptions = data?.facets?.shared?.values?.map(({ id }) => ({
    label: <FormattedMessage id={`ui-inventory.${getSuppressedLabel(id)}`} />,
    value: id,
  })) || [];

  return (
    <Accordion
      label={<FormattedMessage id="ui-inventory.filters.shared" />}
      id="shared"
      name="shared"
      separator={false}
      header={FilterAccordionHeader}
      displayClearButton={activeFilters?.length > 0}
      onClearFilter={() => onClear('shared')}
    >
      <CheckboxFilter
        name="shared"
        dataOptions={dataOptions}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </Accordion>
  );
};

SharedFilter.propTypes = propTypes;

export default SharedFilter;
