// @flow

import { SET_ABOUT_PROFILE, ADD_FIREBASE_PROFILE_ABOUT_DATA, CLEAR_INPUT } from '../actions/actions';

const DEFAULT_INPUT_STATE = '';

export function setProfileAboutReducer(state: string = DEFAULT_INPUT_STATE, action: Object) {
  switch (action.type) {
    case SET_ABOUT_PROFILE:
      return action.payload;
    case CLEAR_INPUT:
      return '';
    default:
      return state;
  }
}

const DEFAULT_PROFILE_ABOUT_STATE = { profileAbout: 'Write a short about me story to tell about yourself' };

export function profileAboutReducer(state: Object = DEFAULT_PROFILE_ABOUT_STATE, action: Object) {
  switch (action.type) {
    case ADD_FIREBASE_PROFILE_ABOUT_DATA:
      return Object.assign({}, state, { profileAbout: action.payload });
    default:
      return state;
  }
}
