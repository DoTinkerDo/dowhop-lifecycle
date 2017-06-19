// request messaging permission

function registerMessaging(user) {
  messaging
    .requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      return messaging.getToken();
    })
    .then(function(token) {
      database.ref('app_users').child(user.uid).child('token').set(token);
    })
    .catch('FCM TOKEN: -> ', console.error);
}
