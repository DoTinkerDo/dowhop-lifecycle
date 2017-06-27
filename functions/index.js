const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.newDoWhopDescriptionAlert = functions.database.ref('/DoWhopDescriptions/{pushKey}').onWrite(function(event) {
  const description = event.data.val();
  const key = event.params.pushKey;

  const getTokens = admin.database().ref('app_users').once('value').then(snapshot => {
    // const tokens = [
    //   'ctP8hLYg7CQ:APA91bHdby2BZuag0HJJxHudP4rBQxfnjFSbOFCkwfuUGIklDkqIS_x7OuODj9YO70eaHd9Pzs8SI5hzI_TsatW9tCTFU2amyVlzbjvwbZmske5dRi6J5ZIUlnIBUzIKsWgsxKSGqM1C'
    // ];
    const tokens = [];
    snapshot.forEach(user => {
      const token = user.child('token').val();
      const doerDescription = description.doerDescription || '';
      const creatorDescription = description.creatorDescription || '';
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

  const getUser = admin.auth().getUser('VYw0lPDFD3btHJadneuSFGjy8wk1');
  const placeholderUserPhotoURL =
    'https://static.wixstatic.com/media/de271e_7b4ba75cc39345df91b400d66d827907~mv2.png/v1/crop/x_0,y_12,w_300,h_276/fill/w_50,h_46,al_c,usm_0.66_1.00_0.01/de271e_7b4ba75cc39345df91b400d66d827907~mv2.png';

  Promise.all([getTokens, getUser]).then(([tokens, user]) => {
    const payload = {
      notification: {
        title: description.titleDescription,
        body: 'Has been updated',
        icon: placeholderUserPhotoURL
      }
    };
    admin.messaging().sendToDevice(tokens, payload).catch(function(error) {
      console.log('ERROR IN INDEX.js -> ', error);
    });
  });
});
