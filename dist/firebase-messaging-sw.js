importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

const config = {
  messagingSenderId: '1090371045772'
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  const title = payload.title;
  const options = {
    body: payload.body,
    icon: payload.status
  };

  return self.registration.showNotification(title, options);
});
