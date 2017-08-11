import { combineReducers } from 'redux';
import { intlReducer } from 'redux-intl-connect';
import auth from './auth';
import notification from './notification';
import permissions from './permissions';
import ui from './ui';
import user from './user';
import app from './app';

const rootReducer = combineReducers({
  app,
  intl: intlReducer,
  auth,
  notification,
  permissions,
  ui,
  user,
});

export default rootReducer;
