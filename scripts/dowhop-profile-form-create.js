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
var socialButtonWeb = document.getElementById('social-button-4');
var updateForm = document.getElementById('direct-update-form-div');
var closingButton = document.getElementById('update-form-div-span');

createProfileFormBtn.addEventListener('click', createProfile);
socialButtonLinkedIn.addEventListener('click', expandLinkedIn);
socialButtonTwitter.addEventListener('click', expandTwitter);
socialButtonInstagram.addEventListener('click', expandInstagram);
socialButtonWeb.addEventListener('click', expandPersonalWeb)

closingButton.addEventListener('click', closeModalUpdate);

var activities = document.getElementsByClassName('personalAct');
var background = document.getElementById('background-photo').src;

for (var index = 0; index < activities.length; index++) {
  activities[index].addEventListener('mouseover', function() {
    var children = this.childNodes;
    var imageSrc = children[1].src;
    document.getElementById('background-photo').src = imageSrc;
  });
  activities[index].addEventListener('mouseout', function() {
    document.getElementById('background-photo').src = background;
  });
}

//Toggle for showing and hiding edit form in profile
var toggle = 0;

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

function expandPersonalWeb(e) {
  e.preventDefault();

  // Function to collapse MyDiv. So, MyDiv height become 0 px after collapsing.
  document.getElementById('personal-web-card').removeAttribute('hidden');
}

function profileProgressUI() {
  var uid = retrieveUrl(window.location.href);
  var profileRef = database.ref('app_users/' + uid);
  profileRef.once('value').then(function(snapshot) {
    if (snapshot.val() && snapshot.val().profileProgress) {
      var profileProgress = snapshot.val().profileProgress;
      var sections = ['verify-email', 'verify-phone', 'verify-social'];
      var className;
      sections.map(function(section) {
        if (!profileProgress[section]) {
          className = section + '-done';
        } else {
          className = section + '-not-done';
        }
        var elArr = document.getElementsByClassName(className);
        for (var i = 0; i < elArr.length; i++) {
          elArr[i].style.display = 'none';
        }
      });
    }
  });
}

profileProgressUI();

function createProfile(e) {
  e.preventDefault();
  var uid = auth.currentUser.uid;
  var profileRef = database.ref('app_users/' + uid);

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
  closeModalUpdate();
  //createProfileDiv.setAttribute('hidden', 'true');

  /**var theForm = document.getElementById('form-edit');
  theForm.removeAttribute("style");
  theForm.setAttribute("hidden","true");
  createProfileDiv.removeAttribute("style");
  createProfileDiv.setAttribute("hidden", "true");*/
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
// var myProfilePhone = document.getElementById('my-profile-phone'); //removed this element in profile page change, permanently remove later
var myProfileSocialFB = document.getElementById('my-profile-social-FB');
var myProfileSocialTW = document.getElementById('my-profile-social-TW');
var myProfileSocialIG = document.getElementById('my-profile-social-IG');
var myProfileSocialLI = document.getElementById('my-profile-social-LI');

// var myProfileWebsite = document.getElementById('my-profile-website');
var myProfileAbout = document.getElementById('my-profile-about');
// var myProfileEmail = document.getElementById('my-profile-email');
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
    //myProfileName.innerText = appUser.profileName;
    // myProfilePhone.innerText = phoneX(appUser.profilePhone); //commented because removed html
    myProfileSocialFB.innerText = snap.val().profileSocialFB;
    myProfileSocialTW.innerText = snap.val().profileSocialTW;
    myProfileSocialIG.innerText = snap.val().profileSocialIG;
    myProfileSocialLI.innerText = snap.val().profileSocialLI;
    // myProfileEmail.innerHTML = "<a href='mailto:" + appUser.email + " '>Send Message</a> ";
    myProfileAbout.innerText = appUser.profileAbout || 'About Me: ';
    // myProfilePayment.innerText = appUser.pofilePayment;

    if (appUser.profileActivity1) {
      myProfileActivity1.innerText = appUser.profileActivity1;
    } else {
      myProfileActivity3.innerText = '';
    }

    if (appUser.profileActivity2) {
      myProfileActivity2.innerText = appUser.profileActivity2;
    } else {
      myProfileActivity2.innerText = '';
    }

    if (appUser.profileActivity3) {
      myProfileActivity3.innerText = appUser.profileActivity3;
    } else {
      myProfileActivity3.innerText = '';
    }

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
    if (y[y.length - 1] === '#') {
      // Adding a check to 'clean' up the hashtag when present.
      y = y.match(/(.+[^#])/)[1];
    }
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
    var prefix = 'http://';
    let twitter = String(snap.val().profileSocialTW);
    var link = prefix.concat(twitter);

    if (checkHTTP(twitter)) {
      link = twitter;
    }

    if (!snap.val().profileSocialTW) {
    } else {
      window.open(link, '_blank');
    }
  });
}

function socialMediaFB() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.on('value', function(snap) {
    var prefix = 'http://';
    let facebook = String(snap.val().profileSocialFB);
    var link = prefix.concat(facebook);

    if (checkHTTP(facebook)) {
      link = facebook;
    }

    if (!snap.val().profileSocialFB) {
    } else {
      console.log(link);
      window.open(link, '_blank');
    }
  });
}

function socialMediaLI() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.on('value', function(snap) {
    var prefix = 'http://';
    var linkedIn = String(snap.val().profileSocialLI);
    var link = prefix.concat(linkedIn);

    if (checkHTTP(linkedIn)) {
      link = linkedIn;
    }

    if (!snap.val().profileSocialLI) {
    } else {
      window.open(link, '_blank');
    }
  });
}

function socialMediaIG() {
  currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);
  profileRef.once('value', function(snap) {
    var prefix = 'http://';

    let instagram = String(snap.val().profileSocialIG);
    var link = prefix.concat(instagram);

    if (checkHTTP(instagram)) {
      link = instagram;
    }

    if (!snap.val().profileSocialIG) {
    } else {
      window.open(link, '_blank');
    }
  });
}

function checkHTTP(url) {
  var returnValue = true;
  var https = 'http://';
  var www = 'www.';
  for (var i = 0; i < https.length; i++) {
    if (https.charAt(i) != url.charAt(i)) {
      return false;
    }
  }
  return true;
}

function checkWWW(url) {
  var www = "www."

  for(var j = 0; j < www.length; j++) {
    console.log("we're in the second loop");
    console.log(url.charAt(j));
    if(www.charAt(j) != url.charAt(j)) {
      return false;
    }
  }
  return true;

}
/*
function checkURL(String url) {
  var index
}
*/
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

function closeModalUpdate() {
  updateForm.style.display = 'none';
}

function fillInProfileForm(e) {
  var currentProfile = retrieveUrl(window.location.href) || firebase.auth().currentUser.uid;
  var profileRef = firebase.database().ref('app_users/' + currentProfile);

  updateForm.removeAttribute('hidden');
  updateForm.style.display = 'block';
  /**var editForm = document.getElementById('direct-update-form-div');
  console.log(editForm);
  editForm.removeAttribute('hidden');
  editForm.style.display="block";
  createProfileDiv.style.display="block";
  createProfileDiv.removeAttribute("hidden");*/

  profileRef.once('value', function(snap) {
    if ((profileRef = currentProfile)) {
      if (snap.val().displayName) {
        document.getElementById('profile-name').value = snap.val().displayName;
      }
      if (snap.val().profileAbout) {
        document.getElementById('profile-about').value = snap.val().profileAbout;
      }
      if (snap.val().profileSocialFB) {
        document.getElementById('profile-social-FB').value = snap.val().profileSocialFB;
      }
      if (snap.val().profileSocialTW) {
        document.getElementById('profile-social-TW').value = snap.val().profileSocialTW;
      }
      if (snap.val().profileSocialIG) {
        document.getElementById('profile-social-IG').value = snap.val().profileSocialIG;
      }
      if (snap.val().profileSocialLI) {
        document.getElementById('profile-social-LI').value = snap.val().profileSocialLI;
      }
      if (snap.val().profileWebsite) {
        document.getElementById('profile-website').value = snap.val().profileWebsite;
      }
      if (snap.val().profileActivity1) {
        document.getElementById('profile-activity-1').value = snap.val().profileActivity1;
      }
      if (snap.val().profileActivity2) {
        document.getElementById('profile-activity-2').value = snap.val().profileActivity2;
      }
      if (snap.val().profileActivity3) {
        document.getElementById('profile-activity-3').value = snap.val().profileActivity3;
      }
      if (snap.val().profilePhone) {
        document.getElementById('profile-phone').value = snap.val().profilePhone;
      }
      if (snap.val().profilePayment) {
        document.getElementById('profile-payment').value = snap.val().profilePayment;
      }
      if (snap.val().email) {
        document.getElementById('account-email').value = snap.val().email;
      }
    }
  });
}
