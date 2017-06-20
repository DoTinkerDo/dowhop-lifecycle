'use strict';

var rootRef = database.ref('app_users/');
var doWhopDescriptionRootRef = database.ref('doWhopDescription/');
var editDoWhopForm = document.getElementById('edit-dowhop-form');
var submitUpdateDoWhopBtn = document.getElementById('submit-update-dowhop');

editDoWhopForm.addEventListener('click', function(e) {
  e.preventDefault();
});

submitUpdateDoWhopBtn.addEventListener('click', createDoWhop);

function createDoWhop(event) {
  // Collect form data and clear it:
  var titleDescription = document.getElementById('titleDescription');
  // var titleImage = document.getElementById('titleImage');
  var whoDescription = document.getElementById('whoDescription');
  // var whoImage = document.getElementById('whoImage');
  var whatDescription = document.getElementById('whatDescription');
  // var whatImage = document.getElementById('whatImage');
  var whereDescription = document.getElementById('whereDescription');
  // var whereAddress = document.getElementById('whereAddress');
  // var whereImage = document.getElementById('whereImage');
  var whenDescription = document.getElementById('whenDescription');
  // var whenDate = document.getElementById('whenDate');
  // var whenTime = document.getElementById('whenTime');
  // var whenImage = document.getElementById('whenImage');
  var howMuchDescription = document.getElementById('howMuchDescription');
  var creatorDescription = document.getElementById('creatorDescription'); // new
  var doerDescription = document.getElementById('doerDescription'); // new
  var howMuchCost = document.getElementById('howMuchCost');
  // var howmuchImage = document.getElementById('howmuchImage');
  var currentDoWhop = document.getElementById('dowhop-selector-container').firstChild.id || 'orphan';
  var error = document.getElementById('error');

  if (titleDescription.value !== '' && whoDescription.value !== '') {
    event.createdBy = auth.currentUser.uid;
    event.titleDescription = titleDescription.value;
    // event.titleImage = titleImage.innerHTML;
    event.whoDescription = whoDescription.value;
    // event.whoImage = whoImage.innerHTML;
    event.whatDescription = whatDescription.value;
    // event.whatImage = whatImage.innerHTML;
    event.whereDescription = whereDescription.value;
    // event.whereAddress = whereAddress.value;
    // event.whereImage = whereImage.innerHTML;
    event.whenDescription = whenDescription.value;
    // event.whenTime = whenTime.value;
    // event.whenDate = whenDate.value;
    // event.whenImage = whenImage.innerHTML;
    event.howMuchDescription = howMuchDescription.value;
    event.creatorDescription = creatorDescription.value;
    event.doerDescription = doerDescription.value;
    // event.howMuchCost = howMuchCost.value;
    // event.howmuchImage = howmuchImage.innerHTML;
  } else {
    var error = document.getElementById('error');
    error.classList.remove('error--ok');
    error.innerHTML = 'Please fill in all fields';
    return false;
  }

  // Changing this to an edit/update form that will only set certain attributes.
  doWhopDescriptionRootRef.child(currentDoWhop).child('titleDescription').set(event.titleDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('whatDescription').set(event.whatDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('whoDescription').set(event.whoDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('whereDescription').set(event.whereDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('whenDescription').set(event.whenDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('creatorDescription').set(event.creatorDescription);
  doWhopDescriptionRootRef.child(currentDoWhop).child('doerDescription').set(event.doerDescription);

  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('howMuchDescription')
    .set(event.howMuchDescription)
    .then(retrieveMyDoWhops(auth.currentUser.uid));

  titleDescription.value = '';
  // titleImage.innerHTML = '';
  whoDescription.value = '';
  // whoImage.innerHTML = '';
  whatDescription.value = '';
  // whatImage.innerHTML = '';
  whereDescription.value = '';
  // whereAddress.value = '';
  // whereImage.innerHTML = '';
  whenDescription.value = '';
  // whenTime.value = '';
  // whenDate.value = '';
  // whenImage.innerHTML = '';
  howMuchDescription.value = '';
  creatorDescription.value = '';
  doerDescription.value = '';
  // howMuchCost.value = '';
  // howmuchImage.innerHTML = '';

  document.getElementById('error').innerHTML =
    'You rock! Thanks for submitting your DoWhop. Please review your changes to the newly updated DoWhop!';
}

function retrieveMyDoWhops(uid) {
  doWhopDescriptionRootRef.on(
    'value',
    function(snapshot) {
      var doWhopDescriptions = snapshot.val();
      var userDowhopCardDiv = document.getElementById('user-dowhop-cards');
      userDowhopCardDiv.innerHTML = '';

      snapshot.forEach(function(doWhopDescription) {
        var doerDescriptionEmails = [];
        if (doWhopDescription.val().doerDescription) {
          doerDescriptionEmails = doWhopDescription.val().doerDescription.split(', ');
        }

        if (
          doWhopDescription.val().creatorDescription === person.email ||
          doerDescriptionEmails.some(function(doerDescriptionEmail) {
            return doerDescriptionEmail === person.email;
            console.log(person)
          })
        ) {
          makeDoWhopSelector(userDowhopCardDiv, doWhopDescription);
        }
      });
    },
    function(errorObject) {
      console.log('Data Read Failure: ' + errorObject.code);
    }
  );

  // TODO figure out if this code is still used
  // no longer pushing doer objects to app_users
  var rootRefDoer = database.ref('app_users/' + uid);
  rootRefDoer.child('doer').on('value', function(snapshot) {
    snapshot.forEach(function(snapshot) {
      var doWhopItem = snapshot.key;
      retrieveElement(snapshot.key);
    });
  });
  var retrieveElement = function(key) {
    var userDowhopCardDiv = document.getElementById('user-dowhop-cards');
    var doWhopDescriptionRef = database.ref('doWhopDescription').child(key);
    doWhopDescriptionRef.once('value').then(function(doWhopDescription) {
      if (doWhopDescription.val()) {
        makeDoWhopSelector(userDowhopCardDiv, doWhopDescription);
      }
    });
  };
  function addDoWhopImage(files_arr, node) {
    return (file = files_arr[0]);
    if (!file.type.match('image/.*')) {
      alert('You can only add images at the moment.');
      return;
    }
  }
}

function makeDoWhopSelector(container, data) {
  // Add icon to image dependong on whether current user is Creator or Doer:
  var imageURL = '';
  var relationshipIcon = '';
  if (
    data.val() &&
    (data.val().creatorDescription === auth.currentUser.email || data.val().createdBy === auth.currentUser.uid)
  ) {
    relationshipIcon = 'check_box';
  } else {
    relationshipIcon = 'directions_walk';
  }

  // Put together elements to make a DoWhop Selector block:
  if (data.val() && data.val().downloadURL) {
    imageURL =
      data.val().downloadURL ||
      'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';

    container.innerHTML +=
      '<aside class="mdl-card dowhop-selector" id="' +
      data.key +
      '" onclick="sessionRef(this)">' +
      '<div class="dowhop-selector-header" style="background-image: url(' +
      imageURL +
      ');">' +
      '<i class="material-icons dowhop-icon">' +
      relationshipIcon +
      '</i>' +
      '<h1>' +
      data.val().titleDescription +
      '</h1>' +
      '</div>' +
      '<div class="mdl-layout__content dowhop-selector-body">' +
      '<h3>Who?</h3>' +
      '<p>' +
      (data.val().creatorDescription || 'TBD') +
      ' and ' +
      (data.val().doerDescription || 'TBD') +
      '</p>' +
      '<h3>What?</h3>' +
      '<p>' +
      data.val().whatDescription +
      '</p>' +
      '<h3>How much?</h3>' +
      '<p>' +
      (data.val().howMuchDescription || 'TBD') +
      '</p>';
    '</div>' + '</aside>';
  } else {
    return container;
  }
}

// Sets the currently selected DoWhopDescription key in sessions
// for the currentUser
// plus showEditForm and FillInEditForm
function sessionRef(doWhopSelector) {
  var key = doWhopSelector.id;
  database.ref('session').child(person.uid).set({ current_dowhop: key });
  showEditForm(doWhopSelector);
  fillInEditForm(doWhopSelector);
}

function showEditForm(doWhopSelector) {
  var editForm = document.getElementById('edit-dowhop-form');
  var key = doWhopSelector.id;
  var doWhopDescriptionRef = database.ref('doWhopDescription').child(key);

  doWhopDescriptionRef.once('value').then(function(snapshot) {
    var doWhopDescription = snapshot.val();
    if (
      doWhopDescription.creatorDescription === auth.currentUser.email ||
      doWhopDescription.createdBy === auth.currentUser.uid
    ) {
      editForm.removeAttribute('hidden');
    } else {
      editForm.setAttribute('hidden', 'true');
    }
  });
}

function fillInEditForm(doWhopSelector) {
  doWhopDescriptionRootRef.orderByKey().on('value', function(snapshot) {
    snapshot.forEach(function(data) {
      var doWhopDescription = data.val();
      if (data.key === doWhopSelector.id) {
        document.getElementById('titleDescription').value = doWhopDescription.titleDescription;
        document.getElementById('whoDescription').value = doWhopDescription.whoDescription;
        document.getElementById('whatDescription').value = doWhopDescription.whatDescription;
        document.getElementById('whereDescription').value = doWhopDescription.whereDescription;
        // document.getElementById('whereAddress').value = doWhopDescription.whereAddress;
        document.getElementById('whenDescription').value = doWhopDescription.whenDescription;
        // document.getElementById('whenTime').value = doWhopDescription.whenTime;
        document.getElementById('howMuchDescription').value = doWhopDescription.howMuchDescription;
        document.getElementById('creatorDescription').value = doWhopDescription.creatorDescription;
        document.getElementById('doerDescription').value = doWhopDescription.doerDescription;
        // document.getElementById('howMuchCost').value = doWhopDescription.howMuchCost;
      }
    });
  });
}

// TODO determine if
// handleFile, getDate, hideOptions,
// hideAll are being used
function handleFile(files_arr, node) {
  var file = files_arr[0];
  var imagified = node.id.split('F')[0] + 'Image';
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
  var filePath = auth.currentUser.uid + '/' + imagified + '/' + file.name;
  return storage.ref(filePath).put(file).then(function(snapshot, node) {
    var fullPath = snapshot.metadata.fullPath; //TIP: snapshot.metadata.downloadURLs[0] <-- Gets the viewable image link
    document.getElementById(fullPath.split('/')[1]).innerHTML = fullPath;
  });
}

function getDate() {
  d = new Date();
  date = d.getDate();
  month = d.getMonth() + 1;
  year = d.getFullYear();

  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return year + '-' + month + '-' + date;
}

function hideOption(node, name) {
  if (node == null) {
    console.error('Could not find node.');
  } else if (node.id == name) {
    node.setAttribute('hidden', true);
  } else {
    hideOption(node.nextElementSibling, name);
  }
}

function hideAll(underbar_options) {
  underbar_options.childNodes.forEach(function(c) {
    if (c.nodeName != '#text') {
      if (c.parentElement.dataset.openoption == c.id) {
        //closes other tabs
        c.setAttribute('hidden', true);
        c.parentElement.dataset.openoption = '';
      }
    }
  });
}

// Array.from(document.getElementsByClassName('plus-button')).forEach(function(e) {
//   e.addEventListener('click', function() {
//     var self = this;
//     for (var p of self.classList) {
//       if (p == 'fa-plus-circle') {
//         self.classList.remove('fa-plus-circle');
//         self.classList.add('fa-minus-circle');
//         self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
//           if (c.nodeName != '#text') {
//             c.classList.add('slideDown');
//             c.classList.remove('slideUp');
//           }
//         });
//         break;
//       } else if (p == 'fa-minus-circle') {
//         self.classList.remove('fa-minus-circle');
//         self.classList.add('fa-plus-circle');
//         self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
//           if (c.nodeName != '#text') {
//             if (c.classList[0] == 'underbar_options') {
//               hideAll(c);
//             }
//             c.classList.add('slideUp');
//             c.classList.remove('slideDown');
//           }
//         });
//         break;
//       }
//     }
//   });
// });
// Array.from(document.getElementsByClassName('img_icon')).forEach(function(e) {
//   e.addEventListener('click', function() {
//     var self = this;
//     self.parentElement.nextElementSibling.childNodes.forEach(function(c) {
//       if (c.nodeName != '#text' && c.id.split('_')[0] == self.id) {
//         if (c.parentElement.dataset.openoption != '' && c.parentElement.dataset.openoption != c.id) {
//           //closes other tabs
//           hideOption(c.parentElement.childNodes[1], c.parentElement.dataset.openoption);
//         }
//         if (c.parentElement.dataset.openoption == c.id) {
//           c.setAttribute('hidden', true);
//           c.parentElement.dataset.openoption = '';
//         } else {
//           c.removeAttribute('hidden');
//           c.parentElement.dataset.openoption = c.id;
//         }
//       }
//     });
//   });
// });
