import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import itemFilterRenderer from './itemFilterRenderer';

jest.mock('../../imports/ItemFilters', () => {
  return jest.fn(({ onChange, onClear }) => (
    <div data-testid="mocked-item-filters">
      <button type="button" onClick={() => onClear('filterName')} data-testid="clear-button">
        Clear
      </button>
      <button type="button" onClick={() => onChange({ name: 'filterName', values: ['value1', 'value2'] })} data-testid="change-button">
        Change
      </button>
    </div>
  ));
});

jest.mock('../../imports/constants', () => {
  return {
    itemStatuses: ['status1', 'status2'],
  };
});

describe('itemFilterRenderer', () => {
  const data = {
    materialTypes: ['type1', 'type2'],
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

  it('renders ItemFilters component with correct props', () => {
    const { getByTestId } = render(itemFilterRenderer(data)(onChange));
    const itemFiltersComponent = getByTestId('mocked-item-filters');
    expect(itemFiltersComponent).toBeInTheDocument();
  });

  it('calls onChangeHandler when clear button is clicked', () => {
    const { getByTestId } = render(itemFilterRenderer(data)(onChange));
    const clearButton = getByTestId('clear-button');
    userEvent.click(clearButton);
    expect(onChange).toEqual({
      activeFilters: {
        state: {
          filter1: ['value1'],
          filter2: ['value2'],
        },
      },
      getFilterHandlers: expect.any(Function),
    });
  });

  it('calls onChangeHandler when change button is clicked', () => {
    const { getByTestId } = render(itemFilterRenderer(data)(onChange));
    const changeButton = getByTestId('change-button');
    userEvent.click(changeButton);
    expect(onChange).toEqual({
      activeFilters: {
        state: {
          filter1: ['value1'],
          filter2: ['value2'],
        },
      },
      getFilterHandlers: expect.any(Function),
    });
  });
});
