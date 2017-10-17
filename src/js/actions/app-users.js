// @flow

import { database } from '../../firebase';
import { ADD_USERS, UPDATE_USER, REMOVE_USER } from './actions';

const usersRef = database.ref('app_users');

const addUsers = users => ({
  type: ADD_USERS,
  payload: users
});

const updateUser = changedUser => ({
  type: UPDATE_USER,
  payload: changedUser,
  metadata: changedUser.uid
});

const removeUser = removedUser => ({
  type: REMOVE_USER,
  payload: removedUser,
  metadata: removedUser.uid
});

const startListeningForAppUsers = () => (dispatch: Function) => {
  usersRef.on('child_added', snapshot => dispatch(addUsers(snapshot.val())));
  usersRef.on('child_changed', snapshot => dispatch(updateUser(snapshot.val())));
  usersRef.on('child_removed', snapshot => dispatch(removeUser(snapshot.val())));
};

export default startListeningForAppUsers;
