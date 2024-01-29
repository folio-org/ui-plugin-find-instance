import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { LocationFilter } from './LocationFilter';

jest.unmock('@folio/stripes/smart-components');

const dataOptions = [
  {
    value: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
    label: 'Online',
  },
  {
    value: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    label: 'Annex (College)',
  },
  {
    value: '8e9f7ced-d720-4cd4-b098-0f7c1f7c3ceb',
    label: 'Annex (University)',
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
    dataOptions={dataOptions}
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

  it('should display options', () => {
    const { getByText } = renderLocationFilter();

    expect(getByText('Online')).toBeInTheDocument();
    expect(getByText('Annex (College)')).toBeInTheDocument();
    expect(getByText('Annex (University)')).toBeInTheDocument();
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
});
