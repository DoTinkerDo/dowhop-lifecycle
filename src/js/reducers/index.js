// @flow

import { combineReducers } from 'redux';
import authReducer from './authentication';
import currentUserReducer from './current-user';
import {
  setProfileAboutReducer,
  setProfileHeadlineReducer,
  profileAboutReducer,
  profileHeadlineReducer
} from './profile';
import appUsersReducer from './app-users';

const reducer = combineReducers({
  authentication: authReducer,
  currentUser: currentUserReducer,
  value: setProfileAboutReducer,
  headlineValue: setProfileHeadlineReducer,
  headline: profileHeadlineReducer,
  about: profileAboutReducer,
  appUsers: appUsersReducer
});

export default reducer;
