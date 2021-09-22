import { instanceFilterRenderer } from './InstanceFilters';
import { holdingsRecordFilterRenderer } from './HoldingsFilters';
import { itemFilterRenderer } from './ItemFilters';

import {
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
} from './utils';
import {
  FACETS,
  FACETS_CQL
} from './constants';
import {
  AND,
  NOT,
  OR
} from './ElasticQueryField/constants';

export const instanceFilterConfig = [
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.LANGUAGE,
    cql: FACETS_CQL.LANGUAGES,
    values: [],
  },
  {
    name: FACETS.FORMAT,
    cql: FACETS_CQL.INSTANCE_FORMAT,
    values: [],
  },
  {
    name: FACETS.RESOURCE,
    cql: FACETS_CQL.INSTANCE_TYPE,
    values: [],
  },
  {
    name: FACETS.MODE,
    cql: FACETS_CQL.MODE_OF_ISSUANCE,
    values: [],
  },
  {
    name: FACETS.NATURE_OF_CONTENT,
    cql: FACETS_CQL.NATURE_OF_CONTENT,
    values: [],
  },
  {
    name: 'location',
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS_CQL.STAFF_SUPPRESS,
    cql: FACETS_CQL.STAFF_SUPPRESS,
    values: [],
    parse: buildOptionalBooleanQuery(FACETS_CQL.STAFF_SUPPRESS),
  },
  {
    name: FACETS.INSTANCES_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS,
    values: [],
    parse: buildOptionalBooleanQuery(FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS),
  },
  {
    name: FACETS.CREATED_DATE,
    cql: FACETS_CQL.CREATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS.CREATED_DATE),
  },
  {
    name: FACETS.UPDATED_DATE,
    cql: FACETS_CQL.UPDATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS.UPDATED_DATE),
  },
  {
    name: FACETS.SOURCE,
    cql: FACETS_CQL.SOURCE,
    operator: '==',
    values: [],
  },
  {
    name: FACETS.INSTANCES_TAGS,
    cql: FACETS_CQL.INSTANCES_TAGS,
    values: [],
  },
];

export const instanceIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-plugin-find-instance.title', value: 'Title', queryTemplate: 'title all' },
  { label: 'ui-plugin-find-instance.contributor', value: 'Contributor', queryTemplate: 'contributors=' },
  { label: 'ui-plugin-find-instance.identifierAll', value: 'Identifier', queryTemplate: 'identifiers.value==' },
  { label: 'ui-plugin-find-instance.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-plugin-find-instance.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-plugin-find-instance.subject', value: 'Subject', queryTemplate: 'subjects all' },
  { label: 'ui-plugin-find-instance.instanceId', value: 'UUID', queryTemplate: 'id==' },
  { label: 'ui-plugin-find-instance.instanceHrid', value: 'HRID', queryTemplate: 'hrid==' },
  { label: 'ui-plugin-find-instance.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-plugin-find-instance.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-plugin-find-instance.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-plugin-find-instance.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-plugin-find-instance.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
];

export const advancedSearchIndex = { label: 'ui-plugin-find-instance.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' };


export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-plugin-find-instance.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-plugin-find-instance.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-plugin-find-instance.callNumber', value: 'Call Number', queryTemplate: 'holdings.fullCallNumber==' },
  { label: 'ui-plugin-find-instance.holdingsHrid', value: 'HRID', queryTemplate: 'holdings.hrid==' },
  { label: 'ui-plugin-find-instance.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-plugin-find-instance.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-plugin-find-instance.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-plugin-find-instance.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-plugin-find-instance.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_PERMANENT_LOCATION,
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS,
    values: [],
    parse: buildOptionalBooleanQuery(FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS),
  },
  {
    name: FACETS.HOLDINGS_TAGS,
    cql: FACETS_CQL.HOLDINGS_TAGS,
    values: [],
  },
];

export const itemIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-plugin-find-instance.barcode', value: 'Barcode', queryTemplate: 'items.barcode==' },
  { label: 'ui-plugin-find-instance.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-plugin-find-instance.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-plugin-find-instance.callNumber', value: 'Call Number', queryTemplate: 'items.effectiveCallNumberComponents==' },
  { label: 'ui-plugin-find-instance.itemHrid', value: 'Item HRID', queryTemplate: 'items.hrid==' },
  { label: 'ui-plugin-find-instance.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-plugin-find-instance.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-plugin-find-instance.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-plugin-find-instance.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-plugin-find-instance.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
];

export const itemFilterConfig = [
  {
    name: FACETS.MATERIAL_TYPE,
    cql: FACETS_CQL.MATERIAL_TYPES,
    values: [],
  },
  {
    name: FACETS.ITEM_STATUS,
    cql: FACETS_CQL.ITEMS_STATUSES,
    operator: '==',
    values: [],
  },
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_PERMANENT_LOCATION,
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS.ITEMS_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS,
    values: [],
    parse: buildOptionalBooleanQuery(FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS),
  },
  {
    name: FACETS.ITEMS_TAGS,
    cql: FACETS_CQL.ITEMS_TAGS,
    values: [],
  },
];

export const operators = [
  { label: '=', queryTemplate: '' },
];

export const booleanOperators = [
  { label: AND },
  { label: OR },
  { label: NOT },
];

export const itemSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

const config = {
  instances: {
    filters: instanceFilterConfig,
    indexes: instanceIndexes,
    sortMap: instanceSortMap,
    renderer: instanceFilterRenderer,
    operators,
    booleanOperators,
  },
  holdings: {
    filters: holdingFilterConfig,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
    operators,
    booleanOperators,
  },
  items: {
    filters: itemFilterConfig,
    indexes: itemIndexes,
    sortMap: itemSortMap,
    renderer: itemFilterRenderer,
    operators,
    booleanOperators,
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
