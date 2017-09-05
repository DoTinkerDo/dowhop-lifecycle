myProfilePicture = document.getElementById('my-profile-picture');

function retrieveProfile() {
	var currentUser = auth.currentUser.uid;

	var profileRef = database.ref('app_users/' + currentUser);

	profileRef.once('value', function(snap) {
		appUser = snap.val();
		myProfilePicture.src = appUser.photoURL;
	});
}

// For looking at your own profile (user is logged in):
auth.onAuthStateChanged(function(user) {
	console.log(user);
  if (user) {
    retrieveProfile();
  }
});