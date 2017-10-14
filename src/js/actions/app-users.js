// @flow

import { auth, database } from '../../firebase';
import { ADD_USERS } from './actions';

const userRef = database.ref('app_users');

const addUsers = users => ({
  type: ADD_USERS,
  users
});

const startListeningForAppUsers = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      userRef.on('value', snapshot => {
        dispatch(addUsers(snapshot.val()));
      });
    }
  });
};

export default startListeningForAppUsers;
