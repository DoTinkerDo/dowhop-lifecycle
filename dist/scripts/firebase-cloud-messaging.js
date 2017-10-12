function registerMessaging(user) {
  messaging
    .requestPermission()
    .then(function() {
      return messaging.getToken();
    })
    .then(function(token) {
      database.ref('app_users').child(user.uid).child('token').set(token);
    })
    .catch(function(error) {
      'FCM TOKEN ERROR: -> ', console.error;
    });
}

messaging.onMessage(function(payload) {
  console.log('ONMESSAGE: -> ', payload);
});
