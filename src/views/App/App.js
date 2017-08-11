import React, { PropTypes } from 'react';
import AppViewController from './App.controller';
import Notifications from '../../components/common/Notifications';
import s from './App.scss';

const App = (props) => (
  <AppViewController {...props}>
    <div className={s.root}>
      
      <Notifications />
      { props.children }
    </div>
  </AppViewController>
);

App.propTypes = {
  children: PropTypes.object,
};

export default App;
