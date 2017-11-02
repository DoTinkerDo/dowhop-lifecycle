// @flow

import { ADD_PROFILE, UPDATE_PROFILE, REMOVE_PROFILE } from '../actions/actions';

export default function appProfileReducer(state: Array<Object> = [], action: Object) {
  switch (action.type) {
    case ADD_PROFILE:
      return [...state, action.payload];
    case UPDATE_PROFILE: {
      const idx = state.findIndex(profile => profile && profile.uid === action.metadata);
      return [...state.slice(0, idx), action.payload, ...state.slice(idx + 1)];
    }
    // TODO
    // Redux Store is updated,
    // but UI is not updated when profile is deleted in Firebase.
    case REMOVE_PROFILE: {
      const idx = state.findIndex(profile => profile && profile.uid === action.metadata);
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    }
    default:
      return state;
  }
}
