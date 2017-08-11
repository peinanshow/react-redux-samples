import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import * as authActionsCreators from '../../actions/AuthActionCreators';
import connect from '../../utils/connect';
import createDataProviders from '../../utils/createDataProviders';
import messages from './Auth.messages';
import LoginForm from '../../components/auth/LoginForm';
import LoginPage from '../../components/auth/LoginPage'


class AuthViewController extends Component {

  // Assign properties
  components = {
    [LoginForm]: () => {
      const { auth, authActions, intl, uiSettings } = this.props;
      const { loginLabel, loginPlaceholder, passwordLabel, passwordPlaceholder, rememberLabel, submitLabel } = messages;
      return {
        // Data
        authStatusText: auth.statusText,
        isAuthenticating: auth.isAuthenticating,
        // Actions
        onSubmit: authActions.logIn,
        //Settings
        uiSettings:uiSettings,
        // Intl
        intl,
        messages: {
          loginLabel,
          loginPlaceholder,
          passwordLabel,
          passwordPlaceholder,
          rememberLabel,
          submitLabel,
        },
      };
    },

    [LoginPage]: () => {
       const { uiSettings } = this.props;
       return {
         uiSettings: uiSettings
       }
    }
  };

  render() {
    return (
      <div className={this.props.className}>
        { createDataProviders(this.props.children, this.components) }
      </div>
    );
  }
}

AuthViewController.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,

  // Action Creators
  authActions: PropTypes.object,

  // Action Methods
  logIn: PropTypes.func,

  // Data
  auth: PropTypes.object,
  intl: PropTypes.object,
  app: PropTypes.object
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  intl: state.intl,
  uiSettings: state.app
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(
    authActionsCreators,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthViewController);
