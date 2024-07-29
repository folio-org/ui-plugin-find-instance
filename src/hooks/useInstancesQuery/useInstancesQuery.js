import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (instances = [], options = {}) => {
  const { enabled = true, tenantId, ...otherOptions } = options;
  const [namespace] = useNamespace();
  const ky = useOkapiKy({ tenant: tenantId });

  const instanceIdsQuery = instances
    .map(({ id }) => `id==${id}`)
    .join(' or ');

  const res = useQuery(
    {
      queryKey: [namespace, 'instances', instanceIdsQuery, tenantId],
      queryFn: () => ky.get(`search/instances?query=(${instanceIdsQuery})&expandAll=true`).json(),
      enabled: enabled && Boolean(instanceIdsQuery),
      ...otherOptions,
    },
  );

  return res;
};

export { useInstancesQuery };
