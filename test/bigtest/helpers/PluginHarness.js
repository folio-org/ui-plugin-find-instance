import React from 'react';
import noop from 'lodash/noop';
import sinon from 'sinon';

import { Pluggable } from '@folio/stripes/core';

export const onCloseSpy = sinon.spy();

function PluginHarness(props) {
  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="instances"
      id="clickable-find-instance"
      marginTop0
      searchButtonStyle="link"
      searchLabel="Look up instance"
      selectInstance={noop}
      type="find-instance"
      onClose={onCloseSpy}
      disabled={false}
      {...props}
    >
      <span data-test-no-plugin-available>No plugin available!</span>
    </Pluggable>
  );
}

export default PluginHarness;
