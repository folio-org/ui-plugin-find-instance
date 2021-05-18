import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  Button: jest.fn(({ children }) => (
    <button data-test-button type="button">
      <span>
        {children}
      </span>
    </button>
  )),
  Icon: jest.fn((props) => (props && props.children ? props.children : <span />)),
}));
