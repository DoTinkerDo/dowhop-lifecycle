// @flow

import { database, auth, storage } from '../../firebase';
import { SET_DEFAULT_PROFILE_IMAGE } from './actions';

const usersProfilesRef = database.ref('app_users');

export const addDefaultProfileImage = (profileImageUrl: Object) => ({
  type: SET_DEFAULT_PROFILE_IMAGE,
  payload: profileImageUrl
});

// export const editProfileImage = (url: string) => ({
//   type: EDIT_PROFILE_IMAGE_URL,
//   payload: url
// });

export const deleteProfileImage = () => {
  console.log('DELETE');
};

export const uploadImageTask = (file: Object, uid: string, oldImageName: string) => {
  const fileName = `${file.name}-${Math.floor(Math.random() * 100)}`;
  const fileNameFilePath = `userImages/${uid}/profileImage/${fileName}`;
  const uploadTask = storage.ref(fileNameFilePath).put(file, { contentType: file.type });
  // TODO add ui to show upload
  uploadTask.on('state_changed', snapshot => {
    const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    console.log(`Upload is ${progress}% done`);
  });

  // TODO
  // Figure out how to chain this error code
  // Add ui to show errors.
  // Setup rules in FB storage for image size
  // .catch(error => {
  //   if (error.code === 'storage/unauthorized') {
  //     window.alert('Your image could not be uploaded :( \n The size cannot exceed 1Mb');
  //   } else {
  //     console.log('ERROR UPLOAD IMAGE TASK', error);
  //   }
  // });

  uploadTask
    .then(snapshot =>
      usersProfilesRef.child(uid).update({ profileImageUrl: { url: snapshot.downloadURL, name: fileName } })
    )
    .then(() => {
      const filePath = `userImages/${uid}/profileImage/`;
      const storageRef = storage.ref(filePath);
      if (oldImageName) storageRef.child(oldImageName).delete();
    });
};

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
            userProfileRef.update({ profileImageUrl: { url: snap.val(), name: '' } });
          });
        } else {
          // Check for photoImageUrl set above
          userProfileImageRef.on('value', snapUrl =>
            dispatch(addDefaultProfileImage({ url: snapUrl.val(), name: '' }))
          );
        }
      });
    }
  });
};
