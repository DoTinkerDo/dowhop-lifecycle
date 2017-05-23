

/*
  As a creator I want to create a DoWhop for the marketplace!

  titleDescription
  whoDescription
  whatDescription
  whenDescription ->
  whereDescription
  howDescription
  howMuchDescription

*/

// var dowWopImageCapture = document.getElementById('dowhop-image-capture');
var doWhopDescriptionRef = database.ref('/doWhopDescription');
var newDoWhopDiv = document.getElementById('newdowhop');
var createNewDoWhopBtn = document.getElementById('create-new-dowhop');
var titleDescription = document.getElementById('title-description');
var whoDescription = document.getElementById('who-description');
var whatDescription = document.getElementById('what-description');
var whenDescription = document.getElementById('when-description');
var whereDescription = document.getElementById('where-description');
var howMuchDescription = document.getElementById('how-much-description');
var divId = document.getElementById('card');

var fullPath = null;

// function loadDoWhopDescriptions() {
  doWhopDescriptionRef.on("value", function(snapshot) {

          snapshot.forEach(function(data) {
        //<p>Email: <span>' + data.val().email  +'</span></p> // Check below.
        // if((data.val().creator===person.uid) || (data.val().doer===person.email) || (data.val().host===person.email)){
          // let imageUrl = 'https://static.wixstatic.com/media/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.jpg/v1/crop/x_0,y_221,w_3543,h_1159/fill/w_886,h_246,al_c,q_80,usm_0.66_1.00_0.01/de271e_a0f92b126d584e54a84a2f721c1571d4~mv2_d_3543_2480_s_4_2.webp';
          var div = document.createElement('div');
          div.innerHTML +=

          "<section id='" + data.key + "' class='dowhop-selector-block' onclick='sessionRef(this)''>" +

              "<div class='dowhop-selector-header' style='background-image: url(" + data.val().downloadURL + "); background-size: contain;'>" +
                "<h1>" + data.val().titleDescription + "</h1>" +
              "</div>" +

              "<div class='dowhop-selector-body'>" +
                "<h3>" + data.val().whatDescription + "</h3>" +
                // "<h5>When?</h5>" +
                // "<p>" + data.val().whenDate + ' at ' + data.val().whenTime +
                // " " + data.val().whenDescription + "</p>" +
                // "<h5>Where?</h5>" +
                // "<p>" + data.val().whereDescription + " " + data.val().whereAddress + "</p>" +
                "<h5>What else?</h5>" +
                "<p>" + data.val().howmuchDescription + "</p>"
            "</div>" +
          "</section>"
        // }

          divId.append(div);
      });


  })
// }

createNewDoWhopBtn.addEventListener('click', function(e) {
  e.preventDefault();
  doWhopDescriptionRef.push({
    creator: auth.currentUser.uid,
    downloadURL: fullPath,
    titleDescription: titleDescription.value,
    whoDescription: whoDescription.value,
    whatDescription: whatDescription.value,
    whenDescription: whenDescription.value,
    whereDescription: whereDescription.value,
    howMuchDescription: howMuchDescription.value
  });
});

function addDoWhopImage(files_arr, node) {
  var file = files_arr[0];

  if (!file.type.match("image/.*")) {
    alert("You can only add images at the moment.");
    return;
  }

  var uid = auth.currentUser.uid;
  var filePath = "doWhopImages/"+uid+"/"+"titleDescriptionImage/"+file.name;

  return storage.ref(filePath).put(file)
    .then(function(snapshot) {
      fullPath = snapshot.metadata.downloadURLs[0];
    });
}
