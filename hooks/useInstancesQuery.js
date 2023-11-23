import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (instances = []) => {
  const [namespace] = useNamespace();
  const ky = useOkapiKy();

  const instanceIds = instances
    .map(({ id }) => `id==${id}`)
    .join(' or ');

  const res = useQuery(
    {
      queryKey: [namespace, 'instances', instanceIds],
      queryFn: () => ky.get(`search/instances?query=(${instanceIds})&expandAll=true`).json(),
      enabled: Boolean(instanceIds),
    },
  );

  return res;
};

export default useInstancesQuery;
