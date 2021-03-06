'use strict';

var rootRef = database.ref('app_users/');

var doWhopDescriptionRootRef = database.ref('DoWhopDescriptions/');
var submitUpdateDoWhopBtn = document.getElementById('submit-update-dowhop');

submitUpdateDoWhopBtn.addEventListener('click', editSelectedDoWhop);

function editSelectedDoWhop(event) {
  event.preventDefault();

  var titleDescription = document.getElementById('titleDescription');
  var whyDescription = document.getElementById('whyDescription');
  var whoDescription = document.getElementById('whoDescription');
  var whoAmIDescription = document.getElementById('whoAmIDescription');
  var whatDescription = document.getElementById('whatDescription');
  var whereDescription = document.getElementById('whereDescription');
  var whenDescription = document.getElementById('whenDescription');
  var howMuchDescription = document.getElementById('howMuchDescription');
  var creatorDescription = document.getElementById('creatorDescription');
  var doerDescription = document.getElementById('doerDescription');
  var howMuchCost = document.getElementById('howMuchCost');
  var currentDoWhop = document.getElementById('dowhop-selector-container').firstChild.id || 'orphan';

  var error = document.getElementById('error');

  if (titleDescription.value !== '' && whoDescription.value !== '') {
    event.createdBy = auth.currentUser.uid;
    event.titleDescription = titleDescription.value;
    event.whyDescription = whyDescription.value;
    event.whoDescription = whoDescription.value;
    event.whoAmIDescription = whoAmIDescription.value;
    event.whatDescription = whatDescription.value;
    event.whereDescription = whereDescription.value;
    event.whenDescription = whenDescription.value;
    event.howMuchDescription = howMuchDescription.value;
    event.creatorDescription = creatorDescription.value.toLowerCase();
    event.doerDescription = doerDescription.value.toLowerCase();
  } else {
    var error = document.getElementById('error');
    error.classList.remove('error--ok');
    error.innerHTML = 'Please fill in all fields';
    return false;
  }

  // Changing this to an edit/update form that will only set certain attributes.
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('titleDescription')
    .set(event.titleDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whyDescription')
    .set(event.whyDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whatDescription')
    .set(event.whatDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whoDescription')
    .set(event.whoDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whoAmIDescription')
    .set(event.whoAmIDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whereDescription')
    .set(event.whereDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('whenDescription')
    .set(event.whenDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('creatorDescription')
    .set(event.creatorDescription);
  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('doerDescription')
    .set(event.doerDescription);

  // Writes downloadURL for uploaded images to database
  database
    .ref('temp')
    .child(currentDoWhop)
    .child('updateImageTempData')
    .once('value')
    .then(function(snapshot) {
      var updateImageTempData = snapshot.val();

      var whichImagesChanged = [
        updateImageTempData.image1Changed,
        updateImageTempData.image2Changed,
        updateImageTempData.image3Changed
      ];
      var whichUrl = [
        updateImageTempData.potentialUrlForImage1,
        updateImageTempData.potentialUrlForImage2,
        updateImageTempData.potentialUrlForImage3
      ];

      whichImagesChanged.map((imageChanged, idx) => {
        if (imageChanged) {
          var imgNum = idx + 1;
          var key = 'image' + imgNum;
          var url = whichUrl[idx];
          var obj = {};
          obj[key] = url;
          doWhopDescriptionRootRef
            .child(currentDoWhop)
            .child('downloadURL')
            .update(obj);
        }
      });
    })
    .catch(function(error) {
      console.log('updateImageTempData ERROR -> ', error);
    });

  doWhopDescriptionRootRef
    .child(currentDoWhop)
    .child('howMuchDescription')
    .set(event.howMuchDescription)
    .then(retrieveMyDoWhops(auth.currentUser.uid))
    .catch(function(error) {
      console.log('editSelectedDoWhop ERROR -> ', error);
    });

  titleDescription.value = '';
  whyDescription.value = '';
  whoDescription.value = '';
  whoAmIDescription.value = '';
  whatDescription.value = '';
  whereDescription.value = '';
  whenDescription.value = '';
  howMuchDescription.value = '';
  creatorDescription.value = '';
  doerDescription.value = '';

  document.getElementById('error').innerHTML =
    'You rock! Thanks for submitting your DoWhop. Please review your changes to the newly updated DoWhop!';
}

// retrieveMyDoWhops should probably be moved to a more central place...
function retrieveMyDoWhops(uid, currentDoWhopID) {
  doWhopDescriptionRootRef.on(
    'value',
    function(snapshot) {
      var doWhopDescriptions = snapshot.val();
      var userDowhopCardDiv = document.getElementById('user-dowhop-cards');
      var isCurrentDoWhop = false;
      userDowhopCardDiv.innerHTML = '';
      _.map(snapshot.val())
        .reverse()
        .forEach(function(doWhopDescription) {
          var doerDescriptionEmails = [];

          if (doWhopDescription.doerDescription) {
            doerDescriptionEmails = doWhopDescription.doerDescription.split(', ');
          }

          if (
            (doWhopDescription.creatorDescription && doWhopDescription.creatorDescription.toLowerCase()) ===
              person.email.toLowerCase() ||
            doerDescriptionEmails.some(function(doerDescriptionEmail) {
              return doerDescriptionEmail.toLowerCase() === person.email.toLowerCase();
            })
          ) {
            // Begin experiment for filtering selected vs current DoWhop:

            // console.log('is current dowhop?', doWhopDescription.doWhopDescriptionKey === currentDoWhopID);
            doWhopDescription.doWhopDescriptionKey === currentDoWhopID
              ? (isCurrentDoWhop = true)
              : (isCurrentDoWhop = false);

            makeDoWhopSelector(userDowhopCardDiv, doWhopDescription, isCurrentDoWhop);
          }
        });
    },
    function(errorObject) {
      console.log('retrieveMyDoWhops Data Read Failure: ' + errorObject.code);
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
    if (!file.type.match('image/.*')) {
      alert('You can only add images at the moment.');
      return;
    }
    return (file = files_arr[0]);
  }
}

function makeDoWhopSelector(container, data, isCurrentDoWhopStatus) {
  var defaultDoWhopDescriptionImage =
    'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/app-image-assets%2FDefaultDoWhop_banner.jpg?alt=media&token=036dfe25-d46c-4632-82b9-34094628cfc9';
  var image1 = '';
  var image2 = '';
  var activeClass = null;
  isCurrentDoWhopStatus === true ? (activeClass = 'active') : (activeClass = null);

  if (data && data.downloadURL) {
    image1 = data.downloadURL.image1 || data.downloadURL || defaultDoWhopDescriptionImage;
    image2 = data.downloadURL.image2 || data.downloadURL || defaultDoWhopDescriptionImage;
    container.innerHTML +=
      '<aside class="mdl-card dowhop-selector ' +
      activeClass +
      '" id="' +
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
  // console.log('Running setSession....', doWhopSelector);
  doWhopSelector.classList.add('active');
  // Note: this is an important order of operations:
  var key = doWhopSelector.id;
  database
    .ref('session')
    .child(person.uid)
    .update({ current_dowhop: key });
  // console.log(creatorUserObjects, doerUserObjects);
  // setAndGetDoWhopDescriptionSession(key); // new
}

function showEditForm(DoWhopID) {
  // console.log('running showeditform');
  var editForm = document.getElementById('edit-dowhop-form');
  var key = DoWhopID;
  var doWhopDescriptionRef = database.ref('DoWhopDescriptions').child(key);

  doWhopDescriptionRef.once('value').then(function(snapshot) {
    var doWhopDescription = snapshot.val();
    if (doWhopDescription.creatorDescription.toLowerCase() === auth.currentUser.email.toLowerCase()) {
      editForm.removeAttribute('hidden');
    } else {
      editForm.setAttribute('hidden', 'true');
    }
  });
}

function fillInEditForm(doWhopID) {
  var currentDoWhopDescriptionID = doWhopID;

  var editImageCapture1 = document.getElementById('edit-image-capture1');
  var editImageCapture2 = document.getElementById('edit-image-capture2');
  var editImageCapture3 = document.getElementById('edit-image-capture3');

  editImageCapture1.addEventListener('change', addImageToFirebase);
  editImageCapture2.addEventListener('change', addImageToFirebase);
  editImageCapture3.addEventListener('change', addImageToFirebase);

  doWhopDescriptionRootRef.child(currentDoWhopDescriptionID).on('value', function(snapshot) {
    var doWhopDescription = snapshot.val();
    document.getElementById('titleDescription').value = doWhopDescription.titleDescription;
    document.getElementById('whoDescription').value = doWhopDescription.whoDescription;
    document.getElementById('whoAmIDescription').value = doWhopDescription.whoAmIDescription || '';
    document.getElementById('whyDescription').value = doWhopDescription.whyDescription;
    document.getElementById('whatDescription').value = doWhopDescription.whatDescription;
    document.getElementById('whereDescription').value = doWhopDescription.whereDescription;
    document.getElementById('whenDescription').value = doWhopDescription.whenDescription;
    document.getElementById('howMuchDescription').value = doWhopDescription.howMuchDescription;
    document.getElementById('creatorDescription').value = doWhopDescription.creatorDescription;
    document.getElementById('doerDescription').value = doWhopDescription.doerDescription;
    document.getElementById('image1').src = doWhopDescription.downloadURL.image1 || '';
    document.getElementById('image2').src = doWhopDescription.downloadURL.image2 || '';
    document.getElementById('image3').src = doWhopDescription.downloadURL.image3 || '';
  });

  clearImageTempValues(currentDoWhopDescriptionID);
}

function addImageToFirebase(e) {
  var currentImageNumber = e.target.getAttribute('data-image-num');
  var currentDoWhopID = document.getElementById('dowhop-selector-container').firstChild.id;

  var fileName = this.files[0].name;
  var file = this.files[0];
  var filePath = 'userImages/' + uid + '/' + 'titleDescriptionImage/' + currentDoWhopID + '/' + fileName;
  var currentImgElement = 'image' + currentImageNumber;

  storage
    .ref(filePath)
    .put(file)
    .then(function(snapshot) {
      var path = snapshot.metadata.fullPath;
      storage
        .ref(path)
        .getDownloadURL()
        .then(function(url) {
          var potentialUrlForImage = 'potentialUrlForImage' + currentImageNumber;
          var imageChanged = 'image' + currentImageNumber + 'Changed';
          var obj = {};
          obj[imageChanged] = true;
          obj[potentialUrlForImage] = url;
          database
            .ref('temp')
            .child(currentDoWhopID)
            .child('updateImageTempData')
            .update(obj);
        });
    })
    .catch(function(error) {
      console.log('ADDIMAGETOFIREBASE ERROR', error);
    });
}

function clearImageTempValues(currentDoWhopID) {
  database
    .ref('temp')
    .child(currentDoWhopID)
    .child('updateImageTempData')
    .update({
      image1Changed: false,
      image2Changed: false,
      image3Changed: false,
      potentialUrlForImage1: '',
      potentialUrlForImage2: '',
      potentialUrlForImage3: ''
    })
    .catch(function(error) {
      console.log('CLEARIMAGETEMPVALUES ERROR', error);
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
  return storage
    .ref(filePath)
    .put(file)
    .then(function(snapshot, node) {
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
