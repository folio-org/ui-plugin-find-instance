import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Icon } from '@folio/stripes/components';
import { useCallout } from '@folio/stripes/core';
import {
  filterConfig,
  HoldingsRecordFilters,
  InstanceFilters,
  ItemFilters,
  segments,
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '@folio/stripes-inventory-components';

import { DataContext } from './contexts';
import {
  FindInstanceContainer,
  PluginFindRecord,
  PluginFindRecordModal,
} from './components';
import { CONFIG_TYPES } from './constants';
import { useInstancesQuery } from './hooks';
import { parseHttpError } from './utils';

const filterComponents = {
  [segments.instances]: InstanceFilters,
  [segments.holdings]: HoldingsRecordFilters,
  [segments.items]: ItemFilters,
};

const FindInstance = ({
  config,
  selectInstance,
  isMultiSelect,
  renderNewBtn,
  onClose,
  ...rest
}) => {
  const callout = useCallout();
  const intl = useIntl();

  const [segment, setSegment] = useState(segments.instances);
  const [instances, setInstances] = useState([]);

  const { indexes } = filterConfig[segment];

  const { isLoading, isError, error = {}, data: instancesData = {} } = useInstancesQuery(instances);

  /* eslint-disable react/prop-types */
  const renderFilters = useCallback(({ data, query }) => ({ activeFilters, getFilterHandlers }) => {
    const FiltersComponent = filterComponents[segment];

    const handleChange = ({ name, values }) => {
      getFilterHandlers().state({ [name]: values });
    };

    return (
      <FiltersComponent
        activeFilters={activeFilters.state}
        data={data}
        query={query}
        onChange={handleChange}
      />
    );
  }, [segment]);

  useEffect(() => {
    sessionStorage.setItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, false);
  }, [segment]);

  useEffect(() => {
    if (!isLoading && !isError && instancesData.instances?.length) {
      const result = isMultiSelect ? instancesData.instances : instancesData.instances[0];
      selectInstance(result);
      setInstances([]);

      if (onClose) {
        onClose();
      }
    }
  }, [isLoading, isError, instancesData, isMultiSelect, selectInstance]);

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
                  renderFilters={renderFilters({
                    data: contextData,
                    query: {
                      segment,
                      ...viewProps.queryGetter(),
                    },
                  })}
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

FindInstance.defaultProps = {
  searchButtonStyle: 'primary noRightRadius',
  searchLabel: <Icon icon="search" color="#fff" />,
  selectInstance: noop,
  renderNewBtn: noop,
  isMultiSelect: false,
  config: {},
};

FindInstance.propTypes = {
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

export default FindInstance;
