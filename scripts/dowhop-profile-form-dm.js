'use strict'

// Gathering our DOM elements.
var sendDMButton = document.getElementById('send-direct-message');
sendDMButton.addEventListener('click', revealFormDM);

function getPersonOne() {
  let user1 = firebase.auth().currentUser.uid;
  return user1
}

function getPersonTwo() {
  let user2 = sendDMButton.parentNode.id;
  return user2
}

// This will ensure the viewer and recipient are pointed toward the same root reference:
function createPathDM(user1, user2) {
  return 'chat_'+(user1<user2 ? user1+'_'+user2 : user2+'_'+user1);
}

function initiateChatDM() {
  // var directMessageButton =  document.getElementById('direct-message-form-button');
  // directMessageButton.addEventListener('click', sendDirectMessage());
  //
  // var directMessageButtonHide =  document.getElementById('direct-message-form-button-hide');
  // directMessageButtonHide.addEventListener('click', hideFormDM());
  //
  // console.log("You have started a chat!", getPersonOne());
  // console.log("You will be chatting with:", getPersonTwo());
}

function sendDirectMessage() {
  let sender = getPersonOne();
  let recipient = getPersonTwo();
  let refTail = createPathDM(getPersonOne(), getPersonTwo());
  let chatDMref = firebase.database().ref('/direct-messages').child(refTail);
  let message = document.getElementById('direct-message-form-input');
  console.log(refTail);
  chatDMref.push({
    from: sender,
    to: recipient,
    body: message});
}

function revealFormDM(e) {
  e.preventDefault();
  document.getElementById('direct-message-form-button').addEventListener('click', sendDirectMessage());
  document.getElementById('direct-message-form-button-hide').addEventListener('click', hideFormDM);
  var directMessageForm = document.getElementById('direct-message-form');
  directMessageForm.removeAttribute('hidden');
  console.log("You have started a chat!", getPersonOne());
  console.log("You will be chatting with:", getPersonTwo());
}

function hideFormDM(e) {
  e.preventDefault();
  var directMessageForm = document.getElementById('direct-message-form');
  directMessageForm.setAttribute('hidden', 'true');
}
