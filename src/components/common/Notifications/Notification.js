import React, { Component, PropTypes } from 'react';
import FontIcon from '../FontIcon';
import s from './Notification.scss';

class ReportProperties extends Component {

  handleOnClickOnDismiss = () => this.props.onDismiss();

  render() {
    const { description, message, isVisible } = this.props;
    return isVisible ? (
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.message}>
            <div className={s.title}>{message}</div>
            <div className={s.text}>{description}</div>
          </div>
        </div>
        <div className={s.right}>
          <div className={s.dismiss} role="button" title="Dismiss notification" onClick={this.handleOnClickOnDismiss}>
            <FontIcon name="times" />
          </div>
        </div>
      </div>
    ) : null;
  }
}

ReportProperties.propTypes = {
  // Data
  description: PropTypes.string,
  isVisible: PropTypes.bool,
  message: PropTypes.string,

  // Handlers
  onDismiss: PropTypes.func,
};

export default ReportProperties;
