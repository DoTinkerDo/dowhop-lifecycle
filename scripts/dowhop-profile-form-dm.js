// This is a script for managing direct-messaging functionality.
// (c) DoWhop.com, 2017.
'use strict';

// Gathering our DOM elements.
var sendDMButton = document.getElementById('send-direct-message');
sendDMButton.addEventListener('click', revealFormDM);

function getPersonOne() {
  let user1 = firebase.auth().currentUser.uid;
  return user1;
}

function getPersonTwo() {
  let user2 = sendDMButton.parentNode.id;
  return user2;
}

// This will ensure the viewer and recipient are pointed toward the same root reference:
function createPathDM(user1, user2) {
  return 'chat_' + (user1 < user2 ? user1 + '_' + user2 : user2 + '_' + user1);
}

function sendDirectMessage(e) {
  e.preventDefault();
  var message = document.getElementById('direct-message-form-input');
  let senderRef = firebase.database().ref('/app_users').child(getPersonOne());
  let recipientRef = firebase.database().ref('/app_users').child(getPersonTwo());

  let refTail = createPathDM(getPersonOne(), getPersonTwo());
  let chatDMref = firebase.database().ref('/direct-messages').child(refTail);

  let senderName = '';
  senderName = firebase.auth().currentUser.displayName; // Check.

  let recipientName = '';
  recipientRef.once('value', function(snap) {
    recipientName = snap.val().displayName;
  });

  chatDMref
    .push({
      from: senderName,
      to: recipientName,
      body: message.value
    })
    .then(document.getElementById('direct-message-form').reset());
}

function revealFormDM(e) {
  e.preventDefault();
  document.getElementById('direct-message-form-button').addEventListener('click', sendDirectMessage);
  document.getElementById('direct-message-form-button-hide').addEventListener('click', hideFormDM);
  document.getElementById('direct-message-form').removeAttribute('hidden');
  document.getElementById('direct-messages-div').removeAttribute('hidden');
  // console.log('You have started a chat!', getPersonOne());
  // console.log('You will be chatting with:', getPersonTwo());
  loadDirectMessagesHistory();
}

function hideFormDM(e) {
  e.preventDefault();
  var directMessageForm = document.getElementById('direct-message-form');
  directMessageForm.setAttribute('hidden', 'true');
  var directMessagesDiv = document.getElementById('direct-messages-div');
  directMessagesDiv.setAttribute('hidden', 'true');
}

function loadDirectMessagesHistory() {
  var directMessagesDiv = document.getElementById('direct-messages-div');
  let refTail = createPathDM(getPersonOne(), getPersonTwo());
  let chatDMref = firebase.database().ref('/direct-messages').child(refTail);

  // Reset elements.
  chatDMref.off();
  directMessagesDiv.innerText = '';

  // Loads the last x number of messages and listen for new ones:
  var setMessage = function(data) {
    var val = data.val();
    displayMessage(data.key, val.from, val.to, val.body);
  }.bind(this);

  chatDMref.orderByKey().limitToLast(12).on('child_added', setMessage);
  chatDMref.orderByKey().limitToLast(12).on('child_changed', setMessage);
}

function displayMessage(key, from, to, body) {
  var directMessagesDiv = document.getElementById('direct-messages-div');
  var newDiv = document.createElement('div');
  var bodyText = '';
  bodyText += from + ' says: ';
  bodyText += body;
  newDiv.classList.add('message-container');
  newDiv.classList.add('visible');
  newDiv.innerHTML = "<div class='message'>" + bodyText + '</div>';
  // newDiv.innerText = bodyText;
  directMessagesDiv.appendChild(newDiv);
}
