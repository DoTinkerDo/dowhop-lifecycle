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
        email: user.email,
        lastLoginDatePST: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
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

    if (window.location.hash != '' && window.location.hash.length > 0) {
      setLandingTab(window.location.hash.match(/#(.+)/)[1]);
    }

    // Read the user's saved session:

    var sessionRef = database.ref('/session').child(user.uid);
    var userSession;

    sessionRef.once('value').then(function(snap) {
      if (!snap.val()) {
        var userSession = {
          current_tab: 'coordinate-tab'
          // To-Do: Set default doWhopDescriptionKey.
        };
        sessionRef.update(userSession);
      }
      userSession = snap.val();
      // console.log('current DoWhop upon first visit', userSession.current_dowhop);
      // console.log('current tab', userSession.current_tab);
      setAndGetDoWhopDescriptionSession(userSession.current_dowhop);
      // getSessionTab(user.uid);
      setLandingTab(getSessionTab(user.uid));
    });
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
var currentTab = '';

auth.onAuthStateChanged(function(user) {
  if (user) {
    person = user;
    retrieveMyDoWhops(person.uid);
    checkDefaultDoWhop(person);
  } else {
    console.log('PERSON signed out');
  }
});

function getSessionTab(uid) {
  var currentTab;
  var sessionRef = database.ref('/session').child(uid);
  sessionRef.on('value', function(snap) {
    currentTab = snap.val().current_tab;
    // console.log('... running new getsession tab', currentTab);
  });
  return currentTab;
}

// console.log('...finishing running getsession tab', currentTab);

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
    whyDescription: '',
    whatDescription: '',
    whenDescription: '',
    whereDescription: '',
    howMuchDescription: '',
    creatorDescription: 'tinkerdowhop@gmail.com',
    doerDescription: email
  });

  var sessionsRef = database.ref('/session');
  var sessionUserRef = sessionsRef.child(uid);
  sessionUserRef.once('value').then(function(snapshot) {
    if (snapshot.val()) return;
    var userSession = {
      current_dowhop: doWhopDescriptionKey,
      current_tab: 'coordinate-tab'
    };
    sessionUserRef.update(userSession);
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
// function retrieveUrlAnchor(location) {
//   if (location.match(/#(.+)/) && location.match(/#(.+)/)[1] != null) {
//     return location.match(/#(.+)/)[1];
//   } else {
//     return null;
//   }
// }

function setLandingTab(href) {
  // We are covering two situations:
  // One for direct URL to particular tab, second for clicking on particular tab:
  var currentTab;
  // console.log('setLandingTab', href);
  if (typeof href === 'string' && href.match(/-tab/)) {
    currentTab = href;
  } else {
    currentTab = href + '-tab';
  }

  if (document.getElementById(currentTab)) {
    var currentTabElement = document.getElementById(currentTab);
    // var userID = person.uid || user.uid;
    // var sessionRef = database.ref('/session').child(userID);
    var allTabs = document.getElementsByClassName('tab');

    // We need to toggle the tabs to default color if un-selected...
    for (var i = 0; i < allTabs.length; i++) {
      allTabs[i].style.fill = '#000000';
      allTabs[i].style.color = '#000000';
    }

    // ...And set the current session tab:
    currentTabElement.style.fill = '#ec1928';
    currentTabElement.style.color = '#ec1928';

    // sessionRef.update({
    //   current_tab: currentTab
    // });
  }
}

// We are ensuring direct routing also happens without refresh:
window.addEventListener('hashchange', function(e) {
  if (window.location.hash != '' && window.location.hash.length > 0) {
    setLandingTab(window.location.hash.match(/#(.+)/)[1]);
  }
});
