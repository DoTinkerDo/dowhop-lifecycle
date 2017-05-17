//Code cobled together by Erik, working off code created by DoWhop
//form submission
document.getElementById("submit").addEventListener("click", createDoWhop);
var rootRef = firebase.database().ref("users/");
var rootRefEvents = firebase.database().ref("doWhops/"); // <-- New
document.getElementById('whenDate').setAttribute("value", getDate());
//Should refactor below later, for more efficient and concise code

Array.from(document.getElementsByClassName("plus-button")).forEach(function(e){
  e.addEventListener("click", function() {
    var self = this;
    for(var p of self.classList){
      if (p=="fa-plus-circle") {
        self.classList.remove("fa-plus-circle")
        self.classList.add("fa-minus-circle")
        self.parentElement.parentElement.parentElement.nextSibling.nextSibling.childNodes.forEach(function(c, self) {
          if(c.nodeName!="#text") {
            //
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

function createDoWhop(data, clearForm) {

  // I collect form data and clear it
  var creator = firebase.auth().currentUser.uid
  var campoEmail = document.getElementById("email");
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
  var howmuchDescription = document.getElementById("howmuchDescription");
  var howmuchCost = document.getElementById("howmuchCost");
  var howmuchImage = document.getElementById("howmuchImage");


  var error = document.getElementById("error");

  /*took out former if so that only same email dispays if (campoEmail.value !== "" &&  campoNombre.value !== "" && campoApellidos.value !== "")*/
  if (
    campoEmail.value !== "" &&
    titleDescription.value !== "" &&
    whoDescription.value !== ""
  ) {
    data.creator = creator;
    data.email = campoEmail.value.trim();
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
    data.howmuchDescription = howmuchDescription.value.trim();
    data.howmuchCost = howmuchCost.value.trim();
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
    email: data.email,
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
    howmuchDescription: data.howmuchDescription,
    howmuchCost: data.howmuchCost,
    howmuchImage: data.howmuchImage
  }

  // create user data model
  var user = {
    creator: data.creator,
    email: data.email,
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
    howmuchDescription: data.howmuchDescription,
    howmuchCost: data.howmuchCost,
    howmuchImage: data.howmuchImage
  };


  // I check that there is no one with the same email and if it is not I enter it in the bbdd

  rootRef.orderByValue().on("value", function(snapshot) {
    var emails = [];
    snapshot.forEach(function(data) {
      emails.push(data.val().email);
    });
      rootRefEvents.push(newEvent); // <-- New
      //^^ this, for some reason, causes the forms to be reset

      campoEmail.value = "";
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
      howmuchDescription.value = "";
      howmuchCost.value = "";
      howmuchImage.innerHTML = "";

      //^^Moved this to here since implementing the new code for population forms with old events the rootRefEvents.push above was causing the form values to not be wiped

      rootRef.child(data.creator).set(user);
      document.getElementById("error").innerHTML =
        "You rock! Thanks for submitting your DoWhop. We will review your changes and email you the newly published DoWhop!";
      return false;

  })

  // put the listing again? spanish: pinto de nuevo el listado
  queryData();
}

function queryData() {
  rootRefEvents.orderByKey().on(
    "value",
    function(snapshot) {
      var content = document.getElementById("user-list-wrap");
      content.innerHTML = "";
      snapshot.forEach(function(data) {
        //<p>Email: <span>' + data.val().email  +'</span></p>
        if(data.val().creator===person.uid){
          content.innerHTML +=
            '<div class="user-list__item" onclick="sessionRef(this)"><div hidden id="'+ data.key + '"></div>'+
            '<h4>DoWhop Title: <span>' +
            data.val().titleDescription +
            "</span></h4><h4>Who: <span>" +
            data.val().whoDescription +
            "</span></h4><h4>What: <span>" +
            data.val().whatDescription +
            "</span></h4><h4>When: <span>" +
            data.val().whereDescription +
            "</span></h4><h4>Where: <span>" +
            data.val().whenDescription +
            "</span></h4><h4>$: <span>" +
            data.val().howmuchCost  +
            "</h4></div><br>";
        }
      });
    },
    function(errorObject) {
      console.log("Data Read Failure: " + errorObject.code);
    }
  );
}
//consulta = query
queryData();

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

function sessionRef(node){
  fillInForms(node) //didn't put the code in here cuz it's not *strictly* about the sessions references
  firebase.database().ref().child('session/' + person.uid).set({current_dowhop: node.firstElementChild.id})
  //Curretly overwrites everything else in the session, even if you're NOT storing a current_dowhop
}

function fillInForms(node){
  rootRefEvents.orderByKey().on("value",
    function(snapshot) {
      snapshot.forEach(function(data) {
        if(data.key===node.firstElementChild.id){
          document.getElementById("email").value = data.val().email;
          document.getElementById("titleDescription").value = data.val().titleDescription;
          document.getElementById("titleImage").innerHTML = data.val().titleImage;
          document.getElementById("whoDescription").value = data.val().whoDescription;
          document.getElementById("whoImage").innerHTML = data.val().whoImage;
          document.getElementById("whatDescription").value = data.val().whatDescription;
          document.getElementById("whatImage").innerHTML = data.val().whatImage;
          document.getElementById("whereDescription").value = data.val().whereDescription;
          document.getElementById("whereAddress").value = data.val().whereAddress;
          document.getElementById("whereImage").innerHTML = data.val().whereImage;
          document.getElementById("whenDescription").value = data.val().whenDescription;
          document.getElementById("whenDate").value = data.val().whenDate;
          document.getElementById("whenTime").value = data.val().whenTime;
          document.getElementById("whenImage").innerHTML = data.val().whenImage;
          document.getElementById("howmuchDescription").value = data.val().howmuchDescription;
          document.getElementById("howmuchCost").value = data.val().howmuchCost;
          document.getElementById("howmuchImage").innerHTML = data.val().howmuchImage;
        }
      })
    })
  }
