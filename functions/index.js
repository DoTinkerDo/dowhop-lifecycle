const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.DoWhopDescriptionNewDateAlert = functions.database
  .ref('/DoWhopDescriptions/{pushKey}/whenDate')
  .onWrite(event => {
    const originalDate = event.data.val();
    const key = event.params.pushKey;
    const doWhopIcon = '/functions/images/doWhopIcon.png';
    const tokens = [
      'ctP8hLYg7CQ:APA91bHdby2BZuag0HJJxHudP4rBQxfnjFSbOFCkwfuUGIklDkqIS_x7OuODj9YO70eaHd9Pzs8SI5hzI_TsatW9tCTFU2amyVlzbjvwbZmske5dRi6J5ZIUlnIBUzIKsWgsxKSGqM1C',
      'cU1YolfMcGM:APA91bH-uMLNUivsr1L4gGlESiDl-GbgQGl4Qhr1wT165AHyFsOeBPKMBLIXRkHjHERV-u-kdMUtUKZehpTCmNqjGqQb9-8atr2zCB0lwcqdZSQwOqRIeEnB_DgWF21dSlWlsQU6_oQk'
    ];

    const payload = {
      notification: {
        title: (originalDate && originalDate.titleDescription) || 'Coordinate Date',
        body: 'DoWhop Date has been added and or Updated',
        icon: doWhopIcon
      }
    };
    return admin.messaging().sendToDevice(tokens, payload).catch(error => console.log('ERROR IN INDEX.js -> ', error));
  });

exports.DoWhopDescriptionNewTimeAlert = functions.database
  .ref('/DoWhopDescriptions/{pushKey}/whereAddress')
  .onWrite(event => {
    const originalTime = event.data.val();
    const key = event.params.pushKey;
    const doWhopIcon = '/functions/images/doWhopIcon.png';
    const tokens = [
      'ctP8hLYg7CQ:APA91bHdby2BZuag0HJJxHudP4rBQxfnjFSbOFCkwfuUGIklDkqIS_x7OuODj9YO70eaHd9Pzs8SI5hzI_TsatW9tCTFU2amyVlzbjvwbZmske5dRi6J5ZIUlnIBUzIKsWgsxKSGqM1C',
      'cU1YolfMcGM:APA91bH-uMLNUivsr1L4gGlESiDl-GbgQGl4Qhr1wT165AHyFsOeBPKMBLIXRkHjHERV-u-kdMUtUKZehpTCmNqjGqQb9-8atr2zCB0lwcqdZSQwOqRIeEnB_DgWF21dSlWlsQU6_oQk'
    ];

    const payload = {
      notification: {
        title: (originalTime && originalTime.titleDescription) || 'Coordinate Location',
        body: ``,
        icon: doWhopIcon
      }
    };
    return admin.messaging().sendToDevice(tokens, payload).catch(error => console.log('ERROR IN INDEX.js -> ', error));
  });

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
