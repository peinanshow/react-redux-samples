import { createReducer } from '../utils/index';
import ActionTypes from '../constants/ActionTypes';

const initialState = {
  email: null,
  hasDesignerAddon: false,
  id: null,
  isProcessing: false,
  name: '',
  roles: [],
  caps: {
    assignSystemTags: false,
    createReportSchedule: false,
    createTags: false,
  },
};

export default createReducer(initialState, {

  /**
   * Request information about the current user
   */
  [ActionTypes.REQUEST_USER_INFO]: state =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  /**
   * Receive information about the current user
   * @param {Object} state
   * @param {Object} payload
   * @param {string} payload.id
   * @param {string} payload.name
   * @param {string} payload.email
   * @param {Array} payload.roles
   * @param {string} payload.roles.id
   * @param {string} payload.roles.name
   * @param {Object} payload.caps
   * @param {boolean} payload.caps.createReportSchedule
   * @param {boolean} payload.caps.createTags
   * @param {boolean} payload.caps.assignSystemTags
   */
  [ActionTypes.RECEIVE_USER_INFO]: (state, payload) =>
    Object.assign({}, state, {
      isProcessing: false,
      name: payload.name,
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
      caps: payload.caps,
    }),

  /**
   * Receive a list of licenses
   * @param {Object} state
   * @param {Array} payload
   * @param {string} [payload.serialKey]
   * @param {string} [payload.package]
   * @param {string} [payload.status]
   * @param {string} [payload.daysLeft]
   */
  [ActionTypes.RECEIVE_LICENSE_INFO]: (state, payload) => {
    const designerAddonPackage = payload.find(item => item.package === 3) || {}; // Get designer addon package info
    return Object.assign({}, state, {
      hasDesignerAddon: designerAddonPackage.status && designerAddonPackage.status === 3 || false,
    });
  },

});
