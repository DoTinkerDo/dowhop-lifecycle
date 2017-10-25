// @flow

import { ADD_USERS, UPDATE_USER, REMOVE_USER } from '../actions/actions';

export default function appUsersReducer(state: Array<Object> = [], action: Object) {
  switch (action.type) {
    case ADD_USERS:
      return [...state, action.payload];
    case UPDATE_USER: {
      const idx = state.findIndex(user => user && user.uid === action.metadata);
      return [...state.slice(0, idx), action.payload, ...state.slice(idx + 1)];
    }
    case REMOVE_USER: {
      const idx = state.findIndex(user => user && user.uid === action.metadata);
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    }
    default:
      return state;
  }
}
