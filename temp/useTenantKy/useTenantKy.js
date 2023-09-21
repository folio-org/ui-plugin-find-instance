import { useOkapiKy } from '@folio/stripes/core';

const useTenantKy = ({ tenantId } = {}) => {
  const ky = useOkapiKy();

  return tenantId
    ? ky.extend({
      hooks: {
        beforeRequest: [
          request => {
            request.headers.set('X-Okapi-Tenant', tenantId);
          },
        ],
      },
    })
    : ky;
};

export default useTenantKy;
