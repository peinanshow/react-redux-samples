import React, { PropTypes, Component } from 'react';
import Modal from '../Modal';
import s from './Prompt.scss';


class Prompt extends Component {

  state = { value: '' };

  componentDidMount = () => this.props.onMount();

  handleOnCancel = () => this.props.onCancel();

  handleOnChange = (value) => this.setState({ value });

  handleOnConfirm = () => {
    this.props.onConfirm(this.state.value);
    this.handleOnCancel();
  };

  handleKeyDown = (event) => {
    if (this.state.value && event.keyCode === 13) {
      this.handleOnConfirm(); // enter
    }
  };

  render() {
    const { strCaption, strSave, strCancel, text } = this.props;
    return (
      <Modal
        caption={strCaption}
        confirmText={strSave}
        customBodyClassName={s.muted}
        dismissText={strCancel}
        isConfirmDisabled={!this.state.value}
        onConfirm={this.handleOnConfirm}
        onDismiss={this.handleOnCancel}
      >
        <div className={s.form}>
          <input
            autoFocus="true"
            className={s.input}
            type="text"
            defaultValue={text}
            onKeyDown={this.handleKeyDown}
            onChange={(event) => this.handleOnChange(event.target.value)}
          />
        </div>
      </Modal>
    );
  }
}

Prompt.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onMount: PropTypes.func,
  strCancel: PropTypes.string,
  strCaption: PropTypes.string,
  strSave: PropTypes.string,
  text: PropTypes.string,
};

Prompt.defaultProps = {
  text: '',
};

export default Prompt;
