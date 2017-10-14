// @flow

import { database, auth } from '../../firebase';
import { SET_USER_PROFILE_STORY, CLEAR_INPUT, ADD_USER_STORY } from './actions';

const userProfilesRef = database.ref('app_users');

export const storyValue = (value: string) => ({
  type: SET_USER_PROFILE_STORY,
  payload: value
});

export const clearInput = () => ({
  type: CLEAR_INPUT
});

export const addStory = (story: string) => ({
  type: ADD_USER_STORY,
  story
});

export const createStory = ({ story, uid }: Object) => () => {
  const userProfileRef = userProfilesRef.child(uid);
  userProfileRef.update({ story });
};

export const startListeningForUserProfileChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userProfileRef = userProfilesRef.child(user.uid);
      userProfileRef.on('value', snapshot => {
        const userStory = snapshot.val();
        dispatch(addStory(userStory));
      });
    }
  });
};
