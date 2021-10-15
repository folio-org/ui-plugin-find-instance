import {
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { get, template } from 'lodash';

import { getFilterConfig } from '../Imports/imports/filterConfig';

export const CQL_FIND_ALL = 'cql.allRecords=1';

export function getQueryTemplate(queryIndex, indexes) {
  const searchableIndex = indexes.find(({ value }) => value === queryIndex);

  return get(searchableIndex, 'queryTemplate');
}

export function getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex) {
  const identifierType = identifierTypes
    .find(({ name }) => name.toLowerCase() === queryIndex);
  const identifierTypeId = get(identifierType, 'id', 'identifier-type-not-found');

  return template(queryTemplate)({ identifierTypeId });
}

export function buildQuery(queryParams, pathComponents, resourceData, logger) {
  const query = { ...resourceData.query };

  const { indexes, sortMap, filters } = getFilterConfig(query.segment);
  const queryIndex = query?.qindex || 'all';
  const queryValue = get(query, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  if (queryIndex.match(/isbn|issn/)) {
    // eslint-disable-next-line camelcase
    const identifierTypes = resourceData?.identifier_types?.records ?? [];
    queryTemplate = getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex);
  }

  if (queryIndex === 'querySearch' && queryValue.match('sortby')) {
    query.sort = '';
  } else if (!query.sort) {
    // Default sort for filtering/searching instances/holdings/items should be by title (UIIN-1046)
    query.sort = 'title';
  }

  resourceData.query = { ...query, qindex: '' };

  // makeQueryFunction escapes quote and backslash characters by default,
  // but when submitting a raw CQL query (i.e. when queryIndex === 'querySearch')
  // we assume the user knows what they are doing and wants to run the CQL as-is.
  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2,
    null,
    queryIndex !== 'querySearch',
  )(queryParams, pathComponents, resourceData, logger);
}
