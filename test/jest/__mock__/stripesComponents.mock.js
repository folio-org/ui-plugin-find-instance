import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Button: jest.fn(({
    children,
    onClick,
  }) => (
    <button
      data-test-button
      type="button"
      onClick={onClick}
    >
      <span>
        {children}
      </span>
    </button>
  )),
  ButtonGroup: jest.fn(({ children }) => (
    <div data-testid="buttonGroup">
      {children}
    </div>
  )),
  Accordion: jest.fn(({ children, label, name, onClearFilter, displayClearButton }) => (
    <div>
      {label}
      {children}
      <div>
        <button
          type="button"
          disabled={!displayClearButton}
          onClick={() => onClearFilter()}
          data-testid={`clear-${name}`}
        >Clear
        </button>
      </div>
      <div data-testid={`accordion-${name}`} />
    </div>
  )),
  FilterGroups: jest.fn(({
    group,
    index = 0,
    FilterAccordionHeader = 'FilterAccordionHeader',
    filters = {},
    onClearFilter = jest.fn(),
    filterGroupNames = jest.fn(),
    ocf = jest.fn(),
  }) => (
    <div data-test-filter-groups>
      <div
        label={group.label}
        id={`${group.label}-${index}`}
        name={group.name}
        key={`acc-${group.name}-${index}`}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={Object.keys(filters).some(filter => filter.startsWith(group.name))}
        onClearFilter={onClearFilter}
      >
        <div
          key={`${group.label}-${index}`}
          label={group.label}
          groupName={group.name}
          names={filterGroupNames(group)}
          filters={filters}
          onChangeFilter={ocf}
        />
      </div>
    </div>
  )),
  Icon: jest.fn((props) => (props && props.children ? props.children : <span />)),
  Label: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  Modal: jest.fn(({ children, label, dismissible, ...rest }) => {
    return (
      <div
        data-test={dismissible ? '' : ''}
        {...rest}
      >
        <h1>{label}</h1>
        {children}
      </div>
    );
  }),
  MCLRenderer: jest.fn(({ totalCount, loading }) => (
    <div handlers={this.handlers} noWrapper>
      <div ref={this.status} />
      <div
        style={this.getOuterElementStyle()}
        tabIndex="0"
        id={this.props.id}
        ref={this.container}
        role="grid"
        aria-rowcount={this.getAccessibleRowCount()}
        data-total-count={totalCount}
      >
        <div ref={this.headerContainer}>
          <div
            className={this.getHeaderStyle()}
            style={{ display: 'flex' }}
            ref={this.headerRow}
            role="row"
            aria-rowindex="1"
          />
        </div>
        <div
          style={this.getScrollableStyle()}
          onScroll={this.handleScroll}
          ref={this.scrollContainer}
        >
          <div
            role="rowgroup"
            style={this.getRowContainerStyle()}
            ref={this.rowContainer}
          >
            {this.renderedRows || ''}
          </div>
        </div>
        {
          loading &&
          <div>
            <div>
              <span icon="spinner-ellipsis" width="35px" />
            </div>
          </div>
        }
      </div>
    </div>
  )),
  MultiColumnList: jest.fn(({ isEmptyMessage = '', ...rest }) => (
    <div
      {...rest}
      isEmptyMessage={isEmptyMessage}
    />)),
  Pane: jest.fn(({ children, className, defaultWidth, paneTitle, firstMenu, lastMenu, ...rest }) => {
    return (
      <div className={className} {...rest} style={{ width: defaultWidth }}>
        <div>
          {firstMenu ?? null}
          {paneTitle}
          {lastMenu ?? null}
        </div>
        {children}
      </div>
    );
  }),
  languageOptions: jest.fn(() => []),
  PaneMenu: jest.fn(({ children }) => <div>{children}</div>),
  Paneset: jest.fn(({ children }) => <div>{children}</div>),
  SearchField: jest.fn(({
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    onClear,
    loading,
    clearSearchId,
    disabled,
    ...rest
  }) => (
    <div>
      <input
        {...rest}
        aria-label={rest['aria-label'] || ariaLabel}
        clearFieldId={clearSearchId}
        disabled={disabled}
        id={id}
        hasClearIcon={typeof onClear === 'function' && loading !== true}
        loading={loading}
        onChange={onChange}
        onClearField={onClear}
        placeholder={placeholder}
        type="search"
        value={value || ''}
        readOnly={loading || rest.readOnly}
      />
    </div>
  )),
  Loading: jest.fn(({ 'data-testid': dataTestId }) => <div data-testid={dataTestId}>Loading</div>)
}));
