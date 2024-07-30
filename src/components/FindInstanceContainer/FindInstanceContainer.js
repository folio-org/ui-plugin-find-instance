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
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
  withSearchErrors,
  buildRecordsManifest,
} from '@folio/stripes-inventory-components';

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

export const applyDefaultStaffSuppressFilter = (query) => {
  const isUserTouchedStaffSuppress = JSON.parse(sessionStorage.getItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY));

  if (!query.query && query.filters === staffSuppressFalse && !isUserTouchedStaffSuppress) {
    // if query is empty and the only filter value is staffSuppress.false and search was not initiated by user action
    // then we need to clear the query.filters here to not automatically search when Inventory search is opened
    query.filters = undefined;
  }
};

class FindInstanceContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: staffSuppressFalse,
      },
    },
    requestUrlQuery: { initialValue: '' },
    records: buildRecordsManifest(applyDefaultStaffSuppressFilter),
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
      filters: staffSuppressFalse,
    });
    window.addEventListener('beforeunload', this.clearStaffSuppressStorageFlag);
  }

  componentDidUpdate() {
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
      tenantId,
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
