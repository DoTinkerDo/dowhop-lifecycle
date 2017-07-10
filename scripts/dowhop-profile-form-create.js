'use strict';

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

function showForm(e) {
	e.preventDefault();
	createProfileDiv.removeAttribute('hidden');
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
		// .then(createProfileForm.reset())
	}
	if (createProfilePhone.value) {
		profileRef.update({ profilePhone: createProfilePhone.value });
		// .then(createProfileForm.reset())
	}
	if (createProfileSocial.value) {
		profileRef.update({ profileSocial: createProfileSocial.value });
		// .then(createProfileForm.reset())
	}
	if (createProfileWebsite.value) {
		profileRef.update({ profileWebsite: createProfileWebsite.value });
		// .then(createProfileForm.reset())
	}
	if (createProfilePayment.value) {
		profileRef.update({ profilePayment: createProfilePayment.value });
		// .then(createProfileForm.reset())
	}
	if (createProfileAbout.value) {
		profileRef.update({ profileAbout: createProfileAbout.value });
		// .then(createProfileForm.reset())
	}
	if (createProfileActivity1.value) {
		profileRef.update({ profileActivity1: createProfileActivity1.value });
		// .then(createProfileForm.reset())
	}

	if (createProfileActivity2.value) {
		profileRef.update({ profileActivity2: createProfileActivity2.value });
		// .then(createProfileForm.reset())
	}
	if (createProfileActivity3.value) {
		profileRef.update({ profileActivity3: createProfileActivity3.value });
		// .then(createProfileForm.reset())
	}
	// createProfileForm.reset();
	createProfileDiv.setAttribute('hidden', 'true');
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
var activityImage1 = document.getElementById('activity-image-1');
var activityImage2 = document.getElementById('activity-image-2');
var activityImage3 = document.getElementById('activity-image-3');
var myProfilePicture = document.getElementById('my-profile-picture');
var sendDirectMessageDiv = document.getElementById('send-direct-message-div');

function retrieveProfile(currentProfile) {
	// We are testing whether visiting user is looking at own profile (default), or other's via query parameter:
	currentProfile = retrieveUrl(window.location.href) || auth.currentUser.uid;
	var profileRef = database.ref('app_users/' + currentProfile);

	// Retrieving relevant data from the database:
	profileRef.on('value', function(snap) {
		var appUser = snap.val();
		myDisplayName.innerText = appUser.displayName;
		myProfileName.innerText = appUser.profileName;
		myProfilePhone.innerText = appUser.profilePhone;
		// myProfileSocial.innerText = appUser.profileSocial;
		// myProfileWebsite.innerText = appUser.profileWebsite;
		myProfileAbout.innerText = appUser.profileAbout;
		myProfileEmail.innerText = appUser.email;
		// myProfilePayment.innerText = appUser.pofilePayment;
		myProfileActivity1.innerText = appUser.profileActivity1;
		myProfileActivity2.innerText = appUser.profileActivity2;
		myProfileActivity3.innerText = appUser.profileActivity3;
		activityImage1.src = appUser.profileActivityImageURLs.image1 || '/images/placeholder-image1.png';
		activityImage2.src = appUser.profileActivityImageURLs.image2 || '/images/placeholder-image2.png';
		activityImage3.src = appUser.profileActivityImageURLs.image3 || '/images/placeholder-image3.png';
		myProfilePicture.src = appUser.photoURL;
		myProfilePicture.style.backgroundImage = 'url(' + appUser.photoURL + ')';
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
