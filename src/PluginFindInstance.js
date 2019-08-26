import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _omit from 'lodash/omit';
import className from 'classnames';
import { FormattedMessage } from 'react-intl';
import contains from 'dom-helpers/query/contains';

import { Button, Icon } from '@folio/stripes/components';

import InstanceSearchModal from './InstanceSearchModal';

import css from './InstanceSearch.css';

class PluginFindInstance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalTrigger = React.createRef();
    this.modalContent = React.createRef();
  }

  getStyle() {
    const { marginBottom0, marginTop0 } = this.props;
    return className(
      css.searchControl,
      { [css.marginBottom0]: marginBottom0 },
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    const {
      afterClose
    } = this.props;

    this.setState({
      openModal: false,
    }, () => {
      if (afterClose) {
        afterClose();
      }

      if (this.modalContent.current && this.modalTrigger.current) {
        if (contains(this.modalContent.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  render() {
    const { id, searchButtonStyle, searchLabel } = this.props;
    // don't inadvertently pass in other resources which could result in resource confusion.
    const isolatedProps = _omit(this.props, ['parentResources', 'resources', 'mutator', 'parentMutator']);

    return (
      <div className={this.getStyle()} data-test-plugin-find-instance>
        <FormattedMessage id="ui-plugin-find-instance.searchButton.title">
          {ariaLabel => (
            <Button
              id={id}
              key="searchButton"
              buttonStyle={searchButtonStyle}
              aria-label={ariaLabel}
              onClick={this.openModal}
              buttonRef={this.modalTrigger}
              data-test-plugin-find-instance-button
            >
              {searchLabel || <Icon icon="search" color="#fff" />}
            </Button>
          )}
        </FormattedMessage>
        <InstanceSearchModal
          openWhen={this.state.openModal}
          closeCB={this.closeModal}
          contentRef={this.modalContent}
          {...isolatedProps}
        />
      </div>
    );
  }
}

PluginFindInstance.defaultProps = {
  id: 'clickable-plugin-find-instance',
  searchButtonStyle: 'primary noRightRadius',
  dataKey: 'plugin_find_instance',
};

PluginFindInstance.propTypes = {
  afterClose: PropTypes.func,
  id: PropTypes.string,
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  onModalClose: PropTypes.func,
  dataKey: PropTypes.string,
};

export default PluginFindInstance;
