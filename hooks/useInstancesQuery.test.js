import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';


import { instances } from '../test/jest/fixtures/instances';
import useInstancesQuery from './useInstancesQuery';


const instance = instances[0];
const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstancesQuery', () => {
  let mock;
  beforeEach(() => {
    mock = useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn().mockResolvedValue({ instances: [instance] }),
      }),
    });
  });

  afterEach(() => {
    mock.mockRestore();
  });

  it('fetches instances', async () => {
    const { result } = renderHook(() => useInstancesQuery([instance]), { wrapper });
    await waitFor(() => expect(result.current[0].data.instances[0].id).toEqual(instance.id));
  });
});
