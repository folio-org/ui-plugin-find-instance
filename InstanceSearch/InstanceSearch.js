import React, { useState } from 'react';
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

const query = {
  query: '',
  sort: 'title',
};

const InstanceSearch = ({ selectInstance, isMultiSelect, renderNewBtn, ...rest }) => {
  const intl = useIntl();
  const [segment, setSegment] = useState('instances');
  const {
    indexes,
    renderer,
  } = getFilterConfig(segment);
  const searchIndexes = indexes.map(index => {
    const { prefix = '' } = index;
    const label = `${prefix}${intl.formatMessage({ id: index.label })}`;
    return { ...index, label };
  });

  return (
    <DataProvider>
      <PluginFindRecord
        {...rest}
        selectRecordsCb={(list) => (isMultiSelect ? selectInstance(list) : selectInstance(list[0]))}
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
