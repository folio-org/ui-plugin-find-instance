import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Icon } from '@folio/stripes/components';
import {
  useCallout,
  useStripes,
} from '@folio/stripes/core';
import {
  filterConfig,
  queryIndexes,
  renderFilters,
  ResetProvider,
  segments,
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

const FindInstance = ({
  config = {},
  isMultiSelect = false,
  onClose,
  selectInstance = noop,
  renderNewBtn = noop,
  tenantId,
  suppressSharedFacet = false,
  searchButtonStyle = 'primary noRightRadius',
  searchLabel = <Icon icon="search" color="#fff" />,
  ...rest
}) => {
  const stripes = useStripes();
  const currentTenantId = tenantId || stripes.okapi?.tenant;
  const callout = useCallout();
  const intl = useIntl();

  const [segment, setSegment] = useState(segments.instances);
  const [instances, setInstances] = useState([]);

  const { indexes } = filterConfig[segment];
  const searchIndexes = indexes.filter(queryIndex => queryIndex.value !== queryIndexes.ADVANCED_SEARCH);

  const {
    isLoading,
    isError,
    error = {},
    data: instancesData = {},
  } = useInstancesQuery(instances, { tenantId });

  const handleFilterChange = useCallback((onChange) => ({ name, values }) => {
    onChange({ [name]: values });
  }, []);

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
    <ResetProvider>
      <PluginFindRecord
        {...rest}
        searchButtonStyle={searchButtonStyle}
        searchLabel={searchLabel}
        onClose={onClose}
        tenantId={tenantId}
        selectRecordsCb={list => setInstances(list)}
      >
        {(modalProps) => (
          <DataContext.Consumer>
            {contextData => (
              <FindInstanceContainer
                segment={segment}
                tenantId={currentTenantId}
                contextData={contextData}
                isSharedDefaultFilter={suppressSharedFacet}
              >
                {(viewProps) => (
                  <PluginFindRecordModal
                    {...viewProps}
                    {...modalProps}
                    config={config}
                    contextData={contextData}
                    isMultiSelect={isMultiSelect}
                    renderNewBtn={renderNewBtn}
                    renderFilters={renderFilters({
                      data: contextData,
                      query: viewProps.queryGetter(),
                      segment,
                      tenantId,
                      onFilterChange: handleFilterChange,
                      suppressSharedFacet,
                    })}
                    segment={segment}
                    setSegment={setSegment}
                    searchIndexes={searchIndexes}
                    isSharedDefaultFilter={suppressSharedFacet}
                  />
                )}
              </FindInstanceContainer>
            )}
          </DataContext.Consumer>
        )}
      </PluginFindRecord>
    </ResetProvider>
  );
};

FindInstance.propTypes = {
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  selectInstance: PropTypes.func,
  renderNewBtn: PropTypes.func,
  tenantId: PropTypes.string,
  isMultiSelect: PropTypes.bool,
  onClose: PropTypes.func,
  config: CONFIG_TYPES,
  suppressSharedFacet: PropTypes.bool,
};

export default FindInstance;
