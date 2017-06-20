importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '221310152590'
  // messagingSenderId: '1090371045772'
});

var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  var title = 'hello, world';
  var options = {
    body: payload.data.status
  };
  return self.registration.showNotification(title, options);
});
