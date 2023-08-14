import { QueryClient, QueryClientProvider } from 'react-query';

import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import InstanceSearch from './InstanceSearch';

jest.mock('../hooks/useInstancesQuery', () => {
  return jest.fn().mockReturnValue([{
    isLoading: true,
    data: null,
  }]).mockReturnValue([{
    isLoading: false,
    data: { id: 'instance-1' },
  }]);
});

const queryClient = new QueryClient();

const defaultProps = {
  searchLabel: 'Search',
  searchButtonStyle: 'style',
  marginBottom0: true,
  marginTop0: true,
  selectInstance: jest.fn(),
  renderNewBtn: jest.fn(),
  isMultiSelect: true,
  onClose: jest.fn(),
  config:{},
};

describe('InstanceSearch', () => {
  test('should render InstanceSearch with no props', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <InstanceSearch />
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });
  test('should render InstanceSearch with default props', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InstanceSearch {...defaultProps} />
      </QueryClientProvider>
    );
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
