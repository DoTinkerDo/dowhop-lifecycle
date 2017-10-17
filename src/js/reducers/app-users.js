// @flow

import { ADD_USERS, UPDATE_USERS } from '../actions/actions';

export default function appUsersReducer(state: Array<void> = [], action: Object) {
  switch (action.type) {
    case ADD_USERS:
      return [...state, action.payload];
    case UPDATE_USERS: {
      const idx = state.findIndex(user => user && user.uid === action.metadata);
      return [...state.slice(0, idx), action.payload, ...state.slice(idx + 1)];
    }
    default:
      return state;
  }
}
