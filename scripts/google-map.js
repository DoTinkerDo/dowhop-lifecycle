'use strict';
var mapElement = document.getElementById('map');
var map = null;
var localCoords = {};
localCoords.lat = 32.73597; // Setting default to San Diego unless navigator below works.
localCoords.lng = -117.15071;

function initializeGoogle() {
  // To-Do: Make dynamic location for scalable use of the site.
  // if (window.navigator.geolocation) {
  //   console.log('getting location...');
  //
  //   var options = {
  //     enableHighAccuracy: false,
  //     timeout: 1000,
  //     maximumAge: 0
  //   };
  //
  //   window.navigator.geolocation.getCurrentPosition(updateLocation, errorHandle, options);
  //
  //   function updateLocation(position) {
  //     localCoords.lat = position.coords.latitude;
  //     localCoords.long = position.coords.longitude;
  //   }
  //
  //   function errorHandle(error) {
  //     console.log(error);
  //     localCoords.lat = 32.73597; // Checking default if no result.
  //     localCoords.lng = -117.15071;
  //   }
  // }

  if (!map) {
    initAutocomplete(); // To ensure we don't keep re-loading the API.
  }
}

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: localCoords,
    zoom: 10,
    mapTypeControl: false,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('whereAddressPending');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Adding protocol to hide/reveal image icons below message form:

var date, where, image;
function revealInput() {
  switch (this.dataset.input) {
    case 'date':
      document.getElementById('when-date-time-pending-hidden').removeAttribute('hidden');
      document.getElementById('where-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      break;
    case 'where':
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('where-pending-hidden').removeAttribute('hidden');
      document.getElementById('whereAddressPending').removeAttribute('hidden');
      document.getElementById('map').removeAttribute('hidden');
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      initializeGoogle(); // OK.
      google.maps.event.trigger(map, 'resize');
      break;
    case 'image':
      document.getElementById('mediaCapture').removeAttribute('hidden');
      document.getElementById('submitImage').removeAttribute('hidden');
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('where-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      break;
    default:
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      break;
  }
}
