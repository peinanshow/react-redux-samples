import ActionTypes from '../constants/ActionTypes';

/**
 * Shows a notification message
 * @param {Object} data
 */
export function showNotification(data) {
  return {
    type: ActionTypes.SHOW_NOTIFICATION,
    payload: {
      message: data.message,
      description: data.description,
    },
  };
}

/**
 * Hides a notification message
 */
export function hideNotification() {
  return {
    type: ActionTypes.HIDE_NOTIFICATION,
  };
}
