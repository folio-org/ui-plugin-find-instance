import React from 'react';
import '../../../test/jest/__mock__';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemFilters from './ItemFilters';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));
const activeFilters = {
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
      name: 'location1',
      id: 'locationid1'
    }
  ],
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
const intl = { formatMessage: jest.fn() };
const renderItemFilters = () => render(
  <ItemFilters
    activeFilters={activeFilters}
    data={data}
    onChange={onChange}
    onClear={mockClear}
    intl={intl}
  />
);
describe('ItemFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderItemFilters();
  });

  it('Should Clear selected filters for effective Location', () => {
    const clearEffectiveLocation = document.querySelector('[data-testid="clear-effectiveLocation"]');
    userEvent.click(clearEffectiveLocation);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for materialType', () => {
    const clearMaterialType = document.querySelector('[data-testid="clear-materialTypeAccordion"]');
    userEvent.click(clearMaterialType);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for itemStatus', () => {
    const clearitemStatus = document.querySelector('[data-testid="clear-itemFilterAccordion"]');
    userEvent.click(clearitemStatus);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for holdingsPermanentLocation', () => {
    const clearholdingsPermanentLocation = document.querySelector('[data-testid="clear-holdingsPermanentLocationAccordion"]');
    userEvent.click(clearholdingsPermanentLocation);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for discoverySuppress', () => {
    const cleardiscoverySuppress = document.querySelector('[data-testid="clear-discoverySuppress"]');
    userEvent.click(cleardiscoverySuppress);
    expect(mockClear).toBeCalled();
  });
});
describe('ItemFilters with empty filters', () => {
  const emptyActiveFilters = {};
  beforeEach(() => {
    render(
      <ItemFilters
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
