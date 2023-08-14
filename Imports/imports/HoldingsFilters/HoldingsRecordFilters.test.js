
import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import HoldingsRecordFilters from './HoldingsRecordFilters';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));
const activeFilters = {
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
const renderHoldingsRecordFilters = () => render(
  <HoldingsRecordFilters
    activeFilters={activeFilters}
    data={data}
    onChange={onChange}
    onClear={mockClear}
  />
);

describe('InstanceFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderHoldingsRecordFilters();
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
});
describe('HoldingsRecordFilters with empty filters', () => {
  const emptyActiveFilters = {};
  beforeEach(() => {
    render(
      <HoldingsRecordFilters
        activeFilters={emptyActiveFilters}
        data={data}
        onChange={onChange}
        onClear={mockClear}
      />
    );
  });

  it('Clear buttons Should be disabled when activeFilters are Empty', () => {
    const clearButtons = screen.getAllByRole('button', { name: 'Clear' });
    clearButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
