//Code cobled together by Erik, working off code created by DoWhop
//form submission

document.getElementById("submit").addEventListener("click", createDoWhop);
var rootRef = firebase.database().ref("app_users/");
var rootRefEvents = firebase.database().ref("doWhopDescription/"); // <-- New

document.getElementById('whenDate').setAttribute("value", getDate());
//Should refactor below later, for more efficient and concise code

// Hiding the forms by default unless admin is noted otherwise:
// document.getElementById("admin-input-form").setAttribute("hidden", "true");

Array.from(document.getElementsByClassName("plus-button")).forEach(function(e){
  e.addEventListener("click", function() {
    var self = this;
    for(var p of self.classList){
      if (p=="fa-plus-circle") {
        self.classList.remove("fa-plus-circle")
        self.classList.add("fa-minus-circle")
        self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
          if(c.nodeName!="#text") {
            c.classList.add("slideDown")
            c.classList.remove("slideUp")
          }
        })
        break
      }
      else if(p=="fa-minus-circle"){
        self.classList.remove("fa-minus-circle")
        self.classList.add("fa-plus-circle")
        self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
          if(c.nodeName!="#text") {
            if(c.classList[0]=="underbar_options"){
              hideAll(c);
            }
            c.classList.add("slideUp")
            c.classList.remove("slideDown")
          }
        })
        break
      }
    }
  })
})

Array.from(document.getElementsByClassName("img_icon")).forEach(function(e){
  e.addEventListener("click", function() {
    var self = this;
    self.parentElement.nextElementSibling.childNodes.forEach(function(c){
      if(c.nodeName!="#text"&&(c.id.split("_")[0]==self.id)){
        if(c.parentElement.dataset.openoption!="" && c.parentElement.dataset.openoption!=c.id){ //closes other tabs
          hideOption(c.parentElement.childNodes[1], c.parentElement.dataset.openoption)
        }
        if(c.parentElement.dataset.openoption==c.id){
          c.setAttribute("hidden", true)
          c.parentElement.dataset.openoption="";
        }
        else {
          c.removeAttribute("hidden")
          c.parentElement.dataset.openoption=c.id
        }
      }
    })
  })
})
//
// document.getElementById("calendar").addEventListener("click", function() {
//   this.parentElement.nextElementSibling.innerHTML="<span>Date:</span><input type='date' id='whenDate' size='50'>"
// })
// document.getElementById("clock").addEventListener("click", function() {
//   document.getElementById("underbar_options").innerHTML="<span>Time:</span><input type='time' id='whenTime' size='50'>"
// })


// var adminDiv = document.getElementById("admin-input-form");
// adminDiv.style.display = 'none';

function createDoWhop(data, clearForm) {

  // Checking for user's admin status <-- CHECK.
  // person.email === 'tinkerdowhop@gmail.com' || 'omaralimalik@gmail.com' ?
  //   adminDiv.style.display = 'block' :
  //   adminDiv.style.display = 'none';

  // I collect form data and clear it
  var creator = firebase.auth().currentUser.uid
  // var campoEmail = document.getElementById("email");
  var titleDescription = document.getElementById("titleDescription");
  var titleImage = document.getElementById("titleImage");
  var whoDescription = document.getElementById("whoDescription");
  var whoImage = document.getElementById("whoImage");
  var whatDescription = document.getElementById("whatDescription");
  var whatImage = document.getElementById("whatImage");
  var whereDescription = document.getElementById("whereDescription");
  var whereAddress = document.getElementById("whereAddress");
  var whereImage = document.getElementById("whereImage");
  var whenDescription = document.getElementById("whenDescription");
  var whenDate = document.getElementById("whenDate")
  var whenTime = document.getElementById("whenTime")
  var whenImage = document.getElementById("whenImage");
  var howMuchDescription = document.getElementById("howMuchDescription");
  var hostDescription = document.getElementById("hostDescription"); // new
  var doerDescription = document.getElementById("doerDescription"); // new
  var howMuchCost = document.getElementById("howMuchCost");
  var howmuchImage = document.getElementById("howmuchImage");
  var currentDoWhop = document.getElementById("dowhop-selector-container").firstChild.id || "orphan";

  var error = document.getElementById("error");

  /*took out former if so that only same email dispays if (campoEmail.value !== "" &&  campoNombre.value !== "" && campoApellidos.value !== "")*/
  if (
    // campoEmail.value !== "" &&
    titleDescription.value !== "" &&
    whoDescription.value !== ""
  ) {
    data.creator = creator;
    // data.email = campoEmail.value.trim();
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
    data.host = hostDescription.value.trim();
    data.doer = doerDescription.value.trim();
    data.howMuchCost = howMuchCost.value.trim();
    data.howmuchImage = howmuchImage.innerHTML.trim();
      ;
    //   error.innerHTML = "";
    // campoWhat.value.trim();
    //   error.innerHTML = "";
    // campoWhere.value.trim();
    //   error.innerHTML = "";
    // campoWhen.value.trim();
    //   error.innerHTML = "";
    // campoHowmuch.value.trim();
    //   error.innerHTML = "";
  } else {
    var error = document.getElementById("error");
    error.classList.remove("error--ok");
    error.innerHTML = "Please fill in all fields";
    return false;
  }

  // create event data model

  var newEvent = {

    creator: person.uid, // <-- New
    // email: data.email,
    titleDescription: data.titleDescription,
    titleImage: data.titleImage,
    whoDescription: data.whoDescription,
    whoImage: data.whoImage,
    whatDescription: data.whatDescription,
    whatImage: data.whatImage,
    whereDescription: data.whereDescription,
    whereAddress: data.whereAddress,
    whereImage: data.whereImage,
    whenDescription: data.whenDescription,
    whenDate: data.whenDate,
    whenTime: data.whenTime,
    whenImage: data.whenImage,
    howMuchDescription: data.howMuchDescription,
    howMuchCost: data.howMuchCost,
    howmuchImage: data.howmuchImage,
    doer: data.hostDescription || "none",
    host: data.doerDescription || "none"
  }

    // Changing this to an edit/update form that will only set certain attributes. NOTE: THis is overwriter the DOERs list.
    rootRefEvents.child(currentDoWhop).child('titleDescription').set(data.titleDescription);
    rootRefEvents.child(currentDoWhop).child('whatDescription').set(data.whatDescription);
    rootRefEvents.child(currentDoWhop).child('whoDescription').set(data.whoDescription);
    rootRefEvents.child(currentDoWhop).child('whereDescription').set(data.whereDescription);
    rootRefEvents.child(currentDoWhop).child('whenDescription').set(data.whenDescription);
    rootRefEvents.child(currentDoWhop).child('host').set(data.host);
    rootRefEvents.child(currentDoWhop).child('doer').set(data.doer);
    rootRefEvents.child(currentDoWhop).child('howMuchDescription').set(data.howMuchDescription).then(retrieveMyDoWhops(auth.currentUser.uid));

    //^^Moved this to here since implementing the new code for population forms with old events the rootRefEvents.push above was causing the form values to not be wiped

  // create user data model
  var user = {
    creator: data.creator,
    // email: data.email,
    titleDescription: data.titleDescription,
    titleImage: data.titleImage,
    whoDescription: data.whoDescription,
    whoImage: data.whoImage,
    whatDescription: data.whatDescription,
    whatImage: data.whatImage,
    whereDescription: data.whereDescription,
    whereAddress: data.whereAddress,
    whereImage: data.whereImage,
    whenDescription: data.whenDescription,
    whenDate: data.whenDate,
    whenTime: data.whenTime,
    whenImage: data.whenImage,
    howMuchDescription: data.howMuchDescription,
    host: data.hostDescription,
    doer: data.doerDescription,
    howMuchCost: data.howMuchCost,
    howmuchImage: data.howmuchImage
  };

  titleDescription.value = "";
  titleImage.innerHTML = "";
  whoDescription.value = "";
  whoImage.innerHTML = "";
  whatDescription.value = "";
  whatImage.innerHTML = "";
  whereDescription.value = "";
  whereAddress.value = "";
  whereImage.innerHTML = "";
  whenDescription.value = "";
  whenTime.value = "";
  whenDate.value = "";
  whenImage.innerHTML = "";
  howMuchDescription.value = "";
  hostDescription.value = "";
  doerDescription.value = "";
  howMuchCost.value = "";
  howmuchImage.innerHTML = "";

  // rootRef.child(data.creator).set(user);
  document.getElementById("error").innerHTML =
    "You rock! Thanks for submitting your DoWhop. Please review your changes to the newly updated DoWhop!";


  // I check that there is no one with the same email and if it is not I enter it in the bbdd

  // rootRef.orderByValue().on("value", function(snapshot) {
  //   var emails = [];
  //   snapshot.forEach(function(data) {
  //     emails.push(data.val().email);
  //   });
  //     rootRefEvents.push(newEvent); // <-- New
  //
  //     rootRef.child(data.creator).set(user);
  //     document.getElementById("error").innerHTML =
  //       "You rock! Thanks for submitting your DoWhop. We will review your changes and email you the newly published DoWhop!";
  //     return false;
  //
  // })
  //^^^ Commented this out bc we no longer need to Email search AND it was totally crashing our DB by adding more events everytime a new one was created
  //Relevant code has been moved up to where the newEvent and user objects are created

  // put the listing again? spanish: pinto de nuevo el listado
  // retrieveMyDoWhops();
}


function retrieveMyDoWhops(uid) {

  var rootRefEvents = firebase.database().ref("doWhopDescription/");
  var rootRefDoer = firebase.database().ref("app_users/" + uid);

  var makeDoWhopSelector = function(container, data) {

    let imageUrl = '';
    let relationshipIcon ='';

    // Checking if current user is the creator; if so, prepare a special icon:
    if (data.val() && (data.val().host===auth.currentUser.email || data.val().creator===auth.currentUser.uid)) {
      relationshipIcon = 'check_box'; // icon for a Creator
    } else {
      relationshipIcon = 'directions_walk'; // icon for a Doer
    }

    // Put together elements to make a DoWhop Selector block:
    if (data.val() && data.val().downloadURL) {
      imageUrl = data.val().downloadURL || 'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';
      container.innerHTML +=

      "<section id='" + data.key + "' class='dowhop-selector-block' onclick='sessionRef(this)'>" +
        "<i class='material-icons dowhop-icon'>" + relationshipIcon + "</i>" +
          "<div class='dowhop-selector-header' style='background-image: url(" + imageUrl + ");'>" +
            "<h1>" + data.val().titleDescription + "</h1>" +
          "</div>" +
          "<div class='dowhop-selector-body'>" +
            "<h3>What?</h3>" +
            "<p>" + data.val().whatDescription + "</p>" +
            "<h3>When?</h3>" +
            "<p>" + data.val().whenDescription + "</p>" +
            "<h3>What day?</h3>" +
            "<p>" + ("TBD" || data.val().whenDate) + "<p>" +
            "<h3>What time?</h3>" +
            "<p>" + ("TBD" || data.val().whenTime) + "<p>" +
            "<h3>Where?</h3>" +
            "<p>" + data.val().whereDescription + "</p>" +
            "<p>" + ("Address TBD" || data.val().whereAddress) + "</p>" +
            "<h3>How Much?</h3>" +
            "<p>" + data.val().howMuchDescription + "</p>" +
            "<h3>Who is host?</h3>" +
            "<p>" + data.val().host + "</p>" +
            "<h3>Who is doer?</h3>" +
            "<p>" + data.val().doer + "</p>" +
            "<p>" + (":-)" || data.val().howMuchCost) + "</p>"
        "</div>" +
      "</section>"
    } else {
      console.log("No data yet...");
      return container
    }
  };

  var retrieveElement = function(id) {
    let container = document.getElementById("user-list-wrap");

    let myTempRef = firebase.database().ref("/doWhopDescription/"+ id);
    myTempRef.once("value").then(function(data) {

      if(data.val()) {
        makeDoWhopSelector(container, data);
        console.log("inside retrieving...");
        console.log(data.val().titleDescription);
      } else {
        console.log("No data yet...");
      }

    });
  }

  rootRefDoer.child('doer').on("value", function(snap) {
    console.log("You own!!!!:", snap.val());

    // var content = document.getElementById("user-list-wrap");

    snap.forEach(function(snap) {
      // Note: these hard-coded doer, host properties are a fall-back functionality.
      // if((data.val().creator===person.uid) || (data.val().doer===person.email) || (data.val().host===person.email)){

      var doWhopItem = snap.key;

      retrieveElement(snap.key);

      console.log("YOU RLY OWN!!!:", snap.key);
        // makeDoWhopSelector(content, data);
      });
  });

  rootRefEvents.orderByKey().on(
    "value",
    function(snapshot) {
      var content = document.getElementById("user-list-wrap");
      content.innerHTML = "";
      snapshot.forEach(function(data) {
        // Note: these hard-coded doer, host, doer properties are an admin-priority functionality.
        if( (data.val().creator===person.uid) || (data.val().host===person.email) || (data.val().doer===person.email) ){
          makeDoWhopSelector(content, data);
        }
      });
    },
    function(errorObject) {
      console.log("Data Read Failure: " + errorObject.code);
    }
  );
}

function handleFile(files_arr, node) {
  var file = files_arr[0]
  var imagified = node.id.split("F")[0] + "Image"
  console.log(files_arr)
  if(!file.type.match("image/.*")){
    alert("You can only add images at the moment.")
    return;
  }

  var filePath = firebase.auth().currentUser.uid+"/"+imagified+"/"+file.name
  //filePath should be <user_id>/<form_id>/<file_name>, but we're going to just hack it together for now
  return firebase.storage().ref(filePath).put(file).then(function(snapshot, node){
    var fullPath = snapshot.metadata.fullPath;
    //snapshot.metadata.downloadURLs[0] <-- Gets the viewable image link
    document.getElementById(fullPath.split("/")[1]).innerHTML = fullPath
  })
}

function getDate() {
  d = new Date();
  date = d.getDate()
  month = d.getMonth()+1;
  year = d.getFullYear();

  if (date < 10){
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return year + '-' + month + '-' + date;
}

function hideOption(node, name){
  if (node==null) {
    console.error("Could not find node.");
  }
  else if(node.id==name){
    node.setAttribute("hidden", true)
  }
  else {
    hideOption(node.nextElementSibling, name)
  }
}

function hideAll(underbar_options){
  underbar_options.childNodes.forEach(function(c){
    if(c.nodeName!="#text"){
      //
      if(c.parentElement.dataset.openoption==c.id){ //closes other tabs
        c.setAttribute("hidden", true)
        c.parentElement.dataset.openoption="";
      }
    }
  })
}

function showEditForm(node) {
  var editForm = document.getElementById("edit-dowhop-form");
  var rootRefEvent = firebase.database().ref("doWhopDescription/" + node.id);
  rootRefEvent.once("value").then(function(snap) {
    if(snap.val().host === auth.currentUser.email || snap.val().creator === auth.current) {
      console.log("You clicked on one of your events!");
      editForm.removeAttribute("hidden");
    } else {
      console.log("You clicked on someone else's events!");
      editForm.setAttribute("hidden", "true");
    }
  })
}

function sessionRef(node){
  fillInForms(node) //didn't put the code in here cuz it's not *strictly* about the sessions references
  showEditForm(node);
    firebase.database().ref().child('session/' + person.uid).set({current_dowhop: node.id});
    //Curretly overwrites everything else in the session, even if you're NOT storing a current_dowhop
}

function fillInForms(node){
  rootRefEvents.orderByKey().on("value",
    function(snapshot) {
      snapshot.forEach(function(data) {
        if(data.key===node.id){
          // document.getElementById("email").value = data.val().email;
          document.getElementById("titleDescription").value = data.val().titleDescription;
          // document.getElementById("titleImage").innerHTML = data.val().titleImage;
          document.getElementById("whoDescription").value = data.val().whoDescription;
          // document.getElementById("whoImage").innerHTML = data.val().whoImage;
          document.getElementById("whatDescription").value = data.val().whatDescription;
          // document.getElementById("whatImage").innerHTML = data.val().whatImage;
          document.getElementById("whereDescription").value = data.val().whereDescription;
          document.getElementById("whereAddress").value = data.val().whereAddress;
          // document.getElementById("whereImage").innerHTML = data.val().whereImage;
          document.getElementById("whenDescription").value = data.val().whenDescription;
          // document.getElementById("whenDate").value = data.val().whenDate;
          document.getElementById("whenTime").value = data.val().whenTime;
          // document.getElementById("whenImage").innerHTML = data.val().whenImage;
          document.getElementById("howMuchDescription").value = data.val().howMuchDescription;
          // New
          document.getElementById("hostDescription").value = data.val().host;
          document.getElementById("doerDescription").value = data.val().doer;
          document.getElementById("howMuchCost").value = data.val().howMuchCost;
          // document.getElementById("howmuchImage").innerHTML = data.val().howmuchImage;
        }
      })
    })
  }

// retrieveMyDoWhops(auth.currentUser.uid); // ERROR.
