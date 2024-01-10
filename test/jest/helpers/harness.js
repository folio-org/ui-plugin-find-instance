import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import IntlProvider from './intl';

const queryClient = new QueryClient();
const defaultHistory = createMemoryHistory();

const Harness = ({
  children,
  history = defaultHistory,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router history={history}>
        <IntlProvider>
          {children}
        </IntlProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default Harness;
