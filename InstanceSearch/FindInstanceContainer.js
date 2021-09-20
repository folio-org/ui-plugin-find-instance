import React from 'react';
import PropTypes from 'prop-types';
import {
  keyBy,
  get,
  reduce,
} from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import {
  getFilterConfig,
  advancedSearchIndex,
  operators,
} from '../Imports/imports/filterConfig';

import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../Imports/imports/utils';

import {
  CQL_FIND_ALL,
  FACETS,
  FACETS_TO_REQUEST,
  DEFAULT_FILTERS_NUMBER,
} from '../Imports/imports/constants';
import getElasticQuery from '../Imports/imports/ElasticQueryField/getElasticQuery';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;
const columnWidths = {
  isChecked: '8%',
  title: '40%',
  contributors: '32%',
  publishers: '20%',
};
const visibleColumns = ['title', 'contributors', 'publishers'];
const columnMapping = {
  title: <FormattedMessage id="ui-plugin-find-instance.instances.columns.title" />,
  contributors: <FormattedMessage id="ui-plugin-find-instance.instances.columns.contributors" />,
  publishers: <FormattedMessage id="ui-plugin-find-instance.instances.columns.publishers" />,
};

const idPrefix = 'uiPluginFindInstance-';
const modalLabel = <FormattedMessage id="ui-plugin-find-instance.modal.title" />;
const filterConfig = getFilterConfig().filters;

const setFilterValues = (resource, filterName, nameAttr, cqlAttr) => {
  const filterValues = get(resource, 'records') || [];
  if (filterValues.length) {
    const filterConfigObj = filterConfig.find(group => group.name === filterName);
    filterConfigObj.values = filterValues.map(rec => ({ name: rec[nameAttr], cql: rec[cqlAttr] }));
  }
};

const contributorsFormatter = (r, contributorTypes) => {
  let formatted = '';

  if (!r?.contributors?.length) {
    return formatted;
  }

  const contributorTypesById = keyBy(contributorTypes, 'id');

  for (let i = 0; i < r.contributors.length; i += 1) {
    const contributor = r.contributors[i];
    const type = contributorTypesById[contributor.contributorNameTypeId];
    const typeName = type ? ` (${type.name})` : '';
    formatted += `${(i > 0 ? ' ; ' : '')}${contributor.name}${typeName}`;
  }

  return formatted;
};


export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(props?.segment);
  const query = { ...resourceData.query };
  const queryIndex = query?.qindex ?? 'all';
  const queryValue = query?.query ?? '';
  let queryTemplate = getQueryTemplate(queryIndex, [...indexes, advancedSearchIndex]);

  if (queryIndex.match(/isbn|issn/)) {
    // eslint-disable-next-line camelcase
    const identifierTypes = resourceData?.identifier_types?.records ?? [];
    queryTemplate = getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex);
  }

  if (queryIndex === 'advancedSearch' && queryValue.match('sortby')) {
    query.sort = '';
  }

  resourceData.query = { ...query, qindex: '' };

  // makeQueryFunction escapes quote and backslash characters by default,
  // but when submitting a raw CQL query (i.e. when queryIndex === 'advancedSearch')
  // we assume the user knows what they are doing and wants to run the CQL as-is.
  const cql = makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2,
    null,
    queryIndex !== 'advancedSearch',
  )(queryParams, pathComponents, resourceData, logger, props);

  return cql === undefined
    ? CQL_FIND_ALL
    : cql;
}

class FindInstanceContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
      },
    },
    records: {
      type: 'okapi',
      records: 'instances',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      path: 'inventory/instances',
      GET: {
        path: 'search/instances',
        params: { query: buildQuery },
        staticFallback: { params: {} },
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    locations: {
      throwErrors: false,
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceTypes: {
      throwErrors: false,
      type: 'okapi',
      records: 'instanceTypes',
      path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    contributorTypes: {
      throwErrors: false,
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
    },
    facets: {
      type: 'okapi',
      records: 'facets',
      path: 'search/instances/facets',
      fetch: false,
      accumulate: true,
    },
  });

  constructor(props, context) {
    super(props, context);

    this.state = {
      // The qindex param holds the search index to use for a query,
      // if multiple indices are in play
      qindex: 'advancedSearch',
      isSearchByKeyword: false,
    };

    this.logger = props.stripes.logger;
    this.log = this.logger.log.bind(this.logger);
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger);
    this.props.mutator.query.replace('');
  }

  componentDidUpdate() {
    const { resources } = this.props;
    const locations = get(resources, 'locations') || {};
    const instanceTypes = get(resources, 'instanceTypes') || {};

    setFilterValues(locations, 'location', 'name', 'id');
    setFilterValues(instanceTypes, 'resource', 'name', 'id');
    this.source.update(this.props);
  }

  setIsSearchByKeyword = (value) => {
    this.setState({ isSearchByKeyword: value });
  }

  onNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues, state }) => {
    const nsValuesWithIndex = {
      ...nsValues,
      qindex: this.state.qindex,
    };

    if (state.searchChanged) {
      const {
        intl,
        searchIndexes,
      } = this.props;
      const { isSearchByKeyword } = this.state;
      nsValuesWithIndex.query = getElasticQuery(nsValuesWithIndex.query, isSearchByKeyword, searchIndexes, operators, intl);
    }

    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.replace(nsValuesWithIndex);
    } else {
      this.props.mutator.query.update(nsValuesWithIndex);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  // Handler for a change of search index in PluginFindRecordModal's <SearchField> component
  setSearchIndex = (e) => {
    this.setState({ qindex: e.target.value });
  }

  getFacets = (accordions, accordionsData) => {
    let index = 0;

    return reduce(accordions, (accum, isFacetOpened, facetName) => {
      if (
        isFacetOpened &&
        facetName !== FACETS.UPDATED_DATE &&
        facetName !== FACETS.CREATED_DATE
      ) {
        const facetNameToRequest = FACETS_TO_REQUEST[facetName];
        const defaultFiltersNumber = `:${DEFAULT_FILTERS_NUMBER}`;
        const isFacetValue = accordionsData?.[facetName]?.value;
        const isFilterSelected = accordionsData?.[facetName]?.isSelected;
        const isOnMoreClicked = accordionsData?.[facetName]?.isOnMoreClicked;
        const isNeedAllFilters =
          isOnMoreClicked ||
          isFacetValue ||
          isFilterSelected;

        const symbol = index
          ? ','
          : '';

        index++;
        return `${accum}${symbol}${facetNameToRequest}${isNeedAllFilters ? '' : defaultFiltersNumber}`;
      }
      return accum;
    }, '');
  };

  fetchFacets = (data) => async (properties = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      accordions,
      accordionsData,
      facetToOpen,
    } = properties;
    const {
      resources,
      mutator,
    } = this.props;
    const {
      reset,
      GET,
    } = mutator.facets;
    const { query } = resources;

    // temporary query value
    const params = { query: 'id = *' };
    const cqlQuery = buildQuery(query, {}, { ...data, query }, { log: () => null }, this.props) || '';
    const facetName = facetToOpen || onMoreClickedFacet || focusedFacet;
    const facetNameToRequest = FACETS_TO_REQUEST[facetName];

    if (cqlQuery) params.query = cqlQuery;

    if (facetToOpen) {
      const defaultFiltersNumber = `:${DEFAULT_FILTERS_NUMBER}`;
      params.facet = `${facetNameToRequest}${defaultFiltersNumber}`;
    } else if (onMoreClickedFacet || focusedFacet) {
      params.facet = facetNameToRequest;
    } else {
      const facets = this.getFacets(accordions, accordionsData);
      if (facets) params.facet = facets;
    }

    try {
      reset();
      await GET({ params });
    } catch (error) {
      throw new Error(error);
    }
  };

  render() {
    const {
      resources,
      children,
      searchIndexes,
      segment,
    } = this.props;
    const contributorTypes = get(resources, 'contributorTypes.records') || [];

    const resultsFormatter = {
      title: ({ title }) => (
        <AppIcon
          size="small"
          app="inventory"
          iconKey="instance"
        >
          {title}
        </AppIcon>
      ),
      contributors: r => contributorsFormatter(r, contributorTypes),
      publishers: r => (r?.publication ?? []).map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
    };

    if (this.source) {
      this.source.update(this.props);
    }

    return children({
      columnMapping,
      columnWidths,
      filterConfig,
      idPrefix,
      modalLabel,
      onNeedMoreData: this.onNeedMoreData,
      queryGetter: this.queryGetter,
      querySetter: this.querySetter,
      resultsFormatter,
      setSearchIndex: this.setSearchIndex,
      fetchFacets: this.fetchFacets,
      setIsSearchByKeyword: this.setIsSearchByKeyword,
      source: this.source,
      visibleColumns,
      resources,
      searchIndexes,
      segment,
      data: {
        records: get(resources, 'records.records', []),
      },
    });
  }
}

FindInstanceContainer.propTypes = {
  stripes: PropTypes.object.isRequired,
  children: PropTypes.func,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  segment: PropTypes.string.isRequired,
  searchIndexes: PropTypes.arrayOf(PropTypes.object),
  intl: PropTypes.object,
};

export default injectIntl(stripesConnect(FindInstanceContainer, { dataKey: 'find_instance' }));
