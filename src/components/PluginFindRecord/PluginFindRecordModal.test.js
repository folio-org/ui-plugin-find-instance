import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import stripesComponents from '@folio/stripes/components';
import smartComponents from '@folio/stripes/smart-components';
import { SORT_OPTIONS } from '@folio/stripes-inventory-components';

import PluginFindRecordModal from './PluginFindRecordModal';
import css from './PluginFindRecordModal.css';

const config = [{
  label: 'Item Types',
  name: 'item',
  cql: 'materialType',
  values: ['Books', 'DVDs', 'Microfilm'],
}, {
  label: 'Location',
  name: 'location',
  cql: 'location.name',
  values: [{ name: 'Main Library', cql: 'main' }, 'Annex Library'],
}];

const contextData = {
  displaySettings: {
    defaultSort: SORT_OPTIONS.CONTRIBUTORS,
  },
};

const renderPluginFindRecordModal = ({
  closeModal = jest.fn(),
  idPrefix = 'idPrefix',
  intl = {},
  isMultiSelect = true,
  label = 'PluginFindRecordModal',
  visibleColumns = ['column1', 'column2', 'column3'],
  onComponentWillUnmount = jest.fn(),
  onNeedMoreData = jest.fn(),
  onSelectRow = jest.fn(),
  queryGetter = jest.fn(),
  querySetter = jest.fn(),
  renderFilters = jest.fn(),
  renderNewBtn = jest.fn(),
  setSegment = jest.fn(),
  source,
  searchIndexes = [{
    label: 'keyword',
    value: 'keyword',
  }, {
    label: 'contributors',
    value: 'contributors',
  }],
  filterConfig = [],
} = {}) => render(
  <MemoryRouter>
    <PluginFindRecordModal
      contextData={contextData}
      className={css.pluginModalContent}
      idPrefix={idPrefix}
      isMultiSelect={isMultiSelect}
      filterConfig={filterConfig}
      setSegment={setSegment}
      visibleColumns={visibleColumns}
      closeModal={closeModal}
      modalLabel={label}
      intl={intl}
      onComponentWillUnmount={onComponentWillUnmount}
      onNeedMoreData={onNeedMoreData}
      onSelectRow={onSelectRow}
      queryGetter={queryGetter}
      renderFilters={renderFilters}
      renderNewBtn={renderNewBtn}
      querySetter={querySetter}
      source={source}
      searchIndexes={searchIndexes}
    />
  </MemoryRouter>
);

describe('Plugin find record modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply default query parameters on mount', () => {
    jest.spyOn(smartComponents, 'SearchAndSortQuery');

    renderPluginFindRecordModal();

    const expectedProps = {
      setQueryOnMount: true,
      initialSortState: { sort: contextData.displaySettings.defaultSort },
      initialSearchState: { qindex: '', query: '' },
      initialFilterState: { staffSuppress: ['false'] },
      initialSearch: '',
    };

    expect(smartComponents.SearchAndSortQuery).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should display default sorting from contextData', () => {
    jest.spyOn(stripesComponents, 'MultiColumnList');

    renderPluginFindRecordModal();

    const expectedProps = {
      sortOrder: contextData.displaySettings.defaultSort,
    };

    expect(stripesComponents.MultiColumnList).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should display sorting from queryGetter', () => {
    jest.spyOn(stripesComponents, 'MultiColumnList');

    const query = {
      sort: SORT_OPTIONS.CONTRIBUTORS,
    };

    renderPluginFindRecordModal({
      queryGetter: () => query,
    });

    const expectedProps = {
      sortOrder: query.sort,
    };

    expect(stripesComponents.MultiColumnList).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should have a sort indicator in MCL', () => {
    jest.spyOn(stripesComponents, 'MultiColumnList');

    const expectedProps = {
      showSortIndicator: true,
      nonInteractiveHeaders: ['publishers', 'isChecked'],
    };

    renderPluginFindRecordModal();

    expect(stripesComponents.MultiColumnList).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });

  describe('With default props', () => {
    let pluginFindRecordModal;

    beforeEach(() => {
      pluginFindRecordModal = renderPluginFindRecordModal({
        filterConfig: config,
        renderFilters: jest.fn(),
      });
    });

    afterEach(cleanup);

    it('should be rendered', () => {
      const { container } = pluginFindRecordModal;
      const modal = screen.getByTestId('data-test-find-records-modal');
      const searchAndSortPane = screen.getByText('stripes-smart-components.searchAndFilter');
      const modalHeader = screen.getByText('PluginFindRecordModal');

      expect(container).toBeVisible();
      expect(modal).toBeInTheDocument();
      expect(searchAndSortPane).toBeInTheDocument();
      expect(modalHeader).toBeVisible();
    });

    describe('when clicking on Reset All', () => {
      it('should reset qindex and query', () => {
        const { getByRole } = pluginFindRecordModal;

        const qIndexSelect = getByRole('combobox', { name: 'stripes-components.searchFieldIndex' });
        const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

        fireEvent.change(qIndexSelect, { target: { value: 'contributors' } });

        expect(qIndexSelect).toHaveValue('contributors');

        fireEvent.click(resetAllButton);

        expect(qIndexSelect).toHaveValue('keyword');
      });
    });
  });

  describe('Records was not found', () => {
    let pluginFindRecordModal;

    beforeEach(() => {
      pluginFindRecordModal = renderPluginFindRecordModal({
        isMultiSelect: false,
        source: {
          totalCount: jest.fn(() => 1),
          loaded: jest.fn(() => false),
          failure: jest.fn(),
          pending: jest.fn(),
        },
      });
    });

    afterEach(cleanup);

    it('should be rendered', () => {
      const { container } = pluginFindRecordModal;
      const modal = screen.getByTestId('data-test-find-records-modal');

      expect(container).toBeVisible();
      expect(modal).toBeInTheDocument();
    });
  });
});
