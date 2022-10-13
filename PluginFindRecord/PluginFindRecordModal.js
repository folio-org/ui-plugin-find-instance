import React from 'react';
import PropTypes from 'prop-types';
import {
  noop,
  omit,
  pickBy,
} from 'lodash';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  Checkbox,
  Icon,
  Modal,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
  MCLPagingTypes
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import Filters from './Filters';
import css from './PluginFindRecordModal.css';
import FilterNavigation from '../Imports/imports/FilterNavigation';

import { CONFIG_TYPES } from '../Imports/imports/constants';

const RESULTS_HEADER = <FormattedMessage id="ui-plugin-find-instance.resultsHeader" />;

const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};
const PAGE_SIZE = 100;

class PluginFindRecordModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filterPaneIsVisible: true,
      checkedMap: {},
      isAllChecked: false,
    };
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
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
                  aria-label={`${hideOrShowMessage} \n\n${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  saveMultiple = () => {
    const selectedRecords = Object.values(pickBy(this.state.checkedMap));

    this.props.onSaveMultiple(selectedRecords);
  };

  toggleAll = () => {
    this.setState((state, props) => {
      const isAllChecked = !state.isAllChecked;
      const { data: { records } } = props;
      const checkedMap = reduceCheckedRecords(records, isAllChecked);

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  toggleRecord = toggledRecord => {
    const { id } = toggledRecord;

    this.setState((state, props) => {
      const { data: { records } } = props;
      const wasChecked = Boolean(state.checkedMap[id]);
      const checkedMap = { ...state.checkedMap };

      if (wasChecked) {
        delete checkedMap[id];
      } else {
        checkedMap[id] = toggledRecord;
      }
      const isAllChecked = records.every(record => Boolean(checkedMap[record.id]));

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  onRowClick = (e, row) => {
    const { isMultiSelect, onSelectRow } = this.props;

    if (!isMultiSelect) {
      onSelectRow(e, row);
    }
  }

  // filters param is in the form, e.g.:
  // {name: "effectiveLocation", values: ["53cf956f-c1df-410b-8bea-27f712cca7c0"]}
  // Want to get something like:
  // {filters: "effectiveLocation.53cf956f-c1df-410b-8bea-27f712cca7c0"}
  convertFilters = (filters) => {
    const queryClauses = [];
    Object.keys(filters).forEach(filter => {
      filters[filter].forEach(value => {
        queryClauses.push(`${filter}.${value}`);
      });
    });

    return { filters: queryClauses.join(',') };
  }

  /**
  This custom queryStateReducer function seems to be necessary because of the way
  in which searchAndSortQuery favors simple checkbox filters (see, e.g., the
  onFilterCheckboxChange function); without this, filter state is not set properly
  for more complex arrangements.

  The newState param contains a filterFields object that represents the *changed*
  filters, which could mean that filter values have been added or removed, or a filter
  has been cleared entirely. We have to be a bit careful in determining what the changes
  are.
  */
  queryStateReducer = (state, nextState) => {
    if (nextState.filterChanged) {
      let newFilterFields = state.filterFields; // Begin with filters from previous state
      const changedFilters = Object.keys(nextState.filterFields);
      if (changedFilters.length === 0) { return nextState; }

      changedFilters.forEach(filter => {
        if (newFilterFields[filter]) {
          // Filter already exists; changing value(s)
          if (nextState.filterFields[filter].length === 0) {
            // Remove the filter
            newFilterFields = omit(newFilterFields, filter);
          } else {
            newFilterFields[filter] = nextState.filterFields[filter];
          }
        } else {
          // This is a filter that has been added to the filter set; go with the new values
          newFilterFields[filter] = nextState.filterFields[filter];
        }
      });
      nextState.filterFields = newFilterFields;
    }

    return nextState;
  }

  getPaginatedItems = () => {
    const { index, data } = this.props;
    const { records } = data;

    const paginatedItems = [];
    if (records.length > 0) {
      // paginatedItems = new Array(PAGE_SIZE);

      // slice original records array to extract 'pageAmount' of records
      const recordSlice = records.slice(index, index + PAGE_SIZE);
      // push it at the end of the sparse array
      paginatedItems.push(...recordSlice);
    }
    // else {
    //   paginatedItems = [];
    // }
    console.log('paginatedItems ', paginatedItems);
    return paginatedItems;
  }

  render() {
    const {
      closeModal,
      columnMapping,
      columnWidths,
      data,
      filterConfig,
      idPrefix,
      initialSearch,
      intl,
      isMultiSelect,
      modalLabel,
      onComponentWillUnmount,
      onNeedMoreData,
      queryGetter,
      querySetter,
      renderFilters,
      renderNewBtn,
      resultsFormatter,
      searchIndexes,
      setSearchIndex,
      segment,
      setSegment,
      source,
      visibleColumns,
      config,
      index,
      currentPage
    } = this.props;
    const { checkedMap, isAllChecked } = this.state;
    const {
      availableSegments,
    } = config;
    const { records, paginatedItems, totalRecords } = data;
    const checkedRecordsLength = Object.keys(checkedMap).length;
    const builtVisibleColumns = isMultiSelect ? ['isChecked', ...visibleColumns] : visibleColumns;

    const query = queryGetter ? queryGetter() || {} : {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || 'title';
    const resultsStatusMessage = source
      ? (
        <div data-test-find-records-no-results-message>
          <NoResultsMessage
            data-test-find-records-no-results-message
            filterPaneIsVisible
            searchTerm={query.query || ''}
            source={source}
            toggleFilterPane={noop}
          />
        </div>
      )
      : <FormattedMessage id="ui-plugin-find-instance.noSourceYet" />;

    let resultPaneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;

    if (source && source.loaded()) {
      resultPaneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    const formattedSearchableIndexes = searchIndexes.map(index => {
      const { prefix = '' } = index;
      const label = prefix + intl.formatMessage({ id: index.label });

      return { ...index, label };
    });

    const mixedResultsFormatter = {
      isChecked: record => (
        <Checkbox
          type="checkbox"
          checked={Boolean(checkedMap[record.id])}
          onChange={() => this.toggleRecord(record)}
        />
      ),
      ...resultsFormatter,
    };

    const footer = (
      <div className={css.pluginModalFooter}>
        <Button
          marginBottom0
          onClick={closeModal}
          className="left"
          data-test-find-records-modal-close
        >
          <FormattedMessage id="stripes-core.button.close" />
        </Button>
        {isMultiSelect && (
          <>
            <div>
              <FormattedMessage
                id="ui-plugin-find-instance.totalSelected"
                values={{ count: checkedRecordsLength }}
              />
            </div>
            <Button
              buttonStyle="primary"
              data-test-find-records-modal-save
              disabled={!checkedRecordsLength}
              marginBottom0
              onClick={this.saveMultiple}
            >
              <FormattedMessage id="stripes-core.button.save" />
            </Button>
          </>
        )}
      </div>
    );

    // const paginatedItems = this.getPaginatedItems();
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    const pagingCanGoNext = currentPage < totalPages;
    const pagingCanGoPrevious = currentPage > 1;

    return (
      <Modal
        contentClass={css.pluginModalContent}
        data-test-find-records-modal
        data-testid="data-test-find-records-modal"
        dismissible
        enforceFocus={false}
        footer={footer}
        label={modalLabel}
        onClose={closeModal}
        open
        size="large"
        style={{ minHeight: '500px' }}
      >
        <div className={css.pluginModalNewBtnWrapper}>
          {renderNewBtn()}
        </div>
        <div
          data-test-find-records
          className={isMultiSelect ? css.showButtonsBar : ''}
        >
          <SearchAndSortQuery
            data-testid="data-test-search-and-sort"
            initialSearch={initialSearch}
            initialSearchState={{ qindex: '', query: '' }}
            initialSortState={{ sort: 'title' }}
            onComponentWillUnmount={onComponentWillUnmount}
            queryGetter={queryGetter}
            querySetter={querySetter}
            queryStateReducer={this.queryStateReducer}
            syncToLocationSearch={false}
            filtersToParams={this.convertFilters}
          >
            {
              ({
                activeFilters,
                filterChanged,
                getFilterHandlers,
                getSearchHandlers,
                onSort,
                onSubmitSearch,
                resetAll,
                searchChanged,
                searchValue,
              }) => {
                const disableReset = () => {
                  if (filterChanged || searchChanged) {
                    return false;
                  }

                  return true;
                };

                return (
                  <Paneset
                    id={`${idPrefix}-paneset`}
                    isRoot
                  >
                    {
                      this.state.filterPaneIsVisible &&
                      <Pane
                        defaultWidth="25%"
                        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                      >
                        <FilterNavigation
                          availableSegments={availableSegments}
                          segment={segment}
                          setSegment={setSegment}
                          reset={resetAll}
                        />
                        <form onSubmit={onSubmitSearch}>
                          <div className={css.searchGroupWrap}>
                            <SearchField
                              autoFocus
                              className={css.searchField}
                              data-test-plugin-search-input
                              marginBottom0
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              searchableIndexes={formattedSearchableIndexes}
                              onChangeIndex={setSearchIndex}
                              value={searchValue.query}
                            />
                            <Button
                              buttonStyle="primary"
                              data-test-plugin-search-submit
                              data-testid="data-test-plugin-search-submit"
                              disabled={(!searchValue.query || searchValue.query === '')}
                              fullWidth
                              marginBottom0
                              type="submit"
                            >
                              <FormattedMessage id="stripes-smart-components.search" />
                            </Button>
                          </div>
                          <div className={css.resetButtonWrap}>
                            <Button
                              buttonStyle="none"
                              disabled={disableReset()}
                              fullWidth
                              id="clickable-reset-all"
                              onClick={resetAll}
                            >
                              <Icon icon="times-circle-solid">
                                <FormattedMessage id="stripes-smart-components.resetAll" />
                              </Icon>
                            </Button>
                          </div>
                          {
                            renderFilters
                              ? renderFilters({ activeFilters, getFilterHandlers })
                              : (
                                <Filters
                                  activeFilters={activeFilters}
                                  config={filterConfig}
                                  onChangeHandlers={getFilterHandlers()}
                                />
                              )
                          }
                        </form>
                      </Pane>
                    }
                    <Pane
                      defaultWidth="fill"
                      firstMenu={this.renderResultsFirstMenu(activeFilters)}
                      padContent={false}
                      paneSub={resultPaneSub}
                      paneTitle={RESULTS_HEADER}
                    >
                      <MultiColumnList
                        // autosize
                        columnMapping={{
                          isChecked: (
                            <Checkbox
                              checked={isAllChecked}
                              data-test-find-records-modal-select-all
                              onChange={this.toggleAll}
                              type="checkbox"
                            />
                          ),
                          ...columnMapping,

                        }}
                        columnWidths={columnWidths}
                        contentData={paginatedItems}
                        // contentData={records}
                        formatter={mixedResultsFormatter}
                        id="list-plugin-find-records"
                        isEmptyMessage={resultsStatusMessage}
                        key={`checkedRecordsLength_${checkedRecordsLength}`}
                        onHeaderClick={onSort}
                        onNeedMoreData={onNeedMoreData}
                        onRowClick={this.onRowClick}
                        sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                        sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                        // totalCount={count}
                        totalCount={totalRecords}
                        // virtualize
                        visibleColumns={builtVisibleColumns}
                        pageAmount={PAGE_SIZE}
                        pagingType="prev-next"
                        pagingCanGoNext={pagingCanGoNext}
                        pagingCanGoPrevious={pagingCanGoPrevious}
                      />
                    </Pane>
                  </Paneset>
                );
              }
            }
          </SearchAndSortQuery>
        </div>
      </Modal>
    );
  }
}

PluginFindRecordModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  data: PropTypes.object,
  filterConfig: PropTypes.arrayOf(PropTypes.object),
  idPrefix: PropTypes.string.isRequired,
  initialSearch: PropTypes.string,
  intl: PropTypes.object.isRequired,
  isMultiSelect: PropTypes.bool.isRequired,
  modalLabel: PropTypes.node,
  onComponentWillUnmount: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  onSaveMultiple: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  renderFilters: PropTypes.func,
  renderNewBtn: PropTypes.func,
  resultsFormatter: PropTypes.object,
  searchIndexes: PropTypes.arrayOf(PropTypes.object),
  segment: PropTypes.string,
  setSearchIndex: PropTypes.func.isRequired,
  setSegment: PropTypes.func.isRequired,
  source: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  config: CONFIG_TYPES,
  index: PropTypes.number,
};

PluginFindRecordModal.defaultProps = {
  columnMapping: {},
  columnWidths: {},
  data: {},
  filterConfig: [],
  initialSearch: '',
  modalLabel: '',
  onSaveMultiple: noop,
  renderNewBtn: noop,
  resultsFormatter: {},
  searchIndexes: [],
  segment: 'instances',
  config: {
    availableSegments: [],
  },
};

export default injectIntl(PluginFindRecordModal);
