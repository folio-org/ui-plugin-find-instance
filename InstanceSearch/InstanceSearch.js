import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Icon } from '@folio/stripes/components';
import {
  PluginFindRecord,
  PluginFindRecordModal,
} from '../PluginFindRecord';

import FindInstanceContainer from './FindInstanceContainer';

import DataProvider from '../Imports/imports/DataProvider';
import DataContext from '../Imports/imports/DataContext';
import { getFilterConfig } from '../Imports/imports/filterConfig';
import useInstancesQuery from '../hooks/useInstancesQuery';

const query = {
  query: '',
  sort: 'title',
};

const InstanceSearch = ({ selectInstance, isMultiSelect, renderNewBtn, ...rest }) => {
  const intl = useIntl();
  const [segment, setSegment] = useState('instances');
  const [instances, setInstances] = useState([]);
  const {
    indexes,
    renderer,
  } = getFilterConfig(segment);
  const searchIndexes = indexes.map(index => {
    const { prefix = '' } = index;
    const label = `${prefix}${intl.formatMessage({ id: index.label })}`;
    return { ...index, label };
  });

  const instantceIds = instances.filter(inst => inst).map(inst => inst.id);
  const results = useInstancesQuery(instantceIds);
  const isLoading = results.some(result => result.isLoading);

  useEffect(() => {
    if (!isLoading && results.length) {
      const result = isMultiSelect ? results.map(r => r.data) : results?.[0]?.data;
      selectInstance(result);
      setInstances([]);
    }
  }, [isLoading, results, isMultiSelect, selectInstance]);

  return (
    <DataProvider>
      <PluginFindRecord
        {...rest}
        selectRecordsCb={list => setInstances(list)}
      >
        {(modalProps) => (
          <DataContext.Consumer>
            {data => (
              <FindInstanceContainer searchIndexes={searchIndexes} segment={segment}>
                {(viewProps) => (
                  <PluginFindRecordModal
                    {...viewProps}
                    {...modalProps}
                    isMultiSelect={isMultiSelect}
                    renderNewBtn={renderNewBtn}
                    renderFilters={renderer({
                      ...data,
                      query,
                      onFetchFacets: viewProps.fetchFacets(data),
                      parentResources: viewProps.resources,
                    })}
                    setSegment={setSegment}
                  />
                )}
              </FindInstanceContainer>
            )}
          </DataContext.Consumer>
        )}
      </PluginFindRecord>
    </DataProvider>
  );
};

InstanceSearch.defaultProps = {
  searchButtonStyle: 'primary noRightRadius',
  searchLabel: <Icon icon="search" color="#fff" />,
  selectInstance: noop,
  renderNewBtn: noop,
  isMultiSelect: false,
};

InstanceSearch.propTypes = {
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  selectInstance: PropTypes.func,
  renderNewBtn: PropTypes.func,
  isMultiSelect: PropTypes.bool,
};

export default InstanceSearch;
