// Fnctions that will be called when user object is present and signed in.
// (c) DoWhop.com, 2017

// Tasks:
// Check my session
// Retrieve my DoWhops
// Check for pendings
// Show DoWhop View data
// Show DoWhop Creator/Doer data
// Show mini-View at top of page

// All cases, we load pending div forms for current session:
function checkForPendings(data) {
  console.log('Running checkforpendings v2.0...');
  var requesterName = 'Someone'; // NOTE: just in case we are looking at old data.

  if (data.pending && data.pending.requesterName) {
    requesterName = data.pending.requesterName;
  }
  var pendingNotification = requesterName + ' has requested to meet\n';

  // Check if there are pending data:
  if (data && data.pending != null && data.pending.status != 'approved' && data.pending.status != 'denied') {
    // console.log('pending status true. showing pending div.');
    if (data.pending.whenDateTimePending) {
      pendingNotification +=
        'on ' +
        moment(data.pending.whenDateTimePending).format('dddd MMMM D, YYYY') +
        ' at ' +
        moment(data.pending.whenDateTimePending).format('hh:mmA') +
        '\n';
    }
    if (data.pending.whereAddressPending) pendingNotification += 'at ' + data.pending.whereAddressPending + '\n';

    document.getElementById('pending-div').removeAttribute('hidden');
    document.getElementById('pending-div').innerText = pendingNotification;
    // This means visiting user is the creator of event:
    if (firebase.auth().currentUser.email == data.creatorDescription) {
      // console.log('visiting user is the creator. showing approval form, hiding rescind form.');
      document.getElementById('pending-div').innerText = pendingNotification;
      document.getElementById('approve-pending-form').removeAttribute('hidden');
      document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');

      // This means visiting user is a requestor of event change:
    } else if (firebase.auth().currentUser.uid == data.pending.requester) {
      // console.log('visiting user requested a change. showing rescinding form, hiding approval form.'
      document.getElementById('pending-div').innerText = pendingNotification;
      document.getElementById('rescind-pending-form').removeAttribute('hidden');
      document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    }
    // All other cases:
  } else {
    // console.log('this means it has passed over logic tests.');
    document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    document.getElementById('pending-div').innerText = '';
    document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');
  }
}

function showUIBasedOnTab(userSession) {
  var currentTabID = userSession.current_tab;
  console.log();
  var doWhopSelector = document.getElementById('dowhop-selector-container');

  console.log('Running showandhide v2.0');
  if (currentTabID === 'coordinate-tab') {
    document.getElementById('messages-card').removeAttribute('hidden');
    document.getElementById('selector-body').setAttribute('hidden', 'true');
    // FriendlyChat.prototype.loadMessages(); OLD.
    loadMessages(userSession); // NEW.
  } else if (currentTabID === 'edit-tab') {
    // We only load edit form if edit tab is clicked:
    document.getElementById('messages-card').setAttribute('hidden', 'true');
    document.getElementById('selector-body') && document.getElementById('selector-body').removeAttribute('hidden');
    showEditForm(userSession.current_dowhop);
    fillInEditForm(userSession.current_dowhop);
  } else if (currentTabID === 'review-tab') {
    // TO-DO: Good to clear all unwanted UI elements if nothing's chosen.
    document.getElementById('messages-card').setAttribute('hidden', 'true');
    document.getElementById('selector-body').setAttribute('hidden', 'true');
  } else {
    document.getElementById('messages-card').setAttribute('hidden', 'true');
    document.getElementById('selector-body') && document.getElementById('selector-body').setAttribute('hidden', 'true');
  }
}

function loadMessages(userSession) {
  console.log('running loadmessages v2.0....');
  var user = person.uid;
  var messageList = document.getElementById('messages');
  var chatIdCurrent = userSession.current_dowhop;
  // var sessionRef = firebase.database().ref('/session').child(person.uid).child('current_dowhop');
  // sessionRef.on('value', function(snap) {
  //   return (chatIdCurrent = snap.val());
  // });
  var messagesRef = firebase.database().ref().child('messages/' + chatIdCurrent);

  // Make sure we remove all previous listeners and clear the UI.
  messagesRef.off();
  messageList.innerText = '';

  // Loads the last x number of messages and listen for new ones:
  var setMessage = function(data) {
    var val = data.val();
    displayUserMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl, val.senderId);
  }.bind(this);
  messagesRef.orderByKey().on('child_added', setMessage);
  messagesRef.orderByKey().on('child_changed', setMessage); // TIP: To restrict number of messages, include .limitToLast(X) in db query.
}

function displayUserMessage(key, name, text, picUrl, imageUri, senderId) {
  var messageList = document.getElementById('messages');
  var messageInput = document.getElementById('message');
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    container.firstChild.firstChild.setAttribute('href', '/profile.html?' + senderId); // Check routes.
    div.setAttribute('id', key);
    messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) {
    // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) {
    // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener(
      'load',
      function() {
        messageList.scrollTop = messageList.scrollHeight;
      }.bind(this)
    );
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in.
  setTimeout(function() {
    div.classList.add('visible');
  }, 1);
  messageList.scrollTop = messageList.scrollHeight;
  messageInput.focus();
}
