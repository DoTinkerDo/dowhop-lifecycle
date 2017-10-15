// @flow

import { auth, database } from '../../firebase';
import { ADD_USERS } from './actions';

const usersRef = database.ref('app_users');

const addUsers = users => ({
  type: ADD_USERS,
  payload: users
});

const startListeningForAppUsers = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      usersRef.on('child_added', snapshot => {
        dispatch(addUsers(snapshot.val()));
      });
    }
  });
};

export default startListeningForAppUsers;
