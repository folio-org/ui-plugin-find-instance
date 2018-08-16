import React from 'react';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import className from 'classnames';

import css from './InstanceSearch.css';
import InstanceSearchModal from './InstanceSearchModal';

export default class InstanceSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
    this.setState({
      openModal: false,
    });
  }

  render() {
    return (
      <div className={this.getStyle()}>
        <Button
          id="clickable-plugin-find-user"
          key="searchButton"
          buttonStyle={this.props.searchButtonStyle}
          onClick={this.openModal}
          title="Find Instance"
          tabIndex="-1"
        >
          {this.props.searchLabel ? this.props.searchLabel : <Icon icon="search" color="#fff" />}
        </Button>
        <InstanceSearchModal
          openWhen={this.state.openModal}
          closeCB={this.closeModal}
          {...this.props}
        />
      </div>
    );
  }
}

InstanceSearch.defaultProps = {
  searchButtonStyle: 'primary noRightRadius',
};

InstanceSearch.propTypes = {
  searchLabel: PropTypes.string,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
};
