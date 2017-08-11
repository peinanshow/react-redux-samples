import { createReducer } from '../utils/index';
import ActionTypes from '../constants/ActionTypes';

const initialState = {
  description: '',
  visibility: false,
  type: null,
  message: '',
};

export default createReducer(initialState, {

  [ActionTypes.SHOW_NOTIFICATION]: (state, payload) =>
    Object.assign({}, state, {
      visibility: true,
      message: payload.message || '',
      description: payload.description || '',
    }),

  [ActionTypes.HIDE_NOTIFICATION]: (state) =>
    Object.assign({}, state, initialState),

});
