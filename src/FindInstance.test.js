import {
  render,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';

import { useCallout } from '@folio/stripes/core';
import Harness from '../test/jest/helpers/harness';
import FindInstance from './FindInstance';
import { useInstancesQuery } from './hooks';


jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
}));

const instances = [
  {
    title: 'Agile Organisation',
    contributors: [
      {
        name: 'Augustin, Harald',
        contributorNameTypeId: '2b94c631-fca9-4892-a730-03ee529ffe2a'
      },
      {
        name: 'Shaker Verlag GmbH',
        contributorNameTypeId: '2e48e713-17f3-4c13-a9f8-23845bb210aa'
      },
    ],
    publication: [
      {
        publisher: 'Shaker Verlag',
        dateOfPublication: '2017',
      },
    ],
  },
  {
    title: 'The algebraic theory',
    contributors: [
      {
        name: 'Jack, Adrienne',
        authorityId: '09a87694-6e2a-4785-8528-bc372c53f771',
        contributorNameTypeId: '2b94c631-fca9-4892-a730-03ee529ffe2a',
        primary: true,
      },
    ],
    publication: [
      {
        publisher: 'University Press',
        dateOfPublication: '1916',
      },
    ],
  }
];
const mockTenantId = 'tenant-id';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  FindInstanceContainer: (props) => {
    const RealFindInstanceContainer = jest.requireActual('./components').FindInstanceContainer;

    const resources = {
      records: {
        records: instances,
      },
    };

    return (
      <RealFindInstanceContainer
        {...props}
        resources={resources}
      />
    );
  }
}));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useInstancesQuery: jest.fn(),
}));

const mockSelectInstance = jest.fn();
const mockOnClose = jest.fn();
const mockSendCallout = jest.fn();

jest.spyOn({ useCallout }, 'useCallout').mockReturnValue({
  sendCallout: mockSendCallout,
});

const getInstanceSearch = (props = {}) => (
  <Harness>
    <FindInstance
      config={{}}
      searchLabel="plugin-trigger"
      selectInstance={mockSelectInstance}
      isMultiSelect={false}
      onClose={mockOnClose}
      tenantId={mockTenantId}
      {...props}
    />
  </Harness>
);

const renderInstanceSearch = (props) => render(getInstanceSearch(props));

describe('FindInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useInstancesQuery.mockReturnValue({
      isLoading: false,
    });
  });

  it('should render with no axe errors', async () => {
    const { container } = renderInstanceSearch();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when isMultiSelect is applied and a user selects instances and clicks save', () => {
    it('should call useInstancesQuery with the selected instances', async () => {
      const props = {
        isMultiSelect: true,
      };

      const { getByText, getAllByRole, queryByTestId, rerender } = renderInstanceSearch(props);

      await act(async () => userEvent.click(getByText('plugin-trigger')));

      rerender(getInstanceSearch(props));

      await act(async () => userEvent.click(getAllByRole('checkbox')[1]));
      await act(async () => userEvent.click(getByText('stripes-core.button.save')));

      expect(queryByTestId('data-test-find-records-modal')).toBeNull();

      expect(useInstancesQuery).toHaveBeenCalledWith(
        [{
          ...instances[0],
          rowIndex: 0,
        }],
        { tenantId: mockTenantId, include: [] }
      );
    });
  });

  describe('when the useInstancesQuery returns data and isMultiSelect is true', () => {
    it('should call callbacks', async () => {
      const data = {
        instances: [{
          id: 'instance-id',
        }],
      };

      useInstancesQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data,
      });

      const props = {
        isMultiSelect: true,
      };

      renderInstanceSearch(props);

      expect(mockSelectInstance).toHaveBeenCalledWith(data.instances);
      expect(mockOnClose).toHaveBeenCalled();
      expect(useInstancesQuery).toHaveBeenCalledWith([], { tenantId: mockTenantId, include: [] });
    });
  });

  describe('when the useInstancesQuery returns data and isMultiSelect is false', () => {
    it('should call callbacks', async () => {
      const data = {
        instances: [{
          id: 'instance-id',
        }],
      };

      useInstancesQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data,
      });

      renderInstanceSearch();

      expect(mockSelectInstance).toHaveBeenCalledWith(data.instances[0]);
      expect(mockOnClose).toHaveBeenCalled();
      expect(useInstancesQuery).toHaveBeenCalledWith([], { tenantId: mockTenantId, include: [] });
    });
  });

  describe('when the useInstancesQuery returns an error', () => {
    it('should display the "communication problem" error message', async () => {
      useInstancesQuery.mockReturnValue({
        isError: true,
        error: {
          response: Promise.resolve({
            json: jest.fn().mockResolvedValue({}),
          }),
        }
      });

      await act(async () => renderInstanceSearch());

      expect(mockSendCallout).toHaveBeenCalledWith({
        message: 'ui-plugin-find-instance.communicationProblem',
        type: 'error',
      });
    });
  });

  describe('when the useInstancesQuery returns an error', () => {
    it('should display an error message', async () => {
      const message = 'some error';

      useInstancesQuery.mockReturnValue({
        isError: true,
        error: {
          response: Promise.resolve({
            json: jest.fn().mockResolvedValue({ message }),
          }),
        }
      });

      await act(async () => renderInstanceSearch());

      expect(mockSendCallout).toHaveBeenCalledWith({
        message,
        type: 'error',
      });
    });
  });
});
