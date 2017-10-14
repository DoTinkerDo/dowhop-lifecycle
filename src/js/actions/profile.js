// @flow

import { database, auth } from '../../firebase';
import { SET_USER_BIO, CLEAR_INPUT, ADD_USER_BIO } from './actions';

const userProfilesRef = database.ref('app_users');

export const inputValue = (value: string) => ({
  type: SET_USER_BIO,
  payload: value
});

export const clearInput = () => ({
  type: CLEAR_INPUT
});

export const addBio = (bio: string) => ({
  type: ADD_USER_BIO,
  payload: bio
});

export const createBio = ({ bio, uid }: Object) => {
  const userProfileBioRef = userProfilesRef.child(uid).child('profileAbout');
  userProfileBioRef.update({ bio });
};

export const startListeningForUserProfileChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = userProfilesRef.child(user.uid);
      userProfileRef.on('value', snapshot => {
        const profileAbout = snapshot.val().profileAbout;
        dispatch(addBio(profileAbout));
      });
    }
  });
};
