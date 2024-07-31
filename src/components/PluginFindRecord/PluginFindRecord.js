import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import noop from 'lodash/noop';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import { DataProvider } from '../../contexts';

import css from './PluginFindRecord.css';

const triggerId = 'find-instance-trigger';

class PluginFindRecord extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openModal: !this.props.withTrigger,
    };
  }

  getStyle() {
    const { marginBottom0, marginTop0 } = this.props;

    return className(
      css.searchControl,
      { [css.marginBottom0]: marginBottom0 },
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal = () => this.setState({
    openModal: true,
  });

  closeModal = () => {
    const { onClose } = this.props;
    this.setState({ openModal: false });
    if (onClose) onClose();
  };

  passRecordsOut = records => {
    this.props.selectRecordsCb(records);
    this.setState({ openModal: false });
  }

  passRecordOut = (e, record) => {
    this.passRecordsOut([record]);
  }

  renderDefaultTrigger() {
    const { disabled, searchButtonStyle, searchLabel } = this.props;

    return (
      <Button
        buttonStyle={searchButtonStyle}
        data-test-plugin-find-record-button
        disabled={disabled}
        id={triggerId}
        key="searchButton"
        onClick={this.openModal}
      >
        {searchLabel}
      </Button>
    );
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger
      ? renderTrigger({
        id: triggerId,
        onClick: this.openModal,
      })
      : this.renderDefaultTrigger();
  }

  render() {
    const { children, withTrigger, tenantId } = this.props;

    return (
      <div className={this.getStyle()}>
        {withTrigger && this.renderTriggerButton()}
        {
          this.state.openModal &&
          <DataProvider tenantId={tenantId}>
            {
              children({
                onSaveMultiple: this.passRecordsOut,
                onSelectRow: this.passRecordOut,
                closeModal: this.closeModal,
              })
            }
          </DataProvider>
        }
      </div>
    );
  }
}

PluginFindRecord.propTypes = {
  children: PropTypes.func,
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  withTrigger: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  selectRecordsCb: PropTypes.func,
  onClose: PropTypes.func,
  tenantId: PropTypes.string,
};

PluginFindRecord.defaultProps = {
  disabled: false,
  marginBottom0: true,
  marginTop0: true,
  searchButtonStyle: 'primary',
  selectRecordsCb: noop,
  searchLabel: <Icon icon="search" color="#fff" />,
  withTrigger: true,
};

export default PluginFindRecord;
