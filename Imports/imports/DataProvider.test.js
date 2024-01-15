import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { useStripes } from '@folio/stripes/core';

import { buildStripes } from '../../test/jest/__mock__/stripesCore.mock';
import Harness from '../../test/jest/helpers/harness';
import DataProvider from './DataProvider';
import DataContext from './DataContext';
import { OKAPI_TENANT_HEADER } from '../../constants';
import { useLocationsForTenants } from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLocationsForTenants: jest.fn().mockReturnValue({
    data: [],
    isLoading: false,
  }),
}));

const mutator = {
  consortiaTenants: {
    GET: jest.fn(),
  },
};

const resources = {
  consortiaTenants: {
    type: 'okapi',
    records: [],
  },
  instanceFormats: {
    type: 'okapi',
    records: [],
  },
  instanceTypes: {
    type: 'okapi',
    records: [],
  },
  locations: {
    type: 'okapi',
    records: [],
  },
  modesOfIssuance: {
    type: 'okapi',
    records: [],
  },
  natureOfContentTerms: {
    type: 'okapi',
    records: [],
  },
  materialTypes: {
    type: 'okapi',
    records: [],
  },
  tags: {
    type: 'okapi',
    records: [],
  },
};

const renderDataProvider = (props = {}) => render(
  <Harness>
    <DataProvider
      mutator={mutator}
      resource={resources}
      {...props}
    >
      <DataContext.Consumer>
        {data => {
          return (
            <div data-testid="children">
              {Object.keys(data).map(resource => (
                <div key={resource}>
                  {`${resource}: ${JSON.stringify(data[resource])}`}
                </div>
              ))}
            </div>
          );
        }}
      </DataContext.Consumer>
    </DataProvider>
  </Harness>
);

describe('DataProvider', () => {
  it('should pass data to children component', () => {
    const { getByText } = renderDataProvider();

    expect(getByText('consortiaTenants: []')).toBeVisible();
    expect(getByText('instanceFormats: []')).toBeVisible();
    expect(getByText('instanceTypes: []')).toBeVisible();
    expect(getByText('locations: []')).toBeVisible();
    expect(getByText('modesOfIssuance: []')).toBeVisible();
    expect(getByText('natureOfContentTerms: []')).toBeVisible();
    expect(getByText('materialTypes: []')).toBeVisible();
    expect(getByText('tags: []')).toBeVisible();
    expect(getByText('isLoadingLocationsForTenants: false')).toBeVisible();
  });

  describe('when a resource is not loaded', () => {
    it('should display children component', () => {
      const { getByTestId } = renderDataProvider({
        resources: {
          instanceFormats: {
            type: 'okapi',
            hasLoaded: false,
          },
          consortiaTenants: {
            records: [],
          },
        },
      });

      expect(getByTestId('children')).toBeVisible();
    });
  });

  describe('when a resource is failed', () => {
    it('should display children component', () => {
      const { getByTestId } = renderDataProvider({
        resources: {
          instanceFormats: {
            type: 'okapi',
            failed: true,
          },
          consortiaTenants: {
            records: [],
          },
        },
      });

      expect(getByTestId('children')).toBeVisible();
    });
  });

  describe('when resource is not pending', () => {
    it('should display children component', () => {
      const { getByTestId } = renderDataProvider({
        resources: {
          instanceFormats: {
            type: 'okapi',
            isPending: false,
          },
          consortiaTenants: {
            records: [],
          },
        },
      });

      expect(getByTestId('children')).toBeVisible();
    });
  });

  describe('when a resource is loading', () => {
    it('should not display children component', () => {
      const { queryByTestId } = renderDataProvider({
        resources: {
          instanceFormats: {
            type: 'okapi',
            records: [],
            hasLoaded: false,
            failed: false,
            isPending: true,
          },
          consortiaTenants: {
            records: [],
          },
        },
      });

      expect(queryByTestId('children')).toBeNull();
    });
  });

  describe('when env is not consortia', () => {
    it('should not fetch consortiaTenants', () => {
      renderDataProvider();
      expect(mutator.consortiaTenants.GET).not.toHaveBeenCalled();
    });
  });

  describe('when env is consortia', () => {
    const consortium = {
      id: '1f06c60e-4431-432d-97a4-ca2bc6b152cb',
      centralTenantId: 'cs00000int',
    };

    beforeEach(() => {
      useStripes.mockReturnValueOnce(buildStripes({
        user: {
          user: {
            consortium,
          },
        },
      }));
    });

    it('should fetch consortiaTenants', () => {
      renderDataProvider();

      expect(mutator.consortiaTenants.GET).toHaveBeenCalledWith({
        path: `consortia/${consortium.id}/tenants?limit=1000`,
        headers: {
          [OKAPI_TENANT_HEADER]: consortium.centralTenantId,
        },
      });
    });

    it('should fetch locations for all tenants', () => {
      const newResources = {
        consortiaTenants: {
          type: 'okapi',
          records: [{ id: 'tenant-1' }, { id: 'tenant-2' }],
        },
      };

      const data = [
        { id: '1', name: 'Annex' },
        { id: '2', name: 'Main Library' },
      ];

      useLocationsForTenants.mockReturnValueOnce({
        data,
        isLoading: false,
      });

      const { getByText } = renderDataProvider({
        resources: newResources,
      });

      expect(useLocationsForTenants).toHaveBeenCalledWith({
        tenantIds: ['tenant-1', 'tenant-2'],
      });

      expect(getByText(`locations: ${JSON.stringify(data)}`)).toBeVisible();
    });

    it('should pass isLoadingLocationsForTenants to children', () => {
      useLocationsForTenants.mockReturnValueOnce({
        data: [],
        isLoading: true,
      });

      const { getByText } = renderDataProvider();

      expect(getByText('isLoadingLocationsForTenants: true')).toBeVisible();
    });
  });
});
