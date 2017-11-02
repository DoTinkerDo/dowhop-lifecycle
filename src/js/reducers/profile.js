// @flow

import {
  SET_ABOUT_PROFILE,
  ADD_FIREBASE_PROFILE_ABOUT_DATA,
  ADD_FIREBASE_PROFILE_HEADLINE_DATA,
  SET_HEADLINE_PROFILE
} from '../actions/actions';

const DEFAULT_INPUT_STATE = '';
const DEFAULT_PROFILE_ABOUT_STATE = { profileAbout: 'Write an about me story to telling what you like to do...' };
const DEFAULT_PROFILE_HEADLINE_STATE = { profileHeadline: 'Write a catchy headline!' };

export function setProfileHeadlineReducer(state: string = DEFAULT_INPUT_STATE, action: Object) {
  switch (action.type) {
    case SET_HEADLINE_PROFILE:
      return action.payload;
    default:
      return state;
  }
}

export function setProfileAboutReducer(state: string = DEFAULT_INPUT_STATE, action: Object) {
  switch (action.type) {
    case SET_ABOUT_PROFILE:
      return action.payload;
    default:
      return state;
  }
}

export function profileHeadlineReducer(state: Object = DEFAULT_PROFILE_HEADLINE_STATE, action: Object) {
  switch (action.type) {
    case ADD_FIREBASE_PROFILE_HEADLINE_DATA:
      return Object.assign({}, state, { profileHeadline: action.payload });
    default:
      return state;
  }
}

export function profileAboutReducer(state: Object = DEFAULT_PROFILE_ABOUT_STATE, action: Object) {
  switch (action.type) {
    case ADD_FIREBASE_PROFILE_ABOUT_DATA:
      return Object.assign({}, state, { profileAbout: action.payload });
    default:
      return state;
  }
}
