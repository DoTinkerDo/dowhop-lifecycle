'use strict'

// Gathering our DOM elements.
var sendDMButton = document.getElementById('send-direct-message');

sendDMButton.addEventListener('click', initiateChatDM);

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

function initiateChatDM(e) {
  e.preventDefault();
  console.log("You have started a chat!", getPersonOne());
  console.log("You will be chatting with:", getPersonTwo());
  let refTail = createPathDM(getPersonOne(), getPersonTwo());
  let chatDMref = firebase.database().ref('/direct-messages').child(refTail);
  console.log(refTail);
  chatDMref.push({test: "hi"});

}
