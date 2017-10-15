// @flow

import { combineReducers } from 'redux';
import authReducer from './authentication';
import currentUserReducer from './current-user';
import { setProfileAboutReducer, profileAboutReducer } from './profile';
import appUsersReducer from './app-users';

const reducer = combineReducers({
  authentication: authReducer,
  currentUser: currentUserReducer,
  value: setProfileAboutReducer,
  about: profileAboutReducer,
  appUsers: appUsersReducer
});

export default reducer;
