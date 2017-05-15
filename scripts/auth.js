  "use strict";

  var auth = firebase.auth();
  var googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  var signIn = document.getElementById('sign-in');
  var signOut = document.getElementById('sign-out');

  function handleSignIn() {
    auth.signInWithPopup(googleAuthProvider).then(function() {
      console.log('signed in');
      // window.opener.location.reload();
      location.reload(true);
    });
  }

  function handleSignOut() {
    auth.signOut().then(function() {
      console.log('logged out');
      location.reload();
    });
  }

  var person = null;
  auth.onAuthStateChanged(function(user) {
    if (user) {
      person = user;
    } else {
      console.log('user has signed out');
    }
  });

  signIn.addEventListener('click', handleSignIn);
  signOut.addEventListener('click', handleSignOut);
