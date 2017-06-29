'use strict'

// Gathering our DOM elements.
var sendDMButton = document.getElementById('send-direct-message');

sendDMButton.addEventListener('click', initiateChat);

function getPersonOne() {
  let user1 = firebase.auth().currentUser.uid;
  return user1
}

function getPersonTwo() {
  let user2 = sendDMButton.parentNode.id;
  return user2
}

function initiateChat(e) {
  e.preventDefault();
  console.log("You have started a chat!", getPersonOne());
  console.log("You will be chatting with:", getPersonTwo());
  // var personOne = user;


}
