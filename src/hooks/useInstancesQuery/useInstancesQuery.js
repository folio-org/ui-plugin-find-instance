import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (instances = [], options = {}) => {
  const {
    enabled = true,
    tenantId,
    include = [],
    ...otherOptions
  } = options;
  const [namespace] = useNamespace();
  const ky = useOkapiKy({ tenant: tenantId });

  const instanceIdsQuery = instances
    .map(({ id }) => `id==${id}`)
    .join(' or ');

  const includeProperties = ['identifiers.value', 'identifiers.identifierTypeId', ...include];
  const res = useQuery(
    {
      queryKey: [namespace, 'instances', instanceIdsQuery, tenantId],
      queryFn: () => ky.get(`search/instances?query=(${instanceIdsQuery})&include=${includeProperties.join(',')}`).json(),
      enabled: enabled && Boolean(instanceIdsQuery),
      ...otherOptions,
    },
  );

  return res;
};

export { useInstancesQuery };
