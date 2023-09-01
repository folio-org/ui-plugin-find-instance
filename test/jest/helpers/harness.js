import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import IntlProvider from './intl';

const queryClient = new QueryClient();

const Harness = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider>
        {children}
      </IntlProvider>
    </QueryClientProvider>
  );
};

export default Harness;
