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
function checkForPendings(userSession) {
  var currentDoWhop = userSession.current_dowhop;
  console.log('Running checkforpendings v2.0...', currentDoWhop);
  database.ref('DoWhopDescriptions/').child(currentDoWhop).on(
    'value',
    function(data) {
      var requesterName = 'Someone'; // NOTE: just in case we are looking at old data.

      if (data.val().pending && data.val().pending.requesterName) {
        requesterName = data.val().pending.requesterName;
      }
      var pendingNotification = requesterName + ' has requested to meet\n';

      // Check if there are pending data:
      if (
        data.val() &&
        data.val().pending != null &&
        data.val().pending.status != 'approved' &&
        data.val().pending.status != 'denied'
      ) {
        // console.log('pending status true. showing pending div.');
        if (data.val().pending.whenDateTimePending) {
          pendingNotification +=
            'on ' +
            moment(data.val().pending.whenDateTimePending).format('dddd MMMM D, YYYY') +
            ' at ' +
            moment(data.val().pending.whenDateTimePending).format('hh:mmA') +
            '\n';
        }
        if (data.val().pending.whereAddressPending)
          pendingNotification += 'at ' + data.val().pending.whereAddressPending + '\n';

        document.getElementById('pending-div').removeAttribute('hidden');
        document.getElementById('pending-div').innerText = pendingNotification;
        // This means visiting user is the creator of event:
        if (auth.currentUser.email == data.val().creatorDescription) {
          // console.log('visiting user is the creator. showing approval form, hiding rescind form.');
          document.getElementById('pending-div').innerText = pendingNotification;
          document.getElementById('approve-pending-form').removeAttribute('hidden');
          document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');

          // This means visiting user is a requestor of event change:
        } else if (auth.currentUser.uid == data.val().pending.requester) {
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
    },
    function(error) {
      console.error(error);
    }
  );
}

function showUIBasedOnTab(userSession) {
  var currentTabID = userSession.current_tab;
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
    showEditForm(doWhopSelector.firstChild);
    fillInEditForm(doWhopSelector.firstChild);
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
    setMessageImageUrl(imageUri, image);
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

// Setting image management protocols for coordinate only, given a user and a chatID (current DoWhop):

function setMessageImageUrl(imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
    firebase.storage().refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
}

function manageMessengerImages(userSession) {
  var messagesRef = firebase.database().ref().child('messages/' + userSession.current_dowhop);
  event.preventDefault();
  var mediaCapture = document.getElementById('mediaCapture');
  var imageForm = document.getElementById('image-form');
  // Events for image upload:
  var submitImageButton = document.getElementById('submitImage');

  var saveImageMessage = function(event) {
    event.preventDefault();
    var currentUser = person;
    var mediaCapture = document.getElementById('mediaCapture');
    var imageForm = document.getElementById('image-form');
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    imageForm.reset();

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      window.alert('You can only share images. Please try again.');
      return;
    }
    // We add a message with a loading icon that will get updated with the shared image.
    messagesRef
      .push({
        name: currentUser.displayName,
        imageUrl: FriendlyChat.LOADING_IMAGE_URL,
        photoUrl: currentUser.photoURL || '/images/user-icon.png'
      })
      .then(
        function(data) {
          // Upload the image to Cloud Storage.
          var filePath = 'userImages/' + currentUser.uid + '/' + 'messageImages/' + data.key + '/' + file.name;
          return storage.ref(filePath).put(file).then(
            function(snapshot) {
              // Get the file's Storage URI and update the chat message placeholder.
              var fullPath = snapshot.metadata.fullPath;
              return data.update({ imageUrl: this.storage.ref(fullPath).toString() });
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(function(error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      });
    // resetDateTimeWhere; // Check.
  };

  submitImageButton.addEventListener(
    'click',
    function(e) {
      e.preventDefault();
      mediaCapture.click();
    }.bind(this)
  );
  mediaCapture.addEventListener('change', saveImageMessage.bind(this));
}

function showDoWhopSelectorHeader(userSession) {
  var doWhopSelector = document.getElementById('dowhop-selector-container');
  database.ref('DoWhopDescriptions/').child(userSession.current_dowhop).once('value').then(function(snapshot) {
    console.log(snapshot.val());
  })
}

function setAndGetDoWhopDescriptionSession(userSession) {
  console.log('Running setAndGetDoWhopDescriptionSession....');
  var user = person;
  var userID = person.uid;
  var currentDoWhopID = userSession.current_dowhop; // This is available from higher scope.
  var currentTabID = userSession.current_tab;
  var messagesRef = firebase.database().ref().child('messages/');
  var sessionRef = database.ref('/session').child(userID);
  var doWhopSelector = document.getElementById('dowhop-selector-container');
  var messageList = document.getElementById('messages');
  var messageInput = document.getElementById('message');
  var doWhopSelectorDiv = '';

  // Executing functions that are triggered by clicking on a selector block:
  firebase.database().ref().child('DoWhopDescriptions/' + userSession.current_dowhop).on('value', function(data) {
    // Weave together header
    if (data.val()) {
      var imageUrl =
        (data.val().downloadURL && data.val().downloadURL.image1) ||
        data.val().downloadURL ||
        defaultDoWhopDescriptionImage;

      var doWhopDescriptionTitle = data.val().titleDescription || 'Your DoWhops Will Appear Here';

      // Adding these logic checks so that when users update their information, new times, dates, etc render in 'View':
      var renderWhenInformation = data.val().whenDescription;
      var renderWhereInformation = data.val().whereDescription;
      var renderWhoDescription = data.val().whoDescription;
      var renderWhoAmIInformation = data.val().whoAmIDescription || '';
      var whoInformation = data.val().doerDescription; // In progress:  Update with first names dynamically.
      var renderCreatorIcon = '';
      var renderDoerIcons = '';
      var appUsersRef = database.ref('app_users');
      var doerEmails = whoInformation.split(', ');
      var creatorEmail = data.val().creatorDescription;

      appUsersRef
        .once('value')
        .then(function(snap) {
          // console.log('Resetting the values...');
          doerUserObjects.length = 0; // Resetting the global variable.
          creatorUserObjects.length = 0;
          snap.forEach(function(childSnap) {
            doerEmails.filter(function(doerEmail) {
              if (doerEmail === childSnap.val().email) {
                // console.log('it matches!');
                // console.log(childSnap.val());
                doerUserObjects.push(childSnap.val());
              }
            });
            if (creatorEmail === childSnap.val().email) {
              creatorUserObjects.push(childSnap.val());
            }
          });
        })
        .then(
          (function() {
            if (creatorUserObjects && creatorUserObjects.length > 0) {
              _.map(creatorUserObjects, function(userObject) {
                renderCreatorIcon +=
                  '<div class="user-avatar-container">' +
                  "<a href='/profile.html?" +
                  userObject.uid +
                  "'>" +
                  "<div class='user-avatar'>" +
                  "<img src='" +
                  userObject.photoURL +
                  "'>" +
                  '</img>' +
                  '</div>' +
                  '<div class="user-handle">' +
                  userObject.displayName +
                  '</div>' +
                  '</a>' +
                  '</div>';
              });
              // Adding a closing segment that will separate Creators from Doers in View:
              renderCreatorIcon += '<div class="user-avatar-container user-avatar-separator">' + 'will meet' + '</div>';
            }

            if (doerUserObjects && doerUserObjects.length > 0) {
              _.map(doerUserObjects, function(userObject) {
                renderCreatorIcon +=
                  '<div class="user-avatar-container">' +
                  "<a href='/profile.html?" +
                  userObject.uid +
                  "'>" +
                  "<div class='user-avatar'>" +
                  "<img class='user-avatar' src='" +
                  userObject.photoURL +
                  "'>" +
                  '</img>' +
                  '</div>' +
                  '<div class="user-handle">' +
                  userObject.displayName +
                  '</div>' +
                  '</a>' +
                  '</div>';
              });
            }
          })()
        );
      // console.log('final results....', doerUserObjects, creatorUserObjects);
      if (data.val().whereAddress && data.val().whereAddress != 'By request') {
        renderWhereInformation = data.val().whereAddress;
      }
      // Adding more specifc 'time' information, if it has been included:
      if (data.val().whenDateTime && data.val().whenDateTime != ('By request' || 'tbd')) {
        renderWhenInformation =
          moment(data.val().whenDateTime).format('dddd MMMM D, YYYY') +
          ' at: ' +
          moment(data.val().whenDateTime).format('h:mmA');
      }
      // console.log('Returning View div...');
      return (doWhopSelectorDiv +=
        "<section id='" +
        data.key +
        "' class='dowhop-selector-block' onclick='setSession(this)''>" +
        "<div class='dowhop-selector-header-top' style='background-image: url(" +
        imageUrl +
        ");'>" +
        '<h1>' +
        doWhopDescriptionTitle +
        '</h1>' +
        '</div>' +
        '<div id="selector-body" class="mdl-layout__content dowhop-selector-body">' +
        '<div class="mdl-card__title">' +
        '<h1 class="mdl-card__title-text">' +
        doWhopDescriptionTitle +
        ' Description' +
        '</h1>' +
        '</div>' +
        '<div class=" user-avatar-section">' +
        renderCreatorIcon +
        renderDoerIcons +
        '</div>' +
        '<div class="mdl-card__supporting-text">' +
        '<h4>Why?</h4>' +
        '<p>' +
        data.val().whyDescription +
        '</p>' +
        '<h4>Who?</h4>' +
        '<p>' +
        renderWhoDescription +
        '</p>' +
        '<p>' +
        renderWhoAmIInformation +
        '</p>' +
        '<h4>What?</h4>' +
        '<p>' +
        data.val().whatDescription +
        '</p>' +
        '<h4>When?</h4>' +
        '<p>' +
        renderWhenInformation +
        '</p>' +
        '<h4>Where?</h4>' +
        '<p>' +
        renderWhereInformation +
        '</p>' +
        '<h4>How much?</h4>' +
        '<p>' +
        data.val().howMuchDescription +
        '</p>' +
        '</div>' +
        '</div>' +
        '</section>');
    }
  });
  doWhopSelector.innerHTML = doWhopSelectorDiv;
}