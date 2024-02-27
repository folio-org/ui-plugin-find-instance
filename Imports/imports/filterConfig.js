import instanceFilterRenderer from '../FilterRenderers/InstanceFilters';
import holdingsRecordFilterRenderer from '../FilterRenderers/HoldingsFilters';
import itemFilterRenderer from '../FilterRenderers/ItemFilters';

import {
  buildDateRangeQuery,
} from './utils';

export const instanceFilterConfig = [
  {
    name: 'shared',
    cql: 'shared',
    values: [],
  },
  {
    name: 'tenantId',
    cql: 'holdings.tenantId',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'language',
    cql: 'languages',
    values: [],
    operator: '=',
  },
  {
    name: 'format',
    cql: 'instanceFormatIds',
    values: [],
    operator: '=',
  },
  {
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    name: 'mode',
    cql: 'modeOfIssuanceId',
    values: [],
  },
  {
    name: 'natureOfContent',
    cql: 'natureOfContentTermIds',
    values: [],
    operator: '=',
  },
  {
    name: 'location',
    cql: 'holdings.permanentLocationId',
    values: [],
  },
  {
    name: 'staffSuppress',
    cql: 'staffSuppress',
    values: [],
    operator: '==',
  },
  {
    name: 'discoverySuppress',
    cql: 'discoverySuppress',
    values: [],
    operator: '==',
  },
  {
    name: 'createdDate',
    cql: 'metadata.createdDate',
    values: [],
    parse: buildDateRangeQuery('createdDate'),
  },
  {
    name: 'updatedDate',
    cql: 'metadata.updatedDate',
    values: [],
    parse: buildDateRangeQuery('updatedDate'),
  },
  {
    name: 'source',
    cql: 'source',
    operator: '==',
    values: [],
  },
  {
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
];

export const instanceIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-plugin-find-instance.contributor', value: 'contributor', queryTemplate: 'contributors="%{query.query}"' },
  { label: 'ui-plugin-find-instance.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-plugin-find-instance.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value="%{query.query}"' },
  { label: 'ui-plugin-find-instance.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.lccn', value: 'lccn', queryTemplate: 'lccn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  { label: 'ui-plugin-find-instance.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-plugin-find-instance.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-plugin-find-instance.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-plugin-find-instance.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.callNumberEyeReadable',
    value: 'holdingsFullCallNumbers',
    queryTemplate: 'holdingsFullCallNumbers="%{query.query}"' },
  { label: 'ui-plugin-find-instance.callNumberNormalized',
    value: 'callNumberNormalized',
    queryTemplate: 'holdingsNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-plugin-find-instance.holdingsHrid', value: 'hrid', queryTemplate: 'holdings.hrid=="%{query.query}"' },
  { label: 'ui-plugin-find-instance.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: 'shared',
    cql: 'shared',
    values: [],
  },
  {
    name: 'tenantId',
    cql: 'holdings.tenantId',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdings.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'holdings.discoverySuppress',
    values: [],
    operator: '==',
  },
  {
    name: 'tags',
    cql: 'holdings.tags.tagList',
    values: [],
    operator: '=',
  },
];

export const itemIndexes = [
  { label: 'ui-plugin-find-instance.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-plugin-find-instance.barcode', value: 'items.barcode', queryTemplate: 'items.barcode=="%{query.query}"' },
  { label: 'ui-plugin-find-instance.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-plugin-find-instance.itemEffectiveCallNumberEyeReadable',
    value: 'itemFullCallNumbers',
    queryTemplate: 'itemFullCallNumbers="%{query.query}"' },
  { label: 'ui-plugin-find-instance.itemEffectiveCallNumberNormalized',
    value: 'itemNormalizedCallNumbers',
    queryTemplate: 'itemNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-plugin-find-instance.itemHrid', value: 'hrid', queryTemplate: 'items.hrid=="%{query.query}"' },
  { label: 'ui-plugin-find-instance.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },

];

export const itemFilterConfig = [
  {
    name: 'shared',
    cql: 'shared',
    values: [],
  },
  {
    name: 'tenantId',
    cql: 'holdings.tenantId',
    values: [],
  },
  {
    name: 'materialType',
    cql: 'items.materialTypeId',
    values: [],
  },
  {
    name: 'itemStatus',
    cql: 'items.status.name',
    operator: '==',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdings.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'items.discoverySuppress',
    values: [],
    operator: '==',
  },
  {
    name: 'tags',
    cql: 'items.tags.tagList',
    values: [],
    operator: '=',
  },
];

export const itemSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

const allFilters = instanceFilterConfig.concat(holdingFilterConfig, itemFilterConfig);

const config = {
  instances: {
    filters: allFilters,
    indexes: instanceIndexes,
    sortMap: instanceSortMap,
    renderer: instanceFilterRenderer,
  },
  holdings: {
    filters: allFilters,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
  },
  items: {
    filters: allFilters,
    indexes: itemIndexes,
    sortMap: itemSortMap,
    renderer: itemFilterRenderer,
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
