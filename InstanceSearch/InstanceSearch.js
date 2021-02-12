import React from 'react';
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

const InstanceSearch = ({ selectInstance, isMultiSelect, renderNewBtn, ...rest }) => (
  <DataProvider>
    <PluginFindRecord
      {...rest}
      selectRecordsCb={(list) => (isMultiSelect ? selectInstance(list) : selectInstance(list[0]))}
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
                />
              )}
            </FindInstanceContainer>
          )}
        </DataContext.Consumer>
      )}
    </PluginFindRecord>
  </DataProvider>
);

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
