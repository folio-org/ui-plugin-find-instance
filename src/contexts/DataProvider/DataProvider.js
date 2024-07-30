import PropTypes from 'prop-types';

import { useCommonData } from '@folio/stripes-inventory-components';

import { DataContext } from './DataContext';

const DataProvider = ({ children, tenantId }) => {
  const { commonData, isCommonDataLoading } = useCommonData(tenantId);

  if (isCommonDataLoading) {
    return null;
  }

  return (
    <DataContext.Provider value={commonData}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.object,
  tenantId: PropTypes.string,
};

export { DataProvider };
