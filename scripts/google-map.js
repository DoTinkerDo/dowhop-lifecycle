// 'use strict';
// // Adding location, date, time auto-comple
// function initialize() {
//   var input = document.getElementById('searchTextField');
//   var autocomplete = new google.maps.places.Autocomplete(input);
// }
// google.maps.event.addDomListener(window, 'load', initialize);

// function initAutocomplete() {
//   // OM: We initially want to get current location, like so:
//   // var loc;
//   // loc = navigator.geolocation.getCurrentPosition(function(position){ return x = position.coords })
//   // let lat = loc.latitude;
//   // let long = loc.longitude;
//   // To-Do: Change the starting location of the map to dynamically load:
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: 32.742705, lng: -117.145857 }, // <-- Preset to San Diego Zoo
//     zoom: 13,
//     mapTypeId: 'roadmap',
//     mapTypeControl: true,
//     mapTypeControlOptions: {
//       style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
//       position: google.maps.ControlPosition.BOTTOM_CENTER
//     }
//   });
//   // Create the search box and link it to the UI element.
//   var input = document.getElementById('whereAddressPending');
//   var searchBox = new google.maps.places.SearchBox(input);
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
//   // Bias the SearchBox results towards current map's viewport.
//   map.addListener('bounds_changed', function() {
//     searchBox.setBounds(map.getBounds());
//   });
//   var markers = [];
//   // Listen for the event fired when the user selects a prediction and retrieve
//   // more details for that place.
//   searchBox.addListener('places_changed', function() {
//     var places = searchBox.getPlaces();
//     if (places.length == 0) {
//       return;
//     }
//     // Clear out the old markers.
//     markers.forEach(function(marker) {
//       marker.setMap(null);
//     });
//     markers = [];
//     // For each place, get the icon, name and location.
//     var bounds = new google.maps.LatLngBounds();
//     places.forEach(function(place) {
//       if (!place.geometry) {
//         console.log('Returned place contains no geometry');
//         return;
//       }
//       var icon = {
//         url: place.icon,
//         size: new google.maps.Size(71, 71),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(17, 34),
//         scaledSize: new google.maps.Size(25, 25)
//       };
//       // Create a marker for each place.
//       markers.push(
//         new google.maps.Marker({
//           map: map,
//           icon: icon,
//           title: place.name,
//           position: place.geometry.location
//         })
//       );
//       if (place.geometry.viewport) {
//         // Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     map.fitBounds(bounds);
//   });
// }

// // A script to use icon to select/toggle input fields
// var date, time, where, image;
// function revealInput(x) {
//   switch (x) {
//     case 'date':
//       document.getElementById('whenDatePending').removeAttribute('hidden');
//       document.getElementById('whenTimePending').setAttribute('hidden', 'true');
//       document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
//       document.getElementById('map').setAttribute('hidden', 'true');
//       document.getElementById('mediaCapture').setAttribute('hidden', 'true');
//       document.getElementById('submitImage').setAttribute('hidden', 'true');
//       break;
//     case 'time':
//       document.getElementById('whenTimePending').removeAttribute('hidden');
//       document.getElementById('whenDatePending').setAttribute('hidden', 'true');
//       document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
//       document.getElementById('map').setAttribute('hidden', 'true');
//       document.getElementById('mediaCapture').setAttribute('hidden', 'true');
//       document.getElementById('submitImage').setAttribute('hidden', 'true');
//       break;
//     case 'where':
//       document.getElementById('whereAddressPending').removeAttribute('hidden');
//       document.getElementById('map').removeAttribute('hidden');
//       document.getElementById('whenDatePending').setAttribute('hidden', 'true');
//       document.getElementById('whenTimePending').setAttribute('hidden', 'true');
//       document.getElementById('mediaCapture').setAttribute('hidden', 'true');
//       document.getElementById('submitImage').setAttribute('hidden', 'true');
//       break;
//     case 'image':
//       document.getElementById('mediaCapture').removeAttribute('hidden');
//       document.getElementById('submitImage').removeAttribute('hidden');
//       document.getElementById('whenDatePending').setAttribute('hidden', 'true');
//       document.getElementById('whenTimePending').setAttribute('hidden', 'true');
//       document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
//       document.getElementById('map').setAttribute('hidden', 'true');
//       break;
//     default:
//       document.getElementById('whenDatePending').setAttribute('hidden', 'true');
//       document.getElementById('whenTimePending').setAttribute('hidden', 'true');
//       document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
//       document.getElementById('map').setAttribute('hidden', 'true');
//       document.getElementById('mediaCapture').setAttribute('hidden', 'true');
//       document.getElementById('submitImage').setAttribute('hidden', 'true');
//       break;
//   }
// }
