'use strict';

var doWhopDescriptionRef = database.ref('/DoWhopDescriptions');
var titleDescription = document.getElementById('title-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var creatorDescription = document.getElementById('creator-description');
var doerDescription = document.getElementById('doer-description');
var dowhopImageCapture = document.getElementById('dowhop-image-capture');
var submitNewDoWhopBtn = document.getElementById('create-new-dowhop');
var adminEditDoWhopForm = document.getElementById('admin-edit-dowhop-form');
var creatorDescriptionUpdate = document.getElementById('creatorDescriptionUpdate');
var doerDescriptionUpdate = document.getElementById('doerDescriptionUpdate');
submitNewDoWhopBtn.addEventListener('click', submitNewDoWhopEntry);
var emailSubmitBtn = document.getElementById('emailSubmit');
emailSubmitBtn.addEventListener('click', updateEmails);
var selectedForEdit = document.getElementById('selected-for-edit');
var error = document.getElementById('errorAdmin');

function submitNewDoWhopEntry(e) {
  e.preventDefault();

  if (
    !validateAddDoWhopDescription(
      file,
      titleDescription.value,
      whoDescription.value,
      whatDescription.value,
      whenDescription.value,
      whereDescription.value,
      howMuchDescription.value
    )
  ) {
    alert('Please fill out all the fields and add an Image, Try again.');
    return;
  }

  var uid = auth.currentUser.uid;
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var defaultImageURL = '../images/dowhopicon.gif';
  var filePath = 'userImages/' + uid + '/' + 'titleDescriptionImage/' + doWhopDescriptionKey + '/' + file.name;
  var creatorDisplayName = auth.currentUser.displayName;

  // We are preparing a first message to the future chat thread:
  function createWelcomingMessage() {
    showConfirmationMessage();
    // Gathering the appropriate data to fill out message:
    var DoWhopTitleDescription, DoWhopWhenDescription, DoWhopWhereDescription;

    doWhopDescriptionRef.child(doWhopDescriptionKey).once('value', function(snap) {
      DoWhopTitleDescription = snap.val().titleDescription;
      DoWhopWhenDescription = snap.val().whenDescription;
      DoWhopWhereDescription = snap.val().whereDescription;
    });

    var teamName = "Your DoWhop Team";
    var welcomeMessageText = "Welcome to your "
          + DoWhopTitleDescription
          + " DoWhop!\n\n"
          + "Currently, " + creatorDisplayName + " plans to meet \""
          + DoWhopWhenDescription
          + "\" at \"" + DoWhopWhereDescription + "\".\n"
          + "Coordinate the details here!";

    var messagesChatsRef = firebase.database().ref().child('messages').child(doWhopDescriptionKey);
    messagesChatsRef.push({
      chatId: doWhopDescriptionKey,
      name: teamName,
      text: welcomeMessageText,
      photoUrl: defaultImageURL
    });
  }

  storage.ref(filePath).put(file).then(function(snapshot) {
    doWhopDescriptionRef.child(doWhopDescriptionKey).set({
      createdBy: uid,
      doWhopDescriptionKey: doWhopDescriptionKey,
      downloadURL: snapshot.metadata.downloadURLs[0],
      titleDescription: titleDescription.value,
      whoDescription: whoDescription.value,
      whatDescription: whatDescription.value,
      whenDescription: whenDescription.value,
      whereDescription: whereDescription.value,
      howMuchDescription: howMuchDescription.value,
      creatorDescription: creatorDescription.value,
      doerDescription: doerDescription.value
    }).then(
      createWelcomingMessage()
    );
    clearNewDoWhopEntryForm();
  });
}

var file = null;

function addDoWhopImage(files_arr, node) {
  return (file = files_arr[0]);
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
}

function validateAddDoWhopDescription(
  file,
  titleDescription,
  whoDescription,
  whatDescription,
  whenDescription,
  whereDescription,
  howMuchDescription,
  creatorDescription,
  doerDescription
) {
  if (
    titleDescription === '' ||
    whoDescription === '' ||
    whatDescription === '' ||
    whenDescription === '' ||
    whereDescription === '' ||
    howMuchDescription === '' ||
    creatorDescription === '' ||
    doerDescription === '' ||
    file === null
  )
    return false;
  return true;
}

function clearNewDoWhopEntryForm() {
  file = null;
  titleDescription.value = '';
  whoDescription.value = '';
  whatDescription.value = '';
  whenDescription.value = '';
  whereDescription.value = '';
  howMuchDescription.value = '';
  dowhopImageCapture.value = '';
  creatorDescription.value = '';
  doerDescription.value = '';
}

// Function for admins to hand-code Doer, Creator emails for Betas:
var currentNode;

function revealEditEmailForm(node) {
  adminEditDoWhopForm.removeAttribute('hidden');
  currentNode = node.parentElement.id;
  var currentNodeTitle = '';
  // Show current title in UI:
  var ref = firebase.database().ref('DoWhopDescriptions/' + currentNode);
  ref.once('value', function(data) {
    var currentNodeTitle = data.val().titleDescription;
    selectedForEdit.innerHTML = 'Edit: ' + currentNodeTitle;
  });
  return currentNode;
}

function updateEmails(e) {
  e.preventDefault();
  adminEditDoWhopForm.removeAttribute('hidden');
  var rootRefEvents = firebase.database().ref('DoWhopDescriptions/');
  var newCreatorEmail = document.getElementById('creatorDescriptionUpdate');
  var newDoerEmail = document.getElementById('doerDescriptionUpdate');
  rootRefEvents.child(currentNode).child('creatorDescription').set(newCreatorEmail.value);
  rootRefEvents.child(currentNode).child('doerDescription').set(newDoerEmail.value);
  selectedForEdit.innerHTML = 'Edit your DoWhop';
  error.innerHTML = 'Emails have been updated!';
  adminEditDoWhopForm.reset();
}

// Adding function to add a chosen dowhop a user's list.
function addToMyDoWhops(node) {
  firebase
    .database()
    .ref()
    .child('app_users/' + auth.currentUser.uid + '/doer/' + node.parentElement.id)
    .update({ doer: true });
}

var doWhopPlacard = document.getElementById('dowhop-placard');

function registerDoWhopDescriptionCallback() {
  doWhopDescriptionRef.on('value', function(snapshot) {
    var doWhopPlacardsDesc = _.map(snapshot.val()).reverse();
    var div = document.createElement('div');
    doWhopPlacard.innerHTML = '';
    doWhopPlacardsDesc.forEach(function(data) {
      div.innerHTML +=
        "<section id='" +
        data.doWhopDescriptionKey +
        "' class='dowhop-selector-block'>" +
        "<i class='material-icons dowhop-action' onclick='addToMyDoWhops(this)'>person_add</i>" +
        "<i class='material-icons dowhop-action' onclick='revealEditEmailForm(this)'>mode_edit</i>" +
        "<div class='dowhop-selector-header' style='background-image: url(" +
        data.downloadURL +
        ");'>" +
        '<h1>' +
        data.titleDescription +
        '</h1>' +
        '</div>' +
        "<div class='dowhop-selector-body'>" +
        '<h5>What?</h5>' +
        '<p>' +
        data.whatDescription +
        '</p>' +
        '<h5>Who?</h5>' +
        '<p>' +
        data.whoDescription +
        '</p>' +
        '<h5>When?</h5>' +
        '<p>' +
        (data.whenDescription || 'By request') +
        '</p>' +
        '<h5>Where?</h5>' +
        '<p>' +
        data.whereDescription +
        '</p>' +
        '<h5>How much?</h5>' +
        '<p>' +
        data.howMuchDescription +
        '</p>' +
        '<h5>Who is the creator?</h5>' +
        '<p>' +
        (data.creatorDescription || 'TBD') +
        '</p>' +
        '<h5>Who is doer?</h5>' +
        '<p>' +
        (data.doerDescription || 'TBD') +
        '</p>' +
        '</div>' +
        '</section>';
      doWhopPlacard.append(div);
    });
  });
}

function showConfirmationMessage() {
  window.alert('Thanks for submitting your DoWhop!');
}
