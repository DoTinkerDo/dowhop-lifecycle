'use strict';

// Definitions ->
// userHasCompleted = hasRated or hasCommented
// reviewType = creator/doer/dowhop
// reviewPart = stars or comments
// reviewer = creator or doer
// ratingInstance = ratingCreator/ratingDoer/ratingDoWhop/ &
//                  showRatingCreator/showRatingDoer/showRatingDoWhop

var placeholderUserPhotoURL =
  'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/dowhop-icons%2Fdowhop-icon.png?alt=media&token=4ce2cb46-d5f0-4bbc-bb9d-b25ca886e634';
var userData = null;
var uid = person && person.uid;
var selectedDoWhopKey = null;
var maxRating = 5;
var currentRating = 0;

var creatorCommentDiv = document.querySelector('#comments-for-creator');
var doerCommentDiv = document.querySelector('#comments-for-doer');
var doWhopCommentDiv = document.querySelector('#comments-for-dowhop');
var creatorRatingDiv = document.querySelector('#rating-creator');
var doerRatingDiv = document.querySelector('#rating-doer');
var doWhopRatingDiv = document.querySelector('#rating-dowhop');
var creatorDisplayRatingDiv = document.querySelector('#show-rating-creator');
var doerDisplayRatingDiv = document.querySelector('#show-rating-doer');
var doWhopDisplayRatingDiv = document.querySelector('#show-rating-dowhop');
var submitCommentButtons = document.querySelectorAll('.submit-comment');
var creatorRatingInput = document.getElementById('creator-input-container');
var doerRatingInput = document.getElementById('doer-input-container');

// Create rating instances
var ratingCreator = rating(creatorRatingDiv, currentRating, maxRating, creatorSubmitRating);
var ratingDoer = rating(doerRatingDiv, currentRating, maxRating, doerSubmitRating);
var ratingDoWhop = rating(doWhopRatingDiv, currentRating, maxRating, doWhopSubmitRating);
var showRatingCreator = rating(creatorDisplayRatingDiv, currentRating, maxRating, callback);
var showRatingDoer = rating(doerDisplayRatingDiv, currentRating, maxRating, callback);
var showRatingDoWhop = rating(doWhopDisplayRatingDiv, currentRating, maxRating, callback);

// Read ratings and comments when
// we have a user and the selectedDoWhopKey
auth.onAuthStateChanged(function(user) {
  if (user) {
    if (!userData) {
      userData = {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : placeholderUserPhotoURL,
        uid: user.uid,
        email: user.email
      };
      uid = userData.uid;
    } else {
      readUserData(user);
    }

    // Using user session object in Firebase to find currentDoWhop
    var sessionRef = database.ref('/session').child(user.uid).child('current_dowhop');
    sessionRef.on('value', function(snapshot) {
      selectedDoWhopKey = snapshot.val();

      // Toggle review inputs for Creator or Doer
      var doWhopDescriptionRef = database.ref('DoWhopDescriptions').child(selectedDoWhopKey);
      doWhopDescriptionRef.on('value', function(snapshot) {
        var selectedDoWhop = snapshot.val();
        var doerDescription = (selectedDoWhop && selectedDoWhop.doerDescription) || '';
        var currentUserEmail = user.email;
        if (
          doerDescription.split(', ').some(function(doerDescriptionEmail) {
            return doerDescriptionEmail === currentUserEmail;
          })
        ) {
          doerRatingInput.style.display = 'none';
          creatorRatingInput.style.display = 'block';
        } else if (currentUserEmail === selectedDoWhop.creatorDescription) {
          doerRatingInput.style.display = 'block';
          creatorRatingInput.style.display = 'none';
        }
      });

      // Placed read functions here to make sure
      // selectedDoWhopkey is assigned before calling functions
      readRatingsFromDatabase('creator', ratingCreator);
      readRatingsFromDatabase('doer', ratingDoer);
      readRatingsFromDatabase('dowhop', ratingDoWhop);
      readRatingsFromDatabase('creator', showRatingCreator);
      readRatingsFromDatabase('doer', showRatingDoer);
      readRatingsFromDatabase('dowhop', showRatingDoWhop);
      readCommentsFromDatabase('creator', creatorCommentDiv);
      readCommentsFromDatabase('doer', doerCommentDiv);
      readCommentsFromDatabase('dowhop', doWhopCommentDiv);
    });
  }
});

function readUserData(user) {
  var appUserRef = database.ref('/app_users').child(user.uid);
  appUserRef.once('value').then(function(snapshot) {
    userData = _.pick(snapshot.val(), ['displayName', 'photoURL', 'uid', 'email']);
    uid = userData.uid;
  });
}

// Write comments
_.forEach(submitCommentButtons, function(button) {
  button.addEventListener('click', handleCommentSubmit);
});

function handleCommentSubmit(e) {
  e.preventDefault();
  var commentInput = this.parentNode.parentNode.firstChild.nextSibling.firstChild.nextSibling;
  var reviewType = this.id;
  if (!validateHandleCommentSubmit(commentInput.value)) {
    alert('Your comment is longer than 140 characters, Try again.');
    return;
  }
  handleDatabaseCommentSubmit(commentInput.value, reviewType);
  commentInput.value = '';
}

function validateHandleCommentSubmit(comment) {
  if (comment.length >= 140) return false;
  return true;
}

// Write rating callback functions
// used by rating instances
function creatorSubmitRating(rating) {
  handleDatabaseRatingSubmit(rating, 'creator', showRatingCreator);
}
function doerSubmitRating(rating) {
  handleDatabaseRatingSubmit(rating, 'doer', showRatingDoer);
}
function doWhopSubmitRating(rating) {
  handleDatabaseRatingSubmit(rating, 'dowhop', showRatingDoWhop);
}
function callback(rating) {
  return rating;
}

// Helper functions for Firebase reading and writing
function readRatingsFromDatabase(reviewType, ratingInstance) {
  var reviewRef = database.ref().child('DoWhopDescriptions/' + selectedDoWhopKey + '/reviews');
  var ratingRef = reviewRef.child(reviewType).child('/ratings');
  ratingRef.once('value').then(function(snapshot) {
    var ratings = _.map(snapshot.val(), function(rating) {
      return rating;
    });
    ratingInstance.setRating(calculateWeightedRating(ratings));
  });
}
function readCommentsFromDatabase(reviewType, commentDiv) {
  var reviewRef = database.ref().child('DoWhopDescriptions/' + selectedDoWhopKey + '/reviews');
  var commentRef = reviewRef.child(reviewType).child('/comments');
  commentRef.on('value', function(snapshot) {
    var div = document.createElement('div');
    commentDiv.innerHTML = '';
    var commentsDetails = snapshot.val();
    _.forEach(commentsDetails, function(commentDetail) {
      div.innerHTML +=
        '<blockquote>' +
        commentDetail.comment +
        '</blockquote>' +
        '<img class="comment-headshot-pic" src="' +
        commentDetail.photoURL +
        '" alt="head shot for ' +
        commentDetail.name +
        '">' +
        '<p class="comment-by-name">' +
        commentDetail.name +
        '</p>';
      commentDiv.append(div);
    });
  });
}
function handleDatabaseRatingSubmit(rating, reviewType, ratingInstance) {
  var reviewRef = database.ref().child('DoWhopDescriptions/' + selectedDoWhopKey + '/reviews');
  var ratingReviewTypeRef = reviewRef.child(reviewType);
  ratingReviewTypeRef.once('value').then(function(snapshot) {
    var noReviews = snapshot.val();
    var userHasRated = snapshot.child('hasRated').child(uid).val();
    if (userHasRated) {
      let key = snapshot.child('hasRated').child(uid).child('key').val();
      ratingReviewTypeRef.child('ratings').child(key).set(rating);
    } else {
      // Check: if no reviews, then set initial rating to 1
      !noReviews ? (rating = 1) : rating;
      let key = ratingReviewTypeRef.child('ratings').push(rating).key;
      var ratingObj = {};
      ratingObj.key = key;
      ratingObj[uid] = true;
      ratingReviewTypeRef.child('hasRated').child(uid).set(ratingObj);
    }
    ratingInstance.setRating(rating);
  });
  // Sets rating in reviews UI
  ratingInstance.setRating(rating);
}
function handleDatabaseCommentSubmit(comment, reviewType) {
  var commentDetails = { comment: comment, name: userData.displayName, photoURL: userData.photoURL };
  var reviewRef = database.ref().child('DoWhopDescriptions/' + selectedDoWhopKey + '/reviews');
  var commentReviewTypeRef = reviewRef.child(reviewType);
  commentReviewTypeRef.once('value').then(function(snapshot) {
    var userHasCommented = snapshot.child('hasCommented').child(uid).val();
    if (userHasCommented) {
      let key = snapshot.child('hasCommented').child(uid).child('key').val();
      commentReviewTypeRef.child('comments').child(key).set(commentDetails);
    } else {
      let key = commentReviewTypeRef.child('comments').push().key;
      commentReviewTypeRef.child('comments').child(key).set(commentDetails);
      var ratingObj = {};
      ratingObj.key = key;
      ratingObj[uid] = true;
      commentReviewTypeRef.child('hasCommented').child(uid).set(ratingObj);
    }
  });
}
