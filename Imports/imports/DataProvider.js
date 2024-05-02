import keyBy from 'lodash/keyBy';
import {
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
  useStripes,
} from '@folio/stripes/core';

import DataContext from './DataContext';
import {
  useConsortiaTenants,
  useLocationsForTenants,
} from '../../hooks';
import { isUserInConsortiumMode } from './utils';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
  mutator,
}) => {
  const stripes = useStripes();
  const { manifest } = DataProvider;

  const {
    data: consortiaTenants,
    isLoading: isLoadingConsortiaTenants,
  } = useConsortiaTenants();

  const tenantIds = consortiaTenants?.map(tenant => tenant.id);

  useEffect(() => {
    if (isUserInConsortiumMode(stripes)) {
      return;
    }

    mutator.locations.GET({ tenant: stripes.okapi.tenant });
  }, [stripes.okapi.tenant]);

  const {
    data: locationsOfAllTenants,
    isLoading: isLoadingLocationsForTenants,
  } = useLocationsForTenants({ tenantIds });

  const isLoading = useMemo(() => {
    // eslint-disable-next-line guard-for-in
    for (const key in manifest) {
      const isResourceLoading = !resources?.[key]?.hasLoaded && !resources?.[key]?.failed && resources?.[key]?.isPending;

      if (isLoadingConsortiaTenants) {
        return true;
      }

      if (manifest[key].type === 'okapi' && isResourceLoading) {
        return true;
      }
    }

    return false;
  }, [resources, manifest, isLoadingConsortiaTenants]);

  const data = useMemo(() => {
    const loadedData = {
      isLoadingLocationsForTenants,
    };

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    if (isUserInConsortiumMode(stripes)) {
      loadedData.locations = locationsOfAllTenants;
      loadedData.consortiaTenants = consortiaTenants;
    }

    const {
      locations,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');

    return loadedData;
  }, [resources, manifest, isLoading, isLoadingLocationsForTenants, consortiaTenants]);

  if (isLoading) {
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
  mutator: PropTypes.object.isRequired,
  children: PropTypes.object,
};

DataProvider.manifest = {
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
    accumulate: true,
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
