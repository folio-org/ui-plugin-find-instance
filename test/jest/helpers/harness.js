import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import IntlProvider from './intl';
import DataContext from '../../../Imports/imports/DataContext';
import DataProvider from '../../../Imports/imports/DataProvider';

const queryClient = new QueryClient();
const defaultHistory = createMemoryHistory();

const DataProviderMock = ({ ctxValue, children }) => (
  <DataContext.Provider value={ctxValue}>
    {children}
  </DataContext.Provider>
);

const Harness = ({
  children,
  history = defaultHistory,
  dataContext,
}) => {
  const DataProviderComponent = dataContext
    ? DataProviderMock
    : DataProvider;

  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderComponent ctxValue={dataContext}>
        <Router history={history}>
          <IntlProvider>
            {children}
          </IntlProvider>
        </Router>
      </DataProviderComponent>
    </QueryClientProvider>
  );
};

export default Harness;
