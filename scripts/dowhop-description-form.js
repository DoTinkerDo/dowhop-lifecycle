

/*
  As a creator I want to create a DoWhop for the marketplace!

  titleDescription
  whoDescription
  whatDescription
  whenDescription ->
  whereDescription
  howDescription
  howMuchDescription

*/

// var dowWopImageCapture = document.getElementById('dowhop-image-capture');
var doWhopDescriptionRef = database.ref('/doWhopDescription');
var createNewDoWhopBtn = document.getElementById('create-new-dowhop');
var titleDescription = document.getElementById('title-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');

var fullPath = null;

createNewDoWhopBtn.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(titleDescription.value);
  doWhopDescriptionRef.push({
    creator: auth.currentUser.uid,
    downloadURL: fullPath,
    titleDescription: titleDescription.value,
    whoDescription: whoDescription.value,
    whatDescription: whatDescription.value,
    whenDescription: whenDescription.value,
    whereDescription: whereDescription.value,
    howMuchDescription: howMuchDescription.value
  });
});

function addDoWhopImage(files_arr, node) {
  var file = files_arr[0];

  if (!file.type.match("image/.*")) {
    alert("You can only add images at the moment.");
    return;
  }

  var uid = auth.currentUser.uid;
  var filePath = "doWhopImages/"+uid+"/"+"titleDescriptionImage/"+file.name;

  return storage.ref(filePath).put(file)
    .then(function(snapshot) {
      fullPath = snapshot.metadata.downloadURLs[0];
    });
}
