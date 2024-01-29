import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { LocationFilter } from './LocationFilter';

jest.unmock('@folio/stripes/smart-components');

const locations = [
  {
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    name: 'Annex',
  },
  {
    id: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
    name: 'Online',
  },
  {
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    name: 'Annex',
  },
  {
    id: '8e9f7ced-d720-4cd4-b098-0f7c1f7c3ceb',
    name: 'Annex',
  },
];

const mockOnChange = jest.fn();
const mockOnClear = jest.fn();
const name = 'fake-name';
const label = 'fake-label';

const renderLocationFilter = (props = {}) => render(
  <LocationFilter
    id="fake-id"
    name={name}
    label={label}
    closedByDefault={false}
    separator={false}
    isLoadingOptions={false}
    locations={locations}
    selectedValues={[]}
    onChange={mockOnChange}
    onClear={mockOnClear}
    {...props}
  />
);

describe('LocationFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display a label', () => {
    const { getByText } = renderLocationFilter();

    expect(getByText(label)).toBeVisible();
  });

  describe('when options are loading', () => {
    it('should display lading instead of text box', () => {
      const { getByTestId, queryByText } = renderLocationFilter({
        isLoadingOptions: true,
      });

      expect(getByTestId('loading-options')).toBeVisible();
      expect(queryByText('Online')).not.toBeInTheDocument();
    });
  });

  it('should display only options with unique id', () => {
    const { getByText, getAllByText } = renderLocationFilter();

    expect(getByText('Online')).toBeInTheDocument();
    expect(getAllByText('Annex')).toHaveLength(2);
  });

  it('should call "onChange"', async () => {
    const { getByText } = renderLocationFilter();
    const option = getByText('Online');

    await act(() => userEvent.click(option));

    expect(mockOnChange).toHaveBeenCalledWith({
      name,
      values: ['184aae84-a5bf-4c6a-85ba-4a7c73026cd5'],
    });
  });

  it('should call "onClear"', async () => {
    const { getByText } = renderLocationFilter({
      selectedValues: ['184aae84-a5bf-4c6a-85ba-4a7c73026cd5'],
    });

    await act(() => userEvent.click(getByText('Clear')));

    expect(mockOnClear).toHaveBeenCalledWith(name);
  });

  it('should have "label + id" accessible option announcement for duplicates only', async () => {
    const { getByText, getAllByText } = renderLocationFilter();
    const option = getByText('Online');
    const duplicateOption = getAllByText('Annex')[0];

    await act(() => userEvent.click(option));
    await act(() => userEvent.click(duplicateOption));

    expect(getByText('Online added to selection')).toBeInTheDocument();
    expect(getByText('Annex id: 53cf956f-c1df-410b-8bea-27f712cca7c0 added to selection')).toBeInTheDocument();
  });
});
