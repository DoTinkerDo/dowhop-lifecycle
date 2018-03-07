'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'DoWhop';

exports.sendWelcomeEmail = functions.auth.user().onCreate((event) => {

  const user = event.data;

  const email = user.email;
  const displayName = user.displayName;


  return sendWelcomeEmail(email, displayName);
});
