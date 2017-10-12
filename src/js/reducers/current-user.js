// @flow

import { ADD_USER } from '../actions/actions';

export default function currentUserReducer(state: Object = {}, action: Object) {
  switch (action.type) {
    case ADD_USER:
      return {
        displayName: action.displayName,
        createdOn: action.createdOn,
        uid: action.uid,
        email: action.email,
        photoURL: action.photoURL
      };
    default:
      return state;
  }
}
