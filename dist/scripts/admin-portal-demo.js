'use strict'

// Function for generating raw view of data. Assumes user has DoWhop ID ready.

function retrieveSingleDoWhop(e) {
  e.preventDefault();
  var searchTerm = document.getElementById("given-dowhop-id").value || "NA";
  console.log(  firebase.auth().currentUser );
  console.log(searchTerm);

  var tempRef = database.ref('/DoWhopDescriptions').child(searchTerm);
  tempRef.once('value').then((function(snap) {
    searchResults.innerText = JSON.stringify(snap.val())
  }))
}

var searchButton = document.getElementById('search-for-dowhop');
searchButton.addEventListener('click', retrieveSingleDoWhop);
var searchResults = document.getElementById('result');
