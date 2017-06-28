// This is the script for dealing with users' profiles.

// Section for creating profile for first-time users:
var createProfileForm = document.getElementById('create-profile-form');
var createProfileName = document.getElementById('profile-name');
var createProfilePhone = document.getElementById('profile-phone');
var createProfileSocial = document.getElementById('profile-social');
var createProfileWebsite = document.getElementById('profile-website');
var createProfilePayment = document.getElementById('profile-payment');
var createProfileAbout = document.getElementById('profile-about');
var createProfileActivity1 = document.getElementById('profile-activity-1');
var createProfileActivity2 = document.getElementById('profile-activity-2');
var createProfileActivity3 = document.getElementById('profile-activity-3');
var createProfileFormBtn = document.getElementById('create-profile-form-button');
var showProfileFormBtn = document.getElementById('edit-profile-button');
var createProfileDiv = document.getElementById('create-profile-div');

showProfileFormBtn.addEventListener('click', showForm);
createProfileFormBtn.addEventListener('click', createProfile);

function showForm(e){
  e.preventDefault();
  createProfileDiv.removeAttribute("hidden");
  console.log("showing form")
}

function addDoWhopImage(files_arr, node) {
  console.log("You've uploaded a file...");
  console.log(files_arr[0]);
  return (file = files_arr[0]);
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
}

function CollapseMyDiv(){
        // Function to collapse MyDiv. So, MyDiv height become 0 px after collapsing.
        document.getElementById('profile-activity-2').parentNode.removeAttribute('hidden');
        }
function RestoreMyDiv(){
        // Function to restore MyDiv visible again with height 100 px.
        document.getElementById('profile-activity-3').parentNode.removeAttribute('hidden');
        }

function createProfile(e) {
  e.preventDefault();

  var currentProfile = firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  console.log("creating profile")
  // Prepare user data:

  // var profileData = {
  //   update: true,
  //   profileName: createProfileName.value || "",
  //   profilePhone: createProfilePhone.value || "",
  //   profileSocial: createProfileSocial.value || "",
  //   profileWebsite: createProfileWebsite.value || "",
  //   profileAbout: createProfileAbout.value || "",
  //   profileActivity1: createProfileActivity1.value || "",
  //   profileActivity2: createProfileActivity2.value || "",
  //   profileActivity3: createProfileActivity3.value || ""
  // }
  //   profileRef.update(profileData).then(function() {
  //   });

console.log(createProfileActivity1.value)
    if (createProfileName.value) {
      profileRef.update({profileName: createProfileName.value})
      // .then(createProfileForm.reset())
    }
    if (createProfilePhone.value) {
      profileRef.update({profilePhone: createProfilePhone.value})
      // .then(createProfileForm.reset())
      // console.log(createProfilePhone)
    }
    if (createProfileSocial.value) {
      profileRef.update({profileSocial: createProfileSocial.value})
      // .then(createProfileForm.reset())
    }
    if (createProfileWebsite.value) {
      profileRef.update({profileWebsite: createProfileWebsite.value})
      // .then(createProfileForm.reset())
    }
    if (createProfilePayment.value) {
      profileRef.update({profilePayment: createProfilePayment.value})
      // .then(createProfileForm.reset())
    }
    if (createProfileAbout.value) {
      profileRef.update({profileAbout: createProfileAbout.value})
      // .then(createProfileForm.reset())
    }
    if (createProfileActivity1.value) {
      profileRef.update({profileActivity1: createProfileActivity1.value})
      // .then(createProfileForm.reset())
    }

    if (createProfileActivity2.value) {
      profileRef.update({profileActivity2: createProfileActivity2.value})
      // .then(createProfileForm.reset())
    }
    if (createProfileActivity3.value) {
      profileRef.update({profileActivity3: createProfileActivity3.value})
      // .then(createProfileForm.reset())
    }
    // createProfileForm.reset();
    createProfileDiv.setAttribute("hidden", "true");
}

// Section for retrieving previously-existing user profiles:
var currentProfile;
// var myProfileButton = document.getElementById('my-profile-button');
var myDisplayName = document.getElementById('my-display-name');
var myProfileName = document.getElementById('my-profile-name');
var myProfilePhone = document.getElementById('my-profile-phone');
// var myProfileSocial = document.getElementById('my-profile-social');
// var myProfileWebsite = document.getElementById('my-profile-website');
var myProfileAbout = document.getElementById('my-profile-about');
var myProfileEmail = document.getElementById('my-profile-email');
var myProfilePayment = document.getElementById('my-profile-payment');
var myProfileActivity1 = document.getElementById('my-profile-activity-1');
var myProfileActivity2 = document.getElementById('my-profile-activity-2');
var myProfileActivity3 = document.getElementById('my-profile-activity-3');
var myProfilePicture = document.getElementById('my-profile-picture');

function retrieveProfile(currentProfile) {
  // We are testing whether visiting user is looking at own profile (default), or other's via query parameter:
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  console.log('getting for', currentProfile);
  var profileRef = firebase.database().ref('app_users/' + currentProfile);

  // Retrieving relevant data from the database:
  profileRef.on('value', function(snap) {

    myDisplayName.innerText = snap.val().displayName;
    myProfileName.innerText = snap.val().profileName;
    myProfilePhone.innerText = snap.val().profilePhone;
    // myProfileSocial.innerText = snap.val().profileSocial;
    // myProfileWebsite.innerText = snap.val().profileWebsite;
    myProfileAbout.innerText = snap.val().profileAbout;
    myProfileEmail.innerText = snap.val().email;
    // myProfilePayment.innerText = snap.val().pofilePayment;
    myProfileActivity1.innerText = snap.val().profileActivity1;
    myProfileActivity2.innerText = snap.val().profileActivity2;
    myProfileActivity3.innerText = snap.val().profileActivity3;
    myProfilePicture.src = snap.val().photoURL;
    myProfilePicture.style.backgroundImage = 'url(' + snap.val().photoURL + ')';
  });
}

// For looking at someone else's profile via query parameter:
function retrieveUrl(loc) {
  if (loc.match(/\?(.+)/)) {
    var y = loc.match(/\?(.+)/)[1];
    return y } else {
      return null;
    }
}

// For looking at your own profile (user is logged in):
auth.onAuthStateChanged(function(user) {
  if (user) {
    retrieveProfile();
  }
});
