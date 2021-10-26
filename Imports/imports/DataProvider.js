import keyBy from 'lodash/keyBy';
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import DataContext from './DataContext';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
}) => {
  const { manifest } = DataProvider;

  const isLoading = useCallback(() => {
    for (const key in manifest) {
      if (manifest[key].type === 'okapi' && !(resources?.[key]?.hasLoaded)) {
        return true;
      }
    }
    return false;
  }, [resources, manifest]);

  const data = useMemo(() => {
    const loadedData = {};

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    const {
      locations,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');

    return loadedData;
  }, [resources, manifest]);

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
