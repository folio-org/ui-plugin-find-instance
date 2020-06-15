import React from 'react';
import noop from 'lodash/noop';

import { Pluggable } from '@folio/stripes/core';

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
    withTrigger={false}
    onClosePluggin={() => {}}
    {...props}
  >
    <span data-test-no-plugin-available>No plugin available!</span>
  </Pluggable>
);

export default PluginHarnessMultiselect;
