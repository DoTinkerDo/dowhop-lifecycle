'use strict';

var doWhopDescriptionRef = database.ref('/DoWhopDescriptions');
var titleDescription = document.getElementById('title-description');
var whyDescription = document.getElementById('why-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var creatorDescription = document.getElementById('creator-description');
var doerDescription = document.getElementById('doer-description');
var dowhopImageCapture1 = document.getElementById('dowhop-image-capture1');
var dowhopImageCapture2 = document.getElementById('dowhop-image-capture2');
var dowhopImageCapture3 = document.getElementById('dowhop-image-capture3');
var submitNewDoWhopBtn = document.getElementById('create-new-dowhop');
var creatorDescriptionUpdate = document.getElementById('creatorDescriptionUpdate');
var doerDescriptionUpdate = document.getElementById('doerDescriptionUpdate');
var emailSubmitBtn = document.getElementById('emailSubmit');

var error = document.getElementById('errorAdmin');

submitNewDoWhopBtn.addEventListener('click', submitNewDoWhopEntry);
emailSubmitBtn.addEventListener('click', updateEmails);

function submitNewDoWhopEntry(e) {
  e.preventDefault();

  if (
    !validateAddDoWhopDescription(
      files,
      titleDescription.value,
      whyDescription.value,
      whoDescription.value,
      whatDescription.value,
      whenDescription.value,
      whereDescription.value,
      howMuchDescription.value,
      creatorDescription.value,
      doerDescription.value
    )
  ) {
    alert('Please fill out all the fields and add an Image, Try again.');
    return;
  }

  var uid = auth.currentUser.uid;
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var defaultImageURL = '../images/dowhopicon.gif';
  var creatorDisplayName = auth.currentUser.displayName;

  // We are preparing a first message to the future chat thread:
  function createWelcomingMessage() {
    // Gathering the appropriate data to fill out message:
    var DoWhopTitleDescription, DoWhopWhenDescription, DoWhopWhereDescription;

    doWhopDescriptionRef.child(doWhopDescriptionKey).once('value', function(snap) {
      DoWhopTitleDescription = snap.val().titleDescription;
      DoWhopWhenDescription = snap.val().whenDescription;
      DoWhopWhereDescription = snap.val().whereDescription;
    });

    var teamName = 'Your DoWhop Team';
    var welcomeMessageText =
      'Welcome to your ' +
      DoWhopTitleDescription +
      ' DoWhop!\n\n' +
      'Currently, ' +
      creatorDisplayName +
      ' plans to meet "' +
      DoWhopWhenDescription +
      '" at "' +
      DoWhopWhereDescription +
      '".\n' +
      'Coordinate the details here!';

    var messagesChatsRef = firebase.database().ref().child('messages').child(doWhopDescriptionKey);
    messagesChatsRef.push({
      chatId: doWhopDescriptionKey,
      name: teamName,
      text: welcomeMessageText,
      photoUrl: defaultImageURL
    });
  }

  doWhopDescriptionRef
    .child(doWhopDescriptionKey)
    .set({
      createdBy: uid,
      doWhopDescriptionKey: doWhopDescriptionKey,
      titleDescription: titleDescription.value,
      whyDescription: whyDescription.value,
      whoDescription: whoDescription.value,
      whatDescription: whatDescription.value,
      whenDescription: whenDescription.value,
      whereDescription: whereDescription.value,
      howMuchDescription: howMuchDescription.value,
      creatorDescription: creatorDescription.value,
      doerDescription: doerDescription.value
    })
    .then(showConfirmationMessage());

  files.forEach(function(file, idx) {
    var filePath = 'userImages/' + uid + '/' + 'titleDescriptionImage/' + doWhopDescriptionKey + '/' + file.name;
    storage.ref(filePath).put(file).then(function(snapshot) {
      var path = snapshot.metadata.fullPath;
      storage.ref(path).getDownloadURL().then(function(url) {
        var obj = {};
        obj['image' + (idx + 1)] = url;
        doWhopDescriptionRef.child(doWhopDescriptionKey).child('downloadURL').update(obj);
      });
    });
  });
  createWelcomingMessage();
  clearNewDoWhopEntryForm();
}

var files = [];
function addDoWhopImage(files_arr, node) {
  return files.push(files_arr[0]);
  if (!files_arr[0].type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
}

function validateAddDoWhopDescription(
  files,
  titleDescription,
  whyDescription,
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
    whyDescription === '' ||
    whoDescription === '' ||
    whatDescription === '' ||
    whenDescription === '' ||
    whereDescription === '' ||
    howMuchDescription === '' ||
    creatorDescription === '' ||
    doerDescription === '' ||
    files.length < 1
  )
    return false;
  return true;
}

function clearNewDoWhopEntryForm() {
  files = [];
  titleDescription.value = '';
  whyDescription.value = '';
  whoDescription.value = '';
  whatDescription.value = '';
  whenDescription.value = '';
  whereDescription.value = '';
  howMuchDescription.value = '';
  dowhopImageCapture1.value = '';
  dowhopImageCapture2.value = '';
  dowhopImageCapture3.value = '';
  creatorDescription.value = '';
  doerDescription.value = '';
}

var doWhopPlacard = document.getElementById('dowhop-placard');

function registerDoWhopDescriptionCallback() {
  doWhopDescriptionRef.on('value', function(snapshot) {
    var doWhopDescriptions = _.map(snapshot.val()).reverse();
    var div = document.createElement('div');
    doWhopPlacard.innerHTML = '';
    doWhopDescriptions.forEach(function(doWhopDescription) {
      var imageURL =
        (doWhopDescription.downloadURL && doWhopDescription.downloadURL.image1) || doWhopDescription.downloadURL;
      div.innerHTML +=
        "<section id='" +
        doWhopDescription.doWhopDescriptionKey +
        "' class='dowhop-selector-block'>" +
        "<i class='material-icons dowhop-action' onclick='addToMyDoWhops(this)'>person_add</i>" +
        "<i class='material-icons dowhop-action' onclick='revealEditEmailForm(this)'>mode_edit</i>" +
        "<div class='dowhop-selector-header' style='background-image: url(" +
        imageURL +
        ");'>" +
        '<h1>' +
        doWhopDescription.titleDescription +
        '</h1>' +
        '</div>' +
        "<div class='dowhop-selector-body'>" +
        '<h5>What?</h5>' +
        '<p>' +
        doWhopDescription.whatDescription +
        '</p>' +
        '<h5>Why?</h5>' +
        '<p>' +
        doWhopDescription.whyDescription +
        '</p>' +
        '<h5>Who?</h5>' +
        '<p>' +
        doWhopDescription.whoDescription +
        '</p>' +
        '<h5>When?</h5>' +
        '<p>' +
        (doWhopDescription.whenDescription || 'By request') +
        '</p>' +
        '<h5>Where?</h5>' +
        '<p>' +
        doWhopDescription.whereDescription +
        '</p>' +
        '<h5>How much?</h5>' +
        '<p>' +
        doWhopDescription.howMuchDescription +
        '</p>' +
        '<h5>Who is the creator?</h5>' +
        '<p>' +
        (doWhopDescription.creatorDescription || 'TBD') +
        '</p>' +
        '<h5>Who is doer?</h5>' +
        '<p>' +
        (doWhopDescription.doerDescription || 'TBD') +
        '</p>' +
        '</div>' +
        '</section>';
      doWhopPlacard.append(div);
    });
  });
}

// Add Doer(s) or a Creator email to a DoWhopDescription
var adminEditDoWhopForm = document.getElementById('admin-edit-dowhop-form');
var selectedForEdit = document.getElementById('selected-for-edit');
var newCreatorEmail = document.getElementById('creatorDescriptionUpdate');
var newDoerEmail = document.getElementById('doerDescriptionUpdate');
var doWhopDescriptionKeyForUpdate = '';

function revealEditEmailForm(node) {
  adminEditDoWhopForm.removeAttribute('hidden');
  var currentNodeTitle = '';
  doWhopDescriptionKeyForUpdate = node.parentElement.id;
  var doWhopDescriptionRef = database.ref('DoWhopDescriptions').child(doWhopDescriptionKeyForUpdate);
  doWhopDescriptionRef.once('value', function(data) {
    var doWhopDescription = data.val();
    var currentNodeTitle = doWhopDescription.titleDescription;
    selectedForEdit.innerHTML = 'Edit: ' + currentNodeTitle;
  });
}

function updateEmails(e) {
  e.preventDefault();
  adminEditDoWhopForm.removeAttribute('hidden');
  var doWhopDescriptionRef = database.ref('DoWhopDescriptions');

  doWhopDescriptionRef.child(doWhopDescriptionKeyForUpdate).child('creatorDescription').set(newCreatorEmail.value);
  doWhopDescriptionRef.child(doWhopDescriptionKeyForUpdate).child('doerDescription').set(newDoerEmail.value);
  selectedForEdit.innerHTML = 'Edit your DoWhop';
  error.innerHTML = 'Emails have been updated!';
  adminEditDoWhopForm.reset();
}

// Adding function to add a chosen dowhop a user's list.
function addToMyDoWhops(node) {
  console.log('ADDTOMYDOWHOPS CALLED IN ADMIN -> ', node);
  database
    .ref('app_users')
    .child(auth.currentUser.uid)
    .child('doer')
    .child(node.parentElement.id)
    .update({ doer: true });
}

function showConfirmationMessage() {
  window.alert('Thanks for submitting your DoWhop!');
}
