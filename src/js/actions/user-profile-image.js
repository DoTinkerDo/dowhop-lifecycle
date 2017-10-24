// @flow

import { database, auth } from '../../firebase';
import { SET_DEFAULT_PROFILE_IMAGE } from './actions';

const usersProfilesRef = database.ref('app_users');

export const addDefaultProfileImage = (url: string) => ({
  type: SET_DEFAULT_PROFILE_IMAGE,
  payload: url
});

// export const editProfileImage = (url: string) => ({
//   type: EDIT_PROFILE_IMAGE_URL,
//   payload: url
// });

export const deleteProfileImage = () => {
  console.log('DELETE');
};

export const uploadImage = (file: Object) => console.log('FILE -> ', file);

export const startListeningForUserProfileImageChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = usersProfilesRef.child(user.uid);
      const userProfilePhotoUrlRef = userProfileRef.child('photoURL');
      const userProfileImageRef = userProfileRef.child('profileImageUrl');

      userProfileImageRef.on('value', snapshot => {
        // Check for uid.profileImageUrl set by user or below
        if (!snapshot.val()) {
          // Check for uid.photoURL from oAuth
          userProfilePhotoUrlRef.on('value', snap => {
            userProfileRef.update({ profileImageUrl: snap.val() });
          });
        } else {
          // Check for photoImageUrl set above
          userProfileImageRef.on('value', snapUrl => dispatch(addDefaultProfileImage(snapUrl.val())));
        }
      });
    }
  });
};
