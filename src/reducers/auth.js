import { createReducer } from '../utils/index';
import { getCookie, setCookie } from '../utils/cookie';
import ActionTypes from '../constants/ActionTypes';

const AUTH_TOKEN = 'AuthToken';
const authToken = getCookie(AUTH_TOKEN) || null;

const initialState = {
  token: authToken,
  isAuthenticated: false,
  isAuthenticating: false,
  isCheckingToken: false,
  statusText: null,
};

export default createReducer(initialState, {
  /**
   * LogIn request
   * @param {Object} state
   */
  [ActionTypes.REQUEST_AUTHENTICATION]: (state) => ({
    ...state,
    isAuthenticated: false,
    isAuthenticating: true,
    statusText: null,
  }),

  /**
   * LogIn successfully
   * @param {Object} state
   * @param {Object} payload
   * @param {String} payload.token
   * @param {Object} meta
   * @param {Boolean} meta.isRemember
   */
  [ActionTypes.RECEIVE_AUTHENTICATION]: (state, payload, meta) => {
    setCookie(AUTH_TOKEN, payload.token, {
      maxAge: meta.isRemember ? 31536e3 : 0, // Set cookie expiration time to one year (31536e3)
    });
    window.location.reload();
    return ({
      ...state,
      token: payload.token,
      isAuthenticating: false,
      isAuthenticated: true,
      statusText: '',
    });
  },

  /**
   * LogIn failed
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.response.error
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_AUTHENTICATION]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    return ({
      ...state,
      token: null,
      isAuthenticating: false,
      isAuthenticated: false,
      statusText: payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },

  /**
   * Check Token Request
   * @param {Object} state
   */
  [ActionTypes.REQUEST_CHECK_TOKEN]: (state) => ({
    ...state,
    isCheckingToken: true,
    isAuthenticating: true,
    isAuthenticated: false,
    token: null,
    statusText: null,
  }),

  /**
   * Check Token Success
   * @param {Object} state
   * @param {Object} payload
   * @param {String} payload.valid
   */
  [ActionTypes.RECEIVE_CHECK_TOKEN]: (state, payload) => {
    if (!payload.valid) setCookie(AUTH_TOKEN, '');
    return ({
      ...state,
      isAuthenticated: payload.valid,
      isAuthenticating: false,
      isCheckingToken: false,
      token: payload.valid ? authToken : null,
      statusText: null,
    });
  },

  /**
   * Check Token Failure
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_CHECK_TOKEN]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    return ({
      ...state,
      token: null,
      isAuthenticating: false,
      isAuthenticated: false,
      isCheckingToken: false,
      statusText: payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },

  /**
   * Log Out Request
   */
  [ActionTypes.REQUEST_LOG_OUT]: () => {
    setCookie(AUTH_TOKEN, '');
    return initialState;
  },

  /**
   * Log Out Success
   * @param {Object} state
   */
  [ActionTypes.RECEIVE_LOG_OUT]: (state) => {
    window.location.reload();
    return ({
      ...state,
      statusText: 'You have been successfully logged out.',
    });
  },

  /**
   * Log Out Failure
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_LOG_OUT]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    window.location.reload();
    return ({
      ...state,
      statusText: payload.response && payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },
});
