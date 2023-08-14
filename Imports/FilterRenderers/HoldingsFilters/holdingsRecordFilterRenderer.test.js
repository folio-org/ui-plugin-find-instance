
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import holdingsRecordFilterRenderer from './holdingsRecordFilterRenderer';

jest.mock('../../imports/HoldingsFilters', () => {
  return jest.fn(({ onChange, onClear }) => (
    <div data-testid="mocked-item-filters">
      Mocked HoldingsRecordFilters Component
      <button type="button" onClick={() => onClear('filterName')} data-testid="clear-button">
        Clear
      </button>
      <button type="button" onClick={() => onChange({ name: 'filterName', values: ['value1', 'value2'] })} data-testid="change-button">
        Change
      </button>
    </div>
  ));
});

const expectedParam = {
  activeFilters: {
    state: {
      filter1: ['value1'],
      filter2: ['value2'],
    },
  },
  getFilterHandlers: expect.any(Function)
};

describe('holdingsRecordFilterRenderer', () => {
  const data = {
    locations: ['location1', 'location2'],
    tags: ['tag1', 'tag2'],
  };

  const onChange = {
    activeFilters: {
      state: {
        filter1: ['value1'],
        filter2: ['value2'],
      },
    },
    getFilterHandlers: jest.fn(() => ({
      state: jest.fn(),
    })),
  };

  it('renders holdingsRecordFilters component with correct props', () => {
    const { getByTestId } = render(holdingsRecordFilterRenderer(data)(onChange));
    const holdingsRecordFiltersComponent = getByTestId('mocked-item-filters');
    expect(holdingsRecordFiltersComponent).toBeInTheDocument();
  });

  it('calls onChangeHandler when clear button is clicked', () => {
    const { getByTestId } = render(holdingsRecordFilterRenderer(data)(onChange));
    const clearButton = getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(onChange).toEqual(expectedParam);
  });

  it('calls onChangeHandler when change button is clicked', () => {
    const { getByTestId } = render(holdingsRecordFilterRenderer(data)(onChange));
    const changeButton = getByTestId('change-button');
    fireEvent.click(changeButton);
    expect(onChange).toEqual(expectedParam);
  });
});
