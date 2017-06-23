var doWhopDescriptionRef = database.ref('/doWhopDescription');

var titleDescription = document.getElementById('title-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var dowhopImageCapture = document.getElementById('dowhop-image-capture');

var submitNewDoWhopBtn = document.getElementById('create-new-dowhop');
submitNewDoWhopBtn.addEventListener('click', submitNewDoWhopEntry);

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
  var creatorDisplayName = auth.currentUser.displayName;
  var creatorDescription = auth.currentUser.email;
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var filepath;


  // We are preparing a first message to the future chat thread:
  function createWelcomingMessage() {

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

    var messagesChatsRef = database.ref().child('messages').child(doWhopDescriptionKey);
    messagesChatsRef.push({
      chatId: doWhopDescriptionKey,
      name: teamName,
      text: welcomeMessageText,
      photoUrl: 'https://static.wixstatic.com/media/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png/v1/fill/w_512,h_512,al_c/de271e_daded027ba1f4feab7b1c26683bc84da~mv2.png' // <- Customized.
    });
  }

  filePath = 'doWhopImages/' + uid + '/' + 'titleDescriptionImage/' + doWhopDescriptionKey + '/' + file.name;
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
      creatorDescription: creatorDescription,
      doerDescription: '' // Temp.
    }).then(
      showConfirmationMessage()
    );
    createWelcomingMessage();
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
  howMuchDescription
) {
  if (
    titleDescription === '' ||
    whoDescription === '' ||
    whatDescription === '' ||
    whenDescription === '' ||
    whereDescription === '' ||
    howMuchDescription === '' ||
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
}

// Adding function to add a chosen dowhop a user's list:
function addToMyDoWhops(node) {
  firebase
    .database()
    .ref()
    .child('app_users/' + auth.currentUser.uid + '/doer/' + node.parentElement.id)
    .update({ doer: true });
}

function showConfirmationMessage() {
  window.alert('Thanks for submitting your DoWhop!');
}
