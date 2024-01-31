import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { LocationFilter } from './LocationFilter';

import { isUserInConsortiumMode } from '../utils';

jest.unmock('@folio/stripes/smart-components');

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  isUserInConsortiumMode: jest.fn(),
}));

const locations = [
  {
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    name: 'Annex',
  },
  {
    id: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
    name: 'Online',
  },
];

const locationsWithDuplicates = [
  {
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    name: 'Annex',
    _tenantId: 'cs00000int_0001',
  },
  {
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    name: 'Annex',
    _tenantId: 'cs00000int',
  },
  {
    id: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
    name: 'Online',
    _tenantId: 'cs00000int_0003',
  },
  {
    id: '8e9f7ced-d720-4cd4-b098-0f7c1f7c3ceb',
    name: 'Annex',
    _tenantId: 'cs00000int_0005',
  },
];

const consortiaTenants = [
  {
    id: 'cs00000int_0001',
    name: 'College',
  },
  {
    id: 'cs00000int',
    name: 'Central Office',
  },
  {
    id: 'cs00000int_0003',
    name: 'School',
  },
  {
    id: 'cs00000int_0005',
    name: 'University',
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
    consortiaTenants={undefined}
    selectedValues={[]}
    onChange={mockOnChange}
    onClear={mockOnClear}
    {...props}
  />
);

describe('LocationFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isUserInConsortiumMode.mockReturnValue(false);
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

  describe('when the mode is consortium', () => {
    beforeEach(() => {
      isUserInConsortiumMode.mockReturnValue(true);
    });

    describe('and locations with duplicates', () => {
      it('should remove locations with the same id and append tenant name to the label of duplicates', async () => {
        const { getByText, getAllByText } = renderLocationFilter({
          locations: locationsWithDuplicates,
          consortiaTenants,
        });

        expect(getAllByText(/^Annex/)).toHaveLength(2);
        expect(getByText('Annex (College)')).toBeInTheDocument();
        expect(getByText('Annex (University)')).toBeInTheDocument();
        expect(getByText('Online')).toBeInTheDocument();
      });
    });
  });

  it('should display options', () => {
    const { getByText } = renderLocationFilter();

    expect(getByText('Online')).toBeInTheDocument();
    expect(getByText('Annex')).toBeInTheDocument();
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
