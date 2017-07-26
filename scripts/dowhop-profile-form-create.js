'use strict';

// This is the script for dealing with users' profiles.
// Section for creating profile for first-time users:
var createProfileForm = document.getElementById('create-profile-form');
var createProfileName = document.getElementById('profile-name');
var createProfilePhone = document.getElementById('profile-phone');
var createProfileSocialFB = document.getElementById('profile-social-FB');
var createProfileSocialTW = document.getElementById('profile-social-TW');
var createProfileSocialIG = document.getElementById('profile-social-IG');
var createProfileSocialLI = document.getElementById('profile-social-LI');
var createProfileWebsite = document.getElementById('profile-website');
var createProfilePayment = document.getElementById('profile-payment');
var createProfileAbout = document.getElementById('profile-about');
var createProfileActivity1 = document.getElementById('profile-activity-1');
var createProfileActivity2 = document.getElementById('profile-activity-2');
var createProfileActivity3 = document.getElementById('profile-activity-3');
var createProfileFormBtn = document.getElementById('create-profile-form-button');
var showProfileFormBtn = document.getElementById('edit-profile-button');
var createProfileDiv = document.getElementById('create-profile-div');
var socialButtonTwitter = document.getElementById('social-button-1');
var socialButtonInstagram = document.getElementById('social-button-2');
var socialButtonLinkedIn = document.getElementById('social-button-3');

// var expandTwitter = document.getElementById('twitter-card');

showProfileFormBtn.addEventListener('click', showForm);
createProfileFormBtn.addEventListener('click', createProfile);
socialButtonLinkedIn.addEventListener('click', expandLinkedIn);
socialButtonTwitter.addEventListener('click', expandTwitter);
socialButtonInstagram.addEventListener('click', expandInstagram);

//Toggle for showing and hiding edit form in profile
var toggle = 0;

function showForm(e) {
  e.preventDefault();
  if (toggle % 2 === 0) {
    createProfileDiv.removeAttribute('hidden');
  }
  if (toggle % 2 === 1) {
    createProfileDiv.setAttribute('hidden', 'true');
  }
  toggle++;
}

// Image activity upload logic
var addNewActivityList = document.querySelectorAll('.add-new-activity');
var addNewActivityArr = Array.prototype.slice.call(addNewActivityList);

function showCreateProfileActivity(e) {
  e.preventDefault();
  this.id === 'button-1'
    ? (createProfileActivity2.parentNode.parentNode.style.display = 'block')
    : (createProfileActivity3.parentNode.parentNode.style.display = 'block');
}

function hideCreateProfileActivity() {
  createProfileActivity2.parentNode.parentNode.style.display = 'none';
  createProfileActivity3.parentNode.parentNode.style.display = 'none';
}

addNewActivityArr.forEach(function(addNewActivity) {
  addNewActivity.addEventListener('click', showCreateProfileActivity);
});

var inputImageCaptureList = document.querySelectorAll('input.image-capture');
var inputImageCaptureArr = Array.prototype.slice.call(inputImageCaptureList);
var profileImageFiles = [];

function addProfileImage() {
  if (!this.files[0].type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
  this.parentNode.style.color = '#ec1928';
  return profileImageFiles.push(this.files[0]);
}

inputImageCaptureArr.forEach(function(inputImageCapture) {
  inputImageCapture.addEventListener('change', addProfileImage);
});

function expandTwitter(e) {
  e.preventDefault();
  // Function to collapse MyDiv. So, MyDiv height become 0 px after collapsing.
  document.getElementById('twitter-card').removeAttribute('hidden');
}

function expandInstagram(e) {
  e.preventDefault();
  // Function to collapse MyDiv. So, MyDiv height become 0 px after collapsing.
  document.getElementById('instagram-card').removeAttribute('hidden');
}

function expandLinkedIn(e) {
  e.preventDefault();
  // Function to collapse MyDiv. So, MyDiv height become 0 px after collapsing.
  document.getElementById('linkedin-card').removeAttribute('hidden');
}

function createProfile(e) {
  e.preventDefault();
  var uid = auth.currentUser.uid;
  var profileRef = database.ref('app_users/' + uid);

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

  profileImageFiles.forEach(function(file, idx) {
    var filePath = 'userImages/' + uid + '/' + 'profileActivityImages/' + file.name;
    storage.ref(filePath).put(file).then(function(snapshot) {
      var path = snapshot.metadata.fullPath;
      storage.ref(path).getDownloadURL().then(function(url) {
        var obj = {};
        obj['image' + (idx + 1)] = url;
        profileRef.child('profileActivityImageURLs').update(obj);
      });
    });
  });

  if (createProfileName.value) {
    profileRef.update({ profileName: createProfileName.value });
  }
  if (createProfilePhone.value) {
    profileRef.update({ profilePhone: createProfilePhone.value });
  }
  if (createProfileSocialFB.value) {
    profileRef.update({ profileSocialFB: createProfileSocialFB.value });
  }
  if (createProfileSocialTW.value) {
    profileRef.update({ profileSocialTW: createProfileSocialTW.value });
  }
  if (createProfileSocialLI.value) {
    profileRef.update({ profileSocialLI: createProfileSocialLI.value });
  }
  if (createProfileSocialIG.value) {
    profileRef.update({ profileSocialIG: createProfileSocialIG.value });
  }
  if (createProfileWebsite.value) {
    profileRef.update({ profileWebsite: createProfileWebsite.value });
  }
  if (createProfilePayment.value) {
    profileRef.update({ profilePayment: createProfilePayment.value });
  }
  if (createProfileAbout.value) {
    profileRef.update({ profileAbout: createProfileAbout.value });
  }
  if (createProfileActivity1.value) {
    profileRef.update({ profileActivity1: createProfileActivity1.value });
  }

  if (createProfileActivity2.value) {
    profileRef.update({ profileActivity2: createProfileActivity2.value });
  }
  if (createProfileActivity3.value) {
    profileRef.update({ profileActivity3: createProfileActivity3.value });
  }

  clearCreateProfileForm();
  createProfileDiv.setAttribute('hidden', 'true');
}

function clearCreateProfileForm() {
  profileImageFiles = [];
  createProfileName.value = '';
  createProfilePhone.value = '';
  createProfileSocialFB.value = '';
  createProfileSocialTW.value = '';
  createProfileSocialLI.value = '';
  createProfileSocialIG.value = '';
  createProfileWebsite.value = '';
  createProfilePayment.value = '';
  createProfileAbout.value = '';
  createProfileActivity1.value = '';
  createProfileActivity1.value = '';
  createProfileActivity1.value = '';
  inputImageCaptureList[0].parentNode.style.color = '#757575';
  inputImageCaptureList[1].parentNode.style.color = '#757575';
  inputImageCaptureList[2].parentNode.style.color = '#757575';
  hideCreateProfileActivity();
  // reset social here
}

// Section for retrieving previously-existing user profiles:
var currentProfile;
// var myProfileButton = document.getElementById('my-profile-button');
var myDisplayName = document.getElementById('my-display-name');
var myProfileName = document.getElementById('my-profile-name');
var myProfilePhone = document.getElementById('my-profile-phone');
var myProfileSocialFB = document.getElementById('my-profile-social-FB');
var myProfileSocialTW = document.getElementById('my-profile-social-TW');
var myProfileSocialIG = document.getElementById('my-profile-social-IG');
var myProfileSocialLI = document.getElementById('my-profile-social-LI');

// var myProfileWebsite = document.getElementById('my-profile-website');
var myProfileAbout = document.getElementById('my-profile-about');
var myProfileEmail = document.getElementById('my-profile-email');
var myProfilePayment = document.getElementById('my-profile-payment');
var myProfileActivity1 = document.getElementById('my-profile-activity-1');
var myProfileActivity2 = document.getElementById('my-profile-activity-2');
var myProfileActivity3 = document.getElementById('my-profile-activity-3');
var activityImage1 = document.getElementById('activity-image-1');
var activityImage2 = document.getElementById('activity-image-2');
var activityImage3 = document.getElementById('activity-image-3');
var myProfilePicture = document.getElementById('my-profile-picture');
var sendDirectMessageDiv = document.getElementById('send-direct-message-div');
var myProfileSocial = document.getElementById('my-profile-social');

function retrieveProfile(currentProfile) {
  // We are testing whether visiting user is looking at own profile (default), or other's via query parameter:
  currentProfile = retrieveUrl(window.location.href) || auth.currentUser.uid;
  var profileRef = database.ref('app_users/' + currentProfile);

  // Retrieving relevant data from the database:
  profileRef.on('value', function(snap) {
    var appUser = snap.val();
    myDisplayName.innerText = appUser.displayName;
    myProfileName.innerText = appUser.profileName;
    myProfilePhone.innerText = phoneX(appUser.profilePhone);
    myProfileSocialFB.innerText = snap.val().profileSocialFB;

    // console.log(snap.val().profileSocialFB);
    // console.log(currentProfile);
    myProfileSocialTW.innerText = snap.val().profileSocialTW;
    myProfileSocialIG.innerText = snap.val().profileSocialIG;
    myProfileSocialLI.innerText = snap.val().profileSocialLI;
    myProfileAbout.innerText = appUser.profileAbout;
    myProfileEmail.innerHTML = "<a href='mailto:" + 'connect@dowhop.com' + " '>Send Message</a> ";
    // myProfilePayment.innerText = appUser.pofilePayment;
    myProfileActivity1.innerText = appUser.profileActivity1;
    myProfileActivity2.innerText = appUser.profileActivity2;
    myProfileActivity3.innerText = appUser.profileActivity3;
    activityImage1.src =
      (appUser.profileActivityImageURLs && appUser.profileActivityImageURLs.image1) || '/images/placeholder-image1.png';
    activityImage2.src =
      (appUser.profileActivityImageURLs && appUser.profileActivityImageURLs.image2) || '/images/placeholder-image2.png';
    activityImage3.src =
      (appUser.profileActivityImageURLs && appUser.profileActivityImageURLs.image3) || '/images/placeholder-image3.png';
    myProfilePicture.src = appUser.photoURL;
    // myProfilePicture.style.backgroundImage = 'url(' + appUser.photoURL + ')';
    sendDirectMessageDiv.id = appUser.uid; // NEW.
  });
}

// For looking at someone else's profile via query parameter:
function retrieveUrl(loc) {
  if (loc.match(/\?(.+)/)) {
    var y = loc.match(/\?(.+)/)[1];
    return y;
  } else {
    return null;
  }
}

// For looking at your own profile (user is logged in):
auth.onAuthStateChanged(function(user) {
  if (user) {
    retrieveProfile();
  }
});

var profilePerson = null;
auth.onAuthStateChanged(function(user) {
  if (user) {
    currentProfile = retrieveUrl(window.location.href) || auth.currentUser.uid;
    var profileRef = firebase.database().ref('app_users/' + currentProfile);
    profileRef.on('value', function(snap) {
      if (snap.val().profileSocialFB) {
        myProfileSocialFB.classList.add('social-hover');
        myProfileSocialFB.src = '../images/facebook-logo-verified.svg';
      }
      if (snap.val().profileSocialIG) {
        myProfileSocialIG.classList.add('social-hover');
        myProfileSocialIG.src = '../images/instagram-verified.svg';
      }
      if (snap.val().profileSocialTW) {
        myProfileSocialTW.classList.add('social-hover');
        myProfileSocialTW.src = '../images/twitter-verified.svg';
      }
      if (snap.val().profileSocialLI) {
        myProfileSocialLI.classList.add('social-hover');
        myProfileSocialLI.src = '../images/linkedin-verified.svg';
      }
      if (currentProfile !== auth.currentUser.uid) {
        showProfileFormBtn.setAttribute('hidden', 'true');
      } else {
        showProfileFormBtn.removeAttribute('hidden');
      }
    });
    profilePerson = user;
  } else {
    console.log('PERSON signed out');
  }
});

function socialMediaTW() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.on('value', function(snap) {
    console.log(currentProfile);
    let twitter = String(snap.val().profileSocialTW);
    if (!snap.val().profileSocialTW) {
    } else {
      window.open(twitter, '_blank');
    }
  });
}

function socialMediaFB() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  console.log(currentProfile);
  profileRef.on('value', function(snap) {
    let facebook = String(snap.val().profileSocialFB);
    if (!snap.val().profileSocialFB) {
    } else {
      window.open(facebook, '_blank');
    }
  });
}

function socialMediaLI() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.on('value', function(snap) {
    let linkedIn = String(snap.val().profileSocialLI);
    if (!snap.val().profileSocialLI) {
    } else {
      window.open(linkedIn, '_blank');
    }
  });
}

function socialMediaIG() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.once('value', function(snap) {
    let instagram = String(snap.val().profileSocialIG);
    if (!snap.val().profileSocialIG) {
    } else {
      window.open(instagram, '_blank');
    }
  });
}

function phoneX(phone) {
  var str = '';
  var i;
  var x;
  if (phone) {
    var x = phone.split('');
    for (i = 0; i < x.length - 2; i++) {
      x[i] = 'X';
    }
    x.splice(3, 0, '-');
    x.splice(7, 0, '-');
  } else {
    x = 'xxx-xxx-xxxx';
    return x;
  }
  return x.join('');
}

function fillInProfileForm(e) {
  var currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.once('value', function(snap) {
    // console.log(currentProfile.displayName);
    if ((profileRef = currentProfile)) {
      // document.querySelector('placeholder-Name').value = currentProfile.displayName;
      // document.getElementById('whoDescription').value = doWhopDescription.whoDescription;
      // document.getElementById('whyDescription').value = doWhopDescription.whyDescription;
      // document.getElementById('whatDescription').value = doWhopDescription.whatDescription;
      // document.getElementById('whereDescription').value = doWhopDescription.whereDescription;
      // // document.getElementById('whereAddress').value = doWhopDescription.whereAddress;
      // document.getElementById('whenDescription').value = doWhopDescription.whenDescription;
      // // document.getElementById('whenTime').value = doWhopDescription.whenTime;
      // document.getElementById('howMuchDescription').value = doWhopDescription.howMuchDescription;
      // document.getElementById('creatorDescription').value = doWhopDescription.creatorDescription;
      // document.getElementById('doerDescription').value = doWhopDescription.doerDescription;
      // document.getElementById('howMuchCost').value = doWhopDescription.howMuchCost;
    }
  });
}
