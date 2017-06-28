'use strict'

// Gathering our DOM elements.
var sendDMButton = document.getElementById('send-direct-message');

sendDMButton.addEventListener('click', initiateChat());

function initiateChat(e) {
  e.preventDefault();
  console.log("Hello! You have started a chat!");
}
