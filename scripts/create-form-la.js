'use strict';

var doWhopDescriptionRef = database.ref('/DoWhopDescriptions');

var titleDescription = document.getElementById('title-description');
var whyDescription = document.getElementById('why-description');
var whoDescription = document.getElementById('who-description');
var whoAmIDescription = document.getElementById('who-am-i-description');
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
      whoAmIDescription.value,
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
  var creatorDescription = auth.currentUser.email;
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var currentTime = moment().format('YYYY-MM-DD--HH:mm');
  var currentRegion = 'LA';

  doWhopDescriptionRef.child(doWhopDescriptionKey).set({
    createdBy: uid,
    region: currentRegion,
    doWhopDescriptionKey: doWhopDescriptionKey,
    titleDescription: titleDescription.value,
    whyDescription: whyDescription.value,
    whoDescription: whoDescription.value,
    whoAmIDescription: whoAmIDescription.value,
    whatDescription: whatDescription.value,
    whenDescription: whenDescription.value,
    whereDescription: whereDescription.value,
    howMuchDescription: howMuchDescription.value,
    creatorDescription: creatorDescription.toLowerCase(),
    doerDescription: 'no-one',
    createdAt: currentTime
  });

  // TEMP disabled the creation of a welcome message.
  // var creatorDisplayName = auth.currentUser.displayName;
  // var defaultImageURL = '../images/dowhopicon.gif';

  // // Preparing the welcoming message:
  // var messagesChatsRef = database
  //   .ref()
  //   .child('messages')
  //   .child(doWhopDescriptionKey);
  // var teamName = 'Your DoWhop Team';
  // var welcomeMessageText =
  //   'Welcome to your ' +
  //   titleDescription.value +
  //   ' DoWhop!\n\n' +
  //   'Currently, ' +
  //   creatorDisplayName +
  //   ' plans to meet "' +
  //   whenDescription.value +
  //   '" at "' +
  //   whereDescription.value +
  //   '".\n' +
  //   'Coordinate the details here!';

  // showConfirmationMessage();
  // messagesChatsRef.push({
  //   chatId: doWhopDescriptionKey,
  //   name: teamName,
  //   text: welcomeMessageText,
  //   photoUrl: defaultImageURL
  // });

  files.forEach(function(file, idx) {
    var filePath = 'userImages/' + uid + '/' + 'titleDescriptionImage/' + doWhopDescriptionKey + '/' + file.name;
    storage
      .ref(filePath)
      .put(file)
      .then(function(snapshot) {
        var path = snapshot.metadata.fullPath;
        storage
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            var obj = {};
            obj['image' + (idx + 1)] = url;
            doWhopDescriptionRef
              .child(doWhopDescriptionKey)
              .child('downloadURL')
              .update(obj);
          });
      });
  });
  clearNewDoWhopEntryForm();
}

var files = [];
function addDoWhopImage(files_arr, node) {
  if (!files_arr[0].type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
  node.parentNode.style.color = '#ec1928';
  return files.push(files_arr[0]);
}

function validateAddDoWhopDescription(
  file,
  titleDescription,
  whyDescription,
  whoDescription,
  whoAmIDescription,
  whatDescription,
  whenDescription,
  whereDescription,
  howMuchDescription
) {
  if (
    titleDescription === '' ||
    whyDescription === '' ||
    // whoDescription === '' ||
    // whoAmIDescription === '' ||
    // whatDescription === '' ||
    // whenDescription === '' ||
    // whereDescription === '' ||
    // howMuchDescription === '' ||
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
  whoAmIDescription.value = '';
  whatDescription.value = '';
  whenDescription.value = '';
  whereDescription.value = '';
  howMuchDescription.value = '';
  dowhopImageCapture1.value = '';
  dowhopImageCapture2.value = '';
  dowhopImageCapture3.value = '';
  dowhopImageCapture1.parentElement.style.color = '#757575';
  dowhopImageCapture2.parentElement.style.color = '#757575';
  dowhopImageCapture3.parentElement.style.color = '#757575';
}

function showConfirmationMessage() {
  window.alert('Thanks for submitting your DoWhop!');
}
