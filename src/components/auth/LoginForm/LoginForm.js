import React, { Component, PropTypes } from 'react';
import FontIcon from '../../common/FontIcon';
import s from './LoginForm.scss';
import cx from 'classnames';

class LoginForm extends Component {

  state = {
    email: '',
    password: '',
    isRemember: false,
  };


  // EVENT/ACTION HANDLERS

  handleOnSubmit = (event) => {
    const { email, password, isRemember } = this.state;
    event.preventDefault();
    event.stopPropagation();
    this.props.onSubmit(email, password, isRemember);
  };

  // RENDER ASSETS

  renderEmailGroup = () => {
    const { intl, messages, uiSettings } = this.props;
    return (
      <div className={cx(s.group, s.inputgroup)}>
        <FontIcon className = {s.icon}  name ="user" background = {uiSettings.loginInputIconBackgroundColor} />
        <input
          className={s.input}
          onChange={(event) => this.setState({ email: event.target.value })}
          placeholder={intl.formatMessage(messages.loginPlaceholder)}
          required="true"
          type="text"
          style={{background: `${uiSettings.loginInputContentBackgroundColor}`, color: `${uiSettings.loginInputContentColor}`}}
        />
      </div>
    );
  };

  renderPasswordGroup = () => {
    const { intl, messages, uiSettings} = this.props;
    return (
      <div className={cx(s.group, s.inputgroup)}>
        <FontIcon className = {s.icon}  name ="lock" background = {uiSettings.loginInputIconBackgroundColor}/>
        <input
          className={s.input}
          onChange={(event) => this.setState({ password: event.target.value })}
          placeholder={intl.formatMessage(messages.passwordPlaceholder)}
          required="true"
          type="password"
          style={{background: `${uiSettings.loginInputContentBackgroundColor}`,  color: `${uiSettings.loginInputContentColor}`}}
        />
      </div>
    );
  };

  renderActionsGroup = () => {
    const { intl, messages, uiSettings } = this.props;
    return (
      <div className={s.group}>
        <div className={s.row}>
          <div className={cx(s.column, s.rememberaction)} >
            <div className={s.checkbox}>
              <label className={s.label} style={{color: `${uiSettings.loginKeeplogColor}`}}>
                <input
                  className={s.checkbox}
                  type="checkbox"
                  defaultChecked={this.state.isRemember}
                  onChange={(event) => this.setState({ isRemember: event.target.value })}
                />
                { intl.formatMessage(messages.rememberLabel) }
              </label>
            </div>
          </div>
          <div className={cx(s.column, s.loginaction)}>
            <button className={s.button} type="submit"  style={{background: `${uiSettings.loginButtonBackground}`}}>
              { this.props.isAuthenticating
                  ? <FontIcon name="spinner" spin />
                  : intl.formatMessage(messages.submitLabel)
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <form onSubmit={this.handleOnSubmit}>
        { this.renderEmailGroup() }
        { this.renderPasswordGroup() }
        { this.renderActionsGroup() }
        <div className={s.status}>
          { this.props.authStatusText }
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  // Data
  authStatusText: PropTypes.string,
  intl: PropTypes.object,
  isAuthenticating: PropTypes.bool,
  // Actions
  formatMessage: PropTypes.func,
  onSubmit: PropTypes.func,
  messages: PropTypes.object,

  //uiSettings
  uiSettings: PropTypes.object
};

export default LoginForm;
