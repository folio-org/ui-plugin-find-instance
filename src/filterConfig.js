import React from 'react';
import { FormattedMessage } from 'react-intl';

export const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'chi', name: 'Mandarin' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' },
];

// the empty 'values' properties will be filled in by componentWillUpdate
// as those are pulled from the backend
export const filterConfig = [
  {
    label: <FormattedMessage id="ui-inventory.instances.language" />,
    name: 'language',
    cql: 'languages',
    values: [],
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

export const searchableIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'title="%{query.query}" or contributors =/@name "%{query.query}" or identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title="%{query.query}"' },
  { label: 'ui-inventory.identifier', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
];

export default {};


/*

import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: <FormattedMessage id="ui-plugin-find-user.status" />,
    name: 'active',
    cql: 'active',
    values: [
      {
        name: 'inactive',
        cql: 'false',
        displayName: <FormattedMessage id="ui-users.inactive" />,
      },
      {
        name: 'active',
        cql: 'true',
        displayName: <FormattedMessage id="ui-users.active" />,
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-plugin-find-user.information.patronGroup" />,
    name: 'pg',
    cql: 'patronGroup',
    values: [], // will be filled in by componentWillUpdate
  },
];

export default filterConfig;

*/
