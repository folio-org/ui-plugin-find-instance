import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import useTenantKy from '../../temp/useTenantKy';
import { LIMIT_MAX } from '../../constants';

export const useConsortiaTenants = () => {
  const stripes = useStripes();
  const namespace = useNamespace();

  const { centralTenantId, id: consortiumId } = stripes.user.user.consortium || {};

  const ky = useTenantKy({ tenantId: centralTenantId });

  const { data, isFetching } = useQuery(
    [namespace, consortiumId],
    () => ky.get(`consortia/${consortiumId}/tenants`, {
      searchParams: {
        limit: LIMIT_MAX,
      },
    }).json(),
    {
      enabled: Boolean(consortiumId),
    },
  );

  return {
    data: data?.tenants,
    isLoading: isFetching,
  };
};
