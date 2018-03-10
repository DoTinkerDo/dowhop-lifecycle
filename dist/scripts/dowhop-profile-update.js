// connected to the update profile modal

'use strict';

var currentProfile;
var createProfileForm = document.getElementById('create-profile-form');
var profileImgFileButton = document.getElementById('profile-pic-upload');
var myProfileImg = document.getElementById('upload-picture');
var myProfilePicture = document.getElementById('my-profile-picture');
var removeImgBtn = document.getElementById('remove-profile-pic');
var createProfileName = document.getElementById('profile-name');
var createProfilePhone = document.getElementById('profile-phone');
var createProfileSocialFB = document.getElementById('profile-social-FB');
var createProfileSocialTW = document.getElementById('profile-social-TW');
var createProfileSocialIG = document.getElementById('profile-social-IG');
var createProfileSocialLI = document.getElementById('profile-social-LI');
var createPersonalWebsite = document.getElementById('personal-website');
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

var activityImage1 = document.getElementById('activity-image-1');
var activityImage2 = document.getElementById('activity-image-2');
var activityImage3 = document.getElementById('activity-image-3');

createProfileFormBtn.addEventListener('click', createProfile);
removeImgBtn.addEventListener('click', removeProfileImage);
socialButtonLinkedIn.addEventListener('click', expandLinkedIn);
socialButtonTwitter.addEventListener('click', expandTwitter);
socialButtonInstagram.addEventListener('click', expandInstagram);
editProfileButton.addEventListener('click', fillInProfileForm);
socialButtonWeb.addEventListener('click', expandPersonalWeb);
closingButton.addEventListener('click', closeModalUpdate);



//Adds user uploaded photo to storage and profileImg to the database for the user
profileImgFileButton.addEventListener('change', function(e){
	var file = e.target.files[0];

	var uid = auth.currentUser.uid;
	var storageRef = storage.ref('userImages/' + uid + '/profileImage/' + file.name);

	// if the file is not an image then it cannot be uploaded
	if(!file.type.match('image/.*')){
		console.log("You can only upload image files at this time")
	}else {
		var uploadTask = storageRef.put(file);
	    // listens for image upload
		uploadTask.on('state_changed', function(snapshot){

		}, function error(err){
			return err
		//on success adds to storage & database
		},function complete(){
			var downloadURL = uploadTask.snapshot.downloadURL;
			var updates = {};
			var postData = {
				profilePic: downloadURL
			};
			updates['app_users/' + uid + '/profileImg/'] = postData;
			database.ref().update(updates);
		});
	}
})

function updateProfileImages(){
	var uid = retrieveUrl(window.location.href) || auth.currentUser.uid;
	var userProfileImg;
    var profileRef = database.ref('app_users/' + uid );
    profileRef.on('value', function(snap) {
      var appUser = snap.val();
	  console.log("user info", appUser);
      // checks for downloaded image
	  if (appUser.profileImg){
		 userProfileImg = appUser.profileImg.profilePic;
	  }
	  // check if user has photoURL
	  else if (!appUser.profileImg && appUser.photoURL) {
		  userProfileImg  = appUser.photoURL;
	  } else {
		  userProfileImg  = '/images/profile_placeholder.png';
	  }
	  console.log("this is the image", userProfileImg);
		return userProfileImg;
	})
}
// When the user clicks the remove profile image button it is removed from storage and DB
function removeProfileImage(){
	var profileStorageRef = storage.ref('app_users/' + uid + '/profileImage/')
	var profileRef = database.ref('app_users/' + uid + '/profileImage');

	// profileStorageRef.delete()
}
