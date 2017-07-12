const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.DoWhopDescriptionAlert = functions.database.ref('/DoWhopDescriptions/{pushKey}').onWrite(event => {
  const originalDescription = event.data.val();
  const key = event.params.pushKey;

  const getTokens = admin.database().ref('app_users').once('value').then(snapshot => {
    const tokens = [
      'ctP8hLYg7CQ:APA91bHdby2BZuag0HJJxHudP4rBQxfnjFSbOFCkwfuUGIklDkqIS_x7OuODj9YO70eaHd9Pzs8SI5hzI_TsatW9tCTFU2amyVlzbjvwbZmske5dRi6J5ZIUlnIBUzIKsWgsxKSGqM1C'
    ];
    snapshot.forEach(user => {
      const token = user.child('token').val();
      const doerDescription = (originalDescription && originalDescription.doerDescription) || '';
      const creatorDescription = (originalDescription && originalDescription.creatorDescription) || '';
      if (
        token &&
        (doerDescription.split(', ').some(doerDescriptionEmail => doerDescriptionEmail === user.val().email) ||
          creatorDescription === user.val().email)
      ) {
        tokens.push(token);
      }
    });
    return tokens;
  });

  const doWhopIcon = '/functions/images/doWhopIcon.png';
  const getUser = admin.auth().getUser('VYw0lPDFD3btHJadneuSFGjy8wk1');

  Promise.all([getTokens, getUser]).then(([tokens, user]) => {
    const payload = {
      notification: {
        title: (originalDescription && originalDescription.titleDescription) || 'DoWhopTitle Placeholder',
        body: 'Has been created and or updated',
        icon: doWhopIcon
      }
    };
    admin.messaging().sendToDevice(tokens, payload).catch(error => console.log('ERROR IN INDEX.js -> ', error));
  });
});
