import React from 'react';
import noop from 'lodash/noop';
import sinon from 'sinon';

import { Pluggable } from '@folio/stripes/core';

export const onCloseSpy = sinon.spy();

const PluginHarnessMultiselect = (props) => (
  <Pluggable
    aria-haspopup="true"
    dataKey="instances"
    id="clickable-find-instance"
    marginTop0
    searchButtonStyle="link"
    searchLabel="Look up instance"
    selectInstance={noop}
    type="find-instance"
    isMultiSelect
    onClose={onCloseSpy}
    {...props}
  >
    <span data-test-no-plugin-available>No plugin available!</span>
  </Pluggable>
);

export default PluginHarnessMultiselect;
