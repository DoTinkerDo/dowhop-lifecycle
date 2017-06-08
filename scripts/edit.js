// Use code below to edit/update information for a selected DoWhop.

document.getElementById('submit').addEventListener('click', createDoWhop);
var rootRef = firebase.database().ref('app_users/');
var rootRefEvents = firebase.database().ref('doWhopDescription/');

document.getElementById('whenDate').setAttribute('value', getDate());

Array.from(document.getElementsByClassName('plus-button')).forEach(function(e) {
  e.addEventListener('click', function() {
    var self = this;
    for (var p of self.classList) {
      if (p == 'fa-plus-circle') {
        self.classList.remove('fa-plus-circle');
        self.classList.add('fa-minus-circle');
        self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
          if (c.nodeName != '#text') {
            c.classList.add('slideDown');
            c.classList.remove('slideUp');
          }
        });
        break;
      } else if (p == 'fa-minus-circle') {
        self.classList.remove('fa-minus-circle');
        self.classList.add('fa-plus-circle');
        self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
          if (c.nodeName != '#text') {
            if (c.classList[0] == 'underbar_options') {
              hideAll(c);
            }
            c.classList.add('slideUp');
            c.classList.remove('slideDown');
          }
        });
        break;
      }
    }
  });
});

Array.from(document.getElementsByClassName('img_icon')).forEach(function(e) {
  e.addEventListener('click', function() {
    var self = this;
    self.parentElement.nextElementSibling.childNodes.forEach(function(c) {
      if (c.nodeName != '#text' && c.id.split('_')[0] == self.id) {
        if (c.parentElement.dataset.openoption != '' && c.parentElement.dataset.openoption != c.id) {
          //closes other tabs
          hideOption(c.parentElement.childNodes[1], c.parentElement.dataset.openoption);
        }
        if (c.parentElement.dataset.openoption == c.id) {
          c.setAttribute('hidden', true);
          c.parentElement.dataset.openoption = '';
        } else {
          c.removeAttribute('hidden');
          c.parentElement.dataset.openoption = c.id;
        }
      }
    });
  });
});

function createDoWhop(data, clearForm) {

  // Collect form data and clear it:
  var creator = firebase.auth().currentUser.uid;
  var titleDescription = document.getElementById('titleDescription');
  var titleImage = document.getElementById('titleImage');
  var whoDescription = document.getElementById('whoDescription');
  var whoImage = document.getElementById('whoImage');
  var whatDescription = document.getElementById('whatDescription');
  var whatImage = document.getElementById('whatImage');
  var whereDescription = document.getElementById('whereDescription');
  var whereAddress = document.getElementById('whereAddress');
  var whereImage = document.getElementById('whereImage');
  var whenDescription = document.getElementById('whenDescription');
  var whenDate = document.getElementById('whenDate');
  var whenTime = document.getElementById('whenTime');
  var whenImage = document.getElementById('whenImage');
  var howMuchDescription = document.getElementById('howMuchDescription');
  var hostDescription = document.getElementById('hostDescription'); // new
  var doerDescription = document.getElementById('doerDescription'); // new
  var howMuchCost = document.getElementById('howMuchCost');
  var howmuchImage = document.getElementById('howmuchImage');
  var currentDoWhop = document.getElementById('dowhop-selector-container').firstChild.id || 'orphan';

  var error = document.getElementById('error');

  if (
    titleDescription.value !== '' &&
    whoDescription.value !== ''
  ) {
    data.creator = creator;
    data.titleDescription = titleDescription.value.trim();
    data.titleImage = titleImage.innerHTML.trim();
    data.whoDescription = whoDescription.value.trim();
    data.whoImage = whoImage.innerHTML.trim();
    data.whatDescription = whatDescription.value.trim();
    data.whatImage = whatImage.innerHTML.trim();
    data.whereDescription = whereDescription.value.trim();
    data.whereAddress = whereAddress.value.trim();
    data.whereImage = whereImage.innerHTML.trim();
    data.whenDescription = whenDescription.value.trim();
    data.whenTime = whenTime.value.trim();
    data.whenDate = whenDate.value.trim();
    data.whenImage = whenImage.innerHTML.trim();
    data.howMuchDescription = howMuchDescription.value.trim();
    data.hostDescription = hostDescription.value.trim();
    data.doerDescription = doerDescription.value.trim();
    data.howMuchCost = howMuchCost.value.trim();
    data.howmuchImage = howmuchImage.innerHTML.trim();
  } else {
    var error = document.getElementById('error');
    error.classList.remove('error--ok');
    error.innerHTML = 'Please fill in all fields';
    return false;
  }

  // Changing this to an edit/update form that will only set certain attributes.
  rootRefEvents.child(currentDoWhop).child('titleDescription').set(data.titleDescription);
  rootRefEvents.child(currentDoWhop).child('whatDescription').set(data.whatDescription);
  rootRefEvents.child(currentDoWhop).child('whoDescription').set(data.whoDescription);
  rootRefEvents.child(currentDoWhop).child('whereDescription').set(data.whereDescription);
  rootRefEvents.child(currentDoWhop).child('whenDescription').set(data.whenDescription);
  rootRefEvents.child(currentDoWhop).child('hostDescription').set(data.hostDescription);
  rootRefEvents.child(currentDoWhop).child('doerDescription').set(data.doerDescription);
  rootRefEvents
    .child(currentDoWhop)
    .child('howMuchDescription')
    .set(data.howMuchDescription)
    .then(retrieveMyDoWhops(auth.currentUser.uid));

  titleDescription.value = '';
  titleImage.innerHTML = '';
  whoDescription.value = '';
  whoImage.innerHTML = '';
  whatDescription.value = '';
  whatImage.innerHTML = '';
  whereDescription.value = '';
  whereAddress.value = '';
  whereImage.innerHTML = '';
  whenDescription.value = '';
  whenTime.value = '';
  whenDate.value = '';
  whenImage.innerHTML = '';
  howMuchDescription.value = '';
  hostDescription.value = '';
  doerDescription.value = '';
  howMuchCost.value = '';
  howmuchImage.innerHTML = '';

  document.getElementById('error').innerHTML =
    'You rock! Thanks for submitting your DoWhop. Please review your changes to the newly updated DoWhop!';
}

function retrieveMyDoWhops(uid) {
  var rootRefEvents = firebase.database().ref('doWhopDescription/');
  var rootRefDoer = firebase.database().ref('app_users/' + uid);

  var makeDoWhopSelector = function(container, data) {
    let imageUrl = '';
    let relationshipIcon = '';

    // Add icon to image dependong on whether current user is Creator or Doer:
    if (
      data.val() &&
      (data.val().hostDescription === auth.currentUser.email || data.val().creator === auth.currentUser.uid)
    ) {
      relationshipIcon = 'check_box';
    } else {
      relationshipIcon = 'directions_walk'
    }

    // Put together elements to make a DoWhop Selector block:
    if (data.val() && data.val().downloadURL) {
      imageUrl =
        data.val().downloadURL ||
        'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';
      container.innerHTML +=
        "<section id='" +
        data.key +
        "' class='dowhop-selector-block' onclick='sessionRef(this)'>" +
        "<i class='material-icons dowhop-icon'>" +
        relationshipIcon +
        '</i>' +
        "<div class='dowhop-selector-header' style='background-image: url(" +
        imageUrl +
        ");'>" +
        '<h1>' +
        data.val().titleDescription +
        '</h1>' +
        '</div>' +
        "<div class='dowhop-selector-body'>" +

        // '<h3>When?</h3>' +
        // '<p>' +
        // data.val().whenDescription +
        // '</p>' +
        // '<h3>What day?</h3>' +
        // '<p>' +
        // ('TBD' || data.val().whenDate) +
        // '<p>' +
        // '<h3>What time?</h3>' +
        // '<p>' +
        // ('TBD' || data.val().whenTime) +
        // '<p>' +
        // '<h3>Where?</h3>' +
        // '<p>' +
        // data.val().whereDescription +
        // '</p>' +
        // '<p>' +
        // ('Address TBD' || data.val().whereAddress) +
        // '</p>' +
        // '<h3>How Much?</h3>' +
        // '<p>' +
        // data.val().howMuchDescription +
        // '</p>' +

        '<h3>Who is host?</h3>' +
        '<p>' +
        (data.val().hostDescription || 'TBD') +
        '</p>' +
        '<h3>Who is doer?</h3>' +
        '<p>' +
        (data.val().doerDescription || 'TBD') +
        '</p>' +
        '<h3>What?</h3>' +
        '<p>' +
        data.val().whatDescription +
        '</p>' +
        '<h3>How much?</h3>' +
        '<p>' +
        ('TBD' || data.val().howMuchCost) +
        '</p>';
      '</div>' + '</section>';
    } else {
      return container;
    }
  };

  var retrieveElement = function(id) {
    let container = document.getElementById('user-list-wrap');

    let myTempRef = firebase.database().ref('/doWhopDescription/' + id);
    myTempRef.once('value').then(function(data) {
      if (data.val()) {
        makeDoWhopSelector(container, data);
      } else {
      }
    });
  };

  rootRefDoer.child('doer').on('value', function(snap) {
    snap.forEach(function(snap) {
      var doWhopItem = snap.key;
      retrieveElement(snap.key);
    });
  });

  rootRefEvents.orderByKey().on(
    'value',
    function(snapshot) {
      var content = document.getElementById('user-list-wrap');
      content.innerHTML = '';
      snapshot.forEach(function(data) {
        // Note: these hard-coded doer, host, doer properties are an admin-priority functionality.
        if (
          data.val().creator === person.uid ||
          data.val().hostDescription === person.email ||
          data.val().doerDescription === person.email
        ) {
          makeDoWhopSelector(content, data);
        }
      });
    },
    function(errorObject) {
      console.log('Data Read Failure: ' + errorObject.code);
    }
  );
}

function handleFile(files_arr, node) {
  var file = files_arr[0];
  var imagified = node.id.split('F')[0] + 'Image';
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }

  var filePath = firebase.auth().currentUser.uid + '/' + imagified + '/' + file.name;
  return firebase.storage().ref(filePath).put(file).then(function(snapshot, node) {
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

function showEditForm(node) {
  var editForm = document.getElementById('edit-dowhop-form');
  var rootRefEvent = firebase.database().ref('doWhopDescription/' + node.id);
  rootRefEvent.once('value').then(function(snap) {
    if (snap.val().hostDescription === auth.currentUser.email || snap.val().creator === auth.currentUser.uid) {
      editForm.removeAttribute('hidden');
    } else {
      editForm.setAttribute('hidden', 'true');
    }
  });
}

function sessionRef(node) {
  fillInForms(node);
  showEditForm(node);
  firebase.database().ref().child('session/' + person.uid).set({ current_dowhop: node.id });
}

function fillInForms(node) {
  rootRefEvents.orderByKey().on('value', function(snapshot) {
    snapshot.forEach(function(data) {
      if (data.key === node.id) {
        document.getElementById('titleDescription').value = data.val().titleDescription;
        document.getElementById('whoDescription').value = data.val().whoDescription;
        document.getElementById('whatDescription').value = data.val().whatDescription;
        document.getElementById('whereDescription').value = data.val().whereDescription;
        document.getElementById('whereAddress').value = data.val().whereAddress;
        document.getElementById('whenDescription').value = data.val().whenDescription;
        document.getElementById('whenTime').value = data.val().whenTime;
        document.getElementById('howMuchDescription').value = data.val().howMuchDescription;
        document.getElementById('hostDescription').value = data.val().hostDescription;
        document.getElementById('doerDescription').value = data.val().doerDescription;
        document.getElementById('howMuchCost').value = data.val().howMuchCost;
      }
    });
  });
}
