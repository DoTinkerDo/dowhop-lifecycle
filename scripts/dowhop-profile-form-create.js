// This is the script for dealing with users' profiles.

//  Section for creating profile for first-time users:

var createProfileForm = document.getElementById('create-profile-form');
var createProfileName = document.getElementById('profile-name');
var createProfileAbout = document.getElementById('profile-about');
var createProfileActivity1 = document.getElementById('profile-activity-1');
var createProfileFormBtn = document.getElementById('create-profile-form-button');

createProfileFormBtn.addEventListener('click', createProfile);

function addDoWhopImage(files_arr, node) {
  console.log("You've uploaded a file...");
  console.log(files_arr[0]);
  return (file = files_arr[0]);
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
}

function createProfile(e) {
    e.preventDefault();
    var currentProfile = firebase.auth().currentUser.uid;
    var profileRef = firebase.database().ref('app_users/' + currentProfile);

  var profileData = {
    profileName: createProfileName.value,
    profileAbout: createProfileName.value,
    createProfileActivity1: createProfileActivity1.value
  }

  profileRef.update(profileData).then(function() {
    console.log("Successful!");
  });
  console.log("resetting form!");
  createProfileForm.reset();
  console.log("You submitted a new profile!");

}
