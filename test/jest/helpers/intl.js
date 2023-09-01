import { IntlProvider } from 'react-intl';

import findInstanceTranslations from '../../../translations/ui-plugin-find-instance/en';

const prefixKeys = (translations, prefix) => {
  return Object
    .keys(translations)
    .reduce((acc, key) => (
      {
        ...acc,
        [`${prefix}.${key}`]: translations[key],
      }
    ), {});
};

const translations = {
  ...prefixKeys(findInstanceTranslations, 'ui-plugin-find-instance'),
};

const Intl = ({ children }) => (
  <IntlProvider
    locale="en"
    messages={translations}
  >
    {children}
  </IntlProvider>
);

export default Intl;
