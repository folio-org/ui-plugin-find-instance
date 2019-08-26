import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';
import InstanceSearchContainer from './InstanceSearchContainer';
import InstanceSearchView from './InstanceSearchView';

import css from './InstanceSearch.css';

class InstanceSearchModal extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    selectInstances: PropTypes.func,
    selectInstance: PropTypes.func,
    closeCB: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func,
    openWhen: PropTypes.bool,
    dataKey: PropTypes.string,
    contentRef: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.modalContent = props.contentRef || React.createRef();
  }

  closeModal = () => {
    this.setState({
      error: null,
    },
    () => {
      this.props.closeCB();
    });
  }

  passInstanceOut = (e, instance) => {
    this.props.selectInstance(instance);

    if (!instance.error) {
      this.closeModal();
    } else {
      this.setState({
        error: instance.error,
      });
    }
  }

  passInstancesOut = instances => {
    this.props.selectInstances(instances);
    this.closeModal();
  }

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        dismissible
        enforceFocus={false}
        label={<FormattedMessage id="ui-plugin-find-instance.modal.label" />}
        open={this.props.openWhen}
        size="large"
        onClose={this.closeModal}
      >
        {this.state.error ? <div className={css.instanceError}>{this.state.error}</div> : null}
        <InstanceSearchContainer {...this.props} onComponentWillUnmount={this.props.onCloseModal}>
          { (viewProps) => <InstanceSearchView
            {...viewProps}
            onSaveMultiple={this.passInstancesOut}
            onSelectRow={this.passInstanceOut}
            contentRef={this.modalContent}
            isMultiSelect={Boolean(this.props.selectInstances)}
          /> }
        </InstanceSearchContainer>
      </Modal>
    );
  }
}

export default InstanceSearchModal;
