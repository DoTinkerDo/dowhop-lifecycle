// @flow

import { database, auth } from '../../firebase';
import {
  INIT_SOCIAL_URL_INPUT_VALUES,
  INIT_SOCIAL_MEDIA_URLS,
  ADD_SOCIAL_MEDIA_URLS,
  SET_SOCIAL_URL_INPUT_VALUES,
  SET_SOCIAL_URL_INPUT_VALUE
} from './actions';

const userProfilesRef = database.ref('profile');

const initSocialUrlsInputValues = () => ({
  type: INIT_SOCIAL_URL_INPUT_VALUES
});

const initSocialMediaUrls = () => ({
  type: INIT_SOCIAL_MEDIA_URLS
});

const setSocialUrlsInputValues = (socialInputs: Object) => ({
  type: SET_SOCIAL_URL_INPUT_VALUES,
  socialInputs
});

const addSocialMediaUrls = (socialUrls: Object) => ({
  type: ADD_SOCIAL_MEDIA_URLS,
  socialUrls
});

export const setSocialUrlInputValue = (value: string, site: string) => ({
  type: SET_SOCIAL_URL_INPUT_VALUE,
  site,
  value
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
          dispatch(
            setSocialUrlsInputValues({
              valueFB: snapshot.val().facebookUrl,
              valueTW: snapshot.val().twitterUrl,
              valueIG: snapshot.val().instagramUrl,
              valueIN: snapshot.val().linkedInUrl
            })
          );
        } else {
          dispatch(initSocialUrlsInputValues());
          dispatch(initSocialMediaUrls());
        }
      });
    }
  });
};
