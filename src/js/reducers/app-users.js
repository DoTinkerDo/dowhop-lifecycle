// @flow

import { ADD_USERS } from '../actions/actions';

export default function appUsersReducer(state: Array = [], action: Object) {
  switch (action.type) {
    case ADD_USERS:
      return [...state, action.payload];
    default:
      return state;
  }
}
