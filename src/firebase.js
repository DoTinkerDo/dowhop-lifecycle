import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCLCQMuGEkyphG6XLnr2yTwX0pTc65bObA',
  authDomain: 'donewhop-reviews-1367c.firebaseapp.com',
  databaseURL: 'https://donewhop-reviews-1367c.firebaseio.com',
  projectId: 'donewhop-reviews-1367c',
  storageBucket: 'donewhop-reviews-1367c.appspot.com',
  messagingSenderId: '221310152590'
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
