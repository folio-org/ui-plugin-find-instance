import '../test/jest/__mock__';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import FindInstanceContainer, { buildQuery } from './FindInstanceContainer';

const mockStripesConnectedSourceValues = {
  fetchMore: jest.fn(),
  fetchOffset: jest.fn(),
  update: jest.fn()
};

StripesConnectedSource.mockImplementation(jest.fn(() => mockStripesConnectedSourceValues));

const defaultProps = {
  mutator: {
    query: {
      replace: jest.fn(),
      update: jest.fn()
    },
    resultOffset: {
      replace: jest.fn()
    }
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
  }
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
    {({ data, onNeedMoreData, querySetter, resultsFormatter, setSearchIndex }) => {
      const querySetterValues = {
        nsValues: {},
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
        setSearchIndex({ target: { value: 'isbn' } });
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
    userEvent.click(screen.getByText('onNeedMoreData'));
    expect(mockStripesConnectedSourceValues.fetchMore).toBeCalled();
  });
  it('query.update function to be called when changeType value is not reset', () => {
    userEvent.click(screen.getByText('querySetterForUpdate'));
    expect(defaultProps.mutator.query.update).toBeCalledWith({ qindex: '' });
  });
  it('query.replace function to be called when changeType value is reset', () => {
    userEvent.click(screen.getByText('querySetterForReset'));
    expect(defaultProps.mutator.query.replace).toBeCalledWith({ qindex: '' });
  });
  describe('buildQuery', () => {
    it('makeQueryFunction to be called', () => {
      const queryParams = 'queryParams';
      const pathComponents = 'pathComponents';
      const resourceData = {
        identifier_types: {
          records: []
        },
        query: {
          sort: ''
        }
      };
      const logger = 'logger';
      buildQuery(queryParams, pathComponents, resourceData, logger, defaultProps);
      expect(makeQueryFunction).toBeCalled();
    });
  });
});
