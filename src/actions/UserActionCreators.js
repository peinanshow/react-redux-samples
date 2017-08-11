import { CALL_API } from 'redux-api-middleware';
import { endpoints } from '../config';
import ActionTypes from '../constants/ActionTypes';

/**
 * Requests user info
 */
export function getUserInfo() {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest()}/user`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_USER_INFO,
          ActionTypes.RECEIVE_USER_INFO,
          ActionTypes.FAILURE_USER_INFO,
        ],
      },
    }).then(() => dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest()}/licenses`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_LICENSE_INFO,
          ActionTypes.RECEIVE_LICENSE_INFO,
          ActionTypes.FAILURE_LICENSE_INFO,
        ],
      },
    }));
}
