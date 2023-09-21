import { useQueries } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../constants';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (instances = []) => {
  const { tenant } = useStripes().okapi;
  const [namespace] = useNamespace();
  const ky = useOkapiKy();

  const res = useQueries(instances.map(({ id, tenantId }) => ({
    queryKey: [namespace, 'instances', id],
    queryFn: () => {
      return ky.get(`inventory/instances/${id}`, {
        hooks: {
          beforeRequest: [
            request => {
              request.headers.set(OKAPI_TENANT_HEADER, tenantId || tenant);
            },
          ],
        }
      }).json();
    },
  })));

  return res;
};

export default useInstancesQuery;
