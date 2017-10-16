// @flow

import { database } from '../../firebase';
import { ADD_USERS } from './actions';

const usersRef = database.ref('app_users');

const addUsers = users => ({
  type: ADD_USERS,
  payload: users
});

const startListeningForAppUsers = () => (dispatch: Function) => {
  usersRef.on('child_added', snapshot => {
    dispatch(addUsers(snapshot.val()));
  });
  // TODO 'child_removed', 'child_changed'
};

export default startListeningForAppUsers;
