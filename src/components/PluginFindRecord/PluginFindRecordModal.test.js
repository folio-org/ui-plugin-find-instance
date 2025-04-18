import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import stripesComponents from '@folio/stripes/components';
import smartComponents from '@folio/stripes/smart-components';
import {
  ResetProvider,
  SORT_OPTIONS,
} from '@folio/stripes-inventory-components';

import PluginFindRecordModal from './PluginFindRecordModal';
import css from './PluginFindRecordModal.css';

const mockUnsubscribeFromReset = jest.fn();
const mockPublishOnReset = jest.fn();

jest.mock('@folio/stripes-inventory-components', () => ({
  ...jest.requireActual('@folio/stripes-inventory-components'),
  withReset: (Comp) => (props) => (
    <Comp
      {...props}
      unsubscribeFromReset={mockUnsubscribeFromReset}
      publishOnReset={mockPublishOnReset}
    />
  ),
  resetFacetStates: jest.fn(),
  resetFacetSearchValue: jest.fn(),
}));

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
  instanceDateTypes: [],
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
    <ResetProvider>
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
    </ResetProvider>
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
      initialFilterState: {},
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

  describe('when hitting the reset button', () => {
    it('should publish the reset event', async () => {
      const { getByText, getByRole } = renderPluginFindRecordModal();

      await userEvent.type(getByRole('searchbox', { name: /stripes-smart-components.search/i }), 'foo');
      await userEvent.click(getByText('stripes-smart-components.resetAll'));

      expect(mockPublishOnReset).toHaveBeenCalled();
    });
  });

  describe('when changing a segment', () => {
    it('should unsubscribe from the reset event', async () => {
      const { getByText } = renderPluginFindRecordModal();

      await userEvent.click(getByText('ui-plugin-find-instance.filters.holdings'));

      expect(mockUnsubscribeFromReset).toHaveBeenCalled();
    });
  });

  it('should have a sort indicator in MCL', () => {
    jest.spyOn(stripesComponents, 'MultiColumnList');

    const expectedProps = {
      showSortIndicator: true,
      sortableFields: Object.values(SORT_OPTIONS).filter(option => option !== SORT_OPTIONS.RELEVANCE),
    };

    renderPluginFindRecordModal();

    expect(stripesComponents.MultiColumnList).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });

  describe('when hitting the reset button', () => {
    it('should publish the reset event', async () => {
      const { getByText, getByRole } = renderPluginFindRecordModal();

      await userEvent.type(getByRole('searchbox', { name: /stripes-smart-components.search/i }), 'foo');
      await userEvent.click(getByText('stripes-smart-components.resetAll'));

      expect(mockPublishOnReset).toHaveBeenCalled();
    });
  });

  describe('when changing a segment', () => {
    it('should unsubscribe from the reset event', async () => {
      const { getByText } = renderPluginFindRecordModal();

      await userEvent.click(getByText('ui-plugin-find-instance.filters.holdings'));

      expect(mockUnsubscribeFromReset).toHaveBeenCalled();
    });
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
