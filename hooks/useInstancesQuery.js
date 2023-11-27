import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (instances = []) => {
  const [namespace] = useNamespace();
  const ky = useOkapiKy();

  const instanceIdsQuery = instances
    .map(({ id }) => `id==${id}`)
    .join(' or ');

  const res = useQuery(
    {
      queryKey: [namespace, 'instances', instanceIdsQuery],
      queryFn: () => ky.get(`search/instances?query=(${instanceIdsQuery})&expandAll=true`).json(),
      enabled: Boolean(instanceIdsQuery),
    },
  );

  return res;
};

export default useInstancesQuery;
