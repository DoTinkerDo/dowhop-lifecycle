// @flow

import { database, auth } from '../../firebase';
import { ADD_SOCIAL_MEDIA_URLS, SET_SOCIAL_URL_INPUT_VALUES, SET_SOCIAL_URL_INPUT_VALUE } from './actions';

const userProfilesRef = database.ref('profile');

export const setSocialUrlInputValue = (value, site) => ({
  type: SET_SOCIAL_URL_INPUT_VALUE,
  site,
  value
});

export const setSocialUrlsInputValues = (socialInputs: Object) => ({
  type: SET_SOCIAL_URL_INPUT_VALUES,
  socialInputs
});

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
        if (snapshot.val()) {
          dispatch(addSocialMediaUrls(snapshot.val()));
          const socialInputs = {
            valueFB: snapshot.val().facebookUrl,
            valueTW: snapshot.val().instagramUrl,
            valueIG: snapshot.val().linkedInUrl,
            valueIN: snapshot.val().twitterUrl
          };
          dispatch(setSocialUrlsInputValues(socialInputs));
        }
      });
    }
  });
};
