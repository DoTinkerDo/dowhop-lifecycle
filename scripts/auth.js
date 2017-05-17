  "use strict";

  var auth = firebase.auth();
  var googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  var signIn = document.getElementById('sign-in');
  var signOut = document.getElementById('sign-out');

  function handleSignIn() {
    auth.signInWithPopup(googleAuthProvider).then(function() {
      console.log('signed in');
      location.reload();
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

  var currentUserDoWhopId = null;
  var currentDoWhopProto = null;
  firebase.database().ref().child('proto_user/').once('value', function(snapshot) {
   snapshot.forEach(function(data) {
      var name = "\"" + person.displayName + "\"";
      var name = person.displayName;
      if (data.key === name) {
        currentUserDoWhopId = data.val();
      }
    });
    firebase.database().ref().child('proto/' + currentUserDoWhopId).once('value', function(snapshot) {
      currentDoWhopProto = snapshot.val();
    });
  });

  signIn.addEventListener('click', handleSignIn);
  signOut.addEventListener('click', handleSignOut);
