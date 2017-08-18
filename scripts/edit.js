'use strict';

var rootRef = database.ref('app_users/');
var doWhopDescriptionRootRef = database.ref('DoWhopDescriptions/');
var editDoWhopForm = document.getElementById('edit-dowhop-form');
var submitUpdateDoWhopBtn = document.getElementById('submit-update-dowhop');

submitUpdateDoWhopBtn.addEventListener('click', createDoWhop);

function createDoWhop(event) {
  // Collect form data and clear it:
  var titleDescription = document.getElementById('titleDescription');
  // var titleImage = document.getElementById('titleImage');
  var whyDescription = document.getElementById('whyDescription');
  // var whyImage = document.getElementById('whyImage');
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
    event.whyDescription = whyDescription.value;
    // event.whyDescription = whyDescription.value;
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
  doWhopDescriptionRootRef.child(currentDoWhop).child('whyDescription').set(event.whyDescription);
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
  whyDescription.value = '';
  // whyImage.innerHTML = '';
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
      _.map(snapshot.val()).reverse().forEach(function(doWhopDescription) {
        var doerDescriptionEmails = [];
        if (doWhopDescription.doerDescription) {
          doerDescriptionEmails = doWhopDescription.doerDescription.split(', ');
        }

        if (
          doWhopDescription.creatorDescription === person.email ||
          doerDescriptionEmails.some(function(doerDescriptionEmail) {
            return doerDescriptionEmail === person.email;
            console.log(person);
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
  function retrieveElement(key) {
    var userDowhopCardDiv = document.getElementById('user-dowhop-cards');
    var doWhopDescriptionRef = database.ref('DoWhopDescriptions').child(key);
    doWhopDescriptionRef.once('value').then(function(doWhopDescription) {
      if (doWhopDescription) {
        makeDoWhopSelector(userDowhopCardDiv, doWhopDescription);
      }
    });
  }
  function addDoWhopImage(files_arr, node) {
    return (file = files_arr[0]);
    if (!file.type.match('image/.*')) {
      alert('You can only add images at the moment.');
      return;
    }
  }
}

function makeDoWhopSelector(container, data) {
  var image1 = '';
  var image2 = '';
  if (data && data.downloadURL) {
    image1 = data.downloadURL.image1 || data.downloadURL || defaultdataImage;
    image2 = data.downloadURL.image2 || data.downloadURL || defaultdataImage;
    container.innerHTML +=
      '<aside class="mdl-card dowhop-selector" id="' +
      data.doWhopDescriptionKey +
      '" onclick="setSession(this)" onmouseenter="toggleDoWhopDescriptionImage(this)" onmouseleave="toggleDoWhopDescriptionImage(this)" data-url1="' +
      image1 +
      '" data-url2="' +
      image2 +
      '">' +
      '<div class="dowhop-selector-header" style="background-image: url(' +
      image1 +
      ');">' +
      '<h1 id="dowhop-title">' +
      data.titleDescription +
      '</h1>' +
      '<div class="middle">' +
      '<p class="coordinate-text"> Coordinate this DoWhop </p>' +
      '</div>' +
      '</div>' +
      '</aside>';
  } else {
    return container;
  }
}

function toggleDoWhopDescriptionImage(element) {
  var div = element.firstChild;
  div.classList.toggle('swap-image');
  if (div.classList.contains('swap-image')) {
    div.style.backgroundImage = 'url(' + element.dataset.url2 + ')';
  } else {
    div.style.backgroundImage = 'url(' + element.dataset.url1 + ')';
  }
}

// Sets the currently selected DoWhopDescription key in sessions
// for the currentUser
// plus showEditForm and FillInEditForm
function setSession(doWhopSelector) {
  // Note: this is an important order of operations:
  var key = doWhopSelector.id;
  database.ref('session').child(person.uid).update({ current_dowhop: key });
  FriendlyChat.prototype.getSession(); // new
}

function showEditForm(doWhopSelector) {
  var editForm = document.getElementById('edit-dowhop-form');
  var key = doWhopSelector.id;
  var doWhopDescriptionRef = database.ref('DoWhopDescriptions').child(key);

  doWhopDescriptionRef.once('value').then(function(snapshot) {
    var doWhopDescription = snapshot.val();
    if (doWhopDescription.creatorDescription === auth.currentUser.email) {
      editForm.removeAttribute('hidden');
    } else {
      editForm.setAttribute('hidden', 'true');
    }
  });
}

function fillInEditForm(doWhopSelector) {
  //added by mike, can delete
  console.log('doWhopSelector', doWhopSelector);
  console.log('doWhopDescriptionRef', doWhopDescriptionRef);
  doWhopDescriptionRootRef.orderByKey().on('value', function(snapshot) {
    snapshot.forEach(function(data) {
      var doWhopDescription = data.val();

      if (data.key === doWhopSelector.id) {
        document.getElementById('titleDescription').value = doWhopDescription.titleDescription;
        document.getElementById('whoDescription').value = doWhopDescription.whoDescription;
        console.log(doWhopDescription.whoDescription);
        document.getElementById('whyDescription').value = doWhopDescription.whyDescription;
        document.getElementById('whatDescription').value = doWhopDescription.whatDescription;
        document.getElementById('whereDescription').value = doWhopDescription.whereDescription;
        // document.getElementById('whereAddress').value = doWhopDescription.whereAddress;
        document.getElementById('whenDescription').value = doWhopDescription.whenDescription;
        // document.getElementById('whenTime').value = doWhopDescription.whenTime;
        document.getElementById('howMuchDescription').value = doWhopDescription.howMuchDescription;
        document.getElementById('creatorDescription').value = doWhopDescription.creatorDescription;
        document.getElementById('doerDescription').value = doWhopDescription.doerDescription;
        document.getElementById('image1').src = doWhopDescription.downloadURL.image1;
        document.getElementById('image2').src = doWhopDescription.downloadURL.image2;
        document.getElementById('image3').src = doWhopDescription.downloadURL.image3;
        // document.getElementById('howMuchCost').value = doWhopDescription.howMuchCost;
      }
    });
  });
}

function addImageToFirebase(file) {
  var currentImageNumber = event.target.getAttribute('data-image-num');
  var currentDoWhopID = document.getElementById('dowhop-selector-container').firstChild.id;
  var filePath = 'userImages/' + uid + '/' + 'titleDescriptionImage/' + currentDoWhopID + '/' + file[0].name;

  storage.ref(filePath).put(file[0]).then(function(snapshot) {
    var path = snapshot.metadata.fullPath;
    storage.ref(path).getDownloadURL().then(function(url) {
      //set potential download URL to sessionStorage for current image number. Potential download URL will become actually URL
      //when form is submitted
      sessionStorage.setItem('potentialUrlForImage' + currentImageNumber, url);
      //set changed flag to true for current image
      sessionStorage.setItem('image' + currentImageNumber + 'Changed', true);
    });
  });
}

// TODO determine if
// handleFile, getDate, hideOptions,
// hideAll are being used
function handleFile(files_arr, node) {
  var file = files_arr[0];
  var imagified = node.id.split('F')[0] + 'Image';
  if (!files_arr[0].type.match('image/.*')) {
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
