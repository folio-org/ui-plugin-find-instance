import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import TenantIdFilter from './TenantIdFilter';
import Harness from '../../../test/jest/helpers/harness';

jest.unmock('@folio/stripes/smart-components');
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({
    data: {
      tenants: [
        { id: 'consortium', name: 'Consortium' },
        { id: 'university', name: 'University' },
        { id: 'college', name: 'College' },
      ],
    },
  }),
}));

const defaultProps = {
  activeFilters: [],
  onChange: jest.fn(),
  onClear: jest.fn(),
};

const renderTenantIdFilter = (props = {}) => render(
  <Harness>
    <TenantIdFilter
      {...defaultProps}
      {...props}
    />
  </Harness>
);

describe('TenantIdFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderTenantIdFilter();
  });

  it('should render filter with specified options', () => {
    expect(screen.getByText('Consortium')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
    expect(screen.getByText('College')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', async () => {
    const collegeOption = screen.getByText('College');

    await act(() => user.click(collegeOption));

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      name: 'tenantId',
      values: ['college'],
    });
  });
});
