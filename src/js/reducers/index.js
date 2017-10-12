// @flow

import { combineReducers } from 'redux';
import authReducer from './authentication';
import currentUserReducer from './current-user';
import { inputReducer, profileReducer } from './profile';

const reducer = combineReducers({
  authentication: authReducer,
  currentUser: currentUserReducer,
  value: inputReducer,
  profile: profileReducer
});

export default reducer;
