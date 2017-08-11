import React, { Component, PropTypes } from 'react';
import s from './LoginPage.scss';
import cx from 'classnames';

class LoginPage extends Component {

  render() {
    const { children, uiSettings} = this.props 
    return (
       <div className={s.root} style={{backgroundImage: `url(${uiSettings.loginBackgroundImage})`}}>
        <div className={s.container}>
          <div className={s.content} style={{background: `${uiSettings.loginFormBackgroundColor}`}}>
            {uiSettings.loginlogo && <div className={s.logo} style={{backgroundImage: `url(${uiSettings.loginlogo})`}}></div>}
            {children}
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  children:PropTypes.object,
  //uiSettings
  uiSettings: PropTypes.object
};

export default LoginPage;
