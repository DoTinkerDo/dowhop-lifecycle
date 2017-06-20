(function LoginUsers() {
  'use strict';

  var uiConfig = {
    callbacks: {
      signInSuccess: function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return true;
      }
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
  };
  var ui = new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', uiConfig);

  var loginPage = document.getElementById('login-container');
  var applicationPage = document.getElementById('application-container');

  function writeUserData(user) {
    var appUsersRef = database.ref('/app_users');
    var appUserRef = appUsersRef.child(user.uid);
    appUserRef.once('value').then(function(snapshot) {
      if (snapshot.val()) return;
      var userData = {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : placeholderUserPhotoURL,
        uid: user.uid,
        email: user.email
      };
      appUserRef.set(userData);
    });
  }

  function handleSignedInUser(user) {
    loginPage.style.display = 'none';
    applicationPage.style.display = 'block';
    writeUserData(user);
    retrieveMyDoWhops(user.uid);
    // registerMessaging(user);
  }

  function handleSignedOutUser() {
    loginPage.style.display = 'block';
    applicationPage.style.display = 'none';
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  function handleOnAuthStateChange() {
    auth.onAuthStateChanged(function(user) {
      // Check if current user email is admin in Firebase:
      var approved = false;

      firebase.database().ref().child('admin/').once('value', function(snap) {
        // Cycling through the data to see if admin is permitted:
        snap.forEach(function(data) {
          if (data.val() === user.email) {
            approved = true;
            window.location = 'admin.html';
          } else {
            approved = false;
          }
        });
        return approved;
      });

      user ? handleSignedInUser(user) : handleSignedOutUser();
    });
  }

  window.addEventListener('load', handleOnAuthStateChange);
})();

// TODO map what parts of app use this...
// 1) person is used by session -> confirmed line 219!
// 2) ?

// setting currentUser globals...
var person = null;
auth.onAuthStateChanged(function(user) {
  if (user) {
    person = user;
  } else {
    console.log('PERSON signed out');
  }
});

// Probably no longer needed...
// was used by react review app
var currentUserDoWhopId = null;
var currentDoWhopProto = null;
firebase.database().ref().child('proto_user/').once('value', function(snapshot) {
  snapshot.forEach(function(data) {
    var name = '"' + person.displayName + '"';
    var name = person.displayName;
    if (data.key === name) {
      currentUserDoWhopId = data.val();
    }
  });

  firebase.database().ref().child('proto/' + currentUserDoWhopId).once('value', function(snapshot) {
    currentDoWhopProto = snapshot.val();
  });
});
