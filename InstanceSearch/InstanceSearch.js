import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useIntl } from 'react-intl';

import { Icon } from '@folio/stripes/components';
import { useCallout } from '@folio/stripes/core';

import {
  PluginFindRecord,
  PluginFindRecordModal,
} from '../PluginFindRecord';

import FindInstanceContainer from './FindInstanceContainer';

import DataContext from '../Imports/imports/DataContext';
import { getFilterConfig } from '../Imports/imports/filterConfig';
import { useInstancesQuery } from '../hooks';

import {
  CONFIG_TYPES,
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '../Imports/imports/constants';
import { parseHttpError } from '../utils';

const query = {
  query: '',
  sort: 'title',
};

const InstanceSearch = ({
  config,
  selectInstance,
  isMultiSelect,
  renderNewBtn,
  onClose,
  ...rest
}) => {
  const callout = useCallout();
  const intl = useIntl();

  const [segment, setSegment] = useState('instances');
  const [instances, setInstances] = useState([]);
  const {
    indexes,
    renderer,
  } = getFilterConfig(segment);

  const { isLoading, isError, error = {}, data = {} } = useInstancesQuery(instances);

  useEffect(() => {
    sessionStorage.setItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, false);
  }, [segment]);

  useEffect(() => {
    if (!isLoading && !isError && data.instances?.length) {
      const result = isMultiSelect ? data.instances : data.instances[0];
      selectInstance(result);
      setInstances([]);

      if (onClose) {
        onClose();
      }
    }
  }, [isLoading, isError, data, isMultiSelect, selectInstance]);

  useEffect(() => {
    const getError = async () => {
      const response = await error.response;
      const httpError = await parseHttpError(response);
      const message = httpError?.message || intl.formatMessage({ id: 'ui-plugin-find-instance.communicationProblem' });

      callout.sendCallout({
        type: 'error',
        message,
      });
    };

    if (isError) {
      getError().then();
    }
  }, [isError, error]);

  return (
    <PluginFindRecord
      {...rest}
      onClose={onClose}
      selectRecordsCb={list => setInstances(list)}
    >
      {(modalProps) => (
        <DataContext.Consumer>
          {contextData => (
            <FindInstanceContainer segment={segment}>
              {(viewProps) => (
                <PluginFindRecordModal
                  {...viewProps}
                  {...modalProps}
                  config={config}
                  isMultiSelect={isMultiSelect}
                  renderNewBtn={renderNewBtn}
                  renderFilters={renderer({ ...contextData, query })}
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
  config: {},
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
  config: CONFIG_TYPES,
};

export default InstanceSearch;
