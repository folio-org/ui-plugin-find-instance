import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { useConsortiaTenants } from './useConsortiaTenants';
import useTenantKy from '../../temp/useTenantKy';
import { LIMIT_MAX } from '../../constants';

jest.mock('../../temp/useTenantKy', () => jest.fn());

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const response = {
  tenants: [{
    id: 'tenant-id',
  }],
};

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue(response),
});

describe('useConsortiaTenants', () => {
  beforeEach(() => {
    useStripes.mockClear();
    useTenantKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  describe('when env is not consortia', () => {
    it('should not fetch tenants', async () => {
      useStripes.mockReturnValue({
        user: {
          user: {},
        },
      });

      const { result } = renderHook(() => useConsortiaTenants(), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('when env is consortia', () => {
    it('should fetch tenants', async () => {
      const consortium = {
        centralTenantId: 'centralTenantId',
        id: 'id',
      };

      useStripes.mockReturnValue({
        user: {
          user: {
            consortium,
          },
        },
      });

      const { result } = renderHook(() => useConsortiaTenants(), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith(
        'consortia/id/tenants',
        {
          searchParams: {
            limit: LIMIT_MAX,
          },
        },
      );

      expect(result.current).toEqual({
        data: response.tenants,
        isLoading: false,
      });
    });
  });
});
