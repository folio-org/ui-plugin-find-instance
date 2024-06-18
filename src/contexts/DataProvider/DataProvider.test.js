import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { useCommonData } from '@folio/stripes-inventory-components';
import { DataProvider } from './DataProvider';
import { DataContext } from './DataContext';


const commonData = {
  locations: [{ id: 'id-1', tenantId: 'tenant-id' }],
  consortiaTenants: [{ id: 'id-1', name: 'College' }],
};

useCommonData.mockReturnValue({
  commonData,
  isCommonDataLoading: false,
});

const mockData = jest.fn();

const renderDataProvider = () => render(
  <DataProvider>
    <DataContext.Consumer>
      {mockData}
    </DataContext.Consumer>
  </DataProvider>
);

describe('DataProvider1', () => {
  it('should pass data to children component2', () => {
    renderDataProvider();

    expect(mockData).toHaveBeenCalledWith(commonData);
  });
});
