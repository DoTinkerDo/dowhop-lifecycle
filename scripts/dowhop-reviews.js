'use strict';

// Definitions ->
// userHasCompleted = hasRated or hasCommented
// reviewType = creator/doer/dowhop
// reviewPart = stars or comments
// reviewer = creator or doer
// ratingInstance = ratingCreator/ratingDoer/ratingDoWhop/ &
//                  showRatingCreator/showRatingDoer/showRatingDoWhop

var userData = {};
var uid = null;
var currentDoWhopKey = null;
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

// Create rating instances
var ratingCreator = rating(creatorRatingDiv, currentRating, maxRating, creatorSubmitRating);
var ratingDoer = rating(doerRatingDiv, currentRating, maxRating, doerSubmitRating);
var ratingDoWhop = rating(doWhopRatingDiv, currentRating, maxRating, doWhopSubmitRating);
var showRatingCreator = rating(creatorDisplayRatingDiv, currentRating, maxRating, callback);
var showRatingDoer = rating(doerDisplayRatingDiv, currentRating, maxRating, callback);
var showRatingDoWhop = rating(doWhopDisplayRatingDiv, currentRating, maxRating, callback);

// Read ratings and comments when
// we have a user and the currentDoWhopKey
auth.onAuthStateChanged(function(user) {
  if (user) {
    // Create userData objec and set uid
    readUserData(user);

    // Using user session object in Firebase to find currentDoWhop
    var sessionRef = database.ref('/session').child(user.uid).child('current_dowhop');
    sessionRef.once('value').then(function(snapshot) {
      currentDoWhopKey = snapshot.val();
      // Placed read functions here to make sure
      // currentDoWhopkey is assigned before calling functions
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
function handleCommentSubmit(e) {
  e.preventDefault();
  var commentInput = this.parentNode.parentNode.firstChild.nextSibling.firstChild.nextSibling;
  var reviewType = this.id;
  handleDatabaseCommentSubmit(commentInput.value, reviewType);
  commentInput.value = '';
}

_.forEach(submitCommentButtons, function(button) {
  button.addEventListener('click', handleCommentSubmit);
});

// Write ratings
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
  // console.log('rating callback-> ', rating);
}

// Helper functions for Firebase reading and writing
// var key = '-Klems7GHux6YRIksJVj';
// var reviewRef = database.ref().child('doWhopDescription/' + key + '/reviews');

function readRatingsFromDatabase(reviewType, ratingInstance) {
  // var key = document.querySelector('.dowhop-selector-block');
  console.log('KEY RATINGS READING ', currentDoWhopKey);
  var reviewRef = database.ref().child('doWhopDescription/' + currentDoWhopKey + '/reviews');
  var ratingRef = reviewRef.child(reviewType).child('/ratings');
  ratingRef.once('value').then(function(snapshot) {
    var ratings = _.map(snapshot.val(), function(rating) {
      return rating;
    });
    ratingInstance.setRating(calculateWeightedRating(ratings));
  });
}
function readCommentsFromDatabase(reviewType, commentDiv) {
  console.log('KEY COMMENTS READING ', currentDoWhopKey);
  var reviewRef = database.ref().child('doWhopDescription/' + currentDoWhopKey + '/reviews');
  var commentRef = reviewRef.child(reviewType).child('/comments');
  commentRef.on('value', function(snapshot) {
    var comments = snapshot.val();
    var div = document.createElement('div');
    commentDiv.innerHTML = '';
    _.forEach(comments, function(comment) {
      div.innerHTML += '<blockquote>' + comment + '</blockquote>';
      commentDiv.append(div);
    });
  });
}
function handleDatabaseRatingSubmit(rating, reviewType, ratingInstance) {
  console.log('KEY WRITING ', currentDoWhopKey);
  var reviewRef = database.ref().child('doWhopDescription/' + currentDoWhopKey + '/reviews');
  var ratingReviewTypeRef = reviewRef.child(reviewType);
  ratingReviewTypeRef.once('value').then(function(snapshot) {
    var userHasRated = snapshot.child('hasRated').child(uid).val();
    if (userHasRated) {
      var ratingKey = snapshot.child('hasRated').child(uid).child('key').val();
      ratingReviewTypeRef.child('ratings').child(ratingKey).set(rating);
    } else {
      var key = ratingReviewTypeRef.child('ratings').push(rating).key;
      var ratingObj = {};
      ratingObj.key = key;
      ratingObj[uid] = true;
      ratingReviewTypeRef.child('hasRated').child(uid).set(ratingObj);
    }
  });
  // Sets rating in reviews
  ratingInstance.setRating(rating);
}
function handleDatabaseCommentSubmit(comment, reviewType) {
  var reviewRef = database.ref().child('doWhopDescription/' + currentDoWhopKey + '/reviews');
  var commentReviewTypeRef = reviewRef.child(reviewType);
  commentReviewTypeRef.once('value').then(function(snapshot) {
    var userHasCommented = snapshot.child('hasCommented').child(uid).val();
    if (userHasCommented) {
      var ratingKey = snapshot.child('hasCommented').child(uid).child('key').val();
      commentReviewTypeRef.child('comments').child(ratingKey).set(comment);
    } else {
      var key = commentReviewTypeRef.child('comments').push(comment).key;
      var ratingObj = {};
      ratingObj.key = key;
      ratingObj[uid] = true;
      commentReviewTypeRef.child('hasCommented').child(uid).set(ratingObj);
    }
  });
}
