// @flow

import moment from 'moment';
import { auth, database } from '../../firebase';
import { LOGIN, LOGOUT, ATTEMPTING_LOGIN, ATTEMPTING_LOGOUT } from './actions';

const appUsersRef = database.ref('app_users');

const loggedIn = user => ({
  type: LOGIN,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  uid: user.uid,
  isAuthenticated: true
});

const loggedOut = () => ({
  type: LOGOUT
});

export const login = () => (dispatch: Function) => {
  dispatch({ type: ATTEMPTING_LOGIN });
  // TODO ADD SIGNIN METHOD FROM LOGIN.JSX HERE
};

export const logout = () => (dispatch: Function) => {
  dispatch({ type: ATTEMPTING_LOGOUT });
  auth.signOut();
};

export const startListeningToAuthChanges = () => (dispatch: Function) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      dispatch(loggedIn(user));
      const appUserRef = appUsersRef.child(user.uid);
      appUserRef.once('value').then(snapshot => {
        if (snapshot.val()) return;
        const date = moment().toDate();
        const userData = {
          createdOn: date,
          displayName: user.displayName,
          email: user.email,
          photoURL:
            user.photoURL ||
            `https://firebasestorage.googleapis.com/v0/b/dowhop-me.appspot.com/o/assets%2Ficons%2Fprofile-placeholder.png?alt=media&token=04033fce-4c9b-4976-8407-da41981f8046`,
          uid: user.uid
        };
        appUserRef.update(userData);
      });
    } else {
      dispatch(loggedOut());
    }
  });
};
