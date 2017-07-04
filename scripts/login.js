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
      // default doWhop writes first, so this check resulted in
      // userData not being written changed set to update
      // if (snapshot.val()) return;
      var userData = {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : placeholderUserPhotoURL,
        uid: user.uid,
        email: user.email
      };
      appUserRef.update(userData);
    });
    // console.log('prepare to run check default');
    // if (checkDefaultDoWhop() === false) {
    //   createDefaultDoWhop();
    // }
  }

  function handleSignedInUser(user) {
    loginPage.style.display = 'none';
    applicationPage.style.display = 'block';
    writeUserData(user);
    // FCM permission registration
    registerMessaging(user);

    // console.log('prepare to run check default');
    //if (checkDefaultDoWhop() === false) {
    //  createDefaultDoWhop();
    //}
    checkDefaultDoWhop();
    // console.log('coord js.');
    retrieveMyDoWhops(user.uid);
  }

  function handleSignedOutUser() {
    loginPage.style.display = 'block';
    applicationPage.style.display = 'none';
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  function handleOnAuthStateChange() {
    // console.log('prepare to run check default');
    // if (checkDefaultDoWhop() === false) {
    //   createDefaultDoWhop();
    // }
    auth.onAuthStateChanged(function(user) {
      // Check if current user email is admin in Firebase:
      var approved = false;

      database.ref().child('admin/').once('value', function(snapshot) {
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

// TODO map what parts of app use this...
// 1) person is used by session -> confirmed line 219!
// 2) now also used by reviews when user signs in for the first time.

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

function createDefaultDoWhop() {
  console.log('creating default dowhop...');
  var uid = auth.currentUser.uid;
  var email = auth.currentUser.email;
  var creatorDescription = auth.currentUser.email;
  // Then we add on note to user's profile that it has been added:
  var appUsersRef = database.ref('/app_users');
  var appUserRef = appUsersRef.child(uid);

  // console.log("adding dowhop...");
  // Adding a default DoWhop template as welcoming message:
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  // First we create the new default DoWhop:
  doWhopDescriptionRef.child(doWhopDescriptionKey).set({
    createdBy: uid,
    doWhopDescriptionKey: doWhopDescriptionKey,
    downloadURL: defaultDoWhopDescriptionImage,
    titleDescription: 'DoWhop with us!',
    whoDescription: 'DoWhop Team is here to help you!',
    whatDescription: '',
    whenDescription: '',
    whereDescription: '',
    howMuchDescription: '',
    creatorDescription: 'tinkerdowhop@gmail.com',
    doerDescription: email
  });
  // console.log('no default. created default dowhop');

  // Updating user's status henceforth:
  // console.log("updating user's dowhop status...");
  var userData = {
    hasDefaultDoWhop: true
  };
  appUserRef.update(userData);
}

// Checks for a default whop, if not exists, creates one.

function checkDefaultDoWhop() {
  // console.log('running default dowhop check...');
  var uid = auth.currentUser.uid;
  var email = auth.currentUser.email;
  var creatorDescription = auth.currentUser.email;

  // Then we add on note to user's profile that it has been added:
  var appUsersRef = database.ref('/app_users');
  var appUserRef = appUsersRef.child(uid);
  var hasDoWhopAlready = false;

  // Let's check for whether user has a DoWhop:
  appUserRef.once('value', function(snapshot) {
    var snap = snapshot || null;
    if (snap != null && snap.val() != null && snap.val().hasDefaultDoWhop && snap.val().hasDefaultDoWhop === true) {
      // console.log('user has a dowhop already');
      // console.log(snap.val());
      hasDoWhopAlready = true;
      return hasDoWhopAlready;
    } else {
      // console.log('no dowhop exists.');
      //hasDoWhopAlready = false;
      createDefaultDoWhop();
    }
  });
}
