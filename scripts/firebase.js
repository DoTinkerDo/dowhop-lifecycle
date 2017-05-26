var config = {
  apiKey: 'AIzaSyB95x1zEsSkXfaDgOVdTw7ESavk9O9geN0',
  authDomain: 'dowhop-lifecycle.firebaseapp.com',
  databaseURL: 'https://dowhop-lifecycle.firebaseio.com',
  projectId: 'dowhop-lifecycle',
  storageBucket: 'dowhop-lifecycle.appspot.com',
  messagingSenderId: '1090371045772'

  // johann test db creds ->
  // apiKey: 'AIzaSyCLCQMuGEkyphG6XLnr2yTwX0pTc65bObA',
  // authDomain: 'donewhop-reviews-1367c.firebaseapp.com',
  // databaseURL: 'https://donewhop-reviews-1367c.firebaseio.com',
  // projectId: 'donewhop-reviews-1367c',
  // storageBucket: 'donewhop-reviews-1367c.appspot.com',
  // messagingSenderId: '221310152590'
};

firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();
var storage = firebase.storage();
