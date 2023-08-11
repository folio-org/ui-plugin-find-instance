import { useQueries } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (ids = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const res = useQueries(ids.map(id => ({
    queryKey: [namespace, 'instances', id],
    queryFn: () => ky.get(`inventory/instances/${id}`).json(),
  })));

  return res;
};

export default useInstancesQuery;
