// @flow

import { combineReducers } from 'redux';
import authReducer from './authentication';
import currentUserReducer from './current-user';
import { inputReducer, profileReducer } from './profile';
import appUsersReducer from './app-users';

const reducer = combineReducers({
  authentication: authReducer,
  currentUser: currentUserReducer,
  value: inputReducer,
  profile: profileReducer,
  appUsers: appUsersReducer
});

export default reducer;
