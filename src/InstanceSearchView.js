// This view component contains purely presentational code, apart from InstanceSearchContainer that contains the data-layer access.

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  noop,
  pickBy,
} from 'lodash';

import { FormattedMessage } from 'react-intl';
import { IntlConsumer, AppIcon } from '@folio/stripes/core';
import {
  MultiColumnList,
  SearchField,
  Paneset,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Checkbox,
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { filterConfig } from './filterConfig';

import Filters from './Filters';
import css from './InstanceSearch.css';

const reduceInstancesToMap = (instances, isChecked = false) => {
  const instancesReducer = (accumulator, instance) => {
    accumulator[instance.id] = isChecked ? instance : null;

    return accumulator;
  };

  return instances.reduce(instancesReducer, {});
};

class InstanceSearchView extends React.Component {
  static propTypes = {
    contentRef: PropTypes.object,
    idPrefix: PropTypes.string,
    isMultiSelect: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onSaveMultiple: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    initialSearch: PropTypes.string,
    source: PropTypes.object,
    data: PropTypes.object,
    onNeedMoreData: PropTypes.func,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    idPrefix: 'uiPluginFindInstance-',
    visibleColumns: ['title', 'contributors', 'publisher', 'relation'],
    data: {},
    isMultiSelect: false,
  };

  state = {
    filterPaneIsVisible: true,
    checkedMap: {},
    isAllChecked: false,
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  contributorsFormatter = (r, contributorTypes) => {
    let formatted = '';
    if (r.contributors && r.contributors.length) {
      for (let i = 0; i < r.contributors.length; i += 1) {
        const contributor = r.contributors[i];
        const type = contributorTypes.find(ct => ct.id === contributor.contributorNameTypeId);
        formatted += (i > 0 ? ' ; ' : '') +
                     contributor.name +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  }

  renderResultsFirstMenu(filters) {
    const { filterPaneIsVisible } = this.state;

    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible
      ? 'stripes-smart-components.hideSearchPane'
      : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage
          id="stripes-smart-components.numberOfFilters"
          values={{ count: filterCount }}
        >
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage} \n\n${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  saveMultiple = () => {
    const instancesList = Object.values(pickBy(this.state.checkedMap));

    this.props.onSaveMultiple(instancesList);
  };

  toggleAll = () => {
    this.setState((state, props) => {
      const isAllChecked = !state.isAllChecked;
      const { data: { instances } } = props;
      const checkedMap = reduceInstancesToMap(instances, isAllChecked);

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  toggleItem = instance => {
    const { id } = instance;

    this.setState(({ checkedMap }) => {
      const newInstance = checkedMap[id] ? null : instance;

      return {
        checkedMap: {
          ...checkedMap,
          [id]: newInstance,
        },
        isAllChecked: false,
      };
    });
  }

  render() {
    const {
      onSelectRow,
      onComponentWillUnmount,
      idPrefix,
      onNeedMoreData,
      visibleColumns,
      queryGetter,
      querySetter,
      initialSearch,
      source,
      data,
      contentRef,
      isMultiSelect,
    } = this.props;
    const { checkedMap, isAllChecked } = this.state;

    const { instances } = data;
    const checkedInstancesLength = Object.keys(checkedMap).length;
    const builtVisibleColumns = isMultiSelect ? ['isChecked', ...visibleColumns] : visibleColumns;

    const query = queryGetter ? queryGetter() || {} : {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';
    const resultsStatusMessage = source ? (
      <div data-test-find-instance-no-results-message>
        <NoResultsMessage
          data-test-find-instance-no-results-message
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>) : <FormattedMessage id="stripes-smart-components.sas.noResults.loading" />;

    const resultsHeader = 'XXX Instance Search Results';
    let resultPaneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;
    if (source && source.loaded()) {
      resultPaneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    const resultsFormatter = {
      isChecked: instance => (
        <Checkbox
          type="checkbox"
          checked={Boolean(checkedMap[instance.id])}
          onChange={() => this.toggleItem(instance)}
        />
      ),
      title: instance => (
        <AppIcon
          app="inventory"
          size="small"
        >
          {instance.title}
        </AppIcon>
      ),
      publishers: r => r.publication.map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
      contributors: r => this.contributorsFormatter(r, data.contributorTypes),
    };

    return (
      <Fragment>
        <div
          data-test-find-instance
          ref={contentRef}
          className={isMultiSelect ? css.InstanceSearchViewContent : ''}
        >
          <SearchAndSortQuery
            querySetter={querySetter}
            queryGetter={queryGetter}
            onComponentWillUnmount={onComponentWillUnmount}
            initialSearch={initialSearch}
            initialSearchState={{ qindex: '', query: '' }}
            syncToLocationSearch={false}
          >
            {
              ({
                searchValue,
                getSearchHandlers,
                onSubmitSearch,
                onSort,
                getFilterHandlers,
                activeFilters,
                filterChanged,
                searchChanged,
                resetAll,
              }) => {
                const disableReset = () => {
                  if (filterChanged || searchChanged) {
                    return false;
                  }
                  return true;
                };

                return (
                  <IntlConsumer>
                    {intl => (
                      <Paneset id={`${idPrefix}-paneset`}>
                        {this.state.filterPaneIsVisible &&
                          <Pane defaultWidth="22%" paneTitle="XXX instance search">
                            <form onSubmit={onSubmitSearch}>
                              <div className={css.searchGroupWrap}>
                                <SearchField
                                  aria-label="XXX instance search"
                                  name="query"
                                  className={css.searchField}
                                  onChange={getSearchHandlers().query}
                                  value={searchValue.query}
                                  marginBottom0
                                  autoFocus
                                  inputRef={this.searchField}
                                  data-test-instance-search-input
                                />
                                <Button
                                  type="submit"
                                  buttonStyle="primary"
                                  fullWidth
                                  marginBottom0
                                  disabled={(!searchValue.query || searchValue.query === '')}
                                  data-test-instance-search-submit
                                >
                                  XXX Search
                                </Button>
                              </div>
                              <div className={css.resetButtonWrap}>
                                <Button
                                  buttonStyle="none"
                                  id="clickable-reset-all"
                                  disabled={disableReset()}
                                  fullWidth
                                  onClick={resetAll}
                                >
                                  <Icon icon="times-circle-solid">
                                    <FormattedMessage id="stripes-smart-components.resetAll" />
                                  </Icon>
                                </Button>
                              </div>
                              <Filters
                                onChangeHandlers={getFilterHandlers()}
                                activeFilters={activeFilters}
                                config={filterConfig}
                              />
                            </form>
                          </Pane>
                        }
                        <Pane
                          firstMenu={this.renderResultsFirstMenu(activeFilters)}
                          paneTitle={resultsHeader}
                          paneSub={resultPaneSub}
                          defaultWidth="fill"
                          padContent={false}
                        >
                          <MultiColumnList
                            visibleColumns={builtVisibleColumns}
                            contentData={instances}
                            totalCount={count}
                            id="list-plugin-find-instance"
                            columnMapping={{
                              isChecked: (
                                <Checkbox
                                  checked={isAllChecked}
                                  onChange={this.toggleAll}
                                  type="checkbox"
                                />
                              ),
                              title: intl.formatMessage({ id: 'ui-plugin-find-instance.information.title' }),
                              contributors: intl.formatMessage({ id: 'ui-plugin-find-instance.information.contributors' }),
                              publishers: intl.formatMessage({ id: 'ui-plugin-find-instance.information.publishers' }),
                              relation: intl.formatMessage({ id: 'ui-plugin-find-instance.information.relation' }),
                            }}
                            formatter={resultsFormatter}
                            onRowClick={!isMultiSelect && onSelectRow}
                            onNeedMoreData={onNeedMoreData}
                            onHeaderClick={onSort}
                            sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                            sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                            isEmptyMessage={resultsStatusMessage}
                            autosize
                            virtualize
                          />
                        </Pane>
                      </Paneset>
                    )}
                  </IntlConsumer>
                );
              }}
          </SearchAndSortQuery>
        </div>

        {
          isMultiSelect && (
            <div className={css.InstanceSearchViewFooter}>
              <Fragment>
                <div>
                  <FormattedMessage
                    id="ui-plugin-find-instance.modal.total"
                    values={{ count: checkedInstancesLength }}
                  />
                </div>
                <Button
                  data-test-find-instance-modal-save-multiple
                  marginBottom0
                  onClick={this.saveMultiple}
                  disabled={!checkedInstancesLength}
                  buttonStyle="primary"
                >
                  <FormattedMessage id="ui-plugin-find-instance.modal.save" />
                </Button>
              </Fragment>
            </div>
          )
        }
      </Fragment>
    );
  }
}

export default InstanceSearchView;
