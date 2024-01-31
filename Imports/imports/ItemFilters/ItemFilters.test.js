
import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import ItemFilters from './ItemFilters';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));
const activeFilters = {
  shared: ['true'],
  effectiveLocation: ['effectiveLocation'],
  materialType: ['materialType'],
  itemStatus: ['itemStatus'],
  holdingsPermanentLocation: ['holdingsPermanentLocation'],
  discoverySuppress: ['discoverySuppress'],
  tags: ['tags'],
};

const data = {
  locations: [
    {
      _tenantId: 'cs00000int_0001',
      name: 'location1',
      id: 'locationid1'
    }
  ],
  isLoadingLocationsForTenants: false,
  consortiaTenants: [{
    id: 'cs00000int_0001',
    name: 'College',
  }],
  itemStatuses: [{
    label: 'itemStatuses1',
    value: 'itemStatusesValue1'
  }],
  tagsRecords: [{
    name: 'tagsRecords1',
    id: 'tagsRecordsid1'
  }],
  materialTypes: [{
    name: 'materialTypes1',
    id: 'materialTypesid1'
  }],
};

const mockClear = jest.fn();
const onChange = jest.fn();
const renderItemFilters = (props = {}) => render(
  <Harness>
    <ItemFilters
      activeFilters={activeFilters}
      data={data}
      onChange={onChange}
      onClear={mockClear}
      {...props}
    />
  </Harness>
);
describe('ItemFilters', () => {
  describe('when filters are not empty', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderItemFilters();
    });

    it('Should Clear selected filters for shared', () => {
      const clearShared = document.querySelector('[data-testid="clear-shared"]');
      fireEvent.click(clearShared);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for effective Location', () => {
      const clearEffectiveLocation = document.querySelector('[data-testid="clear-effectiveLocation"]');
      fireEvent.click(clearEffectiveLocation);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for materialType', () => {
      const clearMaterialType = document.querySelector('[data-testid="clear-materialTypeAccordion"]');
      fireEvent.click(clearMaterialType);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for itemStatus', () => {
      const clearitemStatus = document.querySelector('[data-testid="clear-itemFilterAccordion"]');
      fireEvent.click(clearitemStatus);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for holdingsPermanentLocation', () => {
      fireEvent.click(screen.getByTestId('clear-holdingsPermanentLocation'));
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for discoverySuppress', () => {
      const cleardiscoverySuppress = document.querySelector('[data-testid="clear-discoverySuppress"]');
      fireEvent.click(cleardiscoverySuppress);
      expect(mockClear).toBeCalled();
    });

    it('should render Shared filter', () => {
      expect(screen.getByText('ui-plugin-find-instance.filters.shared')).toBeInTheDocument();
    });
  });

  describe('when filters are empty', () => {
    beforeEach(() => {
      renderItemFilters({
        activeFilters: {},
      });
    });

    it('should disable clear buttons', () => {
      const clearButtons = screen.getAllByRole('button', { name: 'Clear' });
      clearButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});
