import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';

import {
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import { getFilterConfig } from '../Imports/imports/filterConfig';
import { buildQuery } from './utils';

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
  title: <FormattedMessage id="ui-inventory.instances.columns.title" />,
  contributors: <FormattedMessage id="ui-inventory.instances.columns.contributors" />,
  publishers: <FormattedMessage id="ui-inventory.instances.columns.publishers" />,
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

class FindInstanceContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
      },
    },
    records: {
      throwErrors: false,
      type: 'okapi',
      records: 'instances',
      path: 'inventory/instances',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      resultDensity: 'sparse',
      GET: {
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
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
  });

  constructor(props, context) {
    super(props, context);

    this.state = {
      // The qindex param holds the search index to use for a query,
      // if multiple indices are in play
      qindex: 'all',
      segment: 'instances',
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

  onNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues, state }) => {
    const nsValuesWithIndex = {
      ...nsValues,
      qindex: this.state.qindex,
      segment: this.state.segment,
    };

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

  // Handler for a change of segment in PluginFindRecordModal's <SearchField> component
  setSegment = (segment) => {
    this.setState({ segment, qindex: 'all' });
  }

  render() {
    const {
      resources,
      children,
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
      publishers: r => r.publication.map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
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
      searchIndex: this.state.qindex,
      setSearchIndex: this.setSearchIndex,
      setSegment: this.setSegment,
      source: this.source,
      visibleColumns,
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
};

export default stripesConnect(FindInstanceContainer, { dataKey: 'find_instance' });
