// var config = {
//   apiKey: 'AIzaSyB95x1zEsSkXfaDgOVdTw7ESavk9O9geN0',
//   authDomain: 'dowhop-lifecycle.firebaseapp.com',
//   databaseURL: 'https://dowhop-lifecycle.firebaseio.com',
//   projectId: 'dowhop-lifecycle',
//   storageBucket: 'dowhop-lifecycle.appspot.com',
//   messagingSenderId: '1090371045772'
// };

var config = {
	apiKey: 'AIzaSyBHcfFlJ9UHqjjg3hsN0lWAWuaS0cPsHAc',
	authDomain: 'mikes-dowhop.firebaseapp.com',
	databaseURL: 'https://mikes-dowhop.firebaseio.com',
	projectId: 'mikes-dowhop',
	storageBucket: 'mikes-dowhop.appspot.com',
	messagingSenderId: '775491542622'
};
firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();
var storage = firebase.storage();
var messaging = firebase.messaging();
