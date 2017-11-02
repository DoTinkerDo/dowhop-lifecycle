// @flow

import { database, auth } from '../../firebase';
import {
  INIT_SOCIAL_URL_INPUT_VALUES,
  INIT_SOCIAL_MEDIA_URLS,
  ADD_SOCIAL_MEDIA_URLS,
  SET_SOCIAL_URL_INPUT_VALUES,
  SET_SOCIAL_URL_INPUT_VALUE,
  ADD_PROFILE
  // UPDATE_PROFILE,
  // REMOVE_PROFILE
} from './actions';

const userProfilesRef = database.ref('profile');

export const initSocialUrlsInputValues = () => ({
  type: INIT_SOCIAL_URL_INPUT_VALUES
});

export const initSocialMediaUrls = () => ({
  type: INIT_SOCIAL_MEDIA_URLS
});

export const setSocialUrlInputValue = (value: string, site: string) => ({
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

const addProfile = (profile, uid) => ({
  type: ADD_PROFILE,
  payload: {
    profile,
    uid
  }
});

// const updateProfile = (changedProfile, uid) => ({
//   type: UPDATE_PROFILE,
//   payload: changedProfile,
//   metadata: uid
// });

// const removeProfile = (removedProfile, uid) => ({
//   type: REMOVE_PROFILE,
//   payload: removeProfile,
//   metadata: uid
// });

export const startListeningForProfileSocialMediaLinkChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileSocialUrlsRef = userProfilesRef.child(user.uid).child('socialUrls');
      userProfileSocialUrlsRef.on('value', snapshot => {
        if (snapshot.val()) {
          dispatch(addSocialMediaUrls(snapshot.val()));
          const socialInputs = {
            valueFB: snapshot.val().facebookUrl,
            valueTW: snapshot.val().twitterUrl,
            valueIG: snapshot.val().instagramUrl,
            valueIN: snapshot.val().linkedInUrl
          };
          dispatch(setSocialUrlsInputValues(socialInputs));
        } else {
          dispatch(initSocialUrlsInputValues());
          dispatch(initSocialMediaUrls());
        }
      });
    }
  });

  userProfilesRef.on('child_added', snapshot => dispatch(addProfile(snapshot.val(), snapshot.key)));
  // userProfilesRef.on('child_changed', snapshot => dispatch(updateProfile(snapshot.val(), snapshot.key)));
  // userProfilesRef.on('child_removed', snapshot => dispatch(removeProfile(snapshot.val(), snapshot.key)));
};
