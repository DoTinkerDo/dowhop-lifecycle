'use strict'

var myProfilePicture = document.getElementById('my-profile-picture-header');
//myProfilePicture.src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
console.log("In header file");
var url = "";

function getProfilePic(user) {
	var currentUser = user.uid
	console.log("hello");
	var profileRef = database.ref('app_users/' + currentUser);

	profileRef.on('value', function(snap) {
		var appUser = snap.val();
		//myProfilePicture.src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";

		return appUser.photoURL;
		//console.log(myProfilePicture.src);
	});
	myProfilePicture.src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
}

auth.onAuthStateChanged(function(user) {
	if(user) {
		url = getProfilePic(user);
		console.log("User is signed in");
		console.log(url);	

		//console.log(url);
		//myProfilePicture.src = url;
	}
	else {
		console.log("Not Signed In");
	}
})