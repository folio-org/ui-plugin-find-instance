import {
  render,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { useCommonData } from '@folio/stripes-inventory-components';

import PluginFindRecord from './PluginFindRecord';
import { DataContext } from '../../contexts';
import Harness from '../../../test/jest/helpers/harness';

const commonData = {
  locations: [{ id: 'id-1', tenantId: 'tenant-id' }],
  consortiaTenants: [{ id: 'id-1', name: 'College' }],
};

useCommonData.mockReturnValue({
  commonData,
  isCommonDataLoading: false,
});
const mockSelectRecordsCb = jest.fn();
const mockOnClose = jest.fn();

const record = { id: '1' };
const records = [{ id: '1' }, { id: '2' }];

const getModal = ({
  closeModal,
  onSaveMultiple,
  onSelectRow,
}) => (
  <div data-testid="modal">
    <button
      type="button"
      onClick={() => onSaveMultiple(records)}
    >
      onSaveMultiple
    </button>
    <button
      type="button"
      onClick={(e) => onSelectRow(e, record)}
    >
      onSelectRow
    </button>
    <button
      type="button"
      onClick={closeModal}
    >
      closeModal
    </button>
  </div>
);

const renderPluginFindRecord = (props = {}) => render(
  <Harness>
    <PluginFindRecord
      searchLabel="trigger button"
      selectRecordsCb={mockSelectRecordsCb}
      onClose={mockOnClose}
      {...props}
    >
      {props.children ?? getModal}
    </PluginFindRecord>
  </Harness>
);

describe('Plugin find record', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container, getByText } = renderPluginFindRecord();

    await act(async () => userEvent.click(getByText('trigger button')));

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should open a modal via the default trigger button', async () => {
    const { getByText, getByTestId } = renderPluginFindRecord({
      children: () => (
        <div data-testid="modal">
          modal
        </div>
      ),
    });

    await act(async () => userEvent.click(getByText('trigger button')));

    expect(getByTestId('modal')).toBeVisible();
  });

  it('should open a modal via the custom trigger button', async () => {
    const { getByText, getByTestId } = renderPluginFindRecord({
      renderTrigger: (props) => (
        <button type="button" {...props}>
          custom trigger
        </button>
      ),
      children: () => (
        <div data-testid="modal">
          modal
        </div>
      ),
    });

    await act(async () => userEvent.click(getByText('custom trigger')));

    expect(getByTestId('modal')).toBeVisible();
  });

  it('should convey data to children', async () => {
    const mockData = jest.fn();

    const children = () => (
      <DataContext.Consumer>
        {mockData}
      </DataContext.Consumer>
    );

    const { getByText } = renderPluginFindRecord({
      children,
    });

    await act(async () => userEvent.click(getByText('trigger button')));

    expect(mockData).toHaveBeenCalledWith(commonData);
  });

  describe('when a user selects list items and clicks Save', () => {
    it('should fire the selectRecordsCb with the selected records', async () => {
      const { getByText, queryByTestId } = renderPluginFindRecord();

      await act(async () => userEvent.click(getByText('trigger button')));
      await act(async () => userEvent.click(getByText('onSaveMultiple')));

      expect(mockSelectRecordsCb).toHaveBeenCalledWith(records);
      expect(queryByTestId('modal')).toBeNull();
    });
  });

  describe('when a user clicks on a list item', () => {
    it('should fire the selectRecordsCb with the clicked record', async () => {
      const { getByText, queryByTestId } = renderPluginFindRecord({
        searchLabel: 'trigger button',
      });

      await act(async () => userEvent.click(getByText('trigger button')));
      await act(async () => userEvent.click(getByText('onSelectRow')));

      expect(mockSelectRecordsCb).toHaveBeenCalledWith([record]);
      expect(queryByTestId('modal')).toBeNull();
    });
  });

  describe('when a user closes the modal', () => {
    it('should invoke the onClose callback', async () => {
      const { getByText, queryByTestId } = renderPluginFindRecord();

      await act(async () => userEvent.click(getByText('trigger button')));
      await act(async () => userEvent.click(getByText('closeModal')));

      expect(mockOnClose).toHaveBeenCalled();
      expect(queryByTestId('modal')).toBeNull();
    });
  });
});
