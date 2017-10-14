// @flow

import { ADD_USERS } from '../actions/actions';

export default function appUsersReducer(state: Object = {}, action: Object) {
  switch (action.type) {
    case ADD_USERS:
      return Object.assign({}, state, action.users);
    default:
      return state;
  }
}
