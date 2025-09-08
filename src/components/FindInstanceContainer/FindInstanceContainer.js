import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import flowRight from 'lodash/flowRight';
import classnames from 'classnames';

import { Icon } from '@folio/stripes/components';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';
import {
  withSearchErrors,
  buildRecordsManifest,
  SEARCH_COLUMN_MAPPINGS,
  SEARCH_VISIBLE_COLUMNS,
  getSearchResultsFormatter,
  FACETS,
} from '@folio/stripes-inventory-components';

import { SEARCH_RESULTS_COLUMNS } from '../../constants';

import css from './FindInstanceContainer.css';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;
const columnWidths = {
  [SEARCH_RESULTS_COLUMNS.IS_CHECKED]: '8%',
  [SEARCH_RESULTS_COLUMNS.TITLE]: '40%',
  [SEARCH_RESULTS_COLUMNS.CONTRIBUTORS]: '32%',
  [SEARCH_RESULTS_COLUMNS.PUBLISHERS]: '20%',
};

const idPrefix = 'uiPluginFindInstance-';
const sharedFalse = 'shared.false';
const modalLabel = <FormattedMessage id="ui-plugin-find-instance.modal.title" />;

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

export const applyDefaultFilters = (query, stripes, isSharedDefaultFilter) => {
  const defaultFilter = isSharedDefaultFilter ? sharedFalse : '';

  if (!query.query && query.filters === defaultFilter) {
    // if query is empty and search was not initiated by user action
    // then we need to clear the query.filters here to not automatically search when Inventory search is opened
    query.filters = undefined;
  }

  const isStaffSuppressFilterAvailable = stripes.hasPerm('ui-inventory.instance.staff-suppressed-records.view');

  // if a user doesn't have view staff suppress facet permission - we need to hide staff suppressed records by default
  if (!isStaffSuppressFilterAvailable) {
    const staffSuppressFalse = `${FACETS.STAFF_SUPPRESS}.false`;

    if (!query.query && (!query.filters || query.filters === staffSuppressFalse)) {
      // if query is empty and the only filter value is staffSuppress.false or it's empty
      // then we know that this function call was not initiated by a user performing search
      // so we need to clear filters to avoid unnecessary search on page load
      query.filters = undefined;
    } else {
      query.filters = [query.filters, staffSuppressFalse].filter(Boolean).join(',');
    }
  }
};

class FindInstanceContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
      },
    },
    requestUrlQuery: { initialValue: '' },
    records: buildRecordsManifest(applyDefaultFilters),
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    contributorTypes: {
      tenant: '!{tenantId}',
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
      filters: '',
    });
  }

  componentDidUpdate() {
    this.source.update(this.props);
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
      tenantId,
      contextData,
    } = this.props;
    const contributorTypes = get(resources, 'contributorTypes.records') || [];

    const resultsFormatter = {
      ...getSearchResultsFormatter(contextData),
      [SEARCH_RESULTS_COLUMNS.TITLE]: ({ title, shared }) => (
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
      [SEARCH_RESULTS_COLUMNS.CONTRIBUTORS]: r => contributorsFormatter(r, contributorTypes),
      [SEARCH_RESULTS_COLUMNS.PUBLISHERS]: r => (r?.publication ?? []).map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
    };

    if (this.source) {
      this.source.update(this.props);
    }

    return children({
      columnMapping: SEARCH_COLUMN_MAPPINGS,
      columnWidths,
      idPrefix,
      modalLabel,
      onNeedMoreData: this.onNeedMoreData,
      queryGetter: this.queryGetter,
      querySetter: this.querySetter,
      resultsFormatter,
      source: this.source,
      visibleColumns: SEARCH_VISIBLE_COLUMNS,
      index: this.state.index,
      pageSize: RESULT_COUNT_INCREMENT,
      tenantId,
      data: {
        records: get(resources, 'records.records', []),
        totalRecords: get(resources, 'records.other.totalRecords', 0),
        isPending: get(resources, 'records.isPending', false),
      },
    });
  }
}

FindInstanceContainer.propTypes = {
  contextData: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  children: PropTypes.func,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  tenantId: PropTypes.string,
};

export default flowRight(
  (Component) => stripesConnect(Component, { dataKey: 'find_instance' }),
  withSearchErrors,
)(FindInstanceContainer);
