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
	let sender = getPersonOne();
	let recipient = getPersonTwo();
	let refTail = createPathDM(getPersonOne(), getPersonTwo());
	let chatDMref = firebase.database().ref('/direct-messages').child(refTail);

	chatDMref
		.push({
			from: sender,
			to: recipient,
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
	newDiv.innerText = body;
	directMessagesDiv.append(newDiv);
}
