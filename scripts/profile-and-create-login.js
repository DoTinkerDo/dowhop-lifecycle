(function LoginUsers() {
  'use strict';

  var uiConfig = {
    callbacks: {
      signInSuccess: function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        return true; // Do not redirect.
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

  function profileProgessNodeInit(user) {
    //This function will check if this node exists and create it if it doesn't
    //and not overwrite it if it does
    var currentUserRef = database.ref('/app_users').child(user.uid);
    var profileProgressDataInit;
    profileProgressDataInit = {
      profileProgress: {
        'verify-phone': false,
        'verify-email': false,
        'verify-social': false
      }
    };
    currentUserRef.once('value').then(function(snapshot) {
      if (snapshot.val().profileProgress === undefined) {
        currentUserRef.update(profileProgressDataInit);
      }
    });
  }

  function writeUserData(user) {
    var appUsersRef = database.ref('/app_users');
    var appUserRef = appUsersRef.child(user.uid);
    appUserRef.once('value').then(function(snapshot) {
      // default doWhop writes first, so this check resulted in
      // userData not being written changed set to update
      // if (snapshot.val()) return;
      var userData = {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : placeholderUserPhotoURL,
        uid: user.uid,
        email: user.email,
        lastLoginDatePST: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
      };
      appUserRef.update(userData);
    });
  }

  function handleSignedInUser(user) {
    profileProgessNodeInit(user);
    loginPage.style.display = 'none';
    applicationPage.style.display = 'block';
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

      database.ref('admin/').once('value', function(snapshot) {
        // Cycling through the data to see if admin is permitted:
        snapshot.forEach(function(data) {
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

// ('use strict');
// setting currentUser globals...
var person = null;

auth.onAuthStateChanged(function(user) {
  if (user) {
    person = user;
  } else {
    console.log('PERSON signed out');
  }
});
