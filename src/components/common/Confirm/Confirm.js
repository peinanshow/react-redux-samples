import React, { PropTypes, Component } from 'react';
import Modal from '../Modal';
import s from './Confirm.scss';

class Confirm extends Component {

  handleOnDismiss = () => this.props.onCancel();

  handleOnSubmit = () => {
    this.props.onConfirm();
    this.handleOnDismiss();
  };

  render() {
    const { strSave, strCancel, strCaption, strPrompt } = this.props;
    return (
      <Modal
        caption={strCaption}
        customBodyClassName={s.muted}
        dismissText={strCancel}
        onConfirm={this.handleOnSubmit}
        onDismiss={this.handleOnDismiss}
        submitText={strSave}
      >
        <div className={s.message}>
          { strPrompt }
        </div>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  strCancel: PropTypes.string,
  strCaption: PropTypes.string,
  strPrompt: PropTypes.string,
  strSave: PropTypes.string,
};

export default Confirm;
