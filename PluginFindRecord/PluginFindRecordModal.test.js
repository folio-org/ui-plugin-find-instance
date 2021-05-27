import React from 'react';
import {
  render,
  cleanup,
  screen,
} from '@testing-library/react';

import '../test/jest/__mock__';
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
  setSearchIndex = jest.fn(),
  setSegment = jest.fn(),
  source,
  filterConfig = [],
}) => render(
  <PluginFindRecordModal
    className={css.pluginModalContent}
    idPrefix={idPrefix}
    isMultiSelect={isMultiSelect}
    filterConfig={filterConfig}
    setSegment={setSegment}
    setSearchIndex={setSearchIndex}
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
  />
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
      const searchAndSort = screen.getByTestId('data-test-search-and-sort');
      const modalHeader = screen.getByText('PluginFindRecordModal');

      expect(container).toBeVisible();
      expect(modal).toBeInTheDocument();
      expect(searchAndSort).toBeInTheDocument();
      expect(modalHeader).toBeVisible();
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
        }
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
