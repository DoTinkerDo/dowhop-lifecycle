'use strict';
var mapElement = document.getElementById('map');
var map = null;

function initializeGoogle() {
  initMap();
  initAuto();
}
function initAuto() {
  var input = document.getElementById('whereAddressPending');
  var autocomplete = new google.maps.places.Autocomplete();
}

function initMap() {
  var input = document.getElementById('whereAddressPending');
  map = new google.maps.Map(mapElement, {
    center: { lat: 32.73597, lng: -117.15071 },
    zoom: 8,
    mapTypeControl: false,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  google.maps.event.addDomListener(map, 'load', initialize);
  google.maps.event.addListenerOnce(map, 'idle', function() {
    google.maps.event.trigger(map, 'resize');
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
      document.getElementById('when-date-pending-hidden').removeAttribute('hidden');
      // document.getElementById('when-time-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      break;
    // case 'time':
    //   document.getElementById('when-time-pending-hidden').removeAttribute('hidden');
    //   document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
    //   document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
    //   document.getElementById('map').setAttribute('hidden', 'true');
    //   document.getElementById('mediaCapture').setAttribute('hidden', 'true');
    //   document.getElementById('submitImage').setAttribute('hidden', 'true');
    //   break;
    case 'where':
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('whereAddressPending').removeAttribute('hidden');
      document.getElementById('map').removeAttribute('hidden');
      initializeGoogle(); // OK.
      google.maps.event.trigger(map, 'resize');
      google.maps.event.addDomListener(map, 'load', initialize);
      google.maps.event.addListenerOnce(map, 'idle', function() {
        google.maps.event.trigger(map, 'resize');
      });
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      break;
    case 'image':
      document.getElementById('mediaCapture').removeAttribute('hidden');
      document.getElementById('submitImage').removeAttribute('hidden');
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      // document.getElementById('when-time-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      break;
    default:
      document.getElementById('when-date-pending-hidden').setAttribute('hidden', 'true');
      // document.getElementById('when-time-pending-hidden').setAttribute('hidden', 'true');
      document.getElementById('whereAddressPending').setAttribute('hidden', 'true');
      document.getElementById('mediaCapture').setAttribute('hidden', 'true');
      document.getElementById('submitImage').setAttribute('hidden', 'true');
      document.getElementById('map').setAttribute('hidden', 'true');
      break;
  }
}
