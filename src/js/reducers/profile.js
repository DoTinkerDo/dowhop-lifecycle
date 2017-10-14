// @flow

import { SET_USER_BIO, CLEAR_INPUT, ADD_USER_BIO } from '../actions/actions';

const DEFAULT_INPUT_STATE = '';

export function inputReducer(state: string = DEFAULT_INPUT_STATE, action: Action) {
  switch (action.type) {
    case SET_USER_BIO:
      return action.payload;
    case CLEAR_INPUT:
      return '';
    default:
      return state;
  }
}

export function profileReducer(state: Object = {}, action: Object) {
  switch (action.type) {
    case ADD_USER_BIO:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
