import React from 'react';
import AuthViewController from './Auth.controller';
import LoginForm from '../../components/auth/LoginForm';
import LoginPage from '../../components/auth/LoginPage'

const Auth = (props) => (
  <AuthViewController {...props}>
     <LoginPage>
       <LoginForm />
     </LoginPage>
  </AuthViewController>
);

export default Auth;
