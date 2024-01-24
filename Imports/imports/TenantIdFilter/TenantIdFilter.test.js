import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import TenantIdFilter from './TenantIdFilter';
import Harness from '../../../test/jest/helpers/harness';

jest.unmock('@folio/stripes/smart-components');

const consortiaTenants = [
  {
    'id': 'cs00000int_0001',
    'name': 'College',
  },
  {
    'id': 'cs00000int',
    'name': 'Central Office',
  },
  {
    'id': 'cs00000int_0002',
    'name': 'Professional',
  },
];

const defaultProps = {
  activeFilters: [],
  onChange: jest.fn(),
  onClear: jest.fn(),
};

const renderTenantIdFilter = (props = {}, { dataContext } = {}) => render(
  <Harness dataContext={dataContext}>
    <TenantIdFilter
      {...defaultProps}
      {...props}
    />
  </Harness>
);

describe('TenantIdFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not display options', () => {
    renderTenantIdFilter();

    expect(screen.queryByText('Central Office')).not.toBeInTheDocument();
    expect(screen.queryByText('Professional')).not.toBeInTheDocument();
    expect(screen.queryByText('College')).not.toBeInTheDocument();
  });

  it('should display options', () => {
    renderTenantIdFilter({}, {
      dataContext: {
        consortiaTenants,
      },
    });

    expect(screen.getByText('Central Office')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('College')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', async () => {
    renderTenantIdFilter({}, {
      dataContext: {
        consortiaTenants,
      },
    });

    const collegeOption = screen.getByText('College');

    await act(() => user.click(collegeOption));

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      name: 'tenantId',
      values: ['cs00000int_0001'],
    });
  });
});
