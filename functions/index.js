const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.newDoWhopDescriptionAlert = functions.database.ref('/doWhopDescription/{description}').onWrite(function(event) {
  const message = event.data.val();

  const getTokens = admin.database().ref('app_users').once('value').then(snapshot => {
    const tokens = [];
    snapshot.forEach(user => {
      const token = user.child('token').val();
      if (token) tokens.push(token);
    });
    return tokens;
  });

  const getDoer = admin.auth().getUser(description.uid);

  Promise.all([getTokens, getDoer]).then(([tokens, author]) => {
    const payload = {
      notification: {
        title: `doWhopDescription from ${author}`,
        body: message.content,
        icon: author
      }
    };

    admin.messaging().sendToDoDevice(tokens, payload).catch(function(error) {
      console.error;
    });
  });
});
