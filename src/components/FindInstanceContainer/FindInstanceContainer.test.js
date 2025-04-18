import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { buildSearchQuery } from '@folio/stripes-inventory-components';

import FindInstanceContainer, { applyDefaultFilters } from './FindInstanceContainer';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn(),
}));

const mockStripesConnectedSourceValues = {
  fetchMore: jest.fn(),
  fetchOffset: jest.fn(),
  update: jest.fn()
};

StripesConnectedSource.mockImplementation(jest.fn(() => mockStripesConnectedSourceValues));

const defaultProps = {
  segment: 'instances',
  mutator: {
    query: {
      replace: jest.fn(),
      update: jest.fn()
    },
    resultOffset: {
      replace: jest.fn()
    },
    requestUrlQuery: {
      replace: jest.fn(),
    },
  },
  resources: {
    contributorTypes: {
      records: [
        {
          id: 'testId',
        }
      ],
    },
    instanceTypes: {
      records: [
        {
          id: 'instanceTypesId',
          name: 'instanceTypesName'
        }
      ],
    },
    locations: {
      records: [
        {
          id: 'locationId',
          name: 'locationName'
        }
      ]
    },
    query: {
      qindex: 'isbn',
      query: 'qvalue'
    },
    records: {
      isPending: false,
      other: {
        totalRecords: 0
      },
      records: []
    },
  },
  stripes: {
    logger: {
      log: jest.fn()
    }
  },
  contextData: {
    instanceDateTypes: [],
  },
};
const contributorsData = {
  contributors: [
    {
      id: 'testId',
      name: 'testName'
    }
  ],
};
const publishersData = {
  publication: [
    {
      publisher: 'testPublisher',
      dateOfPublication: '2023-02-03'
    }
  ]
};
const renderFindInstanceContainer = (prop) => render(
  <FindInstanceContainer {...prop}>
    {({ data, onNeedMoreData, querySetter, resultsFormatter }) => {
      const querySetterValues = {
        nsValues: {
          qindex: '',
        },
        state: {
          changeType: 'update'
        }
      };
      const querySetterValuesForReset = {
        nsValues: {},
        state: {
          changeType: 'reset'
        }
      };
      const onclickAction = () => {
        resultsFormatter.title({ title: 'title' });
        resultsFormatter.contributors(contributorsData);
        resultsFormatter.publishers(publishersData);
      };
      return (
        <div
          onClick={onclickAction}
          onKeyDown={onclickAction}
          aria-hidden="true"
        >
          <div data-testid="total-records">{data.totalRecords}</div>
          <div data-testid="is-pending">{data.isPending.toString()}</div>
          <button type="button" onClick={onNeedMoreData} aria-hidden="true">onNeedMoreData</button>
          <button type="button" onClick={querySetter(querySetterValues)}>querySetterForUpdate</button>
          <button type="button" onClick={querySetter(querySetterValuesForReset)}>querySetterForReset</button>
        </div>
      );
    }}
  </FindInstanceContainer>
);
describe('FindInstanceContainer', () => {
  beforeEach(() => renderFindInstanceContainer(defaultProps));
  afterEach(() => jest.clearAllMocks());

  it('Component should render correctly', () => {
    expect(screen.getByTestId('total-records')).toBeInTheDocument();
  });

  it('should call soure.fetchMore on onNeedMoreData', () => {
    fireEvent.click(screen.getByText('onNeedMoreData'));
    expect(mockStripesConnectedSourceValues.fetchMore).toHaveBeenCalled();
  });

  it('query.update function to be called when changeType value is not reset', () => {
    fireEvent.click(screen.getByText('querySetterForUpdate'));
    expect(defaultProps.mutator.query.update).toHaveBeenCalledWith({ qindex: '' });
  });

  it('query.replace function to be called when changeType value is reset', () => {
    fireEvent.click(screen.getByText('querySetterForReset'));
    expect(defaultProps.mutator.query.replace).toHaveBeenCalledWith({
      qindex: '',
      query: '',
      filters: '',
    });
  });

  describe('buildSearchQuery', () => {
    describe('when query is empty', () => {
      it('should return empty query parameters', () => {
        const queryParams = 'queryParams';
        const pathComponents = 'pathComponents';
        const resourceData = {
          identifier_types: {
            records: []
          },
          query: {
            sort: '',
            query: '',
            filters: '',
          },
        };
        const logger = { log: jest.fn() };
        const result = buildSearchQuery(applyDefaultFilters)(queryParams, pathComponents, resourceData, logger, defaultProps);
        expect(result).toBeNull();
      });
    });

    describe('when query is not empty', () => {
      it('should return correct query parameters', () => {
        const queryParams = {
          qindex: 'isbn',
        };
        const pathComponents = 'pathComponents';
        const resourceData = {
          identifier_types: {
            records: []
          },
          query: {
            sort: '',
            query: 'test',
            filters: '',
          },
        };
        const logger = { log: jest.fn() };
        const result = buildSearchQuery(applyDefaultFilters)(queryParams, pathComponents, resourceData, logger, defaultProps);
        expect(result).toEqual('(isbn="test") sortby title');
      });
    });
  });
});
