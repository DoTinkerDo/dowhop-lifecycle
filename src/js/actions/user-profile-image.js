// @flow

import { database, auth, storage } from '../../firebase';

const usersProfilesRef = database.ref('app_users');

export const addProfileImage = () => {
  console.log('ADD');
};

export const editProfileImage = uid => {
  console.log('EDIT ', uid);
};

export const deleteProfileImage = () => {
  console.log('DELETE');
};

export const uploadImage = (file: Object) => console.log('FILE -> ', file);

export const startListeningForUserProfileImageChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = database.ref('app_users').child(user.uid);

      const userProfileImageRef = usersProfilesRef.child(user.uid).child('profileImageUrl');
      if (typeof userProfileImageRef === 'undefined') {
        userProfileRef.update({ profileImageUrl: 'test string' });
      }
      userProfileImageRef.on('child_added', (snapshot, prevChildkey) => {
        const url = snapshot.val();
        console.log(url);
      });

      // dispatch(editProfileImage(user.uid));
    }
  });
};
