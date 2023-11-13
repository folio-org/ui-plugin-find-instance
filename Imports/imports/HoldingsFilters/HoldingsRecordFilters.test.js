
import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import HoldingsRecordFilters from './HoldingsRecordFilters';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));
const activeFilters = {
  shared: ['true'],
  effectiveLocation: ['effectiveLocation1'],
  discoverySuppress: ['discoverySuppress'],
  holdingsPermanentLocation: ['holdingsPermanentLocation'],
  tags: ['tags1'],
};

const data = {
  locations: [
    {
      name: 'location1',
      id: 'locationid1'
    }
  ],
  tagsRecords: [{
    name: 'tagsRecords1',
    id: 'tagsRecordsid1'
  }],
};

const mockClear = jest.fn();
const onChange = jest.fn();
const renderHoldingsRecordFilters = (props = {}) => render(
  <Harness>
    <HoldingsRecordFilters
      activeFilters={activeFilters}
      data={data}
      onChange={onChange}
      onClear={mockClear}
      {...props}
    />
  </Harness>
);

describe('InstanceFilters', () => {
  describe('when filters are not empty', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderHoldingsRecordFilters();
    });

    it('Should Clear selected filters for shared', () => {
      const clearShared = document.querySelector('[data-testid="clear-shared"]');
      fireEvent.click(clearShared);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for effective Location', () => {
      const cleareffectiveLocation = document.querySelector('[data-testid="clear-effectiveLocation"]');
      fireEvent.click(cleareffectiveLocation);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for holdingsPermanentLocation', () => {
      const clearholdingsPermanentLocation = document.querySelector('[data-testid="clear-holdingsPermanentLocation"]');
      fireEvent.click(clearholdingsPermanentLocation);
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
      renderHoldingsRecordFilters({
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
