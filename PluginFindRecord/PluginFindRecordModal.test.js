import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PluginFindRecordModal from './PluginFindRecordModal';
import css from './PluginFindRecordModal.css';

jest.unmock('@folio/stripes/smart-components');
jest.unmock('@folio/stripes/components');

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
  renderFilters,
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
}) => render(
  <MemoryRouter>
    <PluginFindRecordModal
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
