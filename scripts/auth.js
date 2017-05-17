"use strict";

var loginButtonGGL = document.getElementById('login-button-ggl');
var loginButtonFB = document.getElementById('login-button-fb');
var loginPage = document.getElementById('login-page');
var applicationPage = document.getElementById('application-page');

function writeUserData(userId, name, email, photoURL, UID) {
  firebase.database().ref('logged_in_users/' + userId).set({
    username: name,
    email: email,
    userUID: UID,
    photoURL: photoURL,
    UID: UID
  });
}

window.addEventListener('load', function() {

  loginButtonGGL.addEventListener('click', function() {
    var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
      location.reload();
      console.log('GGL login button pressed', result.user);
    });
  });

  loginButtonFB.addEventListener('click', function() {
    var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebookAuthProvider).then(function(result) {
      location.reload();
      console.log('FB login button pressed', result.user);
    });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      loginPage.style.display = 'none';
      applicationPage.style.display = 'block';
      writeUserData(user.uid, user.displayName, user.email, user.photoURL, user.uid);
      console.log('user signed in: ');
    } else {
      loginPage.style.display = 'block';
      applicationPage.style.display = 'none'
      console.log('user signed out');
    }
  });
}, false);

var auth = firebase.auth();
var googleAuthProvider = new firebase.auth.GoogleAuthProvider();

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
