'use strict';

var doWhopDescriptionRef = database.ref('/DoWhopDescriptions');

var titleDescription = document.getElementById('title-description');
var whyDescription = document.getElementById('why-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var dowhopImageCapture1 = document.getElementById('dowhop-image-capture1');
var dowhopImageCapture2 = document.getElementById('dowhop-image-capture2');
var dowhopImageCapture3 = document.getElementById('dowhop-image-capture3');
var submitNewDoWhopBtn = document.getElementById('create-new-dowhop');

submitNewDoWhopBtn.addEventListener('click', submitNewDoWhopEntry);

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
      howMuchDescription.value
    )
  ) {
    alert('Please fill out all the fields and add an Image, Try again.');
    return;
  }

  var uid = auth.currentUser.uid;
  var creatorDisplayName = auth.currentUser.displayName;
  var creatorDescription = auth.currentUser.email;
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var defaultImageURL = '../images/dowhopicon.gif';

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

    var messagesChatsRef = database.ref().child('messages').child(doWhopDescriptionKey);
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
      creatorDescription: creatorDescription,
      doerDescription: '' // Temp.
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
  file,
  titleDescription,
  whyDescription,
  whoDescription,
  whatDescription,
  whenDescription,
  whereDescription,
  howMuchDescription
) {
  if (
    titleDescription === '' ||
    whyDescription === '' ||
    whoDescription === '' ||
    whatDescription === '' ||
    whenDescription === '' ||
    whereDescription === '' ||
    howMuchDescription === '' ||
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
}

// Adding function to add a chosen dowhop a user's list:
function addToMyDoWhops(node) {
  console.log('ADDTOMYDOWHOPS CALLED IN CREATE -> ', node);
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
