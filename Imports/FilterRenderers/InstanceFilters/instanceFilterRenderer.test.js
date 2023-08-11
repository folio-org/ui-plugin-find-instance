
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import instanceFilterRenderer from './instanceFilterRenderer';

jest.mock('../../imports/InstanceFilters', () => {
  return jest.fn(({ onChange, onClear }) => (
    <div data-testid="mocked-item-filters">
      Mocked InstanceFilters Component
      <form>
        <button type="button" onClick={() => onClear('filterName')} data-testid="clear-button">
        Clear
        </button>
      </form>
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

describe('instanceFilterRenderer', () => {
  const data = {
    instanceTypes: ['type1', 'type2'],
    locations: ['location1', 'location2'],
    instanceFormats: ['typeFormat1', 'typeFormat2'],
    natureOfContentTerms: ['nc1', 'nc2'],
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

  it('renders InstanceFilters component with correct props', () => {
    const { getByTestId } = render(instanceFilterRenderer(data)(onChange));
    const instanceFiltersComponent = getByTestId('mocked-item-filters');
    expect(instanceFiltersComponent).toBeInTheDocument();
  });

  it('calls onChangeHandler when clear button is clicked', () => {
    const { getByTestId } = render(instanceFilterRenderer(data)(onChange));
    const clearButton = getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(onChange).toEqual(expectedParam);
  });

  it('calls onChangeHandler when change button is clicked', () => {
    const { getByTestId } = render(instanceFilterRenderer(data)(onChange));
    const changeButton = getByTestId('change-button');
    fireEvent.click(changeButton);
    expect(onChange).toEqual(expectedParam);
  });
});
