// @flow

import { database, auth } from '../../firebase';
import { ADD_SOCIAL_MEDIA_URLS } from './actions';

const userProfilesRef = database.ref('profile');

export const addSocialMediaUrls = (socialUrls: Object) => ({
  type: ADD_SOCIAL_MEDIA_URLS,
  socialUrls
});

export const submitProfileSocialMediaUrls = (socialUrls: Object, uid: string) => {
  const userProfileSocialUrlsRef = userProfilesRef.child(uid);
  userProfileSocialUrlsRef.update({ socialUrls });
};

export const startListeningForProfileSocialMediaLinkChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileSocialUrlsRef = userProfilesRef.child(user.uid).child('socialUrls');
      userProfileSocialUrlsRef.on('value', snapshot => {
        if (snapshot.val()) dispatch(addSocialMediaUrls(snapshot.val()));
      });
    }
  });
};
