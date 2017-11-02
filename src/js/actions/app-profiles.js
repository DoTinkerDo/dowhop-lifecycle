// @flow

import { database } from '../../firebase';
import { ADD_PROFILE, UPDATE_PROFILE, REMOVE_PROFILE } from './actions';

const userProfilesRef = database.ref('profile');

const addProfile = (profile, uid) => ({
  type: ADD_PROFILE,
  payload: { profile, uid }
});

const updateProfile = (profile, uid) => ({
  type: UPDATE_PROFILE,
  payload: { profile, uid },
  metadata: uid
});

const removeProfile = (profile, uid) => ({
  type: REMOVE_PROFILE,
  payload: { profile, uid },
  metadata: uid
});

const startListeningForProfileChanges = () => (dispatch: Function) => {
  userProfilesRef.on('child_added', snapshot => dispatch(addProfile(snapshot.val(), snapshot.key)));
  userProfilesRef.on('child_changed', snapshot => dispatch(updateProfile(snapshot.val(), snapshot.key)));
  userProfilesRef.on('child_removed', snapshot => dispatch(removeProfile(snapshot.val(), snapshot.key)));
};

export default startListeningForProfileChanges;
