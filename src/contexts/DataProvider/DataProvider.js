import PropTypes from 'prop-types';

import { useCommonData } from '@folio/stripes-inventory-components';

import { DataContext } from './DataContext';

const DataProvider = ({
  children,
}) => {
  const { commonData, isCommonDataLoading } = useCommonData();

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
};

export { DataProvider };
