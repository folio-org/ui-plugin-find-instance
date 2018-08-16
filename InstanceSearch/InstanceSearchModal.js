import React from 'react';
import PropTypes from 'prop-types';
import Instances from '@folio/inventory/Instances';
import Modal from '@folio/stripes-components/lib/Modal';

import css from './InstanceSearch.css';

export default class InstanceSearchModal extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    selectInstance: PropTypes.func.isRequired,
    closeCB: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func,
    openWhen: PropTypes.bool,
    dataKey: PropTypes.string,
  }

  constructor(props) {
    super(props);

    const dataKey = props.dataKey;
    this.connectedApp = props.stripes.connect(Instances, { dataKey });

    this.state = {
      error: null,
    };

    this.closeModal = this.closeModal.bind(this);
    this.passInstanceOut = this.passInstanceOut.bind(this);
  }

  closeModal() {
    this.props.closeCB();
    this.setState({
      error: null,
    });
  }

  passInstanceOut(e, instance) {
    this.props.selectInstance(instance);

    if (!instance.error) {
      this.closeModal();
    } else {
      this.setState({
        error: instance.error,
      });
    }
  }

  render() {
    return (
      <Modal onClose={this.closeModal} size="large" open={this.props.openWhen} label="Select Instance" dismissible>
        <div className={css.instanceSearchModal}>
          {this.state.error ? <div className={css.instanceError}>{this.state.error}</div> : null}
          <this.connectedApp
            {...this.props}
            onSelectRow={this.passInstanceOut}
            onComponentWillUnmount={this.props.onCloseModal}
            showSingleResult={false}
            browseOnly
            match={{ path: '' }}
          />
        </div>
      </Modal>
    );
  }
}
