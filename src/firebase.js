import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCYyWsyROqPBBQaxoG4dSmB7rKEJjilf-o',
  authDomain: 'dowhop-reviews.firebaseapp.com',
  databaseURL: 'https://dowhop-reviews.firebaseio.com',
  projectId: 'dowhop-reviews',
  storageBucket: 'dowhop-reviews.appspot.com',
  messagingSenderId: '811119881760'
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
