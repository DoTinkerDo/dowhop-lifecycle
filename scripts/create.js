//Code cobled together by Erik, working off code created by DoWhop
//form submission
document.getElementById("submit").addEventListener("click", createDoWhop);
var rootRef = firebase.database().ref("users/");
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
  var campoEmail = document.getElementById("email");
  var titleDescription = document.getElementById("titleDescription");
  // var titleImage = document.getElementById("titleImage");
  var whoDescription = document.getElementById("whoDescription");
  // var whoImage = document.getElementById("whoImage");
  var whatDescription = document.getElementById("whatDescription");
  // var whatImage = document.getElementById("whatImage");
  var whereDescription = document.getElementById("whereDescription");
  var whereAddress = document.getElementById("whereAddress");
  var whenDescription = document.getElementById("whenDescription");
  var whenDate = document.getElementById("whenDate")
  var whenTime = document.getElementById("whenTime")
  var howDescription = document.getElementById("howDescription");
  var howCost = document.getElementById("howCost");

  var error = document.getElementById("error");

  /*took out former if so that only same email dispays if (campoEmail.value !== "" &&  campoNombre.value !== "" && campoApellidos.value !== "")*/
  if (
    campoEmail.value !== "" &&
    titleDescription.value !== "" &&
    whoDescription.value !== ""
  ) {
    var filePath = data.title + "/" + data.key + "/" + whoImage.value.trim();
    data.email = campoEmail.value.trim();
    data.titleDescription = titleDescription.value.trim();
    // data.titleImage = titleImage.value.trim();
    data.whoDescription = whoDescription.value.trim();
    // data.whoImage = whoImage.value.trim();
    data.whatDescription = whatDescription.value.trim();
    // data.whatImage = whatImage.value.trim();
    data.whereDescription = whereDescription.value.trim();
    data.whereAddress = whereAddress.value.trim();
    data.whenDescription = whenDescription.value.trim();
    data.whenTime = whenTime.value.trim();
    data.whenDate = whenDate.value.trim();
    data.howDescription = howDescription.value.trim();
    data.howCost = howCost.value.trim();
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

  campoEmail.value = "";
  titleDescription.value = "";
  // titleImage.value = "";
  whoDescription.value = "";
  // whoImage.value = "";
  whatDescription.value = "";
  // whatImage.value = "";
  whereDescription.value = "";
  whereAddress.value = "";
  // whereImage.value = "";
  whenDescription.value = "";
  whenTime.value = "";
  whenDate.value = "";
  // whenImage.value = "";
  howDescription.value = "";
  howCost.value = "";
  // howImage.value = "";

  // create user data model
  var user = {
    email: data.email,
    titleDescription: data.titleDescription,
    // titleImage: data.titleImage,
    whoDescription: data.whoDescription,
    // whoImage: data.whoImage,
    whatDescription: data.whatDescription,
    // whatImage: data.whatImage,
    whereDescription: data.whereDescription,
    whereAddress: data.whereAddress,
    // whereImage: data.whereImage,
    whenDescription: data.whenDescription,
    whenDate: data.whenDate,
    // whenTime: data.whenTime,
    howDescription: data.howDescription,
    howCost: data.howCost
  };


  // I check that there is no one with the same email and if it is not I enter it in the bbdd

  rootRef.orderByValue().on("value", function(snapshot) {
    var emails = [];
    snapshot.forEach(function(data) {
      emails.push(data.val().email);
    });

    if (emails.indexOf(data.email) != -1) {
      document.getElementById("error").innerHTML =
        "This email doesn't match your profile, please log in and try again!";
      document.getElementById("error").classList.add("error--ok");
      return false;
    } else {
      rootRef.child(data.title).set(user);
      document.getElementById("error").innerHTML =
        "You rock! Thanks for submitting your DoWhop. We will review your changes and email you the newly published DoWhop!";
      return false;
    }
  });

  // put the listing again? spanish: pinto de nuevo el listado
  queryData();
}

function queryData() {
  rootRef.orderByKey().on(
    "value",
    function(snapshot) {
      var content = document.getElementById("user-list-wrap");
      content.innerHTML = "";
      snapshot.forEach(function(data) {
        //<p>Email: <span>' + data.val().email  +'</span></p>
        content.innerHTML +=
          '<div class="user-list__item"> <h4>DoWhop Title: <span>' +
          data.val().title +
          "</span></h4><h4>Who: <span>" +
          data.val().who +
          "</span></h4><h4>What: <span>" +
          data.val().what +
          "</span></h4><h4>When: <span>" +
          data.val().where +
          "</span></h4><h4>Where: <span>" +
          data.val().when +
          "</span></h4><h4>$: <span>" +
          data.val().howmuch +
          "</h4></div><br>";
      });
    },
    function(errorObject) {
      console.log("Data Read Failure: " + errorObject.code);
    }
  );
}

//consulta = query
queryData();

function handleFile(files_arr) {
  var file = files_arr[0]
  console.log(files_arr)
  if(!file.type.match("image/.*")){
    alert("You can only add images at the moment.")
    return;
  }

  var filePath = "dummy/dummy1/"+file.name
  //filePath should be <user_id>/<form_id>/<file_name>, but we're going to just hack it together for now

  return firebase.storage().ref(filePath).put(file).then(function(snapshot){
    var fullPath = snapshot.metadata.fullPath;
    document.getElementById("replace").innerHTML = '<img src="' + firebase.storage().ref(fullPath).toString() + '">'
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
