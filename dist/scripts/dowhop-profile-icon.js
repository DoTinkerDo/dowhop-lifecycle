'use strict';

var userProfileIcon = document.getElementById('my-profile-icon');

// calls function on load of page
window.onload = getProfileIcon();

function getProfileIcon() {
	currentProfile = auth.currentUser.uid;
	var profileRef = database.ref('app_users/' + currentProfile);
	let userIcon;

	profileRef.on('value', function(snap) {
	var appUser = snap.val();
	// checks for downloaded image
		if (appUser.profileImg){
			userIcon = appUser.profileImg;
		}
		// check if user has photoURL
		else if (!appUser.profileImg && appUser.photoURL) {
			userIcon  = appUser.photoURL;
		} else {
			userIcon  = '/images/profile_placeholder.png';
		}
	})
		userProfileIcon.src = userIcon;
}
