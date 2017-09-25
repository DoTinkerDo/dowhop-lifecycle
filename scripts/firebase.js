// DoWhop Lifecycle DB:
var config = {
  apiKey: 'AIzaSyB95x1zEsSkXfaDgOVdTw7ESavk9O9geN0',
  authDomain: 'dowhop-lifecycle.firebaseapp.com',
  databaseURL: 'https://dowhop-lifecycle.firebaseio.com',
  projectId: 'dowhop-lifecycle',
  storageBucket: 'dowhop-lifecycle.appspot.com',
  messagingSenderId: '1090371045772'
};

firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();
var storage = firebase.storage();
var messaging = firebase.messaging();
