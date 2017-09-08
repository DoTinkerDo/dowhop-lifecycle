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
    writeUserData(user);
    // FCM permission registration
    registerMessaging(user);
    // retrieveMyDoWhops(user.uid);

    // if (window.location.hash != '' && window.location.hash.length > 0) {
    //   getLandingTab(window.location.hash.match(/#(.+)/)[1]);
    // }
    //
    // // Read the user's saved session:
    //
    // var sessionRef = database.ref('/session').child(user.uid);
    // var userSession;
    //
    // sessionRef.on(
    //   'value',
    //   function(snap) {
    //     if (!snap.val()) {
    //       var userSession = {
    //         current_tab: 'coordinate-tab'
    //         // To-Do: Set default doWhopDescriptionKey.
    //       };
    //       sessionRef.update(userSession);
    //     }
    //     userSession = snap.val();
    //     // console.log('current DoWhop in view', userSession.current_dowhop);
    //     // console.log('current tab', userSession.current_tab);
    //     // getSessionTab(user.uid);
    //     getLandingTab(userSession.current_tab);
    //     checkForPendings(userSession); // Sets listener for changes, too.
    //     manageMessengerImages(userSession);
    //     // showDoWhopHeaderInView();
    //     setAndGetDoWhopDescriptionSession(userSession);
    //     showUIBasedOnTab(userSession);
    //   },
    //   function(error) {
    //     console.error(error);
    //   }
    // );
  }

  function handleSignedOutUser() {
    loginPage.style.display = 'block';
    applicationPage.style.display = 'none';
    ui.start('#firebaseui-auth-container', uiConfig);
    database.ref('session/').off();
  }

  function handleOnAuthStateChange() {
    auth.onAuthStateChanged(function(user) {
      // Check if current user email is admin in Firebase:
      var approved = false;
      console.log('authstatechanged');
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

      // if (window.location.hash != '' && window.location.hash.length > 0) {
      //   getLandingTab(window.location.hash.match(/#(.+)/)[1]);
      // }

      // Read the user's saved session:
      if (user) {
        var sessionRef = database.ref('/session').child(user.uid);
        var userSession;

        sessionRef.on('value', function(snap) {
          if (!snap.val()) {
            var userSession = {
              current_tab: 'coordinate-tab'
              // To-Do: Set default doWhopDescriptionKey.
            };
            sessionRef.update(userSession);
          }
          userSession = snap.val();
          // console.log('current DoWhop in view', userSession.current_dowhop);
          // console.log('current tab', userSession.current_tab);
          // getSessionTab(user.uid);
          // getLandingTab(userSession.current_tab);
          checkForPendings(userSession); // Sets listener for changes, too.
          manageMessengerImages(userSession);
          // showDoWhopHeaderInView();
          setAndGetDoWhopDescriptionSession(userSession);
          getLandingTab(userSession.current_tab);
          showUIBasedOnTab(userSession);
        });
      }

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

// function getSessionTab(uid) {
//   // Deprecated.
//   var currentTab;
//   var sessionRef = database.ref('/session').child(uid);
//   sessionRef.on('value', function(snap) {
//     currentTab = snap.val().current_tab;
//     // console.log('... running new getsession tab', currentTab);
//   });
//   return currentTab;
// }

// console.log('...finishing running getsession tab', currentTab);
function createDefaultWelcomingMessage(newKey) {
  // console.log('creating welcoming msg');
  // Gathering the appropriate data to fill out message:
  var DoWhopTitleDescription, DoWhopWhenDescription, DoWhopWhereDescription;

  database.ref('/DoWhopDescriptions').child(newKey).once('value').then(function(snap) {
    DoWhopTitleDescription = snap.val().titleDescription;
    DoWhopWhenDescription = snap.val().whenDescription;
    DoWhopWhereDescription = snap.val().whereDescription;
  });

  var teamName = 'Your DoWhop Team';
  var welcomeMessageText =
    'Welcome to your ' +
    DoWhopTitleDescription +
    ' DoWhop!\n\n' +
    'Currently, ' +
    creatorDisplayName +
    ' plans to meet "' +
    DoWhopWhenDescription +
    '" at "' +
    DoWhopWhereDescription +
    '".\n' +
    'Coordinate the details here!';

  var messagesChatsRef = firebase.database().ref().child('messages').child(newKey);
  messagesChatsRef.push({
    chatId: doWhopDescriptionKey,
    name: teamName,
    text: welcomeMessageText,
    photoUrl: defaultImageURL
  });
}

function createDefaultDoWhop(person) {
  var uid = person.uid;
  var email = person.email;
  var creatorDescription = person.email;
  // Then we add on note to user's profile that it has been added:
  var appUsersRef = database.ref('/app_users');
  var appUserRef = appUsersRef.child(uid);
  var currentTime = moment().format('YYYY-MM-DD--HH:mm');
  // var defaultDoWhopImage = 'images/DefaultDoWhop_banner.jpg';
  var defaultDoWhopImage1 =
    'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/defaultDowhops%2FIMG_0992-edited.jpg?alt=media&token=f7bfe79b-e90b-443e-ae89-3f8abc46661a';
  var defaultDoWhopImage2 =
    'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/defaultDowhops%2FIMG_1161-edited.jpg?alt=media&token=a9c1e9c1-fcd1-437d-b2e4-b0da581dff69';
  // Adding a default DoWhop template as welcoming message:
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  // First we create the new default DoWhop:
  doWhopDescriptionRef.child(doWhopDescriptionKey).set({
    createdBy: uid,
    doWhopDescriptionKey: doWhopDescriptionKey,
    downloadURL: { image1: defaultDoWhopImage1, image2: defaultDoWhopImage2 },
    titleDescription: 'Help with DoWhop',
    whyDescription:
      'These notes will help you create your first DoWhop and answer any questions about the purpose behind each text field! Put a tagline describing this DoWhop in the "why do this DoWhop" section to grab the attention of other DoWhoppers on the marketplace.',
    whoDescription:
      'Enter the maximum number of people you can take and describe who might enjoy the experience based on their skill level and personality.',
    whoAmIDescription: '',
    whatDescription:
      'Specify any items that the Doers will be required to bring with them. Explain what you will provide and what else the price includes.',
    whenDescription:
      'How long with this DoWhop take and when do you typically schedule it. If you know when you we be unavailable to receive bookings specify that here. By request is an okay too',
    whereDescription:
      'You can share the exact address once the doer has booked this experiience. Give the general area here, and describe the facility where this DoWhop will take place. By request or "at your home" will also do for flexible bookings.',
    howMuchDescription:
      'Describe what someone would have to pay to join you and what they would get in exchange. You dont have to describe what the funds go too, but you are welcome to identify any operational expenses or charities you will give the money to upon booking. We will add 20% to the total cost of your DoWhop when listing to the marketplace. You will receive 100% of your listed cost transferred to your payment account when users book and complete this DoWhop.',
    creatorDescription: 'tinkerdowhop@gmail.com',
    doerDescription: email,
    createdAt: currentTime
  });
  // .then(createDefaultWelcomingMessage(doWhopDescriptionKey));

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

function getLandingTab(href) {
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
    var allTabs = document.getElementsByClassName('tab');

    // We need to toggle the tabs to default color if un-selected...
    for (var i = 0; i < allTabs.length; i++) {
      allTabs[i].style.fill = '#000000';
      allTabs[i].style.color = '#000000';
    }
    // ...And set the current session tab:
    currentTabElement.style.fill = '#ec1928';
    currentTabElement.style.color = '#ec1928';
  }
}

// We are ensuring direct routing also happens without refresh:
window.addEventListener('hashchange', function(e) {
  var userID = auth.currentUser.uid;
  var href = window.location.hash;
  var currentTab = '';
  currentTab = href.split('#')[1] + '-tab';

  var sessionRef = database.ref('/session').child(userID);
  sessionRef.update({
    current_tab: currentTab
  });
});
