/*
  As a creator I want to create a DoWhop for the marketplace!
  The form has to validate that I'm entering text into each field.

  titleDescription
  whoDescription
  whatDescription
  whenDescription
  whereDescription
  howDescription
  howMuchDescription

*/

var doWhopDescriptionRef = database.ref('/doWhopDescription');

var titleDescription = document.getElementById('title-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var hostDescription = document.getElementById('host-description');
var guestDescription = document.getElementById('guest-description');
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
  var doWhopDescriptionKey = doWhopDescriptionRef.push().key;
  var filepath;
  // var defaultImageURL = 'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';

  filePath = 'doWhopImages/' + uid + '/' + 'titleDescriptionImage/' + doWhopDescriptionKey + '/' + file.name;
  storage.ref(filePath).put(file).then(function(snapshot) {
    doWhopDescriptionRef.child(doWhopDescriptionKey).set({
      creator: uid,
      doWhopDescriptionKey: doWhopDescriptionKey,
      downloadURL: snapshot.metadata.downloadURLs[0],
      titleDescription: titleDescription.value,
      whoDescription: whoDescription.value,
      whatDescription: whatDescription.value,
      whenDescription: whenDescription.value,
      whereDescription: whereDescription.value,
      howMuchDescription: howMuchDescription.value,
      host: hostDescription.value,
      guest: guestDescription.value
    });
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
  hostDescription,
  guestDescription
) {
  if (
    titleDescription === '' ||
    whoDescription === '' ||
    whatDescription === '' ||
    whenDescription === '' ||
    whereDescription === '' ||
    howMuchDescription === '' ||
    hostDescription === '' ||
    guestDescription === '' ||
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
  hostDescription.value = '';
  guestDescription.value = '';
}

// Adding function to add a chosen dowhop a user's list.
function addToMyDoWhops(node) {
  console.log('you clicked on:', node.parentElement.id);
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
        data.whenDescription +
        '</p>' +
        '<h5>Where?</h5>' +
        '<p>' +
        data.whereDescription +
        '</p>' +
        '<h5>How much?</h5>' +
        '<p>' +
        data.howMuchDescription +
        '</p>' +
        '<h5>Who is host?</h5>' +
        '<p>' +
        data.hostDescription +
        '</p>' +
        '<h5>Who is guest?</h5>' +
        '<p>' +
        data.hostDescription +
        '</p>' +
        '</div>' +
        '</section>';
      doWhopPlacard.append(div);
    });
  });
}
