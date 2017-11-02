// @flow

import { database, auth } from '../../firebase';
import {
  SET_ABOUT_PROFILE,
  ADD_FIREBASE_PROFILE_ABOUT_DATA,
  ADD_FIREBASE_PROFILE_HEADLINE_DATA,
  SET_HEADLINE_PROFILE
} from './actions';

const usersProfilesRef = database.ref('app_users');

const addFirebaseProfileAboutData = (profileAbout: string) => ({
  type: ADD_FIREBASE_PROFILE_ABOUT_DATA,
  payload: profileAbout
});

const addFirebaseProfileHeadlineData = (profileHeadline: string) => ({
  type: ADD_FIREBASE_PROFILE_HEADLINE_DATA,
  payload: profileHeadline
});

export const setHeadlineProfileValue = (value: string) => ({
  type: SET_HEADLINE_PROFILE,
  payload: value
});

export const setAboutProfileValue = (value: string) => ({
  type: SET_ABOUT_PROFILE,
  payload: value
});

export const submitAboutProfile = ({ profileAbout, uid }: Object) => {
  const userProfileAboutRef = usersProfilesRef.child(uid);
  userProfileAboutRef.update({ profileAbout });
};

export const submitHeadlineProfile = ({ profileHeadline, uid }: Object) => {
  const userProfileHeadlineRef = usersProfilesRef.child(uid);
  userProfileHeadlineRef.update({ profileHeadline });
};

export const startListeningForUserProfileChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = usersProfilesRef.child(user.uid);
      const userProfileHeadlineRef = userProfileRef.child('profileHeadline');
      userProfileHeadlineRef.on('value', snapshot => {
        const profileHeadline = snapshot.val();
        if (profileHeadline) {
          dispatch(addFirebaseProfileHeadlineData(profileHeadline));
          dispatch(setHeadlineProfileValue(profileHeadline));
        }
      });
      const userProfileAboutRef = userProfileRef.child('profileAbout');
      userProfileAboutRef.on('value', snapshot => {
        const profileAbout = snapshot.val();
        if (profileAbout) {
          dispatch(addFirebaseProfileAboutData(profileAbout));
          dispatch(setAboutProfileValue(profileAbout));
        }
      });
    }
  });
};
