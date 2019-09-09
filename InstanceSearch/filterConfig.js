import React from 'react';
import { FormattedMessage } from 'react-intl';

const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'chi', name: 'Mandarin' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' },
];

const filterConfig = [
  {
    label: <FormattedMessage id="ui-inventory.instances.language" />,
    name: 'language',
    cql: 'languages',
    values: languages.map(({ code, name }) => ({
      name,
      cql: code,
    })),
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.resourceType" />,
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.location" />,
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
];

export default filterConfig;
