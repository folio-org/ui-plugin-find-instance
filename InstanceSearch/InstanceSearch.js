import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Icon } from '@folio/stripes/components';
import {
  PluginFindRecord,
  PluginFindRecordModal,
} from '../PluginFindRecord';

import FindInstanceContainer from './FindInstanceContainer';

import DataContext from '../Imports/imports/DataContext';
import { getFilterConfig } from '../Imports/imports/filterConfig';
import useInstancesQuery from '../hooks/useInstancesQuery';

const query = {
  query: '',
  sort: 'title',
};

const InstanceSearch = ({ selectInstance, isMultiSelect, renderNewBtn, onClose, ...rest }) => {
  const [segment, setSegment] = useState('instances');
  const [instances, setInstances] = useState([]);
  const {
    indexes,
    renderer,
  } = getFilterConfig(segment);

  const instantceIds = instances.filter(inst => inst).map(inst => inst.id);
  const results = useInstancesQuery(instantceIds);
  const isLoading = results.some(result => result.isLoading);

  useEffect(() => {
    if (!isLoading && results.length) {
      const result = isMultiSelect ? results.map(r => r.data) : results?.[0]?.data;
      selectInstance(result);
      setInstances([]);

      if (onClose) {
        onClose();
      }
    }
  }, [isLoading, results, isMultiSelect, selectInstance]);

  return (
    <PluginFindRecord
      {...rest}
      onClose={onClose}
      selectRecordsCb={list => setInstances(list)}
    >
      {(modalProps) => (
        <DataContext.Consumer>
          {data => (
            <FindInstanceContainer>
              {(viewProps) => (
                <PluginFindRecordModal
                  {...viewProps}
                  {...modalProps}
                  isMultiSelect={isMultiSelect}
                  renderNewBtn={renderNewBtn}
                  renderFilters={renderer({ ...data, query })}
                  segment={segment}
                  setSegment={setSegment}
                  searchIndexes={indexes}
                />
              )}
            </FindInstanceContainer>
          )}
        </DataContext.Consumer>
      )}
    </PluginFindRecord>
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
  onClose: PropTypes.func,
};

export default InstanceSearch;
