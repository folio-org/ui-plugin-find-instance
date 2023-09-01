import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import SharedFilter from './SharedFilter';
import Harness from '../../../test/jest/helpers/harness';

jest.unmock('@folio/stripes/smart-components');
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({
    data: {
      facets: {
        shared: {
          values: [{
            id: 'true',
          }, {
            id: 'false',
          }]
        },
      },
    },
  }),
}));

const defaultProps = {
  activeFilters: [],
  onChange: jest.fn(),
  onClear: jest.fn(),
};

const renderSharedFilter = (props = {}) => render(
  <Harness>
    <SharedFilter
      {...defaultProps}
      {...props}
    />
  </Harness>
);

describe('SharedFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderSharedFilter();
  });

  it('should render filter with specified options', () => {
    expect(screen.getByText('ui-inventory.yes')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.no')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', async () => {
    const yesOption = screen.getByText('ui-inventory.yes');

    await act(() => user.click(yesOption));

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      name: 'shared',
      values: ['true'],
    });
  });
});
