//Display user profile page  dowhop.com/profile?###UserID###

'use strict';
var currentProfile;
var myDisplayName = document.getElementById('my-display-name');
var myProfileName = document.getElementById('my-profile-name');
var myProfileSocialFB = document.getElementById('my-profile-social-FB');
var myProfileSocialTW = document.getElementById('my-profile-social-TW');
var myProfileSocialIG = document.getElementById('my-profile-social-IG');
var myProfileSocialLI = document.getElementById('my-profile-social-LI');
var myPersonalWebsite = document.getElementById('my-personal-website');
var myProfileAbout = document.getElementById('my-profile-about');
var myProfilePayment = document.getElementById('my-profile-payment');
var myProfileActivity1 = document.getElementById('my-profile-activity-1');
var myProfileActivity2 = document.getElementById('my-profile-activity-2');
var myProfileActivity3 = document.getElementById('my-profile-activity-3');
var activityImage1 = document.getElementById('activity-image-1');
var activityImage2 = document.getElementById('activity-image-2');
var activityImage3 = document.getElementById('activity-image-3');
var sendDirectMessageDiv = document.getElementById('send-direct-message-div');
var myProfileSocial = document.getElementById('my-profile-social');


// Updates verification status of email, phone, and social
function profileProgressUI() {
  var uid = retrieveUrl(window.location.href) || auth.currentUser.uid;
  var profileRef = database.ref('app_users/' + uid);
  profileRef.once('value').then(function(snapshot) {
    if (snapshot.val() && snapshot.val().profileProgress) {
      var profileProgress = snapshot.val().profileProgress;
      var sections = ['verify-email', 'verify-phone', 'verify-social'];
      var className;
      sections.map(function(section) {
        if (profileProgress[section]) {
          className = section + '-done';
        } else {
          className = section + '-not-done';
        }
        var elArr = document.getElementsByClassName(className);
        for (var i = 0; i < elArr.length; i++) {
          elArr[i].style.display = 'block';
        }
      });
    }
  });
}
