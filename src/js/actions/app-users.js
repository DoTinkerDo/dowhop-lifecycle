// @flow

import { database } from '../../firebase';
import { ADD_USERS, UPDATE_USERS } from './actions';

const usersRef = database.ref('app_users');

const addUsers = users => ({
  type: ADD_USERS,
  payload: users
});

const updateUsers = (changedUser, uid) => ({
  type: UPDATE_USERS,
  payload: changedUser,
  metadata: uid
});

const startListeningForAppUsers = () => (dispatch: Function) => {
  usersRef.on('child_added', snapshot => {
    dispatch(addUsers(snapshot.val()));
  });
  usersRef.on('child_changed', snapshot => {
    const changedUser = snapshot.val();
    const uid = changedUser.uid;
    dispatch(updateUsers(changedUser, uid));
  });
  // TODO 'child_removed'
};

export default startListeningForAppUsers;
