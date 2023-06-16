import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  makeQueryFunction: jest.fn(() => jest.fn()),
  SearchAndSortQuery: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  SearchAndSortNoResultsMessage: jest.fn(({
    label,
    filterPaneIsVisible = true,
    toggleFilterPane = jest.fn(),
    ...rest
  }) => (
    <div {...rest}>
      <div>
        <span>{label}</span>
      </div>
      {!filterPaneIsVisible &&
        <button
          type="submit"
          onClick={toggleFilterPane}
        >
          Show filters
        </button>
      }
    </div>
  )),
  SearchAndSortSearchButton: jest.fn(({
    label,
    id,
    onClick = jest.fn(),
    disabled,
    ...restProps
  }) => (
    <div>
      <button
        type="button"
        buttonStyle="none"
        id={id}
        onClick={onClick}
        disabled={disabled}
        {...restProps}
      >
        <span size="small" icon="times-circle-solid">
          {label}
        </span>
      </button>
    </div>
  )),
  StripesConnectedSource: jest.fn()
}), { virtual: true });
