import React from 'react';
import PropTypes from 'prop-types';
import { get, template } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';

import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import { searchableIndexes, languages, filterConfig } from './filterConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InstanceSearchContainer extends React.Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'instances',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'inventory/instances',
      GET: {
        params: {
          query: (...args) => {
            const [
              queryParams,
              pathComponents,
              resourceData,
              logger
            ] = args;
            const queryIndex = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === queryIndex);
            let queryTemplate = '';

            if (queryIndex === 'isbn' || queryIndex === 'issn') {
              const identifierType = resourceData.identifier_types.records.find(type => type.name.toLowerCase() === queryIndex);
              const identifierTypeId = identifierType ? identifierType.id : 'identifier-type-not-found';

              queryTemplate = template(searchableIndex.queryTemplate)({ identifierTypeId });
            } else {
              queryTemplate = searchableIndex.queryTemplate;
            }

            resourceData.query = { ...resourceData.query, qindex: '' };

            return makeQueryFunction(
              'cql.allRecords=1',
              queryTemplate,
              {
                Title: 'title',
                publishers: 'publication',
                Contributors: 'contributors',
              },
              filterConfig,
              2
            )(queryParams, pathComponents, resourceData, logger);
          }
        },
        staticFallback: { params: {} },
      },
    },
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
    },
    contributorNameTypes: {
      type: 'okapi',
      records: 'contributorNameTypes',
      path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
    },
    instanceFormats: {
      type: 'okapi',
      records: 'instanceFormats',
      path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceTypes: {
      type: 'okapi',
      records: 'instanceTypes',
      path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    classificationTypes: {
      type: 'okapi',
      records: 'classificationTypes',
      path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    alternativeTitleTypes: {
      type: 'okapi',
      records: 'alternativeTitleTypes',
      path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceStatuses: {
      type: 'okapi',
      records: 'instanceStatuses',
      path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    },
    modesOfIssuance: {
      type: 'okapi',
      records: 'issuanceModes',
      path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceNoteTypes: {
      type: 'okapi',
      path: 'instance-note-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'instanceNoteTypes',
    },
    electronicAccessRelationships: {
      type: 'okapi',
      records: 'electronicAccessRelationships',
      path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
    },
    statisticalCodeTypes: {
      type: 'okapi',
      records: 'statisticalCodeTypes',
      path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    statisticalCodes: {
      type: 'okapi',
      records: 'statisticalCodes',
      path: 'statistical-codes?limit=1000&query=cql.allRecords=1 sortby name',
    },
    illPolicies: {
      type: 'okapi',
      path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'illPolicies',
    },
    holdingsTypes: {
      type: 'okapi',
      path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'holdingsTypes',
    },
    callNumberTypes: {
      type: 'okapi',
      path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'callNumberTypes',
    },
    holdingsNoteTypes: {
      type: 'okapi',
      path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'holdingsNoteTypes',
    },
    itemNoteTypes: {
      type: 'okapi',
      path: 'item-note-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'itemNoteTypes',
    },
    itemDamagedStatuses: {
      type: 'okapi',
      path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'itemDamageStatuses',
    },
  });

  static propTypes = {
    children: PropTypes.func,
    resources: PropTypes.shape({
      instanceFormats: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      locations: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      })
    }).isRequired,
    mutator: PropTypes.shape({
      initializedFilterConfig: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      records: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }),
      resultCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.object
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.log = this.logger.log.bind(this.logger);
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger);
    this.props.mutator.query.replace('');
    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate() {
    const instanceFormats = (this.props.resources.instanceFormats || {}).records || [];
    if (instanceFormats.length) {
      const instanceFormatFilterConfig = filterConfig.find(f => f.name === 'resource');
      const oldValuesLength = instanceFormatFilterConfig.values.length;
      instanceFormatFilterConfig.values = instanceFormats.map(rec => ({ name: rec.group, cql: rec.id }));
      if (oldValuesLength === 0) {
        this.props.mutator.initializedFilterConfig.replace(true); // triggers refresh of instances
      }
    }

    const locations = (this.props.resources.locations || {}).records || [];
    if (locations.length) {
      const locationFilterConfig = filterConfig.find(f => f.name === 'location');
      const oldValuesLength = locationFilterConfig.values.length;
      locationFilterConfig.values = locations.map(rec => ({ name: rec.group, cql: rec.id }));
      if (oldValuesLength === 0) {
        this.props.mutator.initializedFilterConfig.replace(true); // triggers refresh of instances
      }
    }

    this.source.update(this.props);
  }

  onNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.replace(nsValues);
    } else {
      this.props.mutator.query.update(nsValues);
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

    if (this.source) {
      this.source.update(this.props);
    }

    return children({
      initialSearch: '?sort=name',
      source: this.source,
      queryGetter: this.queryGetter,
      querySetter: this.querySetter,
      onNeedMoreData: this.onNeedMoreData,
      data: {
        instances: (resources.records || {}).records || [],
        instanceTypes: (resources.instanceTypes || {}).records || [],
        languages,
        locations: (resources.locations || {}).records || [],
      },
    });
  }
}

export default stripesConnect(InstanceSearchContainer, { dataKey: 'plugin_find_instance' });
