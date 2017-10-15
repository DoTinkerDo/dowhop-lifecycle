// @flow

import { database, auth } from '../../firebase';
import { SET_ABOUT_PROFILE, ADD_FIREBASE_PROFILE_ABOUT_DATA, CLEAR_INPUT } from './actions';

const userProfilesRef = database.ref('app_users');

export const setAboutProfileValue = (value: string) => ({
  type: SET_ABOUT_PROFILE,
  payload: value
});

export const clearInput = () => ({
  type: CLEAR_INPUT
});

export const submitAboutProfile = ({ profileAbout, uid }: Object) => {
  console.log('ACTION SUBMIT ABOUT: ', profileAbout, ' == ', uid);
  const userProfileBioRef = userProfilesRef.child(uid).child('profile');
  userProfileBioRef.update({ profileAbout });
};

export const addFirebaseProfileAboutData = (profileAbout: string) => {
  console.log('ADD DATA -> ', profileAbout);
  return {
    type: ADD_FIREBASE_PROFILE_ABOUT_DATA,
    payload: profileAbout
  };
};

export const startListeningForUserProfileChanges = () => (dispatch: Function) =>
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = userProfilesRef.child(user.uid).child('profile');
      userProfileRef.on('value', snapshot => dispatch(addFirebaseProfileAboutData(snapshot.val())));
    }
  });
