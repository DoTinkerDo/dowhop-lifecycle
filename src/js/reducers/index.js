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
import appProfileReducer from './app-profiles';
import appUsersReducer from './app-users';
import profileUrlReducer from './user-profile-image';
import { socialMediaUrlsReducer, setSocialUrlInputReducer } from './profile-social-media-links';

const reducer = combineReducers({
  authentication: authReducer,
  currentUser: currentUserReducer,
  value: setProfileAboutReducer,
  headlineValue: setProfileHeadlineReducer,
  headline: profileHeadlineReducer,
  about: profileAboutReducer,
  appUsers: appUsersReducer,
  profileUrl: profileUrlReducer,
  socialUrls: socialMediaUrlsReducer,
  socialInputs: setSocialUrlInputReducer,
  appProfiles: appProfileReducer
});

export default reducer;
