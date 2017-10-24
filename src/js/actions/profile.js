// @flow

import { database, auth } from '../../firebase';
import {
  SET_ABOUT_PROFILE,
  ADD_FIREBASE_PROFILE_ABOUT_DATA,
  CLEAR_ABOUT_INPUT,
  CLEAR_PROFILE_INPUT,
  ADD_FIREBASE_PROFILE_HEADLINE_DATA,
  SET_HEADLINE_PROFILE
} from './actions';

const usersProfilesRef = database.ref('app_users');

export const setHeadlineProfileValue = (value: string) => ({
  type: SET_HEADLINE_PROFILE,
  payload: value
});

export const setAboutProfileValue = (value: string) => ({
  type: SET_ABOUT_PROFILE,
  payload: value
});

export const clearAboutInput = () => ({
  type: CLEAR_ABOUT_INPUT
});

export const clearHeadlineInput = () => ({
  type: CLEAR_PROFILE_INPUT
});

export const submitAboutProfile = ({ profileAbout, uid }: Object) => {
  const userProfileAboutRef = usersProfilesRef.child(uid);
  userProfileAboutRef.update({ profileAbout });
};

export const submitHeadlineProfile = ({ profileHeadline, uid }: Object) => {
  const userProfileHeadlineRef = usersProfilesRef.child(uid);
  userProfileHeadlineRef.update({ profileHeadline });
};

export const addFirebaseProfileAboutData = (profileAbout: string) => ({
  type: ADD_FIREBASE_PROFILE_ABOUT_DATA,
  payload: profileAbout
});

export const addFirebaseProfileHeadlineData = (profileHeadline: string) => ({
  type: ADD_FIREBASE_PROFILE_HEADLINE_DATA,
  payload: profileHeadline
});

export const startListeningForUserProfileChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = usersProfilesRef.child(user.uid);

      // TODO test to see if this var assignment throws an error
      // if .child('profileHeadline') isn't create yet. same for about
      const userProfileHeadlineRef = userProfileRef.child('profileHeadline');
      userProfileHeadlineRef.on('value', snapshot => {
        const profileHeadline = snapshot.val();
        dispatch(addFirebaseProfileHeadlineData(profileHeadline));
        dispatch(setHeadlineProfileValue(profileHeadline));
      });
      const userProfileAboutRef = userProfileRef.child('profileAbout');
      userProfileAboutRef.on('value', snapshot => {
        const profileAbout = snapshot.val();
        dispatch(addFirebaseProfileAboutData(profileAbout));
        dispatch(setAboutProfileValue(profileAbout));
      });
    }
  });
};
