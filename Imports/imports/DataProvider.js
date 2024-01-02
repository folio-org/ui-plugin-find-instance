import keyBy from 'lodash/keyBy';
import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
  useStripes,
} from '@folio/stripes/core';

import DataContext from './DataContext';
import { useLocationsForTenants } from '../../hooks';
import { isUserInConsortiumMode } from './utils';
import { OKAPI_TENANT_HEADER } from '../../constants';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
  mutator,
}) => {
  const stripes = useStripes();
  const { manifest } = DataProvider;

  const { consortium } = stripes.user.user;

  useEffect(() => {
    if (!consortium) {
      return;
    }

    mutator.consortiaTenants.GET({
      path: `consortia/${consortium?.id}/tenants?limit=1000`,
      headers: {
        [OKAPI_TENANT_HEADER]: consortium?.centralTenantId,
      },
    });
  }, [consortium?.id]);

  const tenantIds = resources.consortiaTenants.records.map(tenant => tenant.id);

  const {
    data: locationsOfAllTenants,
    isLoading: isLoadingLocationsForTenants,
  } = useLocationsForTenants({ tenantIds });

  const isLoading = useCallback(() => {
    for (const key in manifest) {
      if (manifest[key].type === 'okapi' && !(resources?.[key]?.hasLoaded)) {
        return true;
      }
    }

    if (isLoadingLocationsForTenants) {
      return true;
    }

    return false;
  }, [resources, manifest, isLoadingLocationsForTenants]);

  const data = useMemo(() => {
    const loadedData = {};

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    if (isUserInConsortiumMode(stripes)) {
      loadedData.locations = locationsOfAllTenants;
    }

    const {
      locations,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');

    return loadedData;
  }, [resources, manifest, isLoading()]);

  if (isLoading()) {
    return null;
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  resources: PropTypes.object.isRequired,
  children: PropTypes.object,
  mutator: PropTypes.object.isRequired,
};

DataProvider.manifest = {
  consortiaTenants: {
    type: 'okapi',
    records: 'tenants',
    accumulate: true,
    throwErrors: false,
  },
  instanceFormats: {
    type: 'okapi',
    records: 'instanceFormats',
    path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
  },
  instanceTypes: {
    type: 'okapi',
    records: 'instanceTypes',
    path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  locations: {
    type: 'okapi',
    records: 'locations',
    path: 'locations',
    params: {
      limit: (q, p, r, l, props) => props?.stripes?.config?.maxUnpagedResourceCount || 1000,
      query: 'cql.allRecords=1 sortby name',
    },
  },
  modesOfIssuance: {
    type: 'okapi',
    records: 'issuanceModes',
    path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
  },
  natureOfContentTerms: {
    type: 'okapi',
    path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'natureOfContentTerms',
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'mtypes',
  },
  tags: {
    path: 'tags?limit=10000',  // the same as Tags component in stripes-smart-components
    records: 'tags',
    throwErrors: false,
    type: 'okapi',
  },
};

export default stripesConnect(DataProvider);
