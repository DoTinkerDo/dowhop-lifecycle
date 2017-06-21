const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.newDoWhopDescriptionAlert = functions.database.ref('/doWhopDescription/{pushKey}').onWrite(function(event) {
  const description = event.data.val();
  const key = event.params.pushKey;

  const getTokens = admin.database().ref('app_users').once('value').then(snapshot => {
    const tokens = [
      'ctP8hLYg7CQ:APA91bHdby2BZuag0HJJxHudP4rBQxfnjFSbOFCkwfuUGIklDkqIS_x7OuODj9YO70eaHd9Pzs8SI5hzI_TsatW9tCTFU2amyVlzbjvwbZmske5dRi6J5ZIUlnIBUzIKsWgsxKSGqM1C'
    ];
    snapshot.forEach(user => {
      const token = user.child('token').val();
      if (
        token &&
        (description.doerDescription
          .split(', ')
          .some(doerDescriptionEmail => doerDescriptionEmail === user.val().email) ||
          description.creatorDescription === user.val().email)
      ) {
        tokens.push(token);
      }
    });
    return tokens;
  });

  const getUser = admin.auth().getUser('VYw0lPDFD3btHJadneuSFGjy8wk1');

  console.log('DESCRIPTION -> ', key, ' <-- ', description, ' --> ');

  Promise.all([getTokens, getUser]).then(([tokens, user]) => {
    console.log('TOKENS  AND USER -> ', tokens, ' -- ', getUser);
    const payload = {
      notification: {
        title: description.titleDescription,
        body: 'Has been updated'
      }
    };
    admin.messaging().sendToDevice(tokens, payload).catch(function(error) {
      console.log('ERROR IN INDEX.js -> ', error);
    });
  });
});
