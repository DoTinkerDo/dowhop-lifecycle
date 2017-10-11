import firebase from 'firebase';
import * as firebaseui from 'firebaseui';

// DoWhopMe FB Account Creds.
const config = {
  apiKey: 'AIzaSyCds_tiUvgDETcaagZ4C3tFZfLLLK8Wuf8',
  authDomain: 'dowhop-me.firebaseapp.com',
  databaseURL: 'https://dowhop-me.firebaseio.com',
  projectId: 'dowhop-me',
  storageBucket: 'dowhop-me.appspot.com',
  messagingSenderId: '212713898498'
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const ui = new firebaseui.auth.AuthUI(firebase.auth());
export const auth = firebase.auth();
export const storage = firebase.storage();
export const messaging = firebase.messaging();
