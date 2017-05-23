/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Creates Google maps: <-- TO-DO: Reset the Google Map upon reload.

// This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
  var currentSessionID;
  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

function getSesh() {
  FriendlyChat.prototype.getSession()
}

// Initializes FriendlyChat.
function FriendlyChat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.adminDiv = document.getElementById('admin-input-form'); // Check.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit-message-button');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.messageFormWhenDatePending = document.getElementById('whenDatePending');
  this.messageFormWhenTimePending = document.getElementById('whenTimePending');
  this.messageFormWherePending = document.getElementById('whereAddressPending');

  // Shortcuts to DOM elements for notification messages:
  this.radioApprove = document.getElementById("radioApprove");
  this.radioDeny = document.getElementById("radioDeny");
  this.approvalForm = document.getElementById('approve-pending-form');
  this.rescindingForm = document.getElementById('rescind-pending-form');
  this.pendingDiv = document.getElementById('pending-div');
  this.submitApproval = document.getElementById('submit-approval-button');
  this.submitRescind = document.getElementById('submit-rescind-button');
  this.chatInputMap = document.getElementById('map')

  // Load chat data:
  this.chatItemData = document.getElementById('dowhop-selector-container');
  this.chatItemData.addEventListener('click', this.loadMessages.bind(this)); // <-- Developer: return to this.
  // this.getSession();

  // Save chats on chatroom form submit:
  // this.newChatForm.addEventListener('submit', this.saveChat.bind(this));

  // Reveal when and where upon form section click:
  // this.newChatWhenIcon.addEventListener('click', this.showDateTimeInputs.bind(this));

  // Save message on form submit:
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  // this.signOutButton.addEventListener('click', this.signOut.bind(this));
  // this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button:
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);


  // Events for time-change-approval buttons:
  this.submitApproval.addEventListener('click', this.sendApproval.bind(this));
  this.submitRescind.addEventListener('click', this.sendRescind.bind(this));

  // Events for image upload:
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));
  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth:
FriendlyChat.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

FriendlyChat.prototype.checkForAdmin = function() { // CHECK.

  var adminDiv = document.getElementById("admin-input-form");

  // if(person.email === ("XXXX@gmail.com") {
  //   console.log("person's email passed: ", person.email);
  //   adminDiv.removeAttribute("hidden");
  // } else {
  //   adminDiv.setAttribute("hidden","true");
  // }

};

FriendlyChat.prototype.sendApproval = function(e) {
  e.preventDefault();
  var choice, newDate, newTime, newWhere
  this.chatItemDataSpecific = document.getElementById("dowhop-selector-container").children[0].id
  var myRef = this.database.ref().child('doWhops/' + this.chatItemDataSpecific);
  var myRefPending = this.database.ref().child('doWhops/' + this.chatItemDataSpecific + '/pending');
  var messagesRef = this.database.ref().child('messages/' + this.chatItemDataSpecific);
  var status

  myRefPending.once('value', function(snap) {
    console.log("your suggested date is:\n")
    console.log(snap.val().whenDatePending)
    console.log("your suggested time is:\n")
    console.log(snap.val().whenTimePending);
    newDate = snap.val().whenDatePending;
    newTime = snap.val().whenTimePending;
    newWhere = snap.val().whereAddressPending;
  });

  if (this.radioApprove.checked) {
    status = "approved";
    myRef.update({
      whenDate: newDate,
      whenTime: newTime,
      whereAddress: newWhere
    });
    this.database.ref().child('doWhops/' + this.chatItemDataSpecific + '/pending/').update({
    status: status
    });
  } else if (this.radioDeny.checked) {
    status = "denied";
    this.database.ref().child('doWhops/' + this.chatItemDataSpecific + '/pending/').update({
    status: status
  });
  };
  messagesRef.push({
        chatId: this.chatItemDataSpecific,
        name: "",
        text: person.displayName + " has " + status + " the request.",
        photoUrl: 'https://static.wixstatic.com/media/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png/v1/fill/w_512,h_512,al_c/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png' // <- Customized.
      });

  // Notify the user of a change here:
  window.alert("You have responded to the change request!");

  // Add UI reset information here:
  this.approvalForm.setAttribute("hidden", "true");
  this.rescindingForm.setAttribute("hidden", "true");
  this.pendingDiv.innerHTML = '';
  this.pendingDiv.setAttribute("hidden", "true");
}

FriendlyChat.prototype.sendRescind = function(e) {
  e.preventDefault();
  console.log("You have rescinded");
  this.chatItemDataSpecific = document.getElementById("dowhop-selector-container").children[0].id // <-- Refactor
  this.database.ref().child('doWhops/' + this.chatItemDataSpecific + '/pending/').remove();
  // Send a notification to the user:
  window.alert("You have rescinded!");

  // Add UI reset information here:
  this.approvalForm.setAttribute("hidden", "true");
  this.rescindingForm.setAttribute("hidden", "true");
  this.pendingDiv.innerHTML = ''; // Return.
  this.pendingDiv.setAttribute("hidden", "true");
}

// Add dynamic 'When' form:
FriendlyChat.prototype.showDateTimeInputs = function () {
  // this.newChatWhenBounds.removeAttribute('hidden');
}

FriendlyChat.prototype.removeChats = function() {
  // this.chatList.innerHTML = "";
  this.messageList.innerHTML = "";
  // this.chatItemData.innerHTML = "Your DoWhop details will appear here!";
}

FriendlyChat.prototype.getSession = function() {
    var myRef = firebase.database().ref('session/' + person.uid);
    var dowhopSelector = document.getElementById('dowhop-selector-container');
    // Add parts for the notification-pending displays:
    var pendingDiv = this.pendingDiv;
    var myApprovalForm = this.approvalForm;
    var myRescindingForm = this.rescindingForm;
    var pendingNotification = '';

    var checkForPendings = function(id, data) {
        var pendingNotification = '';
        console.log("something was changed regarding: " + id);

        // Check if there are pending notifications:
        if ((data.val().pending != null) && (data.val().pending.status != "approved") && (data.val().pending.status != "denied")) {
          console.log("pending status true. showing pending div.");
          document.getElementById('pending-div').removeAttribute('hidden');

          // This means visiting user is the creator of event:
          if (firebase.auth().currentUser.uid == data.val().creator || (person.email == data.val().host)) { // <--Check
              console.log("visiting user is the creator. showing approval form, hiding rescind form.")
              pendingNotification = "Someone has requested this change.\nDo you want to approve it?"
              document.getElementById('pending-div').innerText = pendingNotification + "\nPending time: " + data.val().pending.whenDatePending + " at " + data.val().pending.whenTimePending +
                                      "\nPending location: " + data.val().pending.whereAddressPending;

              document.getElementById('approve-pending-form').removeAttribute('hidden');
              document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');

          // This means visiting user is a requestor of event change:
        } else if (firebase.auth().currentUser.uid == data.val().pending.requester) {

            console.log("visiting user requested a change. showing rescinding form, hiding approval form.")
            pendingNotification = "You have requested this time!\nIt is pending. Do you want to change it?";
            document.getElementById('pending-div').innerText = pendingNotification + "\nPending time: " + data.val().pending.whenDatePending + " at " + data.val().pending.whenDatePending +
                                        "\nPending location: " + data.val().pending.whereAddressPending;

            document.getElementById('rescind-pending-form').removeAttribute('hidden');
            document.getElementById('approve-pending-form').setAttribute('hidden', 'true');

          }
          // All other cases:
        } else {

          console.log("this means it has passed over logic tests.");
          document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
          document.getElementById('pending-div').innerText = '';
          document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
          document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');

        }
    console.log("your id...checking here", id)
      };

    myRef.on("value", function(data) {

      var dowhopSelector = document.getElementById('dowhop-selector-container');
      var dowhopSelectorDiv = "";

      console.log("Inside once", currentSessionID = data.val().current_dowhop);

      // Setting the header and check for pendings for the current DoWhop session:

      // Checking for changed pendings in real-time:
      firebase.database().ref().child('doWhops/' + data.val().current_dowhop)
        .on('child_changed', function(data) {
        checkForPendings(data.key, data);
      });

      // Extracting all of the relevant DoWhop-Selector-Block information:
      firebase.database().ref().child('doWhops/' + data.val().current_dowhop)
        .on('value', function(data) {

          // Check for pending notifications:
          checkForPendings(data.key, data)

          // Weave together header
          let imageUrl; // <--TO-DO: refactor. Add ImageUrl default when no uploaded banner image is available.
          imageUrl = 'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';

          return dowhopSelectorDiv +=
          "<section id='" + data.key + "' class='col-sm-12 col-xs-12 dowhop-selector-block' onclick='sessionRef(this)''>" +

              "<div class='dowhop-selector-header' style='background-image: url(" + imageUrl + ");'>" +
                "<h1>" + data.val().titleDescription + "</h1>" +
              "</div>" +
            // We only need the header portion of this data. TO-DO: Refacator.
            //   "<div class='dowhop-selector-body'>" +
            //     "<h3>" + data.val().whatDescription + "</h3>" +
            //     "<h5>When?</h5>" +
            //     "<p>" + data.val().whenDate + ' at ' + data.val().whenTime +
            //     " " + data.val().whenDescription + "</p>" +
            //     "<h5>Where?</h5>" +
            //     "<p>" + data.val().whereDescription + " " + data.val().whereAddress + "</p>" +
            //     "<h5>What else?</h5>" +
            //     "<p>" + data.val().howmuchDescription + ' ' + data.val().howmuchCost +
            // "</div>" +
          "</section>"

         });

       dowhopSelector.innerHTML = dowhopSelectorDiv;
    });
  }

// Loads messages history and listens for upcoming ones:
FriendlyChat.prototype.loadMessages = function() {
  let user = person.uid;
  var chatIdCurrent = this.chatItemData.firstChild.id // <-- Refactor
  this.messagesRef = this.database.ref().child('messages/' + chatIdCurrent);

  // Make sure we remove all previous listeners and clear the UI.
  this.messagesRef.off();
  this.messageList.innerText = '';

  // Loads the last x number of messages and listen for new ones:
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRef.orderByKey().limitToLast(12).on('child_added', setMessage);
  this.messagesRef.orderByKey().limitToLast(12).on('child_changed', setMessage);
};

// Saves a new message on the Firebase DB:
FriendlyChat.prototype.saveMessage = function(e) {
  e.preventDefault();

  // Mke sure this chat and message get sent to two appropriate places:
  this.chatItemDataSpecific = document.getElementById("dowhop-selector-container").children[0].id // <-- Refactor

  // Nesting the message content under chat-id node headings:
  var messagesChatsRef = this.messagesRef; // <-- Refactor?
  var currentUser = person;
  var whenDatePending = this.whenDatePending;
  var whenTimePending = this.whenTimePending;
  var whereAddressPending = this.whereAddressPending;

  // Check that the user entered a time change request:

  if (this.messageFormWhenDatePending.value && this.messageFormWhenTimePending.value && this.messageFormWherePending) {
    // Send the inputted date/time suggestion to the event it's associated with:
    var chatsRef = this.database.ref().child('doWhops/' + this.chatItemDataSpecific + '/pending/');
    // Send a notification to the thread:
    messagesChatsRef.push({
      chatId: this.chatItemDataSpecific,
      name: currentUser.displayName,
      text: currentUser.displayName + " has requested a change: " + this.messageFormWhenDatePending.value + " at " + this.messageFormWhenTimePending.value + "  " + this.messageFormWherePending.value,
      photoUrl: 'https://static.wixstatic.com/media/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png/v1/fill/w_512,h_512,al_c/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png' // <- Customized.
    });

    chatsRef.update({
      status: true,
      whenDatePending: this.messageFormWhenDatePending.value,
      whenTimePending: this.messageFormWhenTimePending.value,
      whereAddressPending: this.messageFormWherePending.value,
      requester: currentUser.uid
    }).then(this.resetDateTimeWhere) // <-- Reset the field.

  }

  // Check that the user entered a message and is signed in:
  if (this.messageInput.value && this.checkSignedInWithMessage()) {

    // Push new message to Firebase:
    messagesChatsRef.push({
      chatId: this.chatItemDataSpecific,
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || 'https://static.wixstatic.com/media/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png/v1/fill/w_512,h_512,al_c/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png' // <- Customized.
    }).then(function() {
      // Clear message text field and SEND button state:
      FriendlyChat.resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

FriendlyChat.prototype.resetDateTimeWhere = function() {
  document.getElementById("whenDatePending").value = null;
  document.getElementById("whenTimePending").value = null;
  document.getElementById("whereAddressPending").value = null;
}

// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
FriendlyChat.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {

    // We add a message with a loading icon that will get updated with the shared image.
    var currentUser = person;
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: FriendlyChat.LOADING_IMAGE_URL,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(data) {

      // Upload the image to Cloud Storage.
      var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
  }
};

// Save all users who've logged in into DB via UID for shallow nesting:
FriendlyChat.prototype.saveUser = function() {
  var currentUser = person;
  this.database.ref('users/' + currentUser.uid).set({
    name: currentUser.displayName,
    email: currentUser.email,
    uid: currentUser.uid,
    photo: currentUser.photoURL || '/images/profile_placeholder.png',
    note: "N/A"
  })
}

// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat and resets views:
FriendlyChat.prototype.signOut = function() {
  this.removeChats();
  this.pendingDiv.setAttribute("hidden", "true");
  this.approvalForm.setAttribute("hidden", "true");
  this.rescindingForm.setAttribute("hidden", "true");
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;   // Added: Get profile pic.
    var userName = user.displayName;        // Added: Get user's name.
    this.checkForAdmin(); // CHECK.

    // We want to reset the page and load currently existing threads:
    // this.loadChats();
    // this.loadPendingNotifications();

    // We want to save currently signed-in user.
    this.saveUser();

    // Add event listener for event session changes:
    this.getSession(currentSessionID);
    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  /* Added: Check if user is signed-in Firebase. */
  if (person) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first, please!',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// ADDED: Saves the messaging device token to the datastore.
FriendlyChat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// ADDED: Requests permissions to show notifications.
FriendlyChat.prototype.requestNotificationsPermissions = function() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Templates for Chats:
FriendlyChat.CHAT_TEMPLATE =
  '<button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dowhop-button">' + '</button>';

// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Tempalte for approval-denial of time-change form:
FriendlyChat.APPROVAL_TEMPLATE =
  '<div class="pending-style">' + '<div>' + '<button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dowhop-button">' + '</button>' + '</div>' + '</div>';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
FriendlyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
FriendlyChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Cloud Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

window.onload = function() {
  window.friendlyChat = new FriendlyChat();
};
