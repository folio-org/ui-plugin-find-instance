import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { Icon } from '@folio/stripes/components';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import { getFilterConfig } from '../Imports/imports/filterConfig';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../Imports/imports/utils';
import {
  CQL_FIND_ALL,
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '../Imports/imports/constants';

import css from './FindInstanceContainer.css';

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
const staffSuppressFalse = 'staffSuppress.false';
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

  if (r.contributors && r.contributors.length) {
    for (let i = 0; i < r.contributors.length; i += 1) {
      const contributor = r.contributors[i];
      const type = contributorTypes.find(ct => ct.id === contributor.contributorNameTypeId);

      formatted += (i > 0 ? ' ; ' : '') +
                   contributor.name +
                   (type ? ` (${type.name})` : '');
    }
  }

  return formatted;
};

const applyDefaultStaffSuppressFilter = (query) => {
  const isUserTouchedStaffSuppress = JSON.parse(sessionStorage.getItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY));

  if (!query.query && query.filters === staffSuppressFalse && !isUserTouchedStaffSuppress) {
    // if query is empty and the only filter value is staffSuppress.false and search was not initiated by user action
    // then we need to clear the query.filters here to not automatically search when Inventory search is opened
    query.filters = undefined;
  }
};

export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(props.segment);
  const query = { ...resourceData.query };
  const queryIndex = props?.resources?.query?.qindex || 'all';
  const queryValue = props?.resources?.query?.query ?? '';
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

  applyDefaultStaffSuppressFilter(query);

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
  )(queryParams, pathComponents, resourceData, logger, props);
}


class FindInstanceContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: staffSuppressFalse,
      },
    },
    records: {
      accumulate: 'true',
      throwErrors: false,
      type: 'okapi',
      records: 'instances',
      resultDensity: 'sparse',
      path: 'search/instances',
      recordsRequired: '%{resultCount}',
      resultOffset: '%{resultOffset}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          expandAll: true,
          query: buildQuery,
        },
        staticFallback: { params: {} },
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
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
  });

  constructor(props, context) {
    super(props, context);

    this.state = {
      index: 0,
    };

    this.logger = props.stripes.logger;
    this.log = this.logger.log.bind(this.logger);
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger);
    this.props.mutator.query.replace({
      qindex: '',
      query: '',
      filters: staffSuppressFalse,
    });
    window.addEventListener('beforeunload', this.clearStaffSuppressStorageFlag);
  }

  componentDidUpdate() {
    const { resources } = this.props;
    const locations = get(resources, 'locations') || {};
    const instanceTypes = get(resources, 'instanceTypes') || {};

    setFilterValues(locations, 'location', 'name', 'id');
    setFilterValues(instanceTypes, 'resource', 'name', 'id');

    this.source.update(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.clearStaffSuppressStorageFlag);
    this.clearStaffSuppressStorageFlag();
  }

  clearStaffSuppressStorageFlag = () => {
    sessionStorage.setItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, false);
  }

  fetchMore = () => {
    this.source.fetchMore(RESULT_COUNT_INCREMENT);
  };

  onNeedMoreData = (_amount, index) => {
    const {
      mutator: { resultOffset },
    } = this.props;

    if (this.source) {
      if (resultOffset && index >= 0) {
        this.source.fetchOffset(index);
      } else {
        this.fetchMore();
      }
    }
  };


  querySetter = ({ nsValues, state }) => {
    const {
      mutator: { query, resultOffset },
    } = this.props;

    if (resultOffset) {
      resultOffset.replace(0);
    }

    if (/reset/.test(state.changeType)) {
      query.replace(nsValues);
    } else {
      query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const {
      resources,
      children,
    } = this.props;
    const contributorTypes = get(resources, 'contributorTypes.records') || [];

    const resultsFormatter = {
      title: ({ title, shared }) => (
        <div className={css.titleContainer}>
          <AppIcon
            size="small"
            app="inventory"
            iconKey="instance"
          >
            {title}
          </AppIcon>
          {shared &&
            <Icon
              size="medium"
              icon="graph"
              iconRootClass={css.sharedIconRoot}
              iconClassName={classnames(
                css.sharedIcon,
              )}
            />
          }
        </div>
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
      source: this.source,
      visibleColumns,
      index: this.state.index,
      pageSize: RESULT_COUNT_INCREMENT,
      data: {
        records: get(resources, 'records.records', []),
        totalRecords: get(resources, 'records.other.totalRecords', 0),
        isPending: get(resources, 'records.isPending', false),
      },
    });
  }
}

FindInstanceContainer.propTypes = {
  stripes: PropTypes.object.isRequired,
  children: PropTypes.func,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FindInstanceContainer, { dataKey: 'find_instance' });
