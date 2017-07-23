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
  }

  function handleSignedInUser(user) {
    loginPage.style.display = 'none';
    applicationPage.style.display = 'block';
    writeUserData(user);
    // FCM permission registration
    registerMessaging(user);
    retrieveMyDoWhops(user.uid);
    setLandingTab(retrieveUrl(window.location.href)); // Check.
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
    retrieveMyDoWhops(person.uid);
    checkDefaultDoWhop(person);
  } else {
    console.log('PERSON signed out');
  }
});

function createDefaultDoWhop(person) {
  var uid = person.uid;
  var email = person.email;
  var creatorDescription = person.email;
  // Then we add on note to user's profile that it has been added:
  var appUsersRef = database.ref('/app_users');
  var appUserRef = appUsersRef.child(uid);
  var defaultDoWhopImage = 'images/DefaultDoWhop_banner.jpg';
  // Adding a default DoWhop template as welcoming message:
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  // First we create the new default DoWhop:
  doWhopDescriptionRef.child(doWhopDescriptionKey).set({
    createdBy: uid,
    doWhopDescriptionKey: doWhopDescriptionKey,
    downloadURL: defaultDoWhopImage,
    titleDescription: 'DoWhop with us!',
    whoDescription: 'DoWhop Team is here to help you!',
    whatDescription: '',
    whenDescription: '',
    whereDescription: '',
    howMuchDescription: '',
    creatorDescription: 'tinkerdowhop@gmail.com',
    doerDescription: email
  });

  // Updating user's status henceforth:
  var userData = {
    hasDefaultDoWhop: true
  };
  appUserRef.update(userData);
}

// Checks for a default whop, if not exists, creates one.

function checkDefaultDoWhop(person) {
  var uid = person.uid;
  var email = person.email;
  var creatorDescription = person.email;

  // Then we add on note to user's profile that it has been added:
  var appUsersRef = database.ref('/app_users');
  var appUserRef = appUsersRef.child(uid);
  var hasDoWhopAlready = false;

  // Let's check for whether user has a DoWhop:
  appUserRef.once('value', function(snapshot) {
    var snap = snapshot || null;
    if (snap != null && snap.val() != null && snap.val().hasDefaultDoWhop && snap.val().hasDefaultDoWhop === true) {
      hasDoWhopAlready = true;
      return hasDoWhopAlready;
    } else {
      createDefaultDoWhop(person);
    }
  });
}

// For checking the pre-specified routing location. New.
function retrieveUrl(location) {
  if (location.match(/#(.+)/)[1]) {
    var y = location.match(/#(.+)/)[1];
    console.log('current location is', y);
    return y;
  } else {
    return null;
  }
}

function setLandingTab(URL) {
  // To-Do: REFACTOR with regard to sesSessionTab() in coordinate.js
  var currentTab = URL + '-tab';
  var currentTabElement = document.getElementById(currentTab);
  var userID = person.uid;
  var sessionRef = database.ref('/session').child(userID);
  var allTabs = document.getElementsByClassName('tab');

  // We need to toggle the tabs to default color if un-selected...
  for (var i = 0; i < allTabs.length; i++) {
    allTabs[i].style.fill = '#000000';
    allTabs[i].style.color = '#000000';
  }

  // ...And set the current session tab:
  currentTabElement.style.fill = '#ec1928';
  currentTabElement.style.color = '#ec1928';

  sessionRef.update({
    current_tab: currentTab
  });
}
