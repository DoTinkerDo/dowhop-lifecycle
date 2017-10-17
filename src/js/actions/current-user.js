// @flow

import { auth, database } from '../../firebase';
import { ADD_CURRENT_USER } from './actions';

const addCurrentUser = user => ({
  type: ADD_CURRENT_USER,
  displayName: user.displayName,
  uid: user.uid,
  email: user.email,
  photoURL: user.photoURL
});

const startListeningForCurrentUser = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const userRef = database.ref('app_users').child(user.uid);
      userRef.on('value', snapshot => {
        if (snapshot.val()) dispatch(addCurrentUser(snapshot.val()));
      });
    }
  });
};

export default startListeningForCurrentUser;
